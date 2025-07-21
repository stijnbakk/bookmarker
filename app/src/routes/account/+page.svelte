<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Account - {data.user?.email || 'User'}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md mx-auto">
		<div class="bg-white shadow rounded-lg p-6">
			<div class="text-center mb-6">
				<h1 class="text-3xl font-bold text-gray-900 mb-2">
					Welcome, {data.user?.email || 'User'}!
				</h1>
				<p class="text-gray-600">
					You are successfully logged in to your account.
				</p>
			</div>

			<div class="border-t border-gray-200 pt-6">
				<h2 class="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
				<div class="space-y-3">
					<div>
						<span class="text-sm font-medium text-gray-500">Email:</span>
						<span class="ml-2 text-sm text-gray-900">{data.user?.email}</span>
					</div>
					<div>
						<span class="text-sm font-medium text-gray-500">User ID:</span>
						<span class="ml-2 text-sm text-gray-900 font-mono">{data.user?.id}</span>
					</div>
					{#if data.user?.email_confirmed_at}
						<div>
							<span class="text-sm font-medium text-gray-500">Email Confirmed:</span>
							<span class="ml-2 text-sm text-green-600">✓ Verified</span>
						</div>
					{:else}
						<div>
							<span class="text-sm font-medium text-gray-500">Email Status:</span>
							<span class="ml-2 text-sm text-yellow-600">⚠ Unverified</span>
						</div>
					{/if}
				</div>
			</div>

			<div class="border-t border-gray-200 pt-6 mt-6">
				<form method="POST" action="?/logout" use:enhance>
					<button
						type="submit"
						class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
					>
						Sign out
					</button>
				</form>
			</div>
		</div>
	</div>
</div>