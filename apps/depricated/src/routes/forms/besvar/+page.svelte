<script>
	import Avatar from '$lib/components/Avatar.svelte';
	import BrugerPopup from '$lib/components/BrugerPopup.svelte';
	import { addNotification } from '$lib/js/notifyStore.js';
	import { get, post, reloadData } from '$lib/js/http.js';
	import { spørgeskemaer } from '$lib/js/store.js';
	import { page } from '$app/stores';

	let anonym = false;
	let spørgeskema = null;
	const spørgeskemaid = $page.url.searchParams.get('id');

	get(`/spoergeskema?id=${spørgeskemaid}`).then(data => {
		spørgeskema = data;
		({ anonym } = spørgeskema);
	});

	const svar = {};
	function inputChange(element) {
		if (element.target.type === 'radio') svar[element.target.getAttribute('key')] = element.target.id;
		else if (element.target.type === 'checkbox' && element.target.checked) svar[element.target.getAttribute('key')] = 'on';
		else if (element.target.type === 'checkbox') delete svar[element.target.getAttribute('key')];
		else if (element.target.type === 'text') svar[element.target.getAttribute('key')] = element.target.value;
	}
	async function submitForm() {
		const response = await post(`/besvar_spoergeskema?id=${spørgeskemaid}`, JSON.stringify({ besvarelser: svar }));
		if (response?.success) {
			reloadData(false);
			window.location.replace('/forms');
		} else {
			addNotification('Noget gik galt under indsendelsen af dine svar', 'alert-error')
		}
	}
</script>

<div class="flex flex-row items-center justify-between">
	{#if spørgeskema}
		<h1 class="heading">{spørgeskema.titel}</h1>
	{:else}
		<h1 class="heading">Spørgeskema</h1>
	{/if}
	<div class="btn-group">
		<a href="/forms" class="btn-sm btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left mr-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>Tilbage</a>
		<button class="btn btn-sm btn-info" on:click={submitForm}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-upload mr-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/><path fill-rule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/></svg>indsend</button>
	</div>
</div>

<div class="divider" />

<section class="mb-6 h-fit w-full rounded-lg bg-base-200 p-4">
	{#if spørgeskema}
		<BrugerPopup navn={spørgeskema.afstender.navn} id={spørgeskema.afstender.id}>
			<div class="flex">
				<Avatar id={spørgeskema.afstender.id} navn={spørgeskema.afstender.navn} size="w-14" />
				<div class="ml-4">
					<p class="text-xl font-bold">{spørgeskema.afstender.navn}</p>
				</div>
			</div>
		</BrugerPopup>
	{/if}
	<p>Anonymt: {anonym ? 'ja' : 'nej'}</p>
</section>

{#if spørgeskema}
	{#each spørgeskema.indhold as spørgesmål}
		<form class="mb-4 h-fit w-full rounded-lg bg-base-200 p-4">
			{#if spørgesmål.svar.type === null}
				<h2 class="mb-2 text-2xl font-bold">{spørgesmål.titel}</h2>
				<p class="mb-2 whitespace-pre-line">{spørgesmål.tekst}</p>
			{:else if spørgesmål.svar.type === 'radio' || spørgesmål.svar.type === 'checkbox'}
				<h2 class="mb-2 text-2xl font-bold">{spørgesmål.titel}</h2>
				<p class="mb-2 whitespace-pre-line">{spørgesmål.tekst}</p>
				<div class="mt-2">
					<div class="form-control">
						{#each spørgesmål.svar.muligheder as svarMulighed}
							<label class="label cursor-pointer">
								<span class="label-text">{svarMulighed.tekst}</span>
								{#if spørgesmål.svar.type === 'radio'}
									<input type="radio" key={spørgesmål.svar.id} id={svarMulighed.id} on:change={inputChange} name={spørgesmål} class="radio bg-neutral-content" />
								{:else if spørgesmål.svar.type === 'checkbox'}
									<input type="checkbox" key={svarMulighed.id} on:change={inputChange} class="checkbox" />
								{/if}
							</label>
						{/each}
					</div>
				</div>
			{:else if spørgesmål.svar.type === 'tekstfelt'}
				<h2 class="mb-2 text-2xl font-bold">{spørgesmål.titel}</h2>
				<p class="mb-2 whitespace-pre-line">{spørgesmål.tekst}</p>
				<input type="text" placeholder="Skriv her" key={spørgesmål.svar.id} on:input={inputChange} class="input-bordered input w-full" />
			{/if}
		</form>
	{/each}
{/if}
