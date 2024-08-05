<script>
	import { config } from '$lib/js/globalConfig.js';

	function update() {
		if ($config.test === undefined) $config.test = true;
		else $config.test = !$config.test;
	}
</script>

{#if $config}
	<p>{JSON.stringify($config)}</p>
	<button class="btn" on:click={update}>Update</button>
{/if}