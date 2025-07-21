import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Pin } from '$lib/types';

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

		const { error } = await event.locals.supabase
			.from('pins')
			.insert({
				user_id: event.locals.user!.id,
				source_url: sourceUrl,
				note: note || null,
				image: null // For now, we'll implement image handling later
			});

		if (error) {
			console.error('Error creating pin:', error);
			return fail(500, { message: 'Failed to create pin' });
		}

		return { success: true };
	}
};