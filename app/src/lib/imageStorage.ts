import type { SupabaseClient } from '@supabase/supabase-js';

export interface ImageUploadResult {
	success: boolean;
	publicUrl?: string;
	path?: string;
	error?: string;
}

export async function downloadAndStoreImage(
	supabase: SupabaseClient,
	imageUrlOrBlob: string | Blob,
	userId: string,
	pinId: string
): Promise<ImageUploadResult> {
	try {
		let imageBlob: Blob;
		
		if (typeof imageUrlOrBlob === 'string') {
			// Download the image from URL
			const imageResponse = await fetch(imageUrlOrBlob);
			
			if (!imageResponse.ok) {
				return {
					success: false,
					error: `Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`
				};
			}

			imageBlob = await imageResponse.blob();
		} else {
			// Use the provided blob directly
			imageBlob = imageUrlOrBlob;
		}
		
		// Generate a unique filename
		const fileExtension = getFileExtension(
			typeof imageUrlOrBlob === 'string' ? imageUrlOrBlob : undefined, 
			imageBlob.type
		);
		const fileName = `${userId}/${pinId}${fileExtension}`;

		// Upload to Supabase Storage
		const { data, error } = await supabase.storage
			.from('pin-images')
			.upload(fileName, imageBlob, {
				contentType: imageBlob.type,
				upsert: true
			});

		if (error) {
			console.error('Supabase storage error:', error);
			return {
				success: false,
				error: `Storage upload failed: ${error.message}`
			};
		}

		// Get the public URL
		const { data: publicUrlData } = supabase.storage
			.from('pin-images')
			.getPublicUrl(fileName);

		return {
			success: true,
			publicUrl: publicUrlData.publicUrl,
			path: fileName
		};
	} catch (error) {
		console.error('Image storage error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}

function getFileExtension(url?: string, mimeType?: string): string {
	// Try to get extension from URL first
	if (url) {
		try {
			const urlPath = new URL(url).pathname;
			const match = urlPath.match(/\.([a-zA-Z0-9]+)$/);
			if (match) {
				return `.${match[1]}`;
			}
		} catch {
			// Ignore URL parsing errors
		}
	}

	// Fallback to mime type
	if (mimeType) {
		const mimeToExt: { [key: string]: string } = {
			'image/jpeg': '.jpg',
			'image/jpg': '.jpg',
			'image/png': '.png',
			'image/gif': '.gif',
			'image/webp': '.webp',
			'image/svg+xml': '.svg'
		};
		return mimeToExt[mimeType] || '.jpg';
	}

	// Default fallback
	return '.jpg';
}