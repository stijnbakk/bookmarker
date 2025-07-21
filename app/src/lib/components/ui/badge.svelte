<script lang="ts">
	import { cn } from '$lib/utils';
	import { type VariantProps, cva } from 'class-variance-authority';

	const badgeVariants = cva(
		'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
		{
			variants: {
				variant: {
					default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
					secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
					destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
					outline: 'text-foreground',
					success: 'border-transparent bg-green-100 text-green-800'
				}
			},
			defaultVariants: {
				variant: 'default'
			}
		}
	);

	type BadgeVariants = VariantProps<typeof badgeVariants>;
	type $$Props = {
		class?: string;
		variant?: BadgeVariants['variant'];
	} & $$restProps;

	export let variant: $$Props['variant'] = 'default';

	let className: $$Props['class'] = '';
	export { className as class };
</script>

<div class={cn(badgeVariants({ variant }), className)} {...$$restProps}>
	<slot />
</div>