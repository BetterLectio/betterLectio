<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLTableAttributes } from 'svelte/elements';

	type $$Props = HTMLTableAttributes & {
		containerClass?: string;
	};

	let className: $$Props['class'] = undefined;
	export { className as class };

	export let containerClass: string | undefined = undefined;
</script>

<div class={cn('w-full overflow-auto', containerClass)}>
	<table class={cn('w-full caption-bottom text-sm', className)} {...$$restProps}>
		<slot />
	</table>
</div>
