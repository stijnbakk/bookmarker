<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	
	// shadcn/ui components
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	
	// Lucide icons
	import { Bookmark, Mail, Lock, ArrowRight, Loader2 } from 'lucide-svelte';

	export let data: PageData;
	export let form: ActionData;
	
	let isSubmitting = false;
</script>

<svelte:head>
	<title>Login - Bookmarker</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center p-4">
	<div class="w-full max-w-md space-y-8">
		<!-- Header -->
		<div class="text-center space-y-2">
			<div class="flex items-center justify-center space-x-2">
				<div class="p-2 bg-primary rounded-full">
					<Bookmark class="w-6 h-6 text-primary-foreground" />
				</div>
				<h1 class="text-2xl font-bold text-foreground">Bookmarker</h1>
			</div>
			<h2 class="text-3xl font-bold text-foreground">Welcome back</h2>
			<p class="text-muted-foreground">Sign in to access your bookmarks</p>
		</div>

		<!-- Login Form -->
		<Card class="p-8">
			<form 
				method="POST" 
				action="?/login" 
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result }) => {
						isSubmitting = false;
					};
				}}
				class="space-y-6"
			>
				<div class="space-y-4">
					<div class="space-y-2">
						<label for="email" class="text-sm font-medium text-foreground">
							Email address
						</label>
						<div class="relative">
							<Mail class="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="Enter your email"
								required
								class="pl-10"
							/>
						</div>
					</div>

					<div class="space-y-2">
						<label for="password" class="text-sm font-medium text-foreground">
							Password
						</label>
						<div class="relative">
							<Lock class="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Enter your password"
								required
								class="pl-10"
							/>
						</div>
					</div>
				</div>

				{#if form?.message}
					<div class="p-3 rounded-md text-sm text-red-700 bg-red-50 border border-red-200">
						{form.message}
					</div>
				{/if}

				<Button type="submit" disabled={isSubmitting} class="w-full">
					{#if isSubmitting}
						<Loader2 class="w-4 h-4 mr-2 animate-spin" />
						Signing in...
					{:else}
						Sign in
						<ArrowRight class="w-4 h-4 ml-2" />
					{/if}
				</Button>
			</form>

			<!-- Register Link -->
			<div class="mt-6 text-center">
				<p class="text-sm text-muted-foreground">
					Don't have an account?
					<a href="/register" class="font-medium text-primary hover:text-primary/80 underline underline-offset-2">
						Sign up here
					</a>
				</p>
			</div>
		</Card>

		<!-- Back to Homepage -->
		<div class="text-center">
			<Button href="/" variant="ghost" size="sm">
				← Back to homepage
			</Button>
		</div>
	</div>
</div>