<script lang="ts">
	import { cn } from '$lib/utils/other';
	import type { HTMLAttributes } from 'svelte/elements';
	import { alertVariants, type Level, type Variant } from '.';

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		variant?: Variant;
		level?: Level;
	};

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let level: $$Props['level'] = 'default';
	export { className as class };
</script>

<div class={cn(alertVariants({ variant, level }), className)} {...$$restProps} role="alert">
	<slot />
</div>
