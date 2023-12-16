<script>
	import { api, get, getDocument } from '$lib/js/http.js';
	import Avatar from '$lib/components/Avatar.svelte';
	import BrugerPopup from '$lib/components/BrugerPopup.svelte';
	import MarkdownIt from 'markdown-it';
	import { addNotification } from '$lib/js/notifyStore.js';
	import purifier from 'dompurify';

	const { sanitize } = purifier();

	const md = new MarkdownIt();
	const beskedId = new URLSearchParams(window.location.search).get('id');

	let updating = false;
	let beskedChain = null;
	let linkPreviewBox = '';
	let beskedModtagere = '';

	get(`/besked?id=${ beskedId}`).then(data => {
		beskedChain = data.beskeder;
		beskedModtagere = data.modtagere;
	});

	let checked = '';
	let titel = '';
	let content = '';
	let id = '';
	function handleClick(_besked) {
		titel = _besked.titel.indexOf('Re:') > -1 ? `Re: ${ beskedChain[0].titel}` : `Re: ${ _besked.titel}`;
		({ id } = _besked);
		checked = checked === 'checked' ? '' : 'checked';
	}
	async function sendBesked() {
		const response = await fetch(`${api}/besvar_besked`, {
			method: 'POST',
			headers: { 'lectio-cookie': localStorage.getItem('lectio-cookie') },
			body: JSON.stringify({
				// eslint-disable-next-line camelcase
				message_id: beskedId,
				id,
				titel,
				content
			})
		});
		if (!response.ok) addNotification('Beskeden kunne ikke sendes, prøv igen senere.', 'alert-error');
		else addNotification('Beskeden blev sendt.', 'alert-success');

		get(`/besked?id=${ beskedId}`).then(data => {
			beskedChain = data.beskeder;
			beskedModtagere = data.modtagere;
		});
	}

	function attemptPreviewAttachment(url) {
		const { pathname, search } = new URL(url);
		get(pathname + search, { method: 'HEAD' }).then(res => console.log(url, res.headers.get('content-disposition')));
	}

	function updateBesked() {
		updating = true;
		addNotification('Opdaterer beskedtråden...', 'alert-info');
		get(`/besked?id=${ beskedId}`).then(data => {
			beskedChain = data.beskeder;
			beskedModtagere = data.modtagere;
			updating = false;
		});
	}

	function previewLink() {
		const links = document.querySelectorAll('.preview');

		links.forEach(link => {
			link.addEventListener('mouseover', evt => {
				const url = evt.target.href;
				console.log(`previewing link: ${ url}`);

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


	let MessageAttachments = [];
	async function fetchMessageAttachment(attachment) {
		console.log(attachment);

		// determine the most likely filetype based on file extension
		let fileType = 'application/octet-stream';
		if (attachment.navn.endsWith('.pdf')) fileType = 'application/pdf';
		else if (attachment.navn.endsWith('.png')) fileType = 'image/png';
		else if (attachment.navn.endsWith('.jpg')) fileType = 'image/jpg';
		else if (attachment.navn.endsWith('.jpeg')) fileType = 'image/jpeg';
		else if (attachment.navn.endsWith('.gif')) fileType = 'image/gif';

		console.log(fileType);
		// eslint-disable-next-line prefer-destructuring
		const attachmentId = attachment.href.split('documentid=')[1];
		// eslint-disable-next-line init-declarations
		let url;
		await getDocument(attachmentId, 'messagedoc', fileType).then(respUrl => {
			url = respUrl;

			// window.open(url, '_blank');
			// fecth the url and return the blob
			fetch(url).then(resp => resp.blob()).then(blob => {
				// create a new file from the blob
				const file = new File([blob], attachment.navn, { type: blob.type });

				// only continue if the file is an image
				if (!file.type.startsWith('image/')) return;

				// create a new image element
				const img = document.createElement('img');
				img.src = url;
				img.alt = attachment.navn;
				img.className = 'rounded-xl';

				// append the image to the div
				MessageAttachments = [...MessageAttachments, url];
				return url;
			});
		});
	}
</script>

<div id="linkpreviewbox" class="invisible absolute z-50 shadow-2xl md:visible">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html linkPreviewBox}
</div>

<input type="checkbox" id="besvar-modal" class="modal-toggle" bind:checked />
<label for="besvar-modal" class="modal modal-bottom cursor-pointer sm:modal-middle">
	<label class="modal-box relative" for="">
		<input type="text" placeholder={titel} bind:value={titel} class="input-ghost input mb-2 text-lg font-bold" />
		<textarea class="textarea-bordered textarea resize-none" placeholder="Besked" bind:value={content} style="width: 100%; height: 100%;" />
		<div class="modal-action">
			<label for="besvar-modal" on:click={sendBesked} class="btn">Send</label>
		</div>
	</label>
</label>

{#if beskedChain}
	<div class="flex-rox flex w-full justify-between">
		<h1 class="heading">{beskedChain[0].titel}</h1>
		<button class={`btn-circle btn ml-4 ${updating ? 'animate-spin' : ''}`} on:click={updateBesked}>
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
				<path
					d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
				/>
				<path
					fill-rule="evenodd"
					d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
				/>
			</svg>
		</button>
	</div>
	<p class="mb-4"><strong>Modtagere:</strong> {beskedModtagere}</p>
	<!-- Måske en linje til at seperere beskeder-->
	<div class="divide-y divide-base-content rounded-none md:divide-none md:rounded-lg md:bg-base-200 md:p-4">
		{#each beskedChain as _besked}
			<div class="relative mt-4 break-words p-2 md:rounded-lg md:bg-base-300 md:p-4" style="margin-left: {_besked.padding_left / 2}em;">
				<button class="btn-sm btn absolute bottom-0 right-0 mb-4 mr-4" on:click={() => handleClick(_besked)}>Besvar</button>
				<BrugerPopup navn={_besked.bruger.navn} id={_besked.bruger.id}>
					<div class="flex">
						<Avatar id={_besked.bruger.id} navn={_besked.bruger.navn} size="w-14" />
						<div class="ml-4">
							<p class="text-xl font-bold">{_besked.bruger.navn}</p>
							<p class="text-left">{_besked.dato}</p>
						</div>
					</div>
				</BrugerPopup>

				<div class="mt-4 mb-4 w-[calc(100vw-32px)] md:w-[calc(100vw-96px)] 2xl:w-[1280px]">
					{#each _besked.vedhæftninger as vedhæftning}
						<div class="hidden">
							{fetchMessageAttachment(vedhæftning)}
						</div>
					{/each}
					{#if MessageAttachments.length === 0}
						{#each _besked.vedhæftninger as vedhæftning}
							<a
								class="btn-primary btn-xs btn mr-1 mb-4"
								href={vedhæftning.href}
								on:mouseup={() => attemptPreviewAttachment(vedhæftning.href)}>{vedhæftning.navn}</a
							>
						{/each}
					{/if}

					<div class="overflow-x-auto">
						<div class="flex gap-3 w-fit rounded-xl">
							{#each MessageAttachments as attachment}
								<div class="rounded-xl h-36 relative group min-w-max">
									<img src={attachment} alt="" class="rounded-xl h-36" />
									<div class="absolute top-0">
										<a href={attachment} target="_blank" class="m-0 btn btn-sm bg-neutral/75 hover:bg-neutral-content/75 filter backdrop-blur-sm border-0 text-neutral-content rounded-tl-xl rounded-bl-none rounded-tr-none rounded-br-md no-animation overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-100"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16"><path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/></svg></a>
									</div>
								</div>
							{/each}
						</div>
					</div>
					{#if MessageAttachments.length > 0 || _besked.vedhæftninger.length > 0}
						<div class="divider"></div>
					{/if}
					<p class="mb-10" use:previewLink>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html sanitize(md.render(_besked.besked)).replace('<a', '<a  class="btn btn-xs btn-primary preview" target="_blank"')}
					</p>
				</div>
			</div>
		{/each}
	</div>
{/if}
