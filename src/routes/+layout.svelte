<script lang="ts">
	import '../app.pcss';

	import { Toaster } from '$lib/components/ui/sonner';
	import Navbar from '$lib/customComponents/navbar.svelte';
	import Command from '$lib/customComponents/command.svelte';
	import Banner from '$lib/customComponents/Banner.svelte'; //fejlen giver ikke mening lol (den er ikke fatal)
	import Spinner from '$lib/customComponents/spinner.svelte';
	import { banners, isAuthed } from '$lib/js/store';
	import { navigating } from '$app/stores';
	import AccountSheet from '$lib/customComponents/AccountSheet.svelte';
	import { ExclamationTriangle } from 'radix-icons-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { check } from '@tauri-apps/plugin-updater';
	import { relaunch } from '@tauri-apps/plugin-process';
	import { toast } from 'svelte-sonner';
	import { dev } from '$app/environment';
	
	import { Settings } from 'luxon';
	Settings.defaultLocale = 'da';
	
	$banners = [];
	checkForUpdate();

	//check if credentials are set, if not add a banner
	function checkIfCredentialsAreSet() {
		const credentials = localStorage.getItem('credentials');
		console.log(credentials);
		if (credentials === null) {
			$banners = [
				...$banners,
				{
					text: 'BetterLectio mangler dine login oplysninger',
					type: 'fatalFixable',
					to: '/indstillinger'
				}
			];
			return true;
		} else {
			//filter out the banner
			$banners = $banners.filter(
				(banner: any) => banner.text !== 'BetterLectio mangler dine login oplysninger'
			);
		}
		return false;
	}

	async function checkCookie() {
		if (checkIfCredentialsAreSet()) throw new Error('Credentials are not set');

		let cookie = localStorage.getItem('lectio-cookie');
		let res = await fetch('https://api.betterlectio.dk/check-cookie', {
			headers: {
				'lectio-cookie': cookie || ''
			}
		});
		let data = await res.json();
		console.log(data);
		// data = {valid: true}
		console.log(data.valid);
		if (!data.valid) {
			//cookie is invalid
			//remove cookie
			localStorage.removeItem('lectio-cookie');
			//login
			await login(false);
			let cookie = localStorage.getItem('lectio-cookie');
			//check if cookie is valid
			if (cookie === undefined || cookie === null) {
				//cookie is invalid
				//remove cookie
				localStorage.removeItem('lectio-cookie');
				//throw error
				throw new Error('Cookie is invalid');
			}
		}
		return true;
	}

	async function login(reload = true) {
		let credentials = JSON.parse(localStorage.getItem('credentials') as string);
		await fetch(`https://api.betterlectio.dk/auth`, {
			headers: {
				brugernavn: credentials.username,
				adgangskode: credentials.password,
				skoleid: credentials.schoolId.toString()
			}
		})
			.then((res) => {
				let cookie = res.headers.get('Set-Lectio-Cookie');
				if (cookie === null) return null;
				localStorage.setItem('lectio-cookie', cookie);
				$isAuthed = true;
				if (reload) document.location.reload();
				return cookie;
			})
			.catch((err) => {
				console.log(err);
			});
	}

	async function checkForUpdate() {
		if (dev) return;
		console.log('checking for updates');
		const update = await check();
		console.log(update);
		if (update?.available) {
			// the update is available
			/* console.log(`Update to ${update.version} available! Date: ${update.date}`);
			console.log(`Release notes: ${update.body}`);
			await update.downloadAndInstall();
			// requires the `process` plugin
			await relaunch(); */
			toast('En opdatering er tilgængelig', {
				description: 'Klik her for at opdatere',
				action: {
					label: 'Opdater nu',
					onClick: async () => {
						await update.downloadAndInstall();
						await relaunch();
					}
				}
			});
		}
	}
</script>

<Command></Command>
<Navbar></Navbar>
{#each $banners as banner}
	<Banner to={banner.to} type={banner.type} text={banner.text}></Banner>
{/each}
<Toaster></Toaster>

{#if $navigating}
	<div class="absolute transform translate-x-1/2 -translate-y-1/2 right-1/2 top-1/2">
		<Spinner></Spinner>
	</div>
{:else}
	{#await checkCookie()}
		<div class="absolute transform translate-x-1/2 -translate-y-1/2 right-1/2 top-1/2">
			<Spinner></Spinner>
		</div>
	{:then value}
		{#if value}
			<div class="overflow-x-clip">
				<slot />
			</div>
		{:else}
			<div class="absolute transform translate-x-1/2 -translate-y-1/2 right-1/2 top-1/2" use:login>
				<Spinner></Spinner>
			</div>
		{/if}
	{:catch error}
		<div class="absolute transform translate-x-1/2 -translate-y-1/2 right-1/2 top-1/2">
			{#if error.message === 'Credentials are not set' || error.message === 'Cookie is invalid'}
				{#if error.message === 'Credentials are not set'}
					<p>Din konto er ikke sat op</p>
					<AccountSheet></AccountSheet>
				{:else}
					<p>Dine login oplysninger er ugyldige</p>
					<AccountSheet></AccountSheet>
				{/if}
			{:else}
				<Alert.Root variant="destructive">
					<ExclamationTriangle class="w-4 h-4"></ExclamationTriangle>
					<Alert.Title>Fejl</Alert.Title>
					<Alert.Description>Der skete en fejl, prøv at genindlæse siden</Alert.Description>
				</Alert.Root>
			{/if}
		</div>
	{/await}
{/if}
