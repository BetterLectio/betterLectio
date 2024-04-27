<script lang="ts">
	import { get } from '$lib/utils/http';
	import { frontPageStore } from '$lib/stores';
	import { DateTime } from 'luxon';

	get('/forside').then((data) => {
		$frontPageStore = data;
	});
</script>

<div class="page-container">
	<h1>Forside - {DateTime.now().toLocaleString()}</h1>
</div>
