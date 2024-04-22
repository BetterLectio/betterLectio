<script lang="ts">
	import { SidebarLink, SiteHeader } from '.';
	import { sidebarStore } from '$lib/stores';
	import { SITE_LINKS } from '$lib/links';
	import * as Sheet from '$lib/components/ui/sheet';
	import { onMount } from 'svelte';

	let height = 0;
	$: mainContentHeight = height; // - (document.getElementById('site-header')?.clientHeight ?? 0); // not needed since height is fixed (not in document flow)

	let timeoutId: number | null = null;
	const mouseEnter = () => {
		if ($sidebarStore.alwaysOpen) return;
		timeoutId = setTimeout(() => {
			$sidebarStore.isOpen = true;
		}, 300);
	};
	const mouseLeave = () => {
		if ($sidebarStore.alwaysOpen) return;
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		$sidebarStore.isOpen = false;
	};

	let isMobile = false;
	let width = 0;
	onMount(() => {
		const resize = () => {
			width = window.innerWidth;
			isMobile = width < 640;
		};
		// note: this is prolly not the most efficient way to do this, but idk, it works :)
		window.addEventListener('resize', resize);
		resize();
		return () => window.removeEventListener('resize', resize);
	});
</script>

<svelte:window bind:innerHeight={height} />

<div>
	<SiteHeader />
	<div class="flex" style="height: {mainContentHeight}px">
		<div
			role="navigation"
			on:mouseenter={mouseEnter}
			on:mouseleave={mouseLeave}
			class="{$sidebarStore.isOpen
				? '!min-w-[240px] !max-w-[240px]'
				: '!min-w-[72px] !max-w-[72px]'} {$sidebarStore.alwaysOpen
				? 'relative'
				: 'fixed'} left-0 bg-background hidden sm:flex flex-col transition-[min-width,max-width] z-10 border-r shadow-sm duration-200 ease-in-out"
			style="width: 240px; height: {mainContentHeight}px"
		>
			<div class="{$sidebarStore.isOpen ? 'w-[240px]' : 'w-[72px]'} mt-14 duration-200 ease-in-out">
				{#each SITE_LINKS.main.links as link}
					<SidebarLink {...link} />
				{/each}
			</div>
		</div>
		<!-- only show if screen less than 640 px -->
		{#if isMobile}
			<Sheet.Root bind:open={$sidebarStore.isOpen} class="sm:hidden">
				<Sheet.Content side="left" class="px-0">
					<Sheet.Header>
						<Sheet.Title></Sheet.Title>
						<Sheet.Description>
							{#each SITE_LINKS.main.links as link}
								<SidebarLink {...link} on:click={() => ($sidebarStore.isOpen = false)} />
							{/each}
						</Sheet.Description>
					</Sheet.Header>
				</Sheet.Content>
			</Sheet.Root>
		{/if}
		<div
			class="{$sidebarStore.alwaysOpen
				? ''
				: 'sm:ml-[72px]'} grow overflow-auto transition-all duration-200 ease-in-out"
		>
			<slot />
		</div>
	</div>
</div>
