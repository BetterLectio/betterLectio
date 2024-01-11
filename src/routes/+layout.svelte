<script lang="ts">
	import type { Cross1 } from 'radix-icons-svelte';

	import '../app.css';

	import { Toaster } from '$lib/components/ui/sonner';
	import Navbar from '$lib/customComponents/navbar.svelte';
	import Command from '$lib/customComponents/command.svelte';
    import Button from '$lib/components/ui/button/button.svelte';

    import { appWindow } from '@tauri-apps/api/window'
    const titlebarMinimize = document.getElementById('titlebar-minimize');
    if (titlebarMinimize) {
        titlebarMinimize.addEventListener('click', () => appWindow.minimize())
    }
    const titlebarMaximize = document.getElementById('titlebar-maximize');
    if (titlebarMaximize) {
        titlebarMaximize.addEventListener('click', () => appWindow.maximize())
    }
    const titlebarClose = document.getElementById('titlebar-close');
    if (titlebarClose) {
        titlebarClose.addEventListener('click', () => appWindow.close())
    }

    //import radix icons for titlebar
    import { Stop as Square, DividerHorizontal as Minus, Cross2 as Cross } from 'radix-icons-svelte';

</script>

<div data-tauri-drag-region class="titlebar flex w-full justify-end">
    <Button on:click={() => appWindow.minimize()} variant="ghost" size="icon" class="rounded-none">
        <Minus class="w-4 h-4" />
    </Button>
    <Button on:click={() => appWindow.maximize()} variant="ghost" size="icon" class="rounded-none">
        <Square class="w-4 h-4" />
    </Button>
    <Button on:click={() => appWindow.close()} variant="ghost" size="icon" class="rounded-none hover:bg-destructive hover:to-destructive-foreground">
        <Cross class="w-4 h-4" />
    </Button>
</div>

<Command />
<Navbar />
<Toaster />

<slot />
