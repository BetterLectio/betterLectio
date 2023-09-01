<script>
	import { addNotification, addNotificationIn } from '$lib/js/notifyStore.js';
	import Avatar from '$lib//components/Avatar.svelte';
	import BrugerPopup from '$lib/components/BrugerPopup.svelte';
	import MarkdownIt from 'markdown-it';
	import Table from '$lib/components/Table.svelte';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { get } from '$lib/js/http.js';
	import { page } from '$app/stores';
	import purifier from 'dompurify';

	const { sanitize } = purifier();

	let cookie = null;
	cookieInfo().then(data => {
		cookie = data;
	});

	const md = new MarkdownIt();

	const exerciseid = $page.url.searchParams.get('exerciseid');

	let oplysningsItems = {};
	let personAfleveringItems = {};
	let feedbackItems = {};
	let aflevedeOpgaveItems = {};
	let _oplysninger = {};

	let elevId = '';

	get(`/opgave?exerciseid=${ exerciseid}`)
		.then(data => {
			const { oplysninger, opgave_indlæg, afleveres_af } = data;

			const { opgavebeskrivelse, opgavenote, opgavetitel, afleveringsfrist, elevtid, hold, karakterskala } = oplysninger;

			// eslint-disable-next-line camelcase
			const { elev, afventer, status_fravær, afsluttet, karakter, karakternote, elevnote } = afleveres_af;
			elevId = elev.bruger_id.slice(1);

			_oplysninger = {
				opgavetitel,
				opgavebeskrivelse,
				opgavenote
			};

			oplysningsItems = {
				Afleveringsfrist: afleveringsfrist,
				Fordybelsestimer: elevtid,
				Hold: hold,
				Karakterskala: karakterskala
			};
			personAfleveringItems = {
				Elev: elev.navn,
				Afventer: afventer,
				// eslint-disable-next-line camelcase
				Fraværsstatus: status_fravær,
				Afsluttet: afsluttet ? 'Ja' : 'Nej'
			};

			feedbackItems = {
				Karakter: karakter,
				Karakternote: karakternote,
				Elevnote: elevnote
			};

			aflevedeOpgaveItems = {
				brugerId: elevId,
				// eslint-disable-next-line camelcase
				indlæg: opgave_indlæg,
				// eslint-disable-next-line camelcase
				harAfleveret: opgave_indlæg.length > 0
			};
		})
		.catch(() => {
			addNotification('noget gik galt, vi beklager, her er noget det måske kan hjælpe', 'alert-error');
			addNotificationIn('se konsol for mere info', 'alert-error', 6000);

			// to hide ui
			_oplysninger = {};
		});
</script>

<div>
	{#if Object.keys(_oplysninger).length}
		<h1 class="heading">{_oplysninger.opgavetitel}</h1>
		<p class="mb-4">{_oplysninger.opgavenote}</p>

		{#if _oplysninger.opgavebeskrivelse}
			<div class="mb-4">
				<h1 class="font-bold">Opgavebeskrivelse</h1>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html sanitize(md.render(_oplysninger.opgavebeskrivelse))
					.replace(/<a/gu, '<a   class="btn btn-xs btn-primary" target="_blank"')
					.replace('</a>', '</a><br>')}
			</div>
		{/if}

		<div class="divider" />

		<h1 class="text-2xl font-bold">Oplysninger</h1>
		<Table items={oplysningsItems} />

		<div class="divider" />

		<h1 class="text-2xl font-bold">Afleveres af</h1>
		<Table items={personAfleveringItems} />

		{#if feedbackItems.karakter}
			<div class="divider" />
			<h1 class="text-2xl font-bold">Feedback</h1>
			<Table items={feedbackItems} />
		{/if}

		<div class="divider" />

		<h1 class="text-2xl font-bold">Opgaveindlæg</h1>
		{#if aflevedeOpgaveItems.harAfleveret}
			<table class="mb-4 mt-2 table w-full rounded-xl shadow-xl">
				<thead>
					<tr>
						<th />
						<th>Bruger</th>
						<th>Indlæg</th>
						<th>Dokument</th>
						<th>Tidspunkt</th>
					</tr>
				</thead>
				<tbody>
					{#each aflevedeOpgaveItems.indlæg as indlæg}
						<tr>
							<td>
								<Avatar id={indlæg.bruger.bruger_id} navn={indlæg.bruger.navn} squared />
							</td>
							<td><BrugerPopup navn={indlæg.bruger.navn} id={indlæg.bruger.bruger_id}>{indlæg.bruger.navn}</BrugerPopup></td>
							<td>{indlæg['indlæg']}</td>
							<td>
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html sanitize(md.render(indlæg.dokument)).replace('<a', '<a   class="btn btn-xs btn-primary" target="_blank"')}
							</td>
							<td>{indlæg.tidspunkt}</td>
						</tr>
					{/each}
				</tbody>
			</table>
			{#if personAfleveringItems?.afsluttet === 'Nej'}
				<a
					href="https://www.lectio.dk/lectio/{cookie.schoolId}/ElevAflevering.aspx?elevid={elevId}&exerciseid={exerciseid}"
					target="_blank"
					class="btn-primary btn my-2">Aflever igen</a
				>
			{/if}
		{:else if cookie?.schoolId}
			<a
				href="https://www.lectio.dk/lectio/{cookie.schoolId}/ElevAflevering.aspx?elevid={elevId}&exerciseid={exerciseid}"
				target="_blank"
				class="btn-primary btn my-2">Aflever her</a
			>
		{/if}
	{/if}
</div>
