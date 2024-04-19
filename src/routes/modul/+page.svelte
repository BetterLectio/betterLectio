<script lang="ts">
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { get } from '$lib/js/http.js';
	import { page } from '$app/stores';
	import purifier from 'dompurify';
	import type { RawModule } from '$lib/types/types';
	import Header from '$lib/customComponents/Header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table';
	import { DividerHorizontal } from 'radix-icons-svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const { sanitize } = purifier();

	let cookie: any | null = null; //TODO: Fix any
	cookieInfo().then((data: unknown) => {
		cookie = data || {};
	});

	const absid = $page.url.searchParams.get('absid');

	let modul: RawModule | null = null;
	let items = {};

	let returnedError = false;
	async function getModul() {
		modul = await get(`/modulHtml?absid=${absid}`).catch(() => {
			returnedError = true;
		});
		items = {
			Tidspunkt: modul?.aktivitet?.tidspunkt,
			Lokale: modul?.aktivitet?.lokale,
			Lærer: modul?.aktivitet?.lærer
		};
	}
	getModul();

	function onIndholdMount(modulElement: any) {
		// ved ikke hvad typen er
		const textAreas = modulElement.getElementsByTagName('textarea');
		for (let i = 0; i < textAreas.length; i++)
			textAreas[i].setAttribute('style', `width=100%; height:${textAreas[i].scrollHeight}px;`); // Som lectio gør det
		const buttons = modulElement.getElementsByTagName('a');
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].setAttribute('target', '_blank');
			if (buttons[i].href.includes('/lectio/'))
				buttons[i].href = `https://www.lectio.dk/lectio/${buttons[i].href.split('/lectio/')[1]}`;
			buttons[i].classList.add('preview');
			const styleElements = buttons[i].querySelectorAll('*[style]');
			for (let j = 0; j < styleElements.length; j++) styleElements[j].removeAttribute('style'); // Måske er der en bedre måde at gøre det på?
		}
	}
</script>

<Header>
	<h1 class="heading">
		{#if modul}
			{modul.aktivitet.hold}
		{:else}
			Loading...
		{/if}
	</h1>
</Header>

<div class="container mx-auto">
	<div class="flex flex-row justify-end w-full">
		{#if modul}
			<Button
				variant="outline"
				href={`https://www.lectio.dk/lectio/${cookie.schoolId}/aktivitet/aktivitetforside2.aspx?absid=${absid}&lectab=elevindhold`}
				target="_blank">Åben Elevfeedback</Button
			>
		{:else}
			<Button variant="outline" disabled={true}>Åben Elevfeedback</Button>
		{/if}
	</div>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				{#each Object.entries(items) as [key, value]}
					{#if key && value}
						<Table.Head>{key}</Table.Head>
					{/if}
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				{#each Object.entries(items) as [key, value]}
					{#if key && value}
						<Table.Cell>{value}</Table.Cell>
					{/if}
				{/each}
			</Table.Row>
		</Table.Body>
	</Table.Root>

	<Separator class="my-4" />

	{#if modul}
		<div class="space-y-4">
			{#each Object.entries(modul) as indhold}
				{#if indhold[1] && indhold[0] !== 'aktivitet'}
					<div>
						<h2 class="text-xl font-bold capitalize">{indhold[0].replace('_', ' ')}</h2>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<div use:onIndholdMount class="modul divide-y space-y-2 break-all">
							{@html sanitize(indhold[1].replace('align="center"', ''))}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.modul :global(h1) {
		@apply text-xl;
	}

	.modul :global(a) {
		@apply underline;
	}

	.modul :global(ol) {
		@apply list-decimal;
		@apply ml-8;
	}

	.modul :global(ul) {
		@apply list-disc;
		@apply ml-8;
	}

	.modul :global(textarea) {
		@apply w-full;
		@apply bg-background;
		@apply resize-none;
	}
</style>
