<script lang="ts">
	import { LectioAvatar, Spinner } from '$lib/components';
	import { Separator } from '$lib/components/ui/separator';
	import { get } from '$lib/utils/http';
	import { fetchInformation, informationStore, messageStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import { DateTime } from 'luxon';
	import type { RawMessage } from '$lib/types/messages';
	import { relativeTime } from '$lib/utils';

	let refreshing = true;
	onMount(async () => {
		const res = (await get('/beskeder2')) as RawMessage[];
		$messageStore = res.map((message) => {
			return {
				date: message.dato,
				id: message.message_id,
				receivers: message.modtagere,
				sender: message.førsteBesked.split(' (')[0].split(' -')[0],
				title: message.emne
			};
		});

		await fetchInformation();
		refreshing = false;
	});
</script>

<div class="page-container">
	{#if !$messageStore || !$informationStore}
		<div class="flex space-x-2">
			<h1>Henter beskeder...</h1>
			<Spinner />
		</div>
	{:else}
		<div class="flex gap-2">
			<h1>Nyeste beskeder</h1>
			 {#if refreshing}
				<Spinner />
			{/if}
		</div>
		<div class="space-y-2">
			{#each $messageStore as message}
				<a class="flex flex-row w-full cursor-pointer unstyled" href="/besked?id={message.id}">
					<LectioAvatar
						navn={message.sender}
						id={$informationStore.students.find((student) => student.name === message.sender)?.id}
					/>
					<div class="flex flex-col ml-2">
						<div class="flex flex-row">
							<div class="font-bold">{message.sender}</div>
							<div
								use:relativeTime={DateTime.fromFormat(message.date, 'd/M-yyyy HH:mm', {
									locale: 'da'
								}).toJSDate()}
								class="ml-2 text-gray-500"
							/>
						</div>
						<div>{message.title}</div>
					</div>
				</a>
				<Separator class="my-2" />
			{/each}
		</div>
	{/if}
</div>
