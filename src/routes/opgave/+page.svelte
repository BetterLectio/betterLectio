<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Spinner } from '$lib/components';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import { authStore } from '$lib/stores';
	import type { RawAssignment } from '$lib/types/assignments';
	import { get } from '$lib/utils/http';
	import { onMount } from 'svelte';

	const exerciseid = $page.url.searchParams.get('id');
	if (!exerciseid) goto('/opgaver');

	let assignment: RawAssignment;
	let ready = false;

	onMount(async () => {
		const res = await get(`/opgave?exerciseid=${exerciseid}`);
		assignment = res;
		ready = true;
	});

	function getMDLink(link: string) {
		//format the markdown link to that it only returns the link
		if (link === '') return link;
		const nav = link.split('](')[1].split(')')[0];
		// make sure on nav has the _blank attribute
		window.open(nav, '_blank');
	}

	function openAssignmentInLectio() {
		console.log(assignment.afleveres_af.elev.bruger_id.slice(1));
		window.open(
			`https://www.lectio.dk/lectio/${
				$authStore.school
			}/ElevAflevering.aspx?elevid=${assignment.afleveres_af.elev.bruger_id.slice(
				1
			)}&exerciseid=${exerciseid}`,
			'_blank'
		);
	}
</script>

<div class="page-container">
	{#if ready}
		<div class="space-y-4">
			<div class="flex space-x-2">
				<Badge class="text-xl" variant="outline">{assignment.oplysninger.hold}</Badge>
				<h1>
					{assignment.oplysninger.opgavetitel}
				</h1>
			</div>
			<div>
				{#if assignment.afleveres_af.afventer === 'Elev'}
					<Badge>afventer: {assignment.afleveres_af.afventer}</Badge>
				{/if}
				{#if assignment.afleveres_af.afsluttet === true}
					<Badge variant="secondary">afsluttet</Badge>
				{/if}
				{#if assignment.afleveres_af.status_fravær.includes('Fravær: 100%')}
					<Badge variant="destructive">{assignment.afleveres_af.status_fravær}</Badge>
				{/if}
				<Badge variant="outline">skala: {assignment.oplysninger.karakterskala}</Badge>
				<Badge variant="outline">frist: {assignment.oplysninger.afleveringsfrist}</Badge>
				<Badge variant="outline">elevtid: {assignment.oplysninger.elevtid}</Badge>
			</div>
			<div>
				{#if assignment.oplysninger.opgavenote}
					<p>{assignment.oplysninger.opgavenote}</p>
				{:else}
					<p>Der er ikke nogen opgavenote</p>
				{/if}
			</div>
			<Separator />
			<div>
				<!-- inlæg og afleverings knap -->
				{#if assignment.opgave_indlæg.length !== 0}
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
							{#each assignment.opgave_indlæg as indlæg}
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
				{#if assignment.afleveres_af.afventer === 'Elev'}
					<Button variant="outline" class="m-2" on:click={openAssignmentInLectio}>Aflever</Button>
				{/if}
			</div>
		</div>
	{:else}
		<div class="flex space-x-2">
			<h1>Indlæser opgave...</h1>
			<Spinner />
		</div>
	{/if}
</div>
