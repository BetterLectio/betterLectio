<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import { ArrowLeft as Back } from 'radix-icons-svelte';
	import * as Table from '$lib/components/ui/table';
	import { get } from '$lib/js/http';
	import { opgaver } from '$lib/js/store';
	import { EnvelopeOpen, ExclamationTriangle, Rocket, Archive, ChatBubble } from 'radix-icons-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import { formatDate } from '$lib/js/relativeTime';

	let _opgaver: Array<Opgave> = [];
	let selected = 'ikkeAfleveredeOpgaver';
	let searchString = '';

	get('/opgaver').then((data) => {
		$opgaver = data;
	});

	type Opgave = {
		afventer: string;
		'elev-tid': string;
		elevnote: string;
		exerciseid: string;
		fravær: string;
		frist: string;
		hold: string;
		karakter: string;
		opgavenote: string;
		opgaver: string;
		opgavetitel: string;
		status: string;
		uge: string;
		date: Date;
	};

	function sortOpgaver(__opgaver: Array<Opgave>) {
		const ikkeAfleveredeOpgaver = [];
		const afleveredeOpgaver = [];
		const afsluttedeOpgaver = [];
		const feedbackOpgaver = [];

		for (const opgave of __opgaver) {
			const _date = opgave.frist.replace('-', '/').split(' ');
			const __date = _date[0].split('/');
			opgave.date = new Date(`${__date[1]}/${__date[0]}/${__date[2]} ${_date[1]}`);
			if (
				(opgave.status === 'Afleveret' && opgave.afventer === 'Elev') ||
				(opgave.status === 'Afsluttet' && opgave.afventer === '')
			)
				feedbackOpgaver.push(opgave);
			if (opgave.status === 'Afleveret') {
				afleveredeOpgaver.push(opgave);
				continue;
			} else if (opgave.status === 'Afsluttet') {
				afsluttedeOpgaver.push(opgave);
				continue;
			} else if (opgave.status === 'Venter') {
				ikkeAfleveredeOpgaver.push(opgave);
			} else {
				ikkeAfleveredeOpgaver.push(opgave);
			}
		}

		if (selected === 'ikkeAfleveredeOpgaver') {
			return ikkeAfleveredeOpgaver;
		} else if (selected === 'afleveredeOpgaver') {
			afleveredeOpgaver.reverse();
			return afleveredeOpgaver;
		} else if (selected === 'afsluttedeOpgaver') {
			afsluttedeOpgaver.reverse();
			return afsluttedeOpgaver;
		} else if (selected === 'feedbackOpgaver') {
			feedbackOpgaver.reverse();
			return feedbackOpgaver;
		}
	}

	function search() {
		selected = 'search';

		const searchResults: Array<Opgave> = [];
		$opgaver.forEach((opgave: Opgave) => {
			if (
				opgave.opgavetitel.toLowerCase().includes(searchString.toLowerCase()) ||
				opgave.hold.includes(searchString.toLowerCase())
			)
				searchResults.push(opgave);
		});
		_opgaver = searchResults.reverse();
	}

	$: if (
		$opgaver &&
		(selected === 'ikkeAfleveredeOpgaver' ||
			selected === 'afleveredeOpgaver' ||
			selected === 'afsluttedeOpgaver' ||
			selected === 'feedbackOpgaver')
	)
		_opgaver = sortOpgaver($opgaver ?? []);

	function elevtidNum(elevtid: string) {
		return Number(elevtid.replace(',', '.'));
	}
</script>

<div class="container mx-auto flex items-center gap-4">
	<Back class="w-8 h-8 " />
	<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Opgaver</h3>
</div>
<Separator class="mb-4 mt-1" />
<div class="container mx-auto">
	<!-- search -->
	<div class="flex items-center gap-4">
		<Input
			type="text"
			class="max-w-xs"
			placeholder="Søg efter opgaver"
			bind:value={searchString}
			on:input={search}
			on:keydown={(e) => {
				if (e.key === 'Enter') search();
			}}
		/>
	</div>

	<Table.Root class="overflow-x-auto">
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
			{#if _opgaver}
				{#each _opgaver as opgave}
				<Table.Row>
						<!-- <a> -->
						<!-- handed in -->
						<div class="h-9 items-center flex ml-2">
							<Tooltip.Root>
								{#if opgave.status === 'Afleveret'}
									<Tooltip.Trigger
										><Rocket class="w-4 h-4 text-green-800 dark:text-green-400" /></Tooltip.Trigger
									>
									<Tooltip.Content>
										<p>Afleveret</p>
									</Tooltip.Content>
								{:else if opgave.status === 'Afsluttet'}
									<Tooltip.Trigger
										><Archive class="w-4 h-4 text-blue-800 dark:text-blue-400" /></Tooltip.Trigger
									>
									<Tooltip.Content>
										<p>Afsluttet</p>
									</Tooltip.Content>
								{:else if opgave.status === 'Venter'}
									<Tooltip.Trigger><EnvelopeOpen class="w-4 h-4" /></Tooltip.Trigger>
									<Tooltip.Content>
										<p>Venter</p>
									</Tooltip.Content>
								{:else}
									<Tooltip.Trigger
										><ExclamationTriangle
											class="w-4 h-4 text-red-800 dark:text-red-400"
										/></Tooltip.Trigger
									>
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
										<Badge class="bg-orange-800 dark:bg-orange-400">{opgave['elev-tid']}</Badge>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Opgaven har {opgave['elev-tid']} elev timer</p>
									</Tooltip.Content>
								{:else if elevtidNum(opgave['elev-tid']) >= 5}
									<Tooltip.Trigger>
										<Badge class="bg-yellow-800 dark:bg-yellow-400">{opgave['elev-tid']}</Badge>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>Opgaven har {opgave['elev-tid']} elev timer</p>
									</Tooltip.Content>
								{:else if elevtidNum(opgave['elev-tid']) > 0}
									<Tooltip.Trigger>
										<Badge variant="outline" class="border-green-800 dark:border-green-400"
											>{opgave['elev-tid']}</Badge
										>
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
						<Table.Cell class="sm:table-cell">
							<Tooltip.Root>
								<Tooltip.Trigger>
									{formatDate(opgave.date)}
								</Tooltip.Trigger>
								<Tooltip.Content>
									{opgave.frist}
								</Tooltip.Content>
							</Tooltip.Root>
						</Table.Cell>
						<Table.Cell class="text-nowrap line-clamp-1 sm:table-cell">{opgave.opgavetitel}</Table.Cell>
					</Table.Row>
				{/each}
			{/if}
		</Table.Body>
	</Table.Root>
</div>
