<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import { getCurrent } from '@tauri-apps/api/window';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { toggleMode } from 'mode-watcher';
	import {
		Avatar,
		Copy,
		Cross1 as Cross,
		DividerHorizontal as Minus,
		Moon,
		Stop as Square,
		Sun
	} from 'radix-icons-svelte';
	import { onMount } from 'svelte';

	let fullscreen = false;
	onMount(async () => (fullscreen = await getCurrent().isMaximized()));

	const resize = async () => (fullscreen = await getCurrent().isMaximized());
</script>

<svelte:window on:resize={resize} />

<div data-tauri-drag-region class="fixed flex justify-end w-full titlebar">
	<div
		class="flex justify-end bg-background pl-0.5 rounded-bl-lg border border-t-0 border-input shadow-md"
	>
		<Button variant="outline" class="my-0.5 h-7 flex justify-between w-48" data-command-opener>
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
		<Button on:click={toggleMode} variant="ghost" size="icon" class="h-8 rounded-none">
			<Sun
				class="w-4 h-4 transition-all duration-200 scale-100 rotate-0 dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute w-4 h-4 transition-all duration-200 scale-0 rotate-90 dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
		<!-- <Button variant="ghost" size="icon" class="h-8 rounded-none">
			<Avatar class="w-5 h-5" />
		</Button> -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button variant="ghost" size="icon" class="h-8 rounded-none">
					<Avatar class="w-5 h-5" />
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
					<Separator orientation="horizontal" class="my-2" />
					<DropdownMenu.Item href="/indstillinger">Indstillinger</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<Separator orientation="vertical" class="h-8 mx-4" />
		<Button
			on:click={() => getCurrent().minimize()}
			variant="ghost"
			size="icon"
			class="h-8 rounded-none"
		>
			<Minus class="w-4 h-4" />
		</Button>
		<Button
			on:click={async () => await getCurrent().toggleMaximize()}
			variant="ghost"
			size="icon"
			class="h-8 rounded-none"
		>
			{#if fullscreen}
				<Copy class="w-4 h-4" />
			{:else}
				<Square class="w-4 h-4" />
			{/if}
		</Button>
		<Button
			on:click={() => getCurrent().close()}
			variant="ghost"
			size="icon"
			class="h-8 rounded-none hover:bg-destructive hover:to-destructive-foreground"
		>
			<Cross class="w-4 h-4" />
		</Button>
	</div>
</div>
<div class="pb-10"></div>
