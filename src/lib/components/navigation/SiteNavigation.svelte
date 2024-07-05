<script lang="ts">
	import { loadingStore, screenSizeStore, sidebarStore } from '$lib/stores';
	import { SITE_LINKS } from '$lib/links';
	import * as Drawer from '$lib/components/ui/drawer';
	import { page } from '$app/stores';
	import { isSmallScreen } from '$lib/utils';
	import { SidebarLink, SiteHeader } from '$lib/components/navigation';

	$: mainContentHeight = $screenSizeStore.height;

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

	$: drawerOpen = !$isSmallScreen && $sidebarStore.isOpen;
	const closeDrawer = () => {
		if (!$isSmallScreen) $sidebarStore.isOpen = false;
	}
</script>

<div>
	<SiteHeader />

	<div class="fixed z-30 w-full top-[41px]">
		<div class="h-[1px] w-full bg-border overflow-hidden">
			<div
				class="w-full h-full bg-foreground animate-progress origin-left-right {$loadingStore
					? 'opacity-100'
					: 'opacity-0'} transition-opacity duration-500 ease-in-out delay-500"
			></div>
		</div>
	</div>
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
		<Drawer.Root
			bind:open={drawerOpen}
			preventScroll={true}
		>
			<Drawer.Content>
				<div class="py-10 pr-4">
					{#each SITE_LINKS.main.links as link}
						<Drawer.Close class="block w-full">
							<SidebarLink on:click={closeDrawer} {...link} />
						</Drawer.Close>
					{/each}
				</div>
			</Drawer.Content>
		</Drawer.Root>
		<div
			class="{$sidebarStore.alwaysOpen
				? ''
				: 'sm:ml-[72px]'} grow overflow-auto transition-all duration-200 ease-in-out"
		>
			<slot />
		</div>
	</div>
</div>
