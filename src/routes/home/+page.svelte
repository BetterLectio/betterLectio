<script lang="ts">
	import { get } from '$lib/js/http';
	import { forside } from '$lib/js/store';

	get('/forside').then((data) => {
		$forside = data;
		console.log(data);
	});
</script>

<div class="page-container">
	<h1>Forside - {new Date().toDateString()}</h1>
</div>
