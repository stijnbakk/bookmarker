<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';
	
	// shadcn/ui components
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Textarea from '$lib/components/ui/textarea.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	
	// Lucide icons
	import { Bookmark, ExternalLink, Calendar, AlertTriangle, CheckCircle, User, Loader2, Camera, Plus } from 'lucide-svelte';

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
				hostname === 'pin.it' ||
				hostname.endsWith('.pinterest.com') ||
				/^[a-z]{2}\.pinterest\.com$/.test(hostname) ||
				hostname.match(/^pinterest\.[a-z]{2,}$/)
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

<div class="min-h-screen bg-background">
	<!-- Header -->
	<header class="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
		<div class="max-w-2xl mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<Bookmark class="w-6 h-6 text-primary" />
					<h1 class="text-2xl font-bold text-foreground">Bookmarks</h1>
				</div>
				<Button href="/account" variant="ghost" size="sm">
					<User class="w-4 h-4 mr-2" />
					Account
				</Button>
			</div>
		</div>
	</header>

	<main class="max-w-2xl mx-auto px-4 py-8 space-y-8">
		<!-- Add Bookmark Form -->
		<Card class="p-6">
			<div class="flex items-center space-x-2 mb-4">
				<Plus class="w-5 h-5 text-muted-foreground" />
				<h2 class="text-lg font-semibold">Add New Bookmark</h2>
			</div>
			
			<form 
				method="POST" 
				action="?/addPin" 
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result }) => {
						isSubmitting = false;
						if (result.type === 'success') {
							resetForm();
							await invalidateAll();
						}
					};
				}}
				class="space-y-4"
			>
				<div class="space-y-2">
					<label for="source_url" class="text-sm font-medium text-foreground">
						URL
					</label>
					<Textarea
						id="source_url"
						name="source_url"
						bind:value={sourceUrl}
						on:keydown={handleKeydown}
						placeholder="Paste your bookmark URL here..."
						rows="2"
						required
						class="resize-none"
					/>
				</div>

				<div class="space-y-2">
					<label for="note" class="text-sm font-medium text-foreground">
						Note <span class="text-muted-foreground">(optional)</span>
					</label>
					<Input
						id="note"
						name="note"
						bind:value={note}
						placeholder="Add a note about this bookmark..."
					/>
				</div>

				<!-- Pinterest URL Detection -->
				{#if sourceUrl && isPinterestUrl(sourceUrl)}
					{#if sourceUrl.includes('pin.it')}
						<div class="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
							<AlertTriangle class="w-4 h-4 flex-shrink-0" />
							<span>Shortened Pinterest URL detected - will try to expand, but full URLs work better!</span>
						</div>
					{:else}
						<div class="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
							<CheckCircle class="w-4 h-4 flex-shrink-0" />
							<span>Pinterest URL detected - image will be scraped!</span>
						</div>
					{/if}
				{/if}

				<Button type="submit" disabled={!sourceUrl.trim() || isSubmitting} class="w-full">
					{#if isSubmitting}
						<Loader2 class="w-4 h-4 mr-2 animate-spin" />
						{#if isPinterestUrl(sourceUrl)}
							Scraping Pinterest...
						{:else}
							Adding...
						{/if}
					{:else}
						Add Bookmark
					{/if}
				</Button>
			</form>
			
			{#if form?.message}
				<div class="mt-4 p-3 rounded-md text-sm {form.success ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}">
					<p>{form.message}</p>
					{#if form?.debug}
						<p class="mt-2 text-xs font-mono text-muted-foreground">{form.debug}</p>
					{/if}
				</div>
			{/if}
		</Card>

		<!-- Bookmarks Feed -->
		<div class="space-y-6">
			{#if data.pins.length === 0}
				<Card class="p-12 text-center">
					<div class="text-muted-foreground mb-4">
						<Bookmark class="w-16 h-16 mx-auto opacity-50" />
					</div>
					<h3 class="text-xl font-semibold text-foreground mb-2">No bookmarks yet</h3>
					<p class="text-muted-foreground">Add your first bookmark using the form above!</p>
				</Card>
			{:else}
				{#each data.pins as pin}
					<Card class="overflow-hidden hover:shadow-lg transition-shadow duration-200">
						{#if pin.image}
							<div class="aspect-video bg-muted overflow-hidden">
								<img 
									src={pin.image} 
									alt="Pinterest pin" 
									class="w-full h-full object-cover"
									loading="lazy"
								/>
							</div>
						{/if}
						
						<div class="p-6 space-y-4">
							<!-- URL and Note -->
							<div class="space-y-2">
								<a 
									href={pin.source_url}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center text-primary hover:text-primary/80 font-medium break-all group"
								>
									<span class="underline underline-offset-2 decoration-primary/30 group-hover:decoration-primary/60">
										{pin.source_url}
									</span>
									<ExternalLink class="w-3 h-3 ml-1 flex-shrink-0 opacity-60" />
								</a>
								
								{#if pin.note}
									<p class="text-foreground leading-relaxed">{pin.note}</p>
								{/if}
							</div>

							<!-- Metadata -->
							<div class="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
								<div class="flex items-center space-x-3">
									<div class="flex items-center space-x-1">
										<Calendar class="w-3 h-3" />
										<time datetime={pin.created_at}>
											{new Date(pin.created_at).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'short',
												day: 'numeric'
											})}
										</time>
									</div>
									
									{#if pin.image}
										<Badge variant="success" class="text-xs">
											<Camera class="w-3 h-3 mr-1" />
											Pinterest
										</Badge>
									{/if}
								</div>
								
								<span class="text-xs font-mono">{pin.id.slice(-8)}</span>
							</div>
						</div>
					</Card>
				{/each}
			{/if}
		</div>
	</main>
</div>