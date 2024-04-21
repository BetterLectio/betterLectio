<script lang="ts">
	import Home from 'lucide-svelte/icons/home';
	import { SidebarLink, SiteHeader } from '.';
	import { sidebarStore } from '$lib/stores';
	import { SITE_LINKS } from '$lib/links';

	let height = 0;
	$: mainContentHeight = height - (document.getElementById('site-header')?.clientHeight ?? 0);

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
				: 'fixed'} left-0 bg-background flex flex-col transition-[min-width,max-width] duration-150 z-10 border-r shadow-sm"
			style="width: 240px; height: {mainContentHeight}px"
		>
			<div class="w-[240px] mt-14">
				{#each SITE_LINKS as link}
					<SidebarLink {...link} />
				{/each}
			</div>
		</div>
		<div class="{$sidebarStore.alwaysOpen ? '' : 'ml-[72px]'} grow overflow-auto">
			<slot />
		</div>
	</div>
</div>
