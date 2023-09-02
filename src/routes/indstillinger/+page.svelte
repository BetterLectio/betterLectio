<script>

	// import Konto from './routes/Konto.svelte';
	// import Api from './routes/Api.svelte';
	// import Pro from './routes/Pro.svelte';
	// import Tilslut from './routes/Tilslut.svelte';
	import Generelt from './routes/Generelt.svelte';
	import { version } from '$app/environment';
</script>

<div class="w-full">
	<Generelt />
	<!-- (ikke nødvændige endnu)
	<Konto />
	<Api />
	<Pro />
	<Tilslut />
	-->

	<p class="mt-4 font-mono">BetterLectio version: {version}</p>
</div>
