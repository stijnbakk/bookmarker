import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Pin } from '$lib/types';
import { isPinterestUrl, scrapePinterestPin, normalizePinterestUrl } from '$lib/pinterest';
import { downloadAndStoreImage } from '$lib/imageStorage';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) {
		return redirect(302, '/login');
	}

	const { data: pins, error } = await event.locals.supabase
		.from('pins')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching pins:', error);
		return {
			pins: [] as Pin[],
			user: event.locals.user
		};
	}

	return {
		pins: pins as Pin[],
		user: event.locals.user
	};
};

export const actions: Actions = {
	addPin: async (event) => {
		if (!event.locals.session) {
			return fail(401, { message: 'Not authenticated' });
		}

		const formData = await event.request.formData();
		const sourceUrl = formData.get('source_url') as string;
		const note = formData.get('note') as string;

		if (!sourceUrl) {
			return fail(400, { message: 'URL is required' });
		}

		// Basic URL validation
		try {
			new URL(sourceUrl);
		} catch {
			return fail(400, { message: 'Invalid URL format' });
		}

		let imageUrl: string | null = null;
		let scrapedNote = note;

		// Check if it's a Pinterest URL and scrape if it is
		if (isPinterestUrl(sourceUrl)) {
			try {
				const scrapedData = await scrapePinterestPin(sourceUrl);
				
				if (scrapedData.success && (scrapedData.imageUrl || scrapedData.imageBlob)) {
					// First create the pin to get the ID
					const { data: pinData, error: pinError } = await event.locals.supabase
						.from('pins')
						.insert({
							user_id: event.locals.user!.id,
							source_url: sourceUrl,
							note: scrapedNote || scrapedData.description || null,
							image: null // Will update this after image upload
						})
						.select('id')
						.single();

					if (pinError) {
						console.error('Error creating pin:', pinError);
						return fail(500, { message: 'Failed to create pin' });
					}

					// Download and store the image
					const imageResult = await downloadAndStoreImage(
						event.locals.supabase,
						scrapedData.imageUrl || scrapedData.imageBlob!,
						event.locals.user!.id,
						pinData.id
					);

					if (imageResult.success && imageResult.publicUrl) {
						// Update the pin with the image URL
						const { error: updateError } = await event.locals.supabase
							.from('pins')
							.update({ image: imageResult.publicUrl })
							.eq('id', pinData.id);

						if (updateError) {
							console.error('Error updating pin with image:', updateError);
							// Don't fail the request, just log the error
						}
					} else {
						console.error('Image upload failed:', imageResult.error);
						// Continue without image - pin is already created
					}

					return { success: true, message: 'Pinterest pin added successfully!' };
				} else {
					// Pinterest scraping failed, but we can still create a regular pin
					console.warn('Pinterest scraping failed:', scrapedData.error);
					return await createRegularPin(event.locals.supabase, event.locals.user!.id, sourceUrl, scrapedNote);
				}
			} catch (error) {
				console.error('Pinterest processing error:', error);
				// Fall back to creating a regular pin
				return await createRegularPin(event.locals.supabase, event.locals.user!.id, sourceUrl, scrapedNote);
			}
		} else {
			// Not a Pinterest URL, create regular pin
			return await createRegularPin(event.locals.supabase, event.locals.user!.id, sourceUrl, scrapedNote);
		}
	}
};

// Helper function to create a regular pin without image scraping
async function createRegularPin(supabase: any, userId: string, sourceUrl: string, note: string) {
	const { error } = await supabase
		.from('pins')
		.insert({
			user_id: userId,
			source_url: sourceUrl,
			note: note || null,
			image: null
		});

	if (error) {
		console.error('Error creating pin:', error);
		return fail(500, { message: 'Failed to create pin' });
	}

	return { success: true };
}