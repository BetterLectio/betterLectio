<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { sidebarStore } from '$lib/stores';
	import { getCurrent } from '@tauri-apps/api/window';
	import Menu from 'lucide-svelte/icons/Menu';
	import Layers2 from 'lucide-svelte/icons/layers-2';
	import Maximize from 'lucide-svelte/icons/maximize';
	import Minus from 'lucide-svelte/icons/minus';
	import Moon from 'lucide-svelte/icons/moon';
	import RotateCw from 'lucide-svelte/icons/rotate-cw';
	import Sun from 'lucide-svelte/icons/sun';
	import UserRound from 'lucide-svelte/icons/user-round';
	import X from 'lucide-svelte/icons/x';
	import { toggleMode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { Separator } from './ui/separator';
	import { navigating } from '$app/stores';

	$: spinning = $navigating ? 'animate-spin' : '';

	let fullscreen = false;
	onMount(async () => (fullscreen = await getCurrent().isMaximized()));

	const resize = async () => (fullscreen = await getCurrent().isMaximized());

	const toggleSidebar = () => {
		$sidebarStore.alwaysOpen = !$sidebarStore.alwaysOpen;
		$sidebarStore.isOpen = $sidebarStore.alwaysOpen;
	};
</script>

<svelte:window on:resize={resize} />

<header
	id="site-header"
	data-tauri-drag-region
	class="fixed h-[42px] top-0 z-40 w-full border-b border-border bg-background shadow-sm flex"
>
	<div class="w-[72px] flex items-center justify-center shrink-0">
		<Button on:click={toggleSidebar} variant="ghost" size="icon">
			<Menu class="size-6" />
		</Button>
	</div>
	<div class="flex w-full">
		<div class="flex items-center pr-12">
			<a href="/" class="flex items-center gap-1 text-lg font-bold unstyled">
				<img src="/favicon.png" alt="BetterLectio" class="h-8" />
				BetterLectio
			</a>
		</div>
		<div class="flex items-center grow shrink-0">
			<div class="flex mr-4 grow">
				<Button
					variant="outline"
					class="flex justify-between max-w-lg grow h-7"
					data-command-opener
				>
					<div>
						<p class="text-sm text-muted-foreground">Søg...</p>
					</div>
					<div>
						<kbd
							class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
						>
							<span class="opacity-50">Ctrl</span>
						</kbd>
						+
						<kbd
							class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
						>
							<span class="opacity-50">P</span>
						</kbd>
					</div>
				</Button>
			</div>
			<Button on:click={toggleMode} variant="ghost" size="icon">
				<Sun
					class="w-5 h-5 transition-all duration-200 scale-100 rotate-0 dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute w-5 h-5 transition-all duration-200 scale-0 rotate-90 dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="ghost" size="icon">
						<UserRound class="w-6 h-6" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>Min Konto</DropdownMenu.Label>
						<DropdownMenu.Separator class="mx-2" />
						<DropdownMenu.Item href="/home">Forside</DropdownMenu.Item>
						<DropdownMenu.Item href="/opgaver">Opgaver</DropdownMenu.Item>
						<DropdownMenu.Item href="/sync">Google Sync</DropdownMenu.Item>
						<DropdownMenu.Item>Lektier</DropdownMenu.Item>
						<DropdownMenu.Item>Dokumenter</DropdownMenu.Item>
						<Separator class="my-2" />
						<DropdownMenu.Item href="/indstillinger">Indstillinger</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<div>
				<Button
					on:click={() => getCurrent().minimize()}
					variant="ghost"
					class="h-full rounded-none"
				>
					<Minus />
				</Button>
				<Button
					on:click={async () => await getCurrent().toggleMaximize()}
					variant="ghost"
					class="h-full rounded-none"
				>
					{#if fullscreen}
						<Layers2 />
					{:else}
						<Maximize />
					{/if}
				</Button>
				<Button
					on:click={() => getCurrent().close()}
					variant="ghost"
					class="h-full rounded-none hover:bg-destructive hover:text-white"
				>
					<X />
				</Button>
			</div>
		</div>
	</div>
</header>
