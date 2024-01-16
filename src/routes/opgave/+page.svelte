<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { get } from '$lib/js/http';
	import Header from '$lib/customComponents/Header.svelte';
	import Spinner from '$lib/customComponents/spinner.svelte';
	import * as Accordion from '$lib/components/ui/accordion';

	type Person = {
		bruger_id: string;
		navn: string;
	};

	type Opgave = {
		afleveres_af: {
			afsluttet: boolean;
			afventer: 'Elev' | 'Lærer';
			elev: Person;
			elevnote: string;
			karakter: string;
			karakternote: string;
			status_fravær: string;
		};
		gruppemedlemmer: Array<Person>;
		opgave_indlæg: Array<string>; //add type later
		oplysninger: {
			afleveringsfrist: string;
			ansvarlig: Person;
			elevtid: string;
			hold: string;
			i_undervisningsbeskrivelse: 'Ja' | 'Nej';
			karakterskala: string;
			opgavebeskrivelse: string | null;
			opgavenote: string;
			opgavetitel: string;
		};
	};

	const exerciseid = $page.url.searchParams.get('id');
	if (!exerciseid) goto('/opgaver');

	let opgave: Opgave;
	let ready: boolean = false;

	get(`/opgave?exerciseid=${exerciseid}`).then((data) => {
		opgave = data;
		ready = true;
		console.log(opgave);
	});
</script>

{#if ready}
	<Header>{opgave.oplysninger.opgavetitel}</Header>
	<div class="container mx-auto">
		<Accordion.Root>
			<Accordion.Item value="item-1">
				<Accordion.Trigger>Opgavenote</Accordion.Trigger>
				<Accordion.Content>
                    <div class="p-4">
                        {#if opgave.oplysninger.opgavenote}
                            <p>{opgave.oplysninger.opgavenote}</p>
                        {:else}
                            <p>Der er ikke nogen opgavenote</p>
                        {/if}
                    </div>
                </Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>
{:else}
	<Header>Indlæser opgave...</Header>
	<div class="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2">
		<Spinner />
	</div>
{/if}
