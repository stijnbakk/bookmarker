<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	
	// shadcn/ui components
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	
	// Lucide icons
	import { User, Mail, Calendar, LogOut, ArrowLeft } from 'lucide-svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Account - {data.user?.email || 'User'}</title>
</svelte:head>

<div class="min-h-screen bg-background">
	<!-- Header -->
	<header class="border-b bg-card/50 backdrop-blur-sm">
		<div class="max-w-2xl mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<User class="w-6 h-6 text-primary" />
					<h1 class="text-2xl font-bold text-foreground">Account</h1>
				</div>
				<Button href="/feed" variant="ghost" size="sm">
					<ArrowLeft class="w-4 h-4 mr-2" />
					Back to Feed
				</Button>
			</div>
		</div>
	</header>

	<main class="max-w-2xl mx-auto px-4 py-8">
		<!-- Welcome Section -->
		<div class="mb-8">
			<h2 class="text-3xl font-bold text-foreground mb-2">
				Welcome back, {data.user?.email?.split('@')[0] || 'User'}!
			</h2>
			<p class="text-muted-foreground">
				Manage your account settings and view your profile information.
			</p>
		</div>

		<!-- Account Information -->
		<Card class="p-8 mb-6">
			<h3 class="text-lg font-semibold text-foreground mb-6">Account Information</h3>
			
			<div class="space-y-6">
				<!-- Email -->
				<div class="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
					<div class="p-2 bg-blue-100 rounded-full">
						<Mail class="w-5 h-5 text-blue-600" />
					</div>
					<div class="flex-1">
						<p class="text-sm font-medium text-foreground">Email Address</p>
						<p class="text-sm text-muted-foreground">{data.user?.email || 'Not available'}</p>
					</div>
					{#if data.user?.email_confirmed_at}
						<Badge variant="success" class="text-xs">
							Verified
						</Badge>
					{:else}
						<Badge variant="outline" class="text-xs">
							Unverified
						</Badge>
					{/if}
				</div>

				<!-- User ID -->
				<div class="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
					<div class="p-2 bg-purple-100 rounded-full">
						<User class="w-5 h-5 text-purple-600" />
					</div>
					<div class="flex-1">
						<p class="text-sm font-medium text-foreground">User ID</p>
						<p class="text-xs font-mono text-muted-foreground">{data.user?.id || 'Not available'}</p>
					</div>
				</div>

				<!-- Account Created -->
				{#if data.user?.created_at}
					<div class="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
						<div class="p-2 bg-green-100 rounded-full">
							<Calendar class="w-5 h-5 text-green-600" />
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-foreground">Member Since</p>
							<p class="text-sm text-muted-foreground">
								{new Date(data.user.created_at).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</p>
						</div>
					</div>
				{/if}
			</div>
		</Card>

		<!-- Actions -->
		<Card class="p-8">
			<h3 class="text-lg font-semibold text-foreground mb-6">Account Actions</h3>
			
			<div class="space-y-4">
				<!-- Sign Out -->
				<form method="POST" action="?/logout" use:enhance class="w-full">
					<Button type="submit" variant="destructive" size="lg" class="w-full">
						<LogOut class="w-4 h-4 mr-2" />
						Sign Out
					</Button>
				</form>
				
				<p class="text-sm text-muted-foreground text-center">
					This will sign you out of your account and redirect you to the homepage.
				</p>
			</div>
		</Card>
	</main>
</div>