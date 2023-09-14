<script>
	import { hold, indstillinger, opgaver } from '$lib/js/store.js';
	import { fade } from 'svelte/transition';
	import { formatDate } from '$lib/js/relativeTime.js';
	import { get } from '$lib/js/http.js';
	import { holdOversætter } from '$lib/js/HoldOversætter.js';
	import { goto } from '$app/navigation';

	let _opgaver = [];
	let selected = 'ikkeAfleveredeOpgaver';
	let searchString = '';

	get('/opgaver').then(data => {
		$opgaver = data;
	});

	function sortOpgaver(__opgaver) {
		const ikkeAfleveredeOpgaver = [];
		const afleveredeOpgaver = [];
		const afsluttedeOpgaver = [];
		const feedbackOpgaver = [];

		// loop trouh __opgaver
		for (const opgave of __opgaver) {
			const _date = opgave.frist.replace('-', '/').split(' ');
			const __date = _date[0].split('/');
			opgave.date = new Date(`${__date[1]}/${__date[0]}/${__date[2]} ${_date[1]}`);
			if ((opgave.status === 'Afleveret' && opgave.afventer === 'Elev') || (opgave.status === 'Afsluttet' && opgave.afventer === '')) {
				feedbackOpgaver.push(opgave);
				console.log('pushed', opgave);
			}
			if (opgave.status === 'Afleveret') {
				opgave.class = 'btn btn-success';
				afleveredeOpgaver.push(opgave);
				continue;
			} else if (opgave.status === 'Afsluttet') {
				opgave.class = 'btn btn-neutral';
				afsluttedeOpgaver.push(opgave);
				continue;
			} else if (opgave.status === 'Venter') {
				opgave.class = 'btn btn-warning';
				ikkeAfleveredeOpgaver.push(opgave);
			} else {
				opgave.class = 'btn btn-error';
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

		const searchResults = [];
		$opgaver.forEach(opgave => {
			if (opgave.opgavetitel.toLowerCase().includes(searchString.toLowerCase())) searchResults.push(opgave);
		});
		_opgaver = searchResults;
	}

	$: if ($opgaver && (selected === 'ikkeAfleveredeOpgaver' || selected === 'afleveredeOpgaver' || selected === 'afsluttedeOpgaver' || selected === 'feedbackOpgaver')) _opgaver = sortOpgaver($opgaver);
</script>

<div>
	<h1 class="heading">Opgaver</h1>
	<div class="flex sm:flex-row flex-col">
		<div class="tabs items-center tabs-boxed justify-between max-sm:hidden">
			<button
				class="{selected === 'ikkeAfleveredeOpgaver' ? 'tab-active ' : ''} tab"
				on:click={() => {
					selected = 'ikkeAfleveredeOpgaver';
				}}>Ikke Afleverede
			</button			>
			<button
				class="{selected === 'afleveredeOpgaver' ? 'tab-active ' : ''} tab"
				on:click={() => {
					selected = 'afleveredeOpgaver';
				}}>Afleverede
			</button>
			<button
				class="{selected === 'afsluttedeOpgaver' ? 'tab-active ' : ''} tab"
				on:click={() => {
					selected = 'afsluttedeOpgaver';
				}}>Afsluttet
			</button>
			<button
				class="{selected === 'feedbackOpgaver' ? 'tab-active ' : ''} tab"
				on:click={() => {
					selected = 'feedbackOpgaver';
				}}>Med Feedback
			</button>

		</div>
		<select class="select w-full bg-base-200 sm:hidden" bind:value={selected}>
			<option value='ikkeAfleveredeOpgaver' >Ikke Afleverede</option>
			<option value='afleveredeOpgaver' >Afleverede</option>
			<option value='afsluttedeOpgaver' >Afsluttet</option>
			<option value='feedbackOpgaver' >Med Feedback</option>
		</select>
		<input
			type="text"
			placeholder="Søg"
			class="input sm:h-10 bg-base-200 mt-4 sm:mt-0 sm:ml-4 "
			bind:value={searchString}
			on:input={search}
		/>

	</div>

	{#if _opgaver}
		<div class="overflow-x-hidden flex">
			<table class="table-zebra my-4 table w-full">
				<thead>
					<tr>
						<th>Opgavetitel</th>
						<th>Timer</th>
						<th>Fag</th>
						<th>Frist</th>
						<th class="max-sm:hidden">Opgavenote</th>
					</tr>
				</thead>
				<tbody class="w-full">
					{#each _opgaver as opgave (opgave.exerciseid)}
						<tr on:click={goto(`/opgave?exerciseid=${opgave.exerciseid}`)} class="max-sm:h-8" in:fade={{ duration: 200 }}>
							<td>
								<a href="/opgave?exerciseid={opgave.exerciseid}" class="{opgave.class} btn-xs w-full">
									<p class="line-clamp-1">{opgave.opgavetitel}</p>
								</a></td
							>
							<td class="bg-">{opgave['elev-tid']}</td>
							<td class="">{holdOversætter(opgave.hold, $hold)}</td>
							<td class="w-fit">
								{#if $indstillinger?.opgaver?.visFristAbsolut}
									<div class="w-max btn-xs btn">
										{opgave.frist}
									</div>
								{:else}
									<p class="inline-block pt-0.5 btn-xs w-max btn first-letter:uppercase">
										{formatDate(opgave.date)}
									</p>
								{/if}
							</td>
							<td class="text-left max-sm:hidden" id={opgave.exerciseid}>
								<div
									class={`h-full text-left${ opgave.opgavenote.length > 100 ? ' tooltip cursor-pointer' : ''}`}
									data-tip={opgave.opgavenote}
								>
									<p class="line-clamp-1">
										{opgave.opgavenote}
									</p>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
