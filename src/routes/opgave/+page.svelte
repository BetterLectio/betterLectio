<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { get } from '$lib/js/http';
	import Header from '$lib/customComponents/Header.svelte';
	import Spinner from '$lib/customComponents/spinner.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Accordion from '$lib/components/ui/accordion';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { cookieInfo } from '$lib/js/LectioCookieHandler';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';

	let cookie: any = null;
	cookieInfo().then((data) => {
		cookie = data;
	});

	const exerciseid = $page.url.searchParams.get('id');
	if (!exerciseid) goto('/opgaver');

	let opgave: Opgave;
	let ready: boolean = false;

	get(`/opgave?exerciseid=${exerciseid}`).then((data) => {
		opgave = data;
		ready = true;
		console.log(opgave);
	});

	function getMDLink(link: string) {
		//format the markdown link to that it only returns the link
		if (link === '') return link;
		console.log(link);
		const nav = link.split('](')[1].split(')')[0];
		// make sure on nav has the _blank attribute
		window.open(nav, '_blank');
	}

	function openAssignmentInLectio() {
		console.log(opgave.afleveres_af.elev.bruger_id.slice(1));
		window.open(
			`https://www.lectio.dk/lectio/${
				cookie.schoolId
			}/ElevAflevering.aspx?elevid=${opgave.afleveres_af.elev.bruger_id.slice(
				1
			)}&exerciseid=${exerciseid}`,
			'_blank'
		);
	}
</script>

{#if ready}
	<Header
		><Badge class="text-xl" variant="outline">{opgave.oplysninger.hold}</Badge>
		{opgave.oplysninger.opgavetitel}</Header
	>
	<div class="container mx-auto mb-2">
		{#if opgave.afleveres_af.afventer === 'Elev'}
			<Badge>afventer: {opgave.afleveres_af.afventer}</Badge>
		{/if}
		{#if opgave.afleveres_af.afsluttet === true}
			<Badge variant="secondary">afsluttet</Badge>
		{/if}
		{#if opgave.afleveres_af.status_fravær.includes('Fravær: 100%')}
			<Badge variant="destructive">{opgave.afleveres_af.status_fravær}</Badge>
		{/if}
		<Badge variant="outline">skala: {opgave.oplysninger.karakterskala}</Badge>
		<Badge variant="outline">frist: {opgave.oplysninger.afleveringsfrist}</Badge>
		<Badge variant="outline">elevtid: {opgave.oplysninger.elevtid}</Badge>
	</div>
	<div class="container mx-auto">
		{#if opgave.oplysninger.opgavenote}
			<p>{opgave.oplysninger.opgavenote}</p>
		{:else}
			<p>Der er ikke nogen opgavenote</p>
		{/if}
	</div>
	<Separator orientation="horizontal" class="my-2" />
	<div class="container mx-auto">
		<!-- inlæg og afleverings knap -->
		{#if opgave.opgave_indlæg.length !== 0}
			<!-- content here -->
			<h3 class="text-lg">Opgave indlæg</h3>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Bruger</Table.Head>
						<Table.Head>Dokument</Table.Head>
						<Table.Head>Inlæg</Table.Head>
						<Table.Head>Tidspunkt</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each opgave.opgave_indlæg as indlæg}
						<Table.Row>
							<Table.Cell>{indlæg.bruger.navn}</Table.Cell>
							{#if indlæg.dokument}
								<Table.Cell
									><Button
										on:click={() => {
											getMDLink(indlæg.dokument ? indlæg.dokument : '');
										}}
										variant="ghost">Dokument</Button
									></Table.Cell
								>
							{:else}
								<Table.Cell></Table.Cell>
							{/if}
							{#if indlæg.indlæg}
								<Table.Cell>{indlæg.indlæg}</Table.Cell>
							{:else}
								<Table.Cell></Table.Cell>
							{/if}
							<Table.Cell>{indlæg.tidspunkt}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
		{#if opgave.afleveres_af.afventer === 'Elev'}
			<Button variant="outline" class="m-2" on:click={openAssignmentInLectio}>Aflever</Button>
		{/if}
	</div>
{:else}
	<Header>Indlæser opgave...</Header>
	<div class="absolute transform translate-x-1/2 -translate-y-1/2 right-1/2 top-1/2">
		<Spinner />
	</div>
{/if}
