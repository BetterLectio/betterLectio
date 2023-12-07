<script>
	import Table from '$lib/components/Table.svelte';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { get } from '$lib/js/http.js';
	import { hold } from '$lib/js/store.js';
	import { holdOversætter } from '$lib/js/HoldOversætter.js';
	import { page } from '$app/stores';
	import purifier from 'dompurify';

	const { sanitize } = purifier();

	let cookie = null;
	cookieInfo().then(data => {
		cookie = data;
	});

	const absid = $page.url.searchParams.get('absid');

	let modul = null;
	let items = {};

	let linkPreviewBox = '';

	function previewLink() {
		const links = document.querySelectorAll('.preview');

		links.forEach(link => {
			link.addEventListener('mouseover', evt => {
				const url = evt.target.href;
				console.log(`previewing lin: ${ url}`);

				// add an i frame to the linkpreviewbox div with the url
				if (!url.includes('lectio')) linkPreviewBox = `<iframe src="${url}" width="600" height="400" title="link preview" class="rounded-lg" in:fade out:fade />`;


				// place the linkpreviewbox div under the element
				const rect = evt.target.getBoundingClientRect();
				const linkpreviewbox = document.getElementById('linkpreviewbox');
				linkpreviewbox.style.top = `${rect.bottom }px`;
				linkpreviewbox.style.left = `${rect.left }px`;

				// on mouse out (btn and linkpreviewbox) remove the i frame
				linkpreviewbox.addEventListener('mouseout', () => {
					linkPreviewBox = '';
				});

				// if the site cant be loaded, remove the i frame
				linkpreviewbox.addEventListener('error', () => {
					linkPreviewBox.remove();
				});
			});
		});
	}

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
		previewLink();
	}
	getModul();

	function onIndholdMount(modulElement) {
		const textAreas = modulElement.getElementsByTagName('textarea');
		for (let i = 0; i < textAreas.length; i++) textAreas[i].setAttribute('style', `width=100%; height:${textAreas[i].scrollHeight}px;`); // Som lectio gør det
		const buttons = modulElement.getElementsByTagName('a');
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].setAttribute('target', '_blank');
			if (buttons[i].href.includes('/lectio/')) buttons[i].href = `https://www.lectio.dk/lectio/${buttons[i].href.split('/lectio/')[1]}`;
			buttons[i].classList.add('preview');
			const styleElements = buttons[i].querySelectorAll('*[style]');
			for (let j = 0; j < styleElements.length; j++) styleElements[j].removeAttribute('style'); // Måske er der en bedre måde at gøre det på?
		}
	}
</script>

<div id="linkpreviewbox" class="invisible absolute shadow-2xl md:visible">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html linkPreviewBox}
</div>

{#if returnedError && !modul}
	<div role="alert" class="alert alert-error">
		<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
		<div class="">
			<h1 class="font-black">Der skete en fejl ved hentning af modulet</h1>
			<p>
				Dette sker typisk hvis Lectio har lavet en opdatering på deres hjemmeside.
				Vi har modtaget en automatisk fejlrapport og vil kigge på det hurtigst muligt.
				Tak for din forståelse.
			</p>
		</div>
		<a href="/forside" class="btn btn-neutral  rounded-full">Gå tilbage til forsiden</a>
	</div>
{/if}

<div>
	<span class="my-2 flex justify-between">
		{#if modul}
			<h1 class="heading">
				{modul.aktivitet.navn ? `${modul.aktivitet.navn } - ` : ''}{modul.aktivitet.hold
					? holdOversætter(modul.aktivitet.hold, $hold)
					: 'Ukendt hold'}
			</h1>
		{:else if !returnedError}
			<div class="animate-pulse bg-base-200 rounded-lg h-12 w-1/2" />
		{/if}
		{#if modul}
			<a
				class="btn"
				target="_blank"
				href={`https://www.lectio.dk/lectio/${cookie.schoolId}/aktivitet/aktivitetforside2.aspx?absid=${absid}&lectab=elevindhold`}
			>
				Åben Elevfeedback
			</a>
		{/if}
	</span>
	{#if modul}
		<Table {items} />
	{:else if !returnedError}
		<div>
			<div class="w-full h-12 bg-base-200 rounded-t-lg shadow-xl animate-pulse" />
			<div class="w-full h-14 bg-base-100 rounded-b-lg shadow-xl animate-pulse" />
		</div>
	{/if}
	{#if modul}
		<div class="space-y-4">
			{#each Object.entries(modul) as indhold}
				{#if indhold[1] && indhold[0] !== 'aktivitet'}
					<div>
						<h2 class="text-xl font-bold capitalize">{indhold[0].replace('_', ' ')}</h2>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<div use:onIndholdMount class="modul divide-y space-y-2 break-all">{@html sanitize(indhold[1].replace('align="center"', ''))}</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>

	.modul :global(h1) {
		@apply text-xl;
	}

	.modul :global(a) {
		@apply btn;
		@apply btn-xs;
		@apply btn-primary;
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
		@apply bg-base-100;
		@apply resize-none;
	}
</style>
