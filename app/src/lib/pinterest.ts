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
		// First expand shortened URLs if needed
		const expandedUrl = await expandShortenedUrl(originalUrl);
		
		// Then normalize the URL for the scraper
		const normalizedUrl = normalizePinterestUrl(expandedUrl);

		console.log('Scraping Pinterest:', { originalUrl, expandedUrl, normalizedUrl });

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

export async function expandShortenedUrl(url: string): Promise<string> {
	try {
		const parsedUrl = new URL(url);
		
		// Only expand pin.it URLs
		if (parsedUrl.hostname !== 'pin.it') {
			return url;
		}

		console.log('Expanding shortened URL:', url);
		
		// Method 1: Try following redirects to get final URL
		try {
			const followResponse = await fetch(url, {
				method: 'GET',
				redirect: 'follow', // Follow all redirects automatically
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
				}
			});

			if (followResponse.ok && followResponse.url !== url) {
				const finalUrl = followResponse.url;
				console.log('Expanded URL via follow:', finalUrl);
				
				// Check if we got a proper Pinterest pin URL
				if (finalUrl.includes('/pin/')) {
					return finalUrl;
				}
				
				// If we got a Pinterest API redirect URL, try to extract pin ID from it
				const apiMatch = finalUrl.match(/url_shortener\/([^\/]+)\/redirect/);
				if (apiMatch) {
					const shortId = apiMatch[1];
					console.log('Found Pinterest API redirect, extracting short ID:', shortId);
					
					// We need to make another request to get the actual pin URL
					try {
						const apiResponse = await fetch(finalUrl, {
							method: 'GET',
							redirect: 'follow',
							headers: {
								'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
							}
						});
						
						if (apiResponse.ok && apiResponse.url !== finalUrl && apiResponse.url.includes('/pin/')) {
							console.log('Resolved API redirect to:', apiResponse.url);
							return apiResponse.url;
						}
					} catch (apiError) {
						console.warn('Failed to resolve API redirect:', apiError);
					}
				}
				
				return finalUrl;
			}
		} catch (followError) {
			console.warn('Follow request failed:', followError);
		}

		// Method 2: Try manual redirect handling
		try {
			const manualResponse = await fetch(url, {
				method: 'GET',
				redirect: 'manual',
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
				}
			});

			const location = manualResponse.headers.get('Location');
			if (location) {
				console.log('Got redirect location:', location);
				
				// If it's still a redirect, try to follow it one more time
				if (location.includes('api.pinterest.com')) {
					try {
						const secondResponse = await fetch(location, {
							method: 'GET',
							redirect: 'follow',
							headers: {
								'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
							}
						});
						
						if (secondResponse.ok && secondResponse.url.includes('/pin/')) {
							console.log('Final resolved URL:', secondResponse.url);
							return secondResponse.url;
						}
					} catch (secondError) {
						console.warn('Second redirect failed:', secondError);
					}
				}
				
				return location;
			}
		} catch (manualError) {
			console.warn('Manual redirect failed:', manualError);
		}

		console.warn('All URL expansion methods failed for:', url);
		return url;
		
	} catch (error) {
		console.error('Error expanding shortened URL:', error);
		return url; // Return original URL if expansion fails
	}
}

export function normalizePinterestUrl(url: string): string {
	try {
		const parsedUrl = new URL(url);

		// Handle Pinterest API redirect URLs
		if (parsedUrl.hostname === 'api.pinterest.com' && url.includes('url_shortener')) {
			console.log('Pinterest API redirect URL detected, cannot process directly');
			// These URLs need to be followed in a browser environment
			// Return original URL and let the scraper handle the error
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
