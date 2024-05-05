<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/other';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		level?: '1' | '2';
		error?: boolean;
	};

	let className: $$Props['class'] = undefined;
	export { className as class };

	export let level: $$Props['level'] = '1';
	export let error: $$Props['error'] = false;
	const rounded = level === '1' ? 'rounded-xl' : 'rounded-md';
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={cn(
		`${rounded} border bg-card dark:bg-dark-${level} text-card-foreground shadow`,
		className
	)}
	class:error
	{...$$restProps}
	on:click
	on:focusin
	on:focusout
	on:mouseenter
	on:mouseleave
>
	<slot />
</div>

<style lang="postcss">
	.error {
		background: repeating-linear-gradient(-70deg, #ff6c6c, #ff6c6c 5px, #ff8585 5px, #ff8585 25px);
	}
</style>
