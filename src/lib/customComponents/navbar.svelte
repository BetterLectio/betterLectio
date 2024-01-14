<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import { appWindow } from '@tauri-apps/api/window';
	const titlebarMinimize = document.getElementById('titlebar-minimize');
	if (titlebarMinimize) {
		titlebarMinimize.addEventListener('click', () => appWindow.minimize());
	}
	const titlebarMaximize = document.getElementById('titlebar-maximize');
	if (titlebarMaximize) {
		titlebarMaximize.addEventListener('click', () => appWindow.maximize());
	}
	const titlebarClose = document.getElementById('titlebar-close');
	if (titlebarClose) {
		titlebarClose.addEventListener('click', () => appWindow.close());
	}

	//import radix icons for titlebar
	import {
		Stop as Square,
		DividerHorizontal as Minus,
		Cross1 as Cross,
		Avatar,
		Sun,
		Moon
	} from 'radix-icons-svelte';
	import { toggleMode } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
</script>

<div data-tauri-drag-region class="titlebar flex w-full justify-end">
	<Button on:click={toggleMode} variant="ghost" size="icon" class="rounded-none h-8">
		<Sun
			class="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 duration-200"
		/>
		<Moon
			class="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 duration-200"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
	<!-- <Button variant="ghost" size="icon" class="rounded-none h-8">
        <Avatar class="w-5 h-5" />
    </Button> -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
            <Button variant="ghost" size="icon" class="rounded-none h-8">
				<Avatar class="w-5 h-5" />
			</Button>
        </DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Min Konto</DropdownMenu.Label>
				<DropdownMenu.Separator class="mx-2" />
				<DropdownMenu.Item href="/">Forside</DropdownMenu.Item>
                <DropdownMenu.Item>Opgaver</DropdownMenu.Item>
                <DropdownMenu.Item>Lektier</DropdownMenu.Item>
                <DropdownMenu.Item>Dokumenter</DropdownMenu.Item>
                <Separator orientation="horizontal" class="my-2" />
                <DropdownMenu.Item href="/indstillinger">Indstillinger</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<Separator orientation="vertical" class="h-8 mx-4" />
	<Button
		on:click={() => appWindow.minimize()}
		variant="ghost"
		size="icon"
		class="rounded-none h-8"
	>
		<Minus class="w-4 h-4" />
	</Button>
	<Button
		on:click={() => appWindow.maximize()}
		variant="ghost"
		size="icon"
		class="rounded-none h-8"
	>
		<Square class="w-4 h-4" />
	</Button>
	<Button
		on:click={() => appWindow.close()}
		variant="ghost"
		size="icon"
		class="rounded-none hover:bg-destructive hover:to-destructive-foreground h-8"
	>
		<Cross class="w-4 h-4" />
	</Button>
</div>