<script lang="ts">
	import '../app.css';

	import { Toaster } from '$lib/components/ui/sonner';
	import Navbar from '$lib/customComponents/navbar.svelte';
	import Command from '$lib/customComponents/command.svelte';
</script>

<Command />
<Navbar />
<Toaster />

<slot />
