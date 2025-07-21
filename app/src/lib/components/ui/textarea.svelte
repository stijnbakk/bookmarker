<script lang="ts">
	import { cn } from '$lib/utils';

	type $$Props = {
		class?: string;
		value?: string;
		placeholder?: string;
		rows?: number;
	} & $$restProps;

	export let value: $$Props['value'] = '';
	export let rows: $$Props['rows'] = 3;

	let className: $$Props['class'] = '';
	export { className as class };
</script>

<textarea
	bind:value
	{rows}
	class={cn(
		'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...$$restProps}
></textarea>