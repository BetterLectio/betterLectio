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
			if ((opgave.status === 'Afleveret' && opgave.afventer === 'Elev') || (opgave.status === 'Afsluttet' && opgave.afventer === '')) feedbackOpgaver.push(opgave);
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
			if (opgave.opgavetitel.toLowerCase().includes(searchString.toLowerCase()) || holdOversætter(opgave.hold, $hold).toLowerCase()
				.includes(searchString.toLowerCase())) searchResults.push(opgave);
		});
		_opgaver = searchResults.reverse();
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
			class="input sm:h-10 bg-base-200 mt-4 sm:mt-0 sm:mx-4 "
			bind:value={searchString}
			on:input={search}
		/>


	</div>
	{#if selected === 'feedbackOpgaver'}
		<div class="alert w-fit mt-4 p-2 flex">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
			<span class="text-xs">Der kan være opgaver på denne liste, der ikke har fået feedback, hvis læren har afsluttet opgaven uden at give feedback.</span>
		</div>
	{/if}


	{#if _opgaver}
		{#if $indstillinger?.opgaver?.liste}
			<ul class="list my-4 lg:hidden">
				{#each _opgaver as opgave}
					<li class="relative flex {opgave.class} mt-2 h-full w-full justify-start text-left font-normal normal-case">
						<a class="mt-2 mb-2" href="/opgave?exerciseid={opgave.exerciseid}">
							<div class="flex items-center">
								<div class="mr-4 flex-none">
									<div>
										<p><strong>{opgave.frist.split('-')[0]}</strong></p>
										<p><strong>{opgave.frist.split(' ')[1]}</strong></p>
									</div>
								</div>

								<!-- the following css is to fix the overflow bug on mobile -->
								<div class="w-[calc(100vw-150px)]">
									<p class="font-bold line-clamp-2 {opgave.status === 'Venter' ? 'mr-16' : ''}">
										{opgave.opgavetitel}
									</p>
									<p>{holdOversætter(opgave.hold, $hold)}</p>
									<p class="line-clamp-1 max-w {opgave.status === 'Venter' ? 'mr-16' : ''}">{opgave.opgavenote}</p>
								</div>
								{#if opgave.status === 'Venter'}
									<div class="flex items-center">
										<div class="absolute right-0 mr-4 text-end">
											<p><strong>Om</strong></p>
											<p>
												<strong>{formatDate(opgave.date).replace('om ', '')}</strong>
											</p>
										</div>
									</div>
								{/if}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
		<div class="overflow-x-hidden {$indstillinger?.opgaver?.liste ? 'hidden lg:flex' : ''}">
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
