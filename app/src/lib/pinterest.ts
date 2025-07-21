// Pinterest utility functions

export function isPinterestUrl(url: string): boolean {
	try {
		const parsedUrl = new URL(url);
		const hostname = parsedUrl.hostname.toLowerCase();

		return (
			hostname === 'pinterest.com' ||
			hostname === 'www.pinterest.com' ||
			hostname === 'pin.it' ||
			hostname.endsWith('.pinterest.com') ||
			// Handle international Pinterest domains
			/^[a-z]{2}\.pinterest\.com$/.test(hostname) || // like nl.pinterest.com
			hostname.match(/^pinterest\.[a-z]{2,}$/) // like pinterest.co.uk
		);
	} catch {
		return false;
	}
}

export interface PinterestScrapedData {
	success: boolean;
	imageUrl?: string;
	imageBlob?: Blob;
	title?: string;
	description?: string;
	error?: string;
}

export async function scrapePinterestPin(originalUrl: string): Promise<PinterestScrapedData> {
	try {
		// Normalize the URL for the scraper
		const normalizedUrl = normalizePinterestUrl(originalUrl);

		console.log('Scraping Pinterest:', { originalUrl, normalizedUrl });

		const response = await fetch('https://pinterest-downloader.fly.dev/scrape', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ url: normalizedUrl })
		});

		if (!response.ok) {
			return {
				success: false,
				error: `Pinterest scraper returned ${response.status}: ${response.statusText}`
			};
		}

		const contentType = response.headers.get('Content-Type') || '';
		console.log('Pinterest scraper response Content-Type:', contentType);

		// Check if response is an image
		if (contentType.startsWith('image/')) {
			console.log('Pinterest scraper returned binary image data');
			
			const imageBlob = await response.blob();
			
			return {
				success: true,
				imageBlob,
				title: `Pinterest Pin from ${originalUrl}`, // Generate a basic title
				description: null
			};
		} else {
			// Try to parse as JSON (fallback for APIs that return JSON)
			const responseText = await response.text();
			console.log('Pinterest scraper response:', {
				status: response.status,
				statusText: response.statusText,
				contentType,
				body: responseText.substring(0, 500) // Log first 500 chars
			});

			let data;
			try {
				data = JSON.parse(responseText);
			} catch (parseError) {
				return {
					success: false,
					error: `Expected image or JSON response, got: ${contentType}. Response: ${responseText.substring(0, 200)}`
				};
			}

			console.log('Parsed Pinterest data:', data);

			// Check various possible field names for the image URL
			const imageUrl = data.imageUrl || data.image_url || data.url || data.media_url || data.image;

			if (imageUrl) {
				return {
					success: true,
					imageUrl,
					title: data.title || data.name || data.pin_title,
					description: data.description || data.desc || data.pin_description
				};
			} else {
				return {
					success: false,
					error: `No image URL found in Pinterest scraper response. Available fields: ${Object.keys(data).join(', ')}`
				};
			}
		}
	} catch (error) {
		console.error('Pinterest scraping error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}

export function normalizePinterestUrl(url: string): string {
	try {
		const parsedUrl = new URL(url);

		// Handle pin.it short URLs - keep as is, the scraper should handle these
		if (parsedUrl.hostname === 'pin.it') {
			return url;
		}

		// Extract pin ID from any Pinterest domain
		const match = parsedUrl.pathname.match(/\/pin\/(\d+)\/?/);
		if (match) {
			const pinId = match[1];
			// Convert to standard US Pinterest URL format that the scraper expects
			return `https://pinterest.com/pin/${pinId}/`;
		}

		// If we can't extract pin ID, return original URL
		return url;
	} catch {
		return url;
	}
}

export function extractPinterestPinId(url: string): string | null {
	try {
		const parsedUrl = new URL(url);

		// Handle pin.it short URLs
		if (parsedUrl.hostname === 'pin.it') {
			return parsedUrl.pathname.slice(1); // Remove leading slash
		}

		// Handle pinterest.com URLs like /pin/123456789/
		const match = parsedUrl.pathname.match(/\/pin\/(\d+)\/?/);
		return match ? match[1] : null;
	} catch {
		return null;
	}
}
