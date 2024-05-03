<script lang="ts">
	import { cn } from '$lib/utils/other';
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	type $$Props = AccordionPrimitive.TriggerProps;
	type $$Events = AccordionPrimitive.TriggerEvents;

	let className: $$Props['class'] = undefined;
	export let level: AccordionPrimitive.HeaderProps['level'] = 3;
	export { className as class };
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		class={cn(
			'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
			className
		)}
		{...$$restProps}
		on:click
	>
		<slot />
		<ChevronDown class="w-4 h-4 transition-transform duration-200 shrink-0 text-muted-foreground" />
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
