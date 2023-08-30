<script>
	import MarkdownIt from 'markdown-it';
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

	const md = new MarkdownIt();
	const absid = $page.url.searchParams.get('absid');

	let modul = null;
	let lektieHtml = '';
	let øvrigeIndholdHtml = '';
	let note = '';
	let items = {};
	let isOpen = '';

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

	async function getModul() {
		modul = await get(`/modul?absid=${absid}`);

		items = {
			Tidspunkt: modul?.aktivitet?.tidspunkt,
			Lokale: modul?.aktivitet?.lokale,
			Lærer: modul?.aktivitet?.lærer
		};

		if (modul.lektier) {
			modul.lektier.split('\n').forEach(element => {
				const translated = sanitize(md.render(element)).replace('<a', '<a   class="btn btn-xs btn-primary preview" target="_blank"');
				lektieHtml += `<p>${ translated }<p/>`;
			});
		}

		// TODO: parse LaTex
		if (modul.øvrigtIndhold) {
			modul.øvrigtIndhold.split('\n').forEach(element => {
				const translated = sanitize(md.render(element)).replace('<a', '<a   class="btn btn-xs btn-primary preview" target="_blank"');
				øvrigeIndholdHtml += `<p>${ translated }<p/>`;
			});
		}

		if (modul.note) {
			modul.note.split('\n').forEach(element => {
				const translated = sanitize(md.render(element)).replace('<a', '<a   class="btn btn-xs btn-primary preview" target="_blank"');
				note += `<p>${ translated }<p/>`;
			});
		}
		previewLink();
		isOpen = 'active';
	}
	getModul();
</script>

<div id="linkpreviewbox" class="invisible absolute shadow-2xl md:visible">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html linkPreviewBox}
</div>

<div>
	<span class="my-2 flex justify-between">
		{#if modul}
			<h1 class="heading">
				{modul.aktivitet.navn ? `${modul.aktivitet.navn } - ` : ''}{modul.aktivitet.hold
					? holdOversætter(modul.aktivitet.hold, $hold)
					: 'Ukendt hold'}
			</h1>
		{:else}
			<div class="animate-pulse bg-base-200 rounded-lg h-12 w-1/2" />
		{/if}
		{#if modul}
			<a
				class="btn"
				href={`https://www.lectio.dk/lectio/${cookie.school}/aktivitet/aktivitetforside2.aspx?absid=${absid}&lectab=elevindhold`}
			>
				Åben Elevfeedback
			</a>
		{/if}
	</span>
	{#if modul}
		<Table {items} />
	{:else}
		<div>
			<div class="w-full h-12 bg-base-200 rounded-t-lg shadow-xl animate-pulse" />
			<div class="w-full h-14 bg-base-100 rounded-b-lg shadow-xl animate-pulse" />
		</div>
	{/if}

	<div class="fromhzerotohauto {isOpen}">
		{#if modul}
			{#if lektieHtml}
				<h3 class="text-xl font-bold">Lektier</h3>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html lektieHtml}
				<div class="mb-4" />
			{/if}
			{#if note}
				<h3 class="text-xl font-bold">Noter</h3>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html note}
				<div class="mb-4" />
			{/if}
			{#if øvrigeIndholdHtml}
				<h3 class="text-xl font-bold">Øvrigt indhold</h3>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html øvrigeIndholdHtml}
				<div class="mb-4" />
			{/if}

			{#if !lektieHtml && !øvrigeIndholdHtml && !note}
				<p>Aktiviteten har ikke noget indhold.</p>
				<div class="mb-4" />
			{/if}
		{/if}
	</div>
</div>

<style>
.fromhzerotohauto {
	max-height: 10px;
	transition: max-height 0.5s ease-in-out;
	overflow: hidden;
}

.fromhzerotohauto.active {
	max-height: 1000px;
	height: auto;
	transition: max-height 0.5s ease-in-out;
}
</style>
