<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import { getCurrent } from '@tauri-apps/api/window';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { toggleMode } from 'mode-watcher';
	import {
		Avatar,
		Copy,
		Cross1 as Cross,
		Home,
		DividerHorizontal as Minus,
		Moon,
		Reload,
		RotateCounterClockwise,
		Stop as Square,
		Sun
	} from 'radix-icons-svelte';
	import { onMount } from 'svelte';
	import { Separator } from './ui/separator';

	let fullscreen = false;
	onMount(async () => (fullscreen = await getCurrent().isMaximized()));

	const resize = async () => (fullscreen = await getCurrent().isMaximized());
</script>

<svelte:window on:resize={resize} />

<header
	data-tauri-drag-region
	class="sticky h-[42px] top-0 z-40 w-full border-b border-border bg-background/60 shadow-sm backdrop-blur justify-between flex flex-row"
>
	<div class="flex items-center gap-1 px-2 py-1">
		<Button href="/" variant="ghost" size="icon">
			<Home class="w-6 h-6" />
		</Button>
		<Button on:click={() => location.reload()} variant="ghost" size="icon">
			<Reload class="w-6 h-6" />
		</Button>
	</div>
	<div class="flex items-center">
		<Button variant="outline" class="flex justify-between w-[50vw] h-7" data-command-opener>
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
	<div class="flex items-center gap-2 shrink-0">
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
					<Avatar class="w-6 h-6" />
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
				<Minus class="w-5 h-5" />
			</Button>
			<Button
				on:click={async () => await getCurrent().toggleMaximize()}
				variant="ghost"
				class="h-full rounded-none"
			>
				{#if fullscreen}
					<Copy class="w-5 h-5" />
				{:else}
					<Square class="w-5 h-5" />
				{/if}
			</Button>
			<Button
				on:click={() => getCurrent().close()}
				variant="ghost"
				class="h-full rounded-none hover:bg-destructive hover:text-white"
			>
				<Cross class="w-5 h-5" />
			</Button>
		</div>
	</div>
</header>
