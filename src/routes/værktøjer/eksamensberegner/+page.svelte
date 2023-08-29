<script>
	import { get } from '$lib/js/http.js';
	import { studieretningspraesentation } from '$lib/js/store.js';

	get('/studieretningspraesentation').then(data => {
		$studieretningspraesentation = data;
	});
</script>

{#if $studieretningspraesentation}
	<p>{JSON.stringify($studieretningspraesentation)}</p>
{/if}
