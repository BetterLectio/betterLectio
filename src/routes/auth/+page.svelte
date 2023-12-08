<script>
	import { api, reloadData } from '$lib/js/http.js';
	import { AES } from 'crypto-es/lib/aes';
	import AutoComplete from 'simple-svelte-autocomplete';
	import { Html5Qrcode } from 'html5-qrcode';
	import { Utf8 } from 'crypto-es/lib/core';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';


	export let data;
	const { enhance, form, submitting, delayed, timeout } = superForm(data.form, {
		dataType: 'json',
		// eslint-disable-next-line no-shadow

		delayMs: 0,
		timeoutMs: 8000,

		onUpdated({ form }) {
			if (form.valid) {
				// if the redirect url is set in the url e.g. "login?redirect=http%3A%2F%2Flocalhost%3A5173%2Fapp%2Fsketch%2Fnew" go to that url otherwise go to the home page
				const urlParams = new URLSearchParams(window.location.search);
				const redirect = urlParams.get('redirect');

				window.location.href = redirect ? redirect : '/forside';
			}
		}
	});

	let options = { '': '' };
	let plainOptions = [];

	const isInAutoAuth = false;

	let redirectTo = new URLSearchParams(window.location.search).get('redirect');
	redirectTo = redirectTo === null ? '/forside' : decodeURIComponent(redirectTo);

	// code for saving school info to localstorage and autofilling it
	$: saveSchoolChecked = true;
	$: if ($form.school && saveSchoolChecked) localStorage.setItem('schoolId', JSON.stringify($form.school));
	$: if (!saveSchoolChecked) localStorage.removeItem('schoolId');
	if (localStorage.getItem('schoolId')) $form.school = JSON.parse(localStorage.getItem('schoolId'));

	fetch(`${api}/skoler`).then(res => res.json())
		.then(json => {
			options = json;

			// format the options to an array of objects
			plainOptions = Object.entries(options).map(([id, skole]) => ({ id, skole: skole.skole, skoleid: skole.id }));
			console.log(plainOptions);
		});

	async function localLogin(e) {
		if (api !== 'http://localhost:5000') return;
		e.preventDefault();

		const response = await fetch(`${api}/auth`, {
			headers: {
				brugernavn: $form.username,
				adgangskode: $form.password,
				skoleid: $form.school.skoleid
			}
		});
		if (response.ok) {
			// get the set-lectio-cookie header
			const lectioCookie = response.headers.get('set-lectio-cookie');

			// lectio-cookie in localstorage to prevent the server from reading the cookie.
			if (lectioCookie && lectioCookie !== null) localStorage.setItem('lectio-cookie', lectioCookie);

			const urlParams = new URLSearchParams(window.location.search);
			const redirect = urlParams.get('redirect');

			window.location.href = redirect ? redirect : '/forside';
		}
	}

	async function qrLogin(url) {
		const skoleId = await url.match(/\/\d+\//g).toString()
			.replaceAll('/', '');
		const userId = await url.match(/userId=\d+/g).toString()
			.replaceAll('userId=', '');
		const QrId = await url.split('QrId=')[1];

		const response = await fetch(`${api}/qr-auth`, {
			headers: {
				userId,
				QrId,
				skoleId
			}
		});
		if (response.ok) {
			const lectioCookie = response.headers.get('set-lectio-cookie');
			if (lectioCookie && lectioCookie !== null) localStorage.setItem('lectio-cookie', lectioCookie);

			await cookieInfo().then(cookie => fetch(`https://db.betterlectio.dk/bruger?bruger_id=${cookie.userId}&skole_id=${cookie.schoolId}`));
			reloadData();

			const originalLink = decodeURIComponent(redirectTo);
			location.href = originalLink;
		}
	}

	let qrAuth = false;
	function changeLoginType() {
		console.log('change');
		qrAuth = !qrAuth;
	}

	function qrCodeDropped(element) {
		const html5QrCode = new Html5Qrcode('reader');

		html5QrCode.scanFile(element.dataTransfer.files[0], false)
			.then(qrCodeMessage => {
				qrLogin(qrCodeMessage);
			})
			.catch(err => {
				console.log(`Error scanning file. Reason: ${err}`);
			});
	}
	function qrCodeUploaded(element) {
		const html5QrCode = new Html5Qrcode('reader');

		html5QrCode.scanFile(element.target.files[0], false)
			.then(qrCodeMessage => {
				qrLogin(qrCodeMessage);
			})
			.catch(err => {
				console.log(`Error scanning file. Reason: ${err}`);
			});
	}

	function itemFilter(item, keywords) {
		const keywordsArray = keywords.join('').split('');

		// return false if no letters match
		if (!keywordsArray.some(keyword => item.skole.toLowerCase().includes(keyword.toLowerCase()))) return false;

		// return true if schoolId is the keyword
		if (keywords.some(keyword => item.skoleid.toLowerCase().includes(keyword.toLowerCase()))) return true;

		return true;
	}

	function itemSortFunction(item1, item2, keywords) {
		// do the same as the filter function but return a number instead of a boolean representing the number of letters that match
		const keywordsArray = keywords.join('').split('');
		let item1MatchCount = 0;
		let item2MatchCount = 0;

		item1MatchCount = keywordsArray.filter(keyword => item1.skole.toLowerCase().includes(keyword.toLowerCase())).length;
		item2MatchCount = keywordsArray.filter(keyword => item2.skole.toLowerCase().includes(keyword.toLowerCase())).length;

		// mult bu the matches in a row
		item1MatchCount *= keywordsArray.filter((keyword, index) => item1.skole.toLowerCase().includes(keywordsArray.slice(index, index + 2).join('').toLowerCase())).length;
		item2MatchCount *= keywordsArray.filter((keyword, index) => item2.skole.toLowerCase().includes(keywordsArray.slice(index, index + 2).join('').toLowerCase())).length;

		// if the schoolId is the keyword, add 10000000 to the match count
		if (keywords[0] === item1.skoleid.toLowerCase()) item1MatchCount += 10000000;
		if (keywords[0] === item2.skoleid.toLowerCase()) item2MatchCount += 10000000;

		return item2MatchCount - item1MatchCount;
	}
</script>

<div class="flex items-center justify-center md:h-[75vh]">
	{#key isInAutoAuth}
		{#if !isInAutoAuth}
			<div class="h-fit rounded-2xl bg-base-200 p-4 shadow-lg">
				<h1 class="text-xl font-bold">Log ind med din Lectio konto</h1>
				<div class="divider mt-1 mb-2" />
				<div class="tabs tabs-boxed">
					<button on:click={changeLoginType} class="tab {qrAuth ? '' : 'tab-active'}">Brugernavn/Adgangskode</button>
					<button on:click={changeLoginType} class="tab {qrAuth ? 'tab-active' : ''}">QR kode</button>
				</div>
				<div class="divider mt-1 mb-2" />
				<form use:enhance autocomplete="on" method="post" on:submit={localLogin}>
					<div class="form-control w-full max-w-xl">
						{#if qrAuth}
							<div class="flex justify-center" on:drop|preventDefault={qrCodeDropped} on:dragover|preventDefault>
								<label class="flex justify-center element w-3/5 aspect-square hover:cursor-pointer">
									Træk eller upload din QR kode her for at logge ind
									<input type="file" class="hidden" on:change|preventDefault={qrCodeUploaded}>
								</label>
							</div>
							<span id="reader"></span>
							<p class="text-xs mt-4">
								Denne side bruger cookies til at huske dine oplysninger til næste gang, du logger ind. Når du logger ind, accepterer du, at din
								browser gemmer dine oplysninger. De gemmes kun på din browser og bliver ikke sendt til nogen server udover Lectio og
								vores proxy/translation layer.
								<br>
								<span class="font-bold">Når du indlæser din QR kode (logger ind), accepterer du automatisk vores</span>
								<a class="font-medium text-blue-600 hover:underline dark:text-blue-500" href="/tos">Servicevilkår & Privatlivspolitik</a>
							</p>
						{:else}
							<input
								type="text"
								name="username"
								id="username-field"
								placeholder="Lectio brugernavn"
								tabindex="0"
								autocomplete="username"
								class="input input-sm w-full max-w-wl mb-2.5 autofill:border-0 autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--b1))]"
								bind:value={$form.username}
							/>
							<input
								type="password"
								name="current-password"
								id="current-password-field"
								autocomplete="current-password"
								tabindex="0"
								placeholder="Lectio adgangskode"
								class="input input-sm w-full max-w-wl mb-2.5 autofill:border-0 autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--b1))]"
								bind:value={$form.password}
							/>
							<!-- <select
								name="skole"
								id="skole"
								placeholder="Vælg din skole"
								tabindex="0"
								class="select select-sm w-full max-w-wl py-0 mb-2.5"
								bind:value={$form.school}
							>
								<option value="" disabled selected> Vælg din skole </option>
								{#each Object.entries(options) as [, value]}
									<option value={value.id}>{value.skole}</option>
								{/each}
							</select> -->
							<AutoComplete
								items="{plainOptions}"
								labelFieldName="skole"
								valueFieldName="id"
								bind:selectedItem="{$form.school}"
								matchAllKeywords={false}
								sortByMatchedKeywords={false}
								keywordsFunction={item => `${item.skole } ${ item.skoleid}`}
								itemFilterFunction={itemFilter}
								itemSortFunction={itemSortFunction}
								noResultsText="Ingen skoler fundet"
								placeholder="Vælg din skole (skriv for at søge)"
								required={true}
								hideArrow={true}
								className="select select-sm w-full max-w-wl py-0 mb-2.5 px-0"
								dropdownClassName="rounded-box"
								maxItemsToShowInList={40}

							>
							</AutoComplete>
							<div class="join p-1.5 bg-base-100">
								<div class="flex join-item">
									<input
										type="checkbox"
										bind:checked={saveSchoolChecked}
										id="saveSchoolIdCheck"
										tabindex="0"
										class="checkbox checkbox-sm"
										name="setSkole"
									/>
									<label class="block text-sm pr-0 font-medium px-3 select-none" for="saveSchoolIdCheck">Husk skole</label>
								</div>
								{#if api === 'http://localhost:5000'}
									<div class="divider divider-horizontal"></div>
									<div class="flex join-item">
										<input
											type="checkbox"
											checked="checked"
											id="saveLogin"
											tabindex="0"
											class="checkbox checkbox-sm"
											name="saveLogin"
										/>
										<label class="block text-sm pr-0 font-medium px-3 select-none" for="saveLogin">Forbliv logget ind</label>
									</div>
								{/if}
							</div>
							<p class="text-xs mt-4">
								Denne side bruger cookies til at huske dine oplysninger til næste gang, du logger ind. Når du logger ind, accepterer du, at din
								browser gemmer dine oplysninger. De gemmes kun på din browser og bliver kun sendt til Lectio og vores server når det er nødvendigt.
								<br>
								<span class="font-bold">Når du logger ind, accepterer du automatisk vores</span>
								<a class="font-medium text-blue-600 hover:underline dark:text-blue-500" href="/tos">Servicevilkår & Privatlivspolitik</a>
							</p>
							<div class="divider" />
							<div class="flex justify-end">
								<button tabindex="0" type="submit" class="btn-primary btn group">
									<p>Log ind</p>
									<label class="swap {$delayed ? 'swap-active' : ''} " for="login">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="octicon arrow-symbol-mktg swap-off"
											width="24"
											height="24"
											viewBox="0 0 16 16"
											fill="none"
										><path
											class="group-hover:translate-x-1 translate-x-0 transition-all ease-in-out duration-200"
											fill="currentColor"
											d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z"
										/><path
											class="scale-x-0 group-hover:scale-x-100 group-hover:translate-x-1 group-hover:opacity-100 opacity-0 translate-x-0 transition-all duration-200 ease-in-out origin-bottom"
											stroke="currentColor"
											d="M1.75 8H11"
											stroke-width="1.5"
											stroke-linecap="round"
										/></svg
										>
										<div class="swap-on loading loading-sm" />
									</label>
								</button>
							</div>
						{/if}
					</div>
				</form>
			</div>
		{:else}
			<!-- is in auto auth -->
			<div class="z-50 flex w-full flex-col items-center justify-center">
				<svg
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					height="73"
					class="mx-0 animate-wiggle fill-current p-0"
				>
					<path
						d="M428.033,162.858C422.975,72.232,347.87,0,256,0S89.025,72.232,83.967,162.858c-0.323,3.179-0.489,6.402-0.489,9.663c0,15.543,0,320.162,0,322.783c0,9.22,7.475,16.696,16.696,16.696h111.304c119.87,0,217.043-97.174,217.043-217.043V172.522C428.522,169.261,428.356,166.037,428.033,162.858z M256,33.391c42.163,0,79.93,18.923,105.464,48.641c-8.722-2.662-17.967-4.119-27.551-4.119c-32.296,0-60.834,16.291-77.913,41.06c-17.079-24.77-45.617-41.06-77.913-41.06c-9.584,0-18.829,1.457-27.551,4.119C176.07,52.314,213.837,33.391,256,33.391z M163.169,360.642c-5.842-7.12-16.37-8.174-23.494-2.326c-6.988,5.731-14.635,10.267-22.804,13.595v-97.801c26.505,36.201,66.686,61.636,112.937,68.728c-18.13,49.489-60.64,87.32-112.937,98.783v-34.418h-0.001c16.082-4.569,30.884-12.325,43.979-23.061C167.978,378.293,169.017,367.772,163.169,360.642z M395.13,294.957c0,101.261-82.386,183.652-183.652,183.652H116.87v-2.97c70.214-12.524,126.789-63.872,147.277-131.009c53.767-2.53,101.081-29.682,130.984-70.521V294.957z M256,311.652c-76.718,0-139.13-62.413-139.13-139.13c0-33.75,27.462-61.217,61.217-61.217s61.217,27.468,61.217,61.217c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-33.75,27.462-61.217,61.217-61.217c33.755,0,61.217,27.468,61.217,61.217C395.13,249.239,332.718,311.652,256,311.652z"
					/>
					<path
						d="M301.195,216.369c-3.26-3.26-7.532-4.891-11.804-4.891c-4.272,0-8.544,1.631-11.804,4.892L256,237.956l-21.587-21.588c-6.521-6.521-17.087-6.521-23.609,0c-6.521,6.521-6.521,17.087,0,23.609l33.391,33.391c6.521,6.521,17.087,6.521,23.609,0l33.391-33.391C307.716,233.456,307.716,222.89,301.195,216.369z"
					/>
					<path
						d="M178.087,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261s22.261-9.99,22.261-22.261 S190.364,150.261,178.087,150.261z"
					/>
					<path
						d="M333.913,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261c12.277,0,22.261-9.99,22.261-22.261 S346.19,150.261,333.913,150.261z"
					/>
				</svg>
				<p class="btn-ghost btn animate-pulse" in:fade={{ delay: 50, duration: 50 }}>
					Logger ind automatisk
					<span class="loading" />
				</p>
			</div>
		{/if}
	{/key}
</div>

<style>
</style>
