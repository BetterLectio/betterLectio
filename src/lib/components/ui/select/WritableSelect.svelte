<script lang="ts">
	import { cn } from '$lib/utils/other';
	import { createCombobox, melt } from '@melt-ui/svelte';
	import Check from 'lucide-svelte/icons/check';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import { fly } from 'svelte/transition';
	import { buttonVariants } from '../button';

	const {
		elements: { menu, input, option },
		states: { open, inputValue, selected, touchedInput },
		helpers: { isSelected }
	} = createCombobox({
		forceVisible: true
	});

	export let items: string[] = [];
	export let placeholder: string = 'Vælg en mulighed...';
	export const value = selected;

	$: filteredItems = $touchedInput
		? items.filter((value) => {
				const normalizedInput = $inputValue.toLowerCase();
				return value.toLowerCase().includes(normalizedInput);
			})
		: items;
</script>

<div class="relative w-full">
	<input
		use:melt={$input}
		class={cn(buttonVariants({ variant: 'outline' }), 'w-full placeholder:text-foreground')}
		{placeholder}
	/>
	<div class="absolute z-10 -translate-y-1/2 right-2 top-1/2">
		{#if $open}
			<ChevronUp />
		{:else}
			<ChevronDown />
		{/if}
	</div>
</div>
{#if $open}
	<ul
		class="unstyled z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg border-2 border-foreground"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div
			class="flex flex-col max-h-full gap-0 px-2 py-2 overflow-y-auto bg-background"
			tabindex="0"
		>
			{#each filteredItems as item, index (index)}
				<li
					use:melt={$option({
						value: item,
						label: item
					})}
					class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4
                    data-[highlighted]:bg-gray-200 dark:data-[highlighted]:bg-zinc-700"
				>
					{#if $isSelected(item)}
						<div class="absolute z-10 check left-2 top-1/2 text-primary">
							<Check />
						</div>
					{/if}
					<span class="pl-4 font-medium">{item}</span>
				</li>
			{:else}
				<li class="relative py-1 pl-8 pr-4 rounded-md cursor-pointer">Ingen resultater</li>
			{/each}
		</div>
	</ul>
{/if}

<style lang="postcss">
	.check {
		@apply absolute left-2 top-1/2;
		translate: 0 calc(-50% + 1px);
	}
</style>
