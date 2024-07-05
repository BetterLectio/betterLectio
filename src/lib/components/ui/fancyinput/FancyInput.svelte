<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils';
	import Input from '../input/input.svelte';

	let className: null | string | undefined = undefined;

	export let value: HTMLInputAttributes['value'] = undefined;
	export { className as class };
	export let placeholder = '';

	let input: HTMLInputElement;
	let focused = false;
	let position = { x: 0, y: 0 };
	let opacity = 0;

	const handleMouseMove = (e: MouseEvent) => {
		if (!input || focused) return;

		const rect = input.getBoundingClientRect();

		position = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	};

	const handleFocus = () => {
		focused = true;
		opacity = 1;
	};

	const handleBlur = () => {
		focused = false;
		opacity = 0;
	};

	const handleMouseEnter = () => {
		opacity = 1;
	};

	const handleMouseLeave = () => {
		opacity = 0;
	};
</script>

<div class="relative w-full">
	<input
		bind:value
		class={cn(
			'flex h-12 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		{placeholder}
		on:blur={handleBlur}
		on:focus={handleFocus}
		on:mouseenter={handleMouseEnter}
		on:mouseleave={handleMouseLeave}
		on:mousemove={handleMouseMove}
		{...$$restProps}
	/>
	<input
		aria-hidden="true"
		bind:this={input}
		class="pointer-events-none absolute left-0 top-0 z-10 h-12 w-full cursor-default rounded-md border border-foreground bg-[transparent] p-3.5 transition-opacity duration-500 placeholder:select-none"
		disabled
		style={`
      -webkit-mask-image: radial-gradient(30% 30px at ${position.x}px ${position.y}px, black 45%, transparent);
    `}
		style:opacity
	/>
</div>
