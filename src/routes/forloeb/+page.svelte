<script>
	import PageLoading from '$lib/components/PageLoading.svelte';
	import { page } from '$app/stores';
	import { get } from '$lib/js/http.js';
	import purifier from 'dompurify';

	const { sanitize } = purifier();

	const id = $page.url.searchParams.get('id');
	let forløb;
	get(`/forloeb?id=${id}`).then(data => {
		forløb = data;
	});
</script>

{#if forløb}
	<div class="flex justify-between">
		<h1 class="heading">{forløb.titel}</h1>
		<a href="/studieplan" class="btn-sm btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left mr-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>Tilbage</a>
	</div>
	<p><b>Periode:</b> {forløb.periode}</p>
	<p><b>Lærer:</b> {forløb.lærer}</p>
	<p><b>Fag:</b> {forløb.fag}</p>
	<p><b>Estimat:</b> {forløb.estimat}</p>
	<br/>
	<b>Beskrivelse:</b>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<p>{@html sanitize(forløb.forløbsbeskrivelse.replaceAll('\n', '<br/>'))}</p>
{:else}
	<PageLoading></PageLoading>
{/if}
