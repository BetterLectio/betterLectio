<script lang="ts">
	import Header from '$lib/customComponents/Header.svelte';
	import { get } from '$lib/js/http';
	import { forside } from '$lib/js/store';

	get('/forside').then((data) => {
		$forside = data;
		console.log(data);
	});
</script>

<Header>Forside - {new Date().toDateString()}</Header>
