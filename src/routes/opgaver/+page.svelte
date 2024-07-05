<script lang="ts">
	import { goto } from '$app/navigation';
	import { Spinner } from '$lib/components';
	import { Assignment } from '$lib/components/lectio';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { ValueSelect } from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { assignmentStore } from '$lib/stores';
	import type { RawSimpleAssignment } from '$lib/types/assignments';
	import { relativeTime } from '$lib/utils';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import Archive from 'svelte-radix/Archive.svelte';
	import ChatBubble from 'svelte-radix/ChatBubble.svelte';
	import EnvelopeOpen from 'svelte-radix/EnvelopeOpen.svelte';
	import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte';
	import Rocket from 'svelte-radix/Rocket.svelte';

	let opgaver = $assignmentStore;
	let filteredOpgaver: RawSimpleAssignment[] = [];
	$: if (opgaver) filteredOpgaver = opgaver;
	let searchString = '';
	let status = 'Skal Afleveres';

	onMount(async () => {
		await assignmentStore.fetch();
		search();
	});

	$: if ($assignmentStore) {
		filteredOpgaver = $assignmentStore?.filter((opgave) => {
			switch (status) {
				case 'Alle':
					return true;
				case 'Skal Afleveres':
					return opgave.status === 'Venter' || opgave.status === 'Mangler';
				case 'Er Afleveret':
					return opgave.status === 'Afleveret' || opgave.status === 'Afsluttet';
			}
		});
		search();
	}

	function search() {
		if (!searchString) return;
		status = 'Alle';
		const searchResults: RawSimpleAssignment[] = [];
		opgaver?.forEach((opgave) => {
			if (
				opgave.opgavetitel.toLowerCase().includes(searchString.toLowerCase()) ||
				opgave.hold.includes(searchString.toLowerCase())
			)
				searchResults.push(opgave);
			filteredOpgaver = searchResults;
		});
	}

	function elevtidNum(elevtid: string) {
		return Number(elevtid.replace(',', '.'));
	}
</script>

<div class="w-full page-container">
	<div class="flex flex-col justify-between gap-4 md:flex-row">
		<div class="flex items-center space-x-2">
			<h1>Opgaver</h1>
			{#if !$assignmentStore}
				<Spinner />
			{/if}
		</div>
		<div class="flex flex-col items-center w-full gap-2 lg:w-fit sm:flex-row">
			{#key status}
				<ValueSelect
					class=""
					bind:value={status}
					items={['Alle', 'Skal Afleveres', 'Er Afleveret']}
				/>
			{/key}
			<Input
				type="text"
				class="w-full h-10 lg:w-fit"
				placeholder="Søg efter opgaver..."
				bind:value={searchString}
				on:input={search}
			/>
		</div>
	</div>

	<Table.Root class="overflow-x-auto" containerClass="hidden md:block !mt-4">
		<Table.Header>
			<Table.Row>
				<Table.Head></Table.Head>
				<Table.Head class="sm:table-cell">Elev tid</Table.Head>
				<Table.Head></Table.Head>
				<Table.Head class="sm:table-cell">Hold</Table.Head>
				<Table.Head class="sm:table-cell">Frist</Table.Head>
				<Table.Head class="sm:table-cell">Opgavetitel</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if filteredOpgaver}
				{#each filteredOpgaver as opgave}
					<Table.Row
						on:click={async () => await goto(`/opgave?id=${opgave.exerciseid}`)}
						class="cursor-pointer select-none"
					>
						<!-- handed in -->
						<div class="flex items-center ml-2 h-9">
							<Tooltip.Root>
								{#if opgave.status === 'Afleveret'}
									<Tooltip.Trigger>
										<Rocket class="w-4 h-4 text-green-800 dark:text-green-400" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Afleveret</p>
									</Tooltip.Content>
								{:else if opgave.status === 'Afsluttet'}
									<Tooltip.Trigger>
										<Archive class="w-4 h-4 text-blue-800 dark:text-blue-400" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Afsluttet</p>
									</Tooltip.Content>
								{:else if opgave.status === 'Venter'}
									<Tooltip.Trigger>
										<EnvelopeOpen class="w-4 h-4" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Venter</p>
									</Tooltip.Content>
								{:else}
									<Tooltip.Trigger>
										<ExclamationTriangle class="w-4 h-4 text-red-800 dark:text-red-400" />
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Mangler</p>
									</Tooltip.Content>
								{/if}
							</Tooltip.Root>
						</div>
						<Table.Cell class="sm:table-cell">
							<Tooltip.Root>
								{#if elevtidNum(opgave['elev-tid']) >= 10}
									<Tooltip.Trigger>
										<Badge class="bg-orange-400">{opgave['elev-tid']}</Badge>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Opgaven har {opgave['elev-tid']} elev timer</p>
									</Tooltip.Content>
								{:else if elevtidNum(opgave['elev-tid']) >= 5}
									<Tooltip.Trigger>
										<Badge class="text-black bg-yellow-400">{opgave['elev-tid']}</Badge>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Opgaven har {opgave['elev-tid']} elev timer</p>
									</Tooltip.Content>
								{:else if elevtidNum(opgave['elev-tid']) > 0}
									<Tooltip.Trigger>
										<Badge variant="outline" class="border-green-400">{opgave['elev-tid']}</Badge>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>
											Opgaven har {opgave['elev-tid']} elev time{elevtidNum(opgave['elev-tid']) ===
										1
											? ''
											: 'r'}
										</p>
									</Tooltip.Content>
								{:else}
									<Tooltip.Trigger>
										<Badge variant="outline">{opgave['elev-tid']}</Badge>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Opgaven har ingen elev timer</p>
									</Tooltip.Content>
								{/if}
							</Tooltip.Root>
						</Table.Cell>
						<Table.Cell class="sm:table-cell">
							{#if opgave.karakter || opgave.elevnote}
								<Tooltip.Root>
									<Tooltip.Trigger>
										<ChatBubble class="w-4 h-4" />
									</Tooltip.Trigger>
									<Tooltip.Content class="w-52">
										{#if opgave.karakter}
											<p>Karakter: {opgave.karakter}</p>
										{/if}
										{#if opgave.karakter && opgave.elevnote}
											<Separator class="my-2" />
										{/if}
										{#if opgave.elevnote}
											<p>Besked: {opgave.elevnote}</p>
										{/if}
									</Tooltip.Content>
								</Tooltip.Root>
							{/if}
						</Table.Cell>
						<Table.Cell class="text-nowrap line-clamp-1 sm:table-cell">{opgave.hold}</Table.Cell>
						<Table.Cell class="sm:table-cell text-nowrap">
							<Tooltip.Root>
								<Tooltip.Trigger>
									<p
										use:relativeTime={DateTime.fromFormat(
											opgave.frist,
											'd/M-yyyy HH:mm'
										).toJSDate()}
									/>
								</Tooltip.Trigger>
								<Tooltip.Content>
									{opgave.frist}
								</Tooltip.Content>
							</Tooltip.Root>
						</Table.Cell>
						<Table.Cell class="text-nowrap line-clamp-1 sm:table-cell"
						>{opgave.opgavetitel}</Table.Cell
						>
					</Table.Row>
				{/each}
			{/if}
		</Table.Body>
	</Table.Root>
	<!-- mobile version here, based on list not table, without tooltips -->
	<div class="flex-col w-full gap-2 max-md:flex md:hidden">
		{#if filteredOpgaver}
			{#each filteredOpgaver as opgave}
				<Assignment assignment={opgave} />
			{/each}
		{/if}
	</div>
</div>
