<script lang="ts">
	import { LectioAvatar, Spinner } from '$lib/components';
	import { Separator } from '$lib/components/ui/separator';
	import { get } from '$lib/js/http';
	import { beskeder } from '$lib/js/store';

	let ready = false;
	get('/beskeder').then((res) => {
		$beskeder = res.beskeder;
		ready = true;
	});
</script>

<div class="page-container">
	{#if !ready}
		<div class="flex space-x-2">
			<h1>Henter beskeder...</h1>
			<Spinner />
		</div>
	{:else}
		<h1>Nyeste beskeder</h1>
		{#each $beskeder as besked}
			<a class="flex flex-row w-full cursor-pointer" href="/besked?id={besked.message_id}">
				<LectioAvatar navn={besked.førsteBesked} id={''} />
				<!-- TODO få billeder til at virke-->
				<div class="flex flex-col ml-2">
					<div class="flex flex-row">
						<div class="font-bold">{besked.førsteBesked}</div>
						<div class="ml-2 text-gray-500">{besked.ændret}</div>
					</div>
					<div>{besked.emne}</div>
				</div>
			</a>
			<Separator class="my-2" />
		{/each}
	{/if}
</div>
