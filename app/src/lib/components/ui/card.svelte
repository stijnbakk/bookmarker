<script lang="ts">
	import { cn } from '$lib/utils';
	import { type VariantProps, cva } from 'class-variance-authority';

	const cardVariants = cva('rounded-lg border bg-card text-card-foreground shadow-sm', {
		variants: {
			variant: {
				default: 'bg-white',
				outline: 'border-2 border-border bg-transparent'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	type CardVariants = VariantProps<typeof cardVariants>;
	type $$Props = {
		class?: string;
		variant?: CardVariants['variant'];
	} & $$restProps;

	export let variant: $$Props['variant'] = 'default';

	let className: $$Props['class'] = '';
	export { className as class };
</script>

<div class={cn(cardVariants({ variant }), className)} {...$$restProps}>
	<slot />
</div>