<script lang="ts">
	// shadcn/ui components
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	
	// Lucide icons
	import { Bookmark, ExternalLink, Camera, Zap, Shield, Globe } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Bookmarker - Save and organize your favorite links</title>
	<meta name="description" content="A simple, elegant bookmarking app with Pinterest image scraping. Save, organize, and access your favorite links with ease." />
</svelte:head>

<div class="min-h-screen bg-background">
	<!-- Hero Section -->
	<section class="bg-gradient-to-b from-background to-muted/20">
		<div class="max-w-4xl mx-auto px-4 py-16 text-center">
			<!-- Logo -->
			<div class="flex items-center justify-center space-x-3 mb-8">
				<div class="p-3 bg-primary rounded-full">
					<Bookmark class="w-8 h-8 text-primary-foreground" />
				</div>
				<h1 class="text-4xl font-bold text-foreground">Bookmarker</h1>
			</div>

			<!-- Hero Content -->
			<div class="max-w-3xl mx-auto space-y-6">
				<h2 class="text-5xl md:text-6xl font-bold text-foreground leading-tight">
					Save and organize your 
					<span class="text-primary">favorite links</span>
				</h2>
				
				<p class="text-xl text-muted-foreground leading-relaxed">
					A simple, elegant bookmarking app that automatically scrapes images from Pinterest and keeps all your links organized in one beautiful feed.
				</p>

				<!-- CTA Button -->
				<div class="pt-4">
					<Button href="/login" size="lg" class="text-lg px-8 py-6">
						<Zap class="w-5 h-5 mr-2" />
						Get Started
					</Button>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="py-16 px-4">
		<div class="max-w-6xl mx-auto">
			<h3 class="text-3xl font-bold text-center text-foreground mb-12">
				Why Choose Bookmarker?
			</h3>
			
			<div class="grid md:grid-cols-3 gap-8">
				<!-- Feature 1 -->
				<Card class="p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
					<div class="flex justify-center">
						<div class="p-3 bg-blue-100 rounded-full">
							<Camera class="w-8 h-8 text-blue-600" />
						</div>
					</div>
					<h4 class="text-xl font-semibold text-foreground">Pinterest Integration</h4>
					<p class="text-muted-foreground">
						Automatically scrapes and displays images from Pinterest pins, making your bookmark collection visually appealing.
					</p>
				</Card>

				<!-- Feature 2 -->
				<Card class="p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
					<div class="flex justify-center">
						<div class="p-3 bg-green-100 rounded-full">
							<Zap class="w-8 h-8 text-green-600" />
						</div>
					</div>
					<h4 class="text-xl font-semibold text-foreground">Lightning Fast</h4>
					<p class="text-muted-foreground">
						Add bookmarks instantly with our streamlined interface. Just paste a URL and hit enter - it's that simple.
					</p>
				</Card>

				<!-- Feature 3 -->
				<Card class="p-8 text-center space-y-4 hover:shadow-lg transition-shadow">
					<div class="flex justify-center">
						<div class="p-3 bg-purple-100 rounded-full">
							<Shield class="w-8 h-8 text-purple-600" />
						</div>
					</div>
					<h4 class="text-xl font-semibold text-foreground">Secure & Private</h4>
					<p class="text-muted-foreground">
						Your bookmarks are stored securely with user authentication. Only you can access your personal collection.
					</p>
				</Card>
			</div>
		</div>
	</section>

	<!-- Demo Section -->
	<section class="py-16 px-4 bg-muted/30">
		<div class="max-w-4xl mx-auto text-center space-y-8">
			<h3 class="text-3xl font-bold text-foreground">
				See It In Action
			</h3>
			<p class="text-xl text-muted-foreground">
				Experience the simplicity and elegance of organized bookmarking
			</p>
			
			<!-- Mock Screenshot/Demo -->
			<div class="bg-card rounded-lg border shadow-lg p-8">
				<div class="bg-background rounded-md p-6 space-y-4">
					<div class="flex items-center space-x-2 text-sm text-muted-foreground">
						<Globe class="w-4 h-4" />
						<span>Example bookmark</span>
					</div>
					<div class="h-32 bg-muted rounded-md flex items-center justify-center">
						<div class="text-center space-y-2">
							<Camera class="w-8 h-8 mx-auto text-muted-foreground" />
							<p class="text-sm text-muted-foreground">Pinterest image preview</p>
						</div>
					</div>
					<div class="space-y-2">
						<div class="flex items-center space-x-2">
							<span class="text-primary font-medium">pinterest.com/pin/example</span>
							<ExternalLink class="w-3 h-3 text-muted-foreground" />
						</div>
						<p class="text-sm text-muted-foreground">Your personal note about this bookmark</p>
					</div>
				</div>
			</div>
			
			<Button href="/login" size="lg" class="mt-8">
				Start Bookmarking Now
			</Button>
		</div>
	</section>

	<!-- Footer -->
	<footer class="py-8 px-4 border-t">
		<div class="max-w-4xl mx-auto text-center">
			<div class="flex items-center justify-center space-x-2 mb-4">
				<Bookmark class="w-5 h-5 text-primary" />
				<span class="text-lg font-semibold text-foreground">Bookmarker</span>
			</div>
			<p class="text-sm text-muted-foreground">
				Save, organize, and access your favorite links with ease.
			</p>
		</div>
	</footer>
</div>