<script lang="ts">
	import { LectioAvatar, Spinner } from '$lib/components';
	import { Separator } from '$lib/components/ui/separator';
	import { get } from '$lib/utils/http';
	import { messageStore } from '$lib/stores';

	get('/beskeder').then((res) => {
		$messageStore = res.beskeder;
	});
</script>

<div class="page-container">
	{#if !$messageStore}
		<div class="flex space-x-2">
			<h1>Henter beskeder...</h1>
			<Spinner />
		</div>
	{:else}
		<h1>Nyeste beskeder</h1>
		{#each $messageStore as message}
			<a class="flex flex-row w-full cursor-pointer" href="/besked?id={message.message_id}">
				<LectioAvatar navn={message.førsteBesked} id={''} />
				<!-- TODO få billeder til at virke-->
				<div class="flex flex-col ml-2">
					<div class="flex flex-row">
						<div class="font-bold">{message.førsteBesked}</div>
						<div class="ml-2 text-gray-500">{message.ændret}</div>
					</div>
					<div>{message.emne}</div>
				</div>
			</a>
			<Separator class="my-2" />
		{/each}
	{/if}
</div>
