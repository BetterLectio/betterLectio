<script>
	import { api, reloadData } from '$lib/js/http.js';
	import { AES } from 'crypto-es/lib/aes';
	import { Utf8 } from 'crypto-es/lib/core';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	const key
		= 'Ting som encrypter login data meget simplet så det ikke er vildt nemt at få fat i fra et andet program. BTW du kan kun gemme login hvis du kører appen, det virker altså ikke på hjemmesiden.';

	let brugernavn = '';
	let adgangskode = '';
	let schoolId = '';
	let options = { '': '' };
	let isInAutoAuth = false;

	onMount(async() => {
		try {
			if (new URLSearchParams(window.location.search).get('redirect') || localStorage.getItem('lectio-cookie')) {
				isInAutoAuth = true;
				const data = await window.navigator.credentials.get({
					password: true,
					mediation: 'optional'
				});
				if (data.type === 'password') {
					const response = await fetch(`${api}/auth`, {
						headers: {
							brugernavn: data.id,
							adgangskode: data.password,
							skoleid: schoolId
						}
					});
					if (response.ok) {
						localStorage.setItem('lectio-cookie', response.headers.get('set-lectio-cookie'));
						window.location.href = decodeURIComponent(new URLSearchParams(window.location.search).get('redirect') || '/forside');
					}
					isInAutoAuth = false;
				}
			}
		} catch (error) {
			isInAutoAuth = false;
		}
	});

	let redirectTo = new URLSearchParams(window.location.search).get('redirect');
	redirectTo = redirectTo === null ? '/forside' : decodeURIComponent(redirectTo);

	function tryLoginInWithCookie() {
		if (localStorage.getItem('lectio-cookie') || localStorage.getItem('lectio-cookie') !== null) {
			fetch(`${api}/check-cookie`, { headers: { 'lectio-cookie': localStorage.getItem('lectio-cookie') } })
				.then(result => result.json())
				.then(data => {
					if (data?.valid) {
						console.log('Logged in with cookie');
						window.location.href = decodeURIComponent(redirectTo);
					} else {
						console.log('Cookie not valid.', 'valitation:', data);
					}
				});
		}
	}
	tryLoginInWithCookie();

	function setSkole() {
		if (isInAutoAuth) return;
		if (document.readyState === 'complete') {
			const checkbox = document.getElementById('saveSchoolIdCheck');

			if (checkbox.checked === true) localStorage.setItem('schoolId', schoolId);
			else localStorage.removeItem('schoolId');
		}
	}

	let saveLogin = true;

	fetch(`${api}/skoler`).then(data => data.json())
		.then(json => {
			options = json;
		});

	function getCachedSchool() {
		// load the schoolId from localstorage and set it to the select
		if (localStorage.getItem('schoolId')) schoolId = localStorage.getItem('schoolId');
	}

	function validateLoginFields() {
		const usernameValid = typeof brugernavn === 'string' && brugernavn.length > 0;
		const passwordValid = typeof adgangskode === 'string' && adgangskode.length > 0;
		const schoolValid = typeof schoolId === 'string' && schoolId.length > 0;

		return usernameValid && passwordValid && schoolValid;
	}

	async function login() {
		const { location } = window;

		setSkole();
		if (!validateLoginFields()) {
			document.querySelector('#MissingInfoAlert').checked = true;
			document.querySelector('#MissingInfoAlertX').addEventListener('click', () => {
				document.querySelector('#MissingInfoAlert').checked = false;
			});
		} else {
			console.log('Logging into Lectio');

			const progress = document.querySelector('.SWAPICONSTATE');
			progress.classList.add('swap-active');
			const response = await fetch(`${api}/auth`, {
				headers: {
					brugernavn,
					adgangskode,
					skoleid: schoolId
				}
			});
			if (response.ok) {
				setSkole();

				if (saveLogin && window.electron) {
					localStorage.setItem('brugernavn', AES.encrypt(brugernavn, key));
					localStorage.setItem('adgangskode', AES.encrypt(adgangskode, key));
					localStorage.setItem('schoolId', schoolId);
				} else {
					localStorage.removeItem('brugernavn');
					localStorage.removeItem('adgangskode');

				// localStorage.removeItem('schoolId');
				}

				const lectioCookie = response.headers.get('set-lectio-cookie');
				if (lectioCookie && lectioCookie !== null) localStorage.setItem('lectio-cookie', lectioCookie);

				await cookieInfo().then(cookie => fetch(`https://db.betterlectio.dk/bruger?bruger_id=${cookie.userId}&schoolId=${cookie.schoolId}`));
				progress.classList.remove('swap-active');
				reloadData();

				const originalLink = decodeURIComponent(redirectTo);
				location.href = originalLink;
			} else {
				progress.classList.remove('swap-active');

				document.querySelector('#CantLogInAlert').checked = true;
				document.querySelector('#CantLogInAlertX').addEventListener('click', () => {
					document.querySelector('#CantLogInAlert').checked = false;
				});
			}
		}
	}

	function handleEnterLogin(evt) {
		if (evt?.key === 'Enter') login();
	}

	if (localStorage.getItem('brugernavn') && localStorage.getItem('adgangskode') && localStorage.getItem('schoolId')) {
		brugernavn = AES.decrypt(localStorage.getItem('brugernavn'), key).toString(Utf8);
		adgangskode = AES.decrypt(localStorage.getItem('adgangskode'), key).toString(Utf8);
		schoolId = localStorage.getItem('schoolId');

		login();
	}
</script>

<input type="checkbox" id="CantLogInAlert" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<label for="CantLogInAlert" id="CantLogInAlertX" class="btn-sm btn-circle btn absolute right-2 top-2">✕</label>
		<h3 class="text-lg font-bold">Kunne ikke logge ind</h3>
		<p class="py-4">Der skete en fejl, er du sikker på at du har indtastet dine oplysninger korrekt?</p>
	</div>
</div>
<input type="checkbox" id="MissingInfoAlert" class="modal-toggle" />
<div class="modal">
	<div class="modal-box relative">
		<label for="MissingInfoAlert" id="MissingInfoAlertX" class="btn-sm btn-circle btn absolute right-2 top-2">✕</label>
		<h3 class="text-lg font-bold">Mangler info</h3>
		<p class="py-4">Du skal udfylde alle felterne for at logge ind.</p>
	</div>
</div>
<div use:getCachedSchool class="flex items-center justify-center md:h-[75vh]">
	{#key isInAutoAuth}
		{#if !isInAutoAuth}
			<div class="h-fit rounded-2xl bg-base-200 p-4 shadow-lg">
				<h1 class="text-xl font-bold">Log ind med din Lectio konto</h1>
				<div class="divider mt-1 mb-2" />
				<form action="javascript:void(0);" autocomplete="on" method="post">
					<div class="form-control w-full max-w-xl">
						<input
							type="text"
							name="username"
							id="username-field"
							placeholder="Brugernavn"
							tabindex="0"
							autocomplete="username"
							class="input input-sm w-full max-w-wl mb-2.5 autofill:border-0 autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--b1))]"
							bind:value={brugernavn}
						/>
						<input
							type="password"
							name="current-password"
							id="current-password-field"
							autocomplete="current-password"
							tabindex="0"
							placeholder="Adgangskode"
							class="input input-sm w-full max-w-wl mb-2.5 autofill:border-0 autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--b1))]"
							bind:value={adgangskode}
							on:keypress={handleEnterLogin}
						/>
						<select
							name="skole"
							id="skole"
							placeholder="Vælg din skole"
							tabindex="0"
							class="select select-sm w-full max-w-wl py-0 mb-2.5"
							bind:value={schoolId}
						>
							<option value="" disabled selected> Vælg din skole </option>
							{#each Object.entries(options) as [, value]}
								<option value={value.id}>{value.skole}</option>
							{/each}
						</select>
						<div class="join p-1.5 bg-base-100">
							<div class="flex join-item">
								<input
									type="checkbox"
									checked="checked"
									id="saveSchoolIdCheck"
									tabindex="0"
									class="checkbox checkbox-sm"
									on:click={setSkole()}
									name="setSkole"
								/>
								<label class="block text-sm pr-0 font-medium px-3 select-none" for="saveSchoolIdCheck">Husk skole</label>
							</div>
							{#if window.electron}
								<div class="divider divider-horizontal"></div>
								<div class="flex join-item">
									<input
										type="checkbox"
										checked="checked"
										id="saveLogin"
										tabindex="0"
										class="checkbox checkbox-sm"
										on:click={() => {
											saveLogin = !saveLogin;
										}}
										name="saveLogin"
									/>
									<label class="block text-sm pr-0 font-medium px-3 select-none" for="saveLogin">Forbliv logget ind</label>
								</div>
							{/if}
						</div>
						<p class="text-xs mt-4">
							Denne side bruger cookies til at huske dine oplysninger til næste gang du logger ind. Når du logger ind accepterer du at din
							browser gemmer dine oplysninger. De gemmes kun på din browser og bliver ikke sendt til nogen server udover Lectio og
							vores proxy/translation layer.
							<br>
							<span class="font-bold">Når du logger ind accepterer du automatisk vores</span>
							<a class="font-medium text-blue-600 hover:underline dark:text-blue-500" href="/tos">Servicevilkår & Privatlivspolitik</a>
						</p>
						<div class="divider" />
						<div class="flex justify-end">
							<button tabindex="0" type="submit" class="btn-primary btn group" on:click={login} on:keyup={handleEnterLogin}>
								<p>Log ind</p>
								<label class="swap SWAPICONSTATE" for="login">
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
