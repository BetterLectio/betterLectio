<script lang="ts">
	import { page } from '$app/stores';
	import { NewTabLink } from '$lib/components/links';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import { authStore } from '$lib/stores';
	import type { RawModule } from '$lib/types/module';
	import { get } from '$lib/utils/http.js';
	import { onMount } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';

	const absid = $page.url.searchParams.get('absid');

	let modul: RawModule | null = null;
	let items = {};

	onMount(async () => {
		modul = await get(`/modul?absid=${absid}`);
		items = {
			Tidspunkt: modul?.aktivitet?.tidspunkt,
			Lokale: modul?.aktivitet?.lokale,
			Lærer: modul?.aktivitet?.lærer
		};
	});
</script>

<div class="page-container">
	<div class="flex justify-between">
		{#if modul}
			<h1>{modul.aktivitet.navn ? modul.aktivitet.navn : modul.aktivitet.hold}</h1>
		{:else}
			<h1>Loading...</h1>
		{/if}
		{#if modul}
			<Button
				variant="outline"
				href={`https://www.lectio.dk/lectio/${$authStore.school}/aktivitet/aktivitetforside2.aspx?absid=${absid}&lectab=elevindhold`}
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
		{#if modul.note}
			<section>
				<h2 class="!mb-0">Note</h2>
				<SvelteMarkdown source={modul.note} renderers={{ link: NewTabLink }} />
			</section>
		{/if}
		{#if modul.lektier}
			<section>
				<h2 class="!mb-0">Lektier</h2>
				<SvelteMarkdown
					source={modul.lektier.replaceAll('\n', '<br>')}
					renderers={{ link: NewTabLink }}
				/>
			</section>
		{/if}
		{#if modul.øvrigtIndhold}
			<section>
				<h2 class="!mb-0">Øvrigt Indhold</h2>
				<SvelteMarkdown
					source={modul.øvrigtIndhold.replaceAll(')', ')<br>')}
					renderers={{ link: NewTabLink }}
				/>
			</section>
		{/if}
		{#if modul.præsentation}
			<section>
				<h2 class="!mb-0">Præsentation</h2>
				<SvelteMarkdown source={modul.præsentation} renderers={{ link: NewTabLink }} />
			</section>
		{/if}
	{/if}
</div>
