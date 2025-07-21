<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let sourceUrl = '';
	let note = '';
	let isSubmitting = false;

	function resetForm() {
		sourceUrl = '';
		note = '';
		isSubmitting = false;
	}

	function isPinterestUrl(url: string): boolean {
		try {
			const parsedUrl = new URL(url);
			const hostname = parsedUrl.hostname.toLowerCase();
			return (
				hostname === 'pinterest.com' ||
				hostname === 'www.pinterest.com' ||
				hostname === 'pin.it' || // Handle shortened URLs
				hostname.endsWith('.pinterest.com') ||
				// Handle international Pinterest domains
				/^[a-z]{2}\.pinterest\.com$/.test(hostname) || // like nl.pinterest.com
				hostname.match(/^pinterest\.[a-z]{2,}$/) // like pinterest.co.uk
			);
		} catch {
			return false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			const form = event.target?.closest('form');
			if (form && sourceUrl.trim()) {
				form.requestSubmit();
			}
		}
	}
</script>

<svelte:head>
	<title>Feed - Bookmarker</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow">
		<div class="max-w-4xl mx-auto px-4 py-6">
			<div class="flex justify-between items-center">
				<h1 class="text-3xl font-bold text-gray-900">Your Bookmarks</h1>
				<a 
					href="/account" 
					class="text-sm text-indigo-600 hover:text-indigo-500"
				>
					Account
				</a>
			</div>
		</div>
	</div>

	<div class="max-w-4xl mx-auto px-4 py-8">
		<!-- Add Pin Form -->
		<div class="bg-white rounded-lg shadow p-6 mb-8">
			<h2 class="text-lg font-medium text-gray-900 mb-4">Add New Bookmark</h2>
			<form 
				method="POST" 
				action="?/addPin" 
				use:enhance={({ formData }) => {
					isSubmitting = true;
					return async ({ result }) => {
						isSubmitting = false;
						if (result.type === 'success') {
							resetForm();
							await invalidateAll();
						}
					};
				}}
			>
				<div class="space-y-4">
					<div>
						<label for="source_url" class="block text-sm font-medium text-gray-700 mb-2">
							URL
						</label>
						<textarea
							id="source_url"
							name="source_url"
							bind:value={sourceUrl}
							on:keydown={handleKeydown}
							placeholder="Paste your bookmark URL here..."
							rows="2"
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-none"
						></textarea>
					</div>
					<div>
						<label for="note" class="block text-sm font-medium text-gray-700 mb-2">
							Note (optional)
						</label>
						<input
							type="text"
							id="note"
							name="note"
							bind:value={note}
							placeholder="Add a note about this bookmark..."
							class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					<button
						type="submit"
						disabled={!sourceUrl.trim() || isSubmitting}
						class="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
					>
						{#if isSubmitting}
							<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							{#if isPinterestUrl(sourceUrl)}
								<span>Scraping Pinterest...</span>
							{:else}
								<span>Adding...</span>
							{/if}
						{:else}
							<span>Add Bookmark</span>
						{/if}
					</button>
					
					{#if sourceUrl && isPinterestUrl(sourceUrl)}
						{#if sourceUrl.includes('pin.it')}
							<div class="mt-2 text-sm text-yellow-600 flex items-center space-x-1">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 15c-.77.833.192 2.5 1.732 2.5z" />
								</svg>
								<span>Shortened Pinterest URL detected - will try to expand, but full URLs work better!</span>
							</div>
						{:else}
							<div class="mt-2 text-sm text-green-600 flex items-center space-x-1">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								<span>Pinterest URL detected - image will be scraped!</span>
							</div>
						{/if}
					{/if}
				</div>
			</form>
			
			{#if form?.message}
				<div class="mt-4 text-sm {form.success ? 'text-green-600' : 'text-red-600'}">
					{form.message}
				</div>
			{/if}
		</div>

		<!-- Pins Feed -->
		<div class="space-y-6">
			{#if data.pins.length === 0}
				<div class="text-center py-12">
					<div class="text-gray-400 mb-4">
						<svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</div>
					<h3 class="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
					<p class="text-gray-600">Add your first bookmark using the form above!</p>
				</div>
			{:else}
				{#each data.pins as pin}
					<div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
						{#if pin.image}
							<div class="aspect-w-16 aspect-h-9 bg-gray-200">
								<img 
									src={pin.image} 
									alt="Pinterest pin" 
									class="w-full h-48 object-cover"
									loading="lazy"
								/>
							</div>
						{/if}
						<div class="p-6">
							<div class="flex justify-between items-start mb-3">
								<div class="flex-1">
									<a 
										href={pin.source_url}
										target="_blank"
										rel="noopener noreferrer"
										class="text-indigo-600 hover:text-indigo-500 font-medium break-all"
									>
										{pin.source_url}
									</a>
									{#if pin.note}
										<p class="text-gray-700 mt-2">{pin.note}</p>
									{/if}
								</div>
							</div>
							<div class="flex justify-between items-center text-xs text-gray-500">
								<div class="flex items-center space-x-2">
									<span>ID: {pin.id}</span>
									{#if pin.image}
										<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
											📷 Pinterest
										</span>
									{/if}
								</div>
								<time datetime={pin.created_at}>
									{new Date(pin.created_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
								</time>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>