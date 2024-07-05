<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Command from '$lib/components/ui/command';
	import { SITE_LINKS } from '$lib/links';
	import { assignmentStore } from '$lib/stores';
	import type { RawSimpleAssignment } from '$lib/types/assignments';
	import { get } from '$lib/utils';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Assignment } from '$lib/components/lectio';

	let query = '';
	let assignmentsLoaded = false;
	const minLengthToSearchAssignments = 2;
	$: searchAssignments = query.length > minLengthToSearchAssignments;
	let open = false;
	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				open = !open;
			}
		}
		document.addEventListener('keydown', handleKeydown);

		//handle the routing of the commands
		function handleRouting(e: MouseEvent | KeyboardEvent) {
			if (e instanceof MouseEvent) {
				const target = e.target as HTMLElement;
				const routeto = target.dataset.routeto;
				if (routeto) {
					open = false;
					goto(routeto);
				}
			} else if (e instanceof KeyboardEvent && e.key === 'Enter') {
				//find the data-selected element that has a child with the data-routeto attribute
				const target = document.querySelector('[data-selected] [data-routeto]');
				if (!target) return;
				const routeto = (target as HTMLElement).dataset.routeto;
				if (routeto) {
					open = false;
					goto(routeto);
				}
			}
		}

		document.addEventListener('click', handleRouting);
		document.addEventListener('keydown', handleRouting);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('click', handleRouting);
		};
	});

	let filteredAssignments = writable<RawSimpleAssignment[]>([]);
	$: if ((open && searchAssignments) || (open && query.length > minLengthToSearchAssignments)) {
		if (!assignmentsLoaded) get('/opgaver').then((res) => assignmentStore.set(res));
		if ($assignmentStore) {
			assignmentsLoaded = true;
			filteredAssignments.set(
				$assignmentStore.filter((assignment) => {
					const title = assignment.opgavetitel.toLowerCase();
					const queryLower = query.toLowerCase();
					return title.includes(queryLower);
				})
			);
		}
		console.log(`searching for ${query} and found ${$filteredAssignments?.length} assignments`);
	}

	//find the element with the data-command-opener attribute and attach a click event listener to it to open the command dialog
	function handleCommandOpenerClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const opener = target.closest('[data-command-opener]');
		if (opener) {
			open = !open;
		}
	}
	document.addEventListener('click', handleCommandOpenerClick);
</script>

<Command.Dialog bind:open data-global-command>
	<Command.Input bind:value={query} placeholder="Søg efter en side..." />
	<Command.List>
		<Command.Empty>Ingen sider fundet.</Command.Empty>
		{#each Object.entries(SITE_LINKS) as categoryEntry}
			{@const category = categoryEntry[1]}
			<Command.Group heading={category.label}>
				{#each category.links as link}
					<Command.Item>
						<p data-routeto={link.href} class="w-full h-full cursor-pointer">Gå til {link.label}</p>
					</Command.Item>
				{/each}
			</Command.Group>
		{/each}
		{#if searchAssignments}
			<Command.Group heading="Opgaver">
				{#if assignmentsLoaded}
					{#each $filteredAssignments || [] as assignment, i}
						<Command.Item>
							<Assignment
								{assignment}
								class="p-0 m-0 border-0 shadow-none"
								componentRoutes={false}
								data-routeto={`/opgave?id=${assignment.exerciseid}`}
							/>
						</Command.Item>
					{/each}
				{:else}
					<Command.Loading />
				{/if}
			</Command.Group>
		{/if}
	</Command.List>
</Command.Dialog>
