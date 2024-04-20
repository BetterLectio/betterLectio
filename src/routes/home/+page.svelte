<script lang="ts">
	import { get } from '$lib/utils/http';
	import { frontPageStore } from '$lib/stores';

	get('/forside').then((data) => {
		$frontPageStore = data;
	});
</script>

<div class="page-container">
	<h1>Forside - {new Date().toDateString()}</h1>
</div>
