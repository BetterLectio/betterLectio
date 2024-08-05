<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import { loadingStore, sidebarStore } from '$lib/stores';
	import { getCurrent } from '@tauri-apps/api/window';
	import AlignJustify from 'lucide-svelte/icons/align-justify';
	import Layers2 from 'lucide-svelte/icons/layers-2';
	import Maximize from 'lucide-svelte/icons/maximize';
	import Minus from 'lucide-svelte/icons/minus';
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';
	import UserRound from 'lucide-svelte/icons/user-round';
	import X from 'lucide-svelte/icons/x';
	import { toggleMode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { isDesktop } from '$lib/utils/environment';
	import { isSmallScreen } from '$lib/utils';

	let fullscreen = false;
	onMount(async () => {
		if (!isDesktop) return;
		fullscreen = await getCurrent().isMaximized();
	});

	const resize = async () => {
		if (!isDesktop) return;
		fullscreen = await getCurrent().isMaximized();
	};

	const toggleSidebar = () => {
		if ($isSmallScreen) $sidebarStore.alwaysOpen = !$sidebarStore.alwaysOpen;

		$sidebarStore.isOpen = $isSmallScreen ? $sidebarStore.alwaysOpen : !$sidebarStore.isOpen;
	};
</script>

<svelte:window on:resize={resize} />

<header
	id="site-header"
	class="fixed h-[42px] top-0 z-20 w-full {$loadingStore
		? 'border-background'
		: 'border-b'} border-border bg-background shadow-sm flex"
>
	<div class="max-sm:pl-3 max-sm:pr-1 sm:w-[72px] flex items-center justify-center shrink-0" data-tauri-drag-region>
		<Button on:click={toggleSidebar} class="size-8" variant="ghost" size="icon">
			<AlignJustify class="size-5" />
			<span class="sr-only">Skjul/vis sidepanel</span>
		</Button>
	</div>
	<div class="{!isDesktop && 'page-container-x max-sm:pl-0'} flex w-full">
		<div class="flex items-center pr-4 sm:pr-12" data-tauri-drag-region>
			<a href="/" class="flex items-center gap-1 text-lg font-bold unstyled">
				<img src="/favicon.png" alt="BetterLectio Logo" class="size-6" />
				<span class="hidden sm:block"> BetterLectio </span>
			</a>
		</div>
		<div class="flex items-center grow shrink-0" data-tauri-drag-region>
			<div class="flex mr-4 grow" data-tauri-drag-region>
				<Button
					variant="outline"
					class="flex justify-between max-w-lg grow h-7"
					data-command-opener
				>
					<div>
						<p class="text-sm text-muted-foreground">Søg...</p>
					</div>
					<div class="hidden md:inline-flex">
						<kbd
							class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
						>
							<span>Ctrl</span>
						</kbd>
						+
						<kbd
							class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
						>
							<span>P</span>
						</kbd>
					</div>
				</Button>
			</div>
			<div class="gap-1 mr-2">
				<Button on:click={toggleMode} class="size-8" variant="ghost" size="icon">
					<Sun
						class="transition-all duration-200 scale-100 rotate-0 size-5 dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute transition-all duration-200 scale-0 rotate-90 size-5 dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button class="size-8" variant="ghost" size="icon">
							<UserRound class="size-5" />
							<span class="sr-only">Vis konto</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>Min Konto</DropdownMenu.Label>
							<DropdownMenu.Separator class="mx-2" />
							<DropdownMenu.Item href="/sync">Google Sync</DropdownMenu.Item>
							<DropdownMenu.Item href="/indstillinger">Indstillinger</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			{#if isDesktop}
				<button
					on:click={() => getCurrent().minimize()}
					class="flex items-center justify-center h-full px-3 rounded-none hover:bg-accent"
				>
					<Minus class="size-5" />
				</button>
				<button
					on:click={async () => await getCurrent().toggleMaximize()}
					class="flex items-center justify-center h-full px-3 rounded-none hover:bg-accent"
				>
					{#if fullscreen}
						<Layers2 class="size-5" />
					{:else}
						<Maximize strokeWidth="1.5" class="size-5" />
					{/if}
				</button>
				<button
					on:click={() => getCurrent().close()}
					class="flex items-center justify-center h-full px-3 rounded-none hover:bg-destructive hover:text-white"
				>
					<X strokeWidth="1" />
				</button>
			{/if}
		</div>
	</div>
</header>
