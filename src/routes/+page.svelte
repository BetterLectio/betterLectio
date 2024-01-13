<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'radix-icons-svelte';
	import { toggleMode } from 'mode-watcher';
	import Greet from '$lib/customComponents/Greet.svelte';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<Button on:click={() => toast('Hello world')}>Show toast</Button>

<!-- <Greet/> -->