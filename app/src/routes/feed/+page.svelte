<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let sourceUrl = '';
	let note = '';

	function resetForm() {
		sourceUrl = '';
		note = '';
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
					return async ({ result }) => {
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
						disabled={!sourceUrl.trim()}
						class="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Add Bookmark
					</button>
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
					<div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
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
							<span>ID: {pin.id}</span>
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
				{/each}
			{/if}
		</div>
	</div>
</div>