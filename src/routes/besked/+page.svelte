<script lang="ts">
	import { Spinner } from '$lib/components';
	import type { FullMessage, RawFullMessage } from '$lib/types/messages';
	import { get } from '$lib/utils/http';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import ChatBubble from './_components/ChatBubble.svelte';

	const beskedId = new URLSearchParams(window.location.search).get('id');

	let message: FullMessage;
	let ready: boolean = false;

	onMount(async () => {
		const res = (await get(`/besked?id=${beskedId}`)) as RawFullMessage;
		message = {
			messages: res.beskeder.map((message) => {
				const edits = (message.besked.match(/^.*Redigeret af.*$/gm) ?? []).map((edit: string) =>
					edit.replace(/ .*,/, '')
				);
				const clientParts = message.besked.match(
					/Sendt fra.*\[(.*)\]\((.*)\)|\[Sendt fra (.*)\]\((.*)\)/
				);
				const client = clientParts
					? {
							name: clientParts[1] ?? clientParts[3],
							link: clientParts[2] ?? clientParts[4]
						}
					: undefined;

				return {
					attachments: message.vedhæftninger
						? message.vedhæftninger.map((attachment) => {
								return {
									link: attachment.href,
									name: attachment.navn
								};
							})
						: [],
					date: DateTime.fromFormat(message.dato, 'dd-MM-yyyy HH:mm:ss', {
						locale: 'da'
					}),
					edits,
					client,
					body: message.besked
						.replaceAll('@', '@<!-- -->')
						.replaceAll(/^.*Redigeret af.*$/gm, '')
						.replace(/Sendt fra.*\[(.*)\]\((.*)\)|\[Sendt fra (.*)\]\((.*)\)/, ''),
					sender: {
						id: message.bruger.id,
						name: message.bruger.navn.split(' (')[0].split(' -')[0]
					},
					title: message.titel,
					id: message.id,
					indent: message.padding_left
				};
			}),
			receivers: res.modtagere
		};
		ready = true;
	});
</script>

<div class="page-container">
	{#if !ready}
		<div class="flex space-x-2">
			<h1>Henter besked...</h1>
			<Spinner />
		</div>
	{:else}
		<h1>{message.messages[0].title}</h1>
		{#each message.messages as msg}
			<ChatBubble message={msg} />
		{/each}
	{/if}
</div>
