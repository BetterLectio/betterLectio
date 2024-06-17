<script lang="ts">
	import '../app.pcss';

	import { dev } from '$app/environment';
	import { AccountSheet, Changelog, SiteNavigation, SiteSearch, Spinner } from '$lib/components';
	import * as Alert from '$lib/components/ui/alert';
	import { Toaster } from '$lib/components/ui/sonner';
	import { authStore } from '$lib/stores';
	import { relaunch } from '@tauri-apps/plugin-process';
	import { check } from '@tauri-apps/plugin-updater';
	import { toast } from 'svelte-sonner';

	import { LECTIO_API } from '$lib/lectio';
	import ShieldAlert from 'lucide-svelte/icons/shield-alert';
	import { Settings } from 'luxon';
	import { onMount } from 'svelte';
	import { isDesktop } from '$lib/utils/environment';
	import { ModeWatcher } from 'mode-watcher';
	import { page } from '$app/stores';
	import { toTitleCase } from '$lib/utils/string';
	Settings.defaultLocale = 'da';

	$: hasCredentials =
		$authStore.username !== null && $authStore.password !== null && $authStore.school !== null;

	let PageRefresher = 0; // Used to refresh page when cookie is updated after is has been invalidated by lectio

	async function checkCookie() {
		if (!hasCredentials) throw new Error('Credentials are not set');

		let res = await fetch(`${LECTIO_API}/check-cookie`, {
			headers: {
				'lectio-cookie': $authStore.cookie || ''
			}
		});
		let data = await res.json();
		console.log('Cookie validity:', data);

		if (!data.valid) {
			$authStore.cookie = null;
			await login();
			console.log('Auth refreshed');
			PageRefresher++; // Soft refresh page to use new cookie in slot

			//check if cookie is valid
			if ($authStore.cookie === null) {
				throw new Error('Cookie is invalid');
			}
		}
		return true;
	}

	async function login() {
		const res = await fetch(`${LECTIO_API}/auth`, {
			headers: {
				brugernavn: $authStore.username || '',
				adgangskode: $authStore.password || '',
				skoleid: $authStore.school?.toString() || ''
			}
		});
		let cookie = res.headers.get('Set-Lectio-Cookie');
		$authStore.cookie = cookie;
	}

	onMount(async () => {
		if (!isDesktop || dev) return;

		const update = await check();
		if (update?.available) {
			toast('En opdatering er tilgængelig', {
				description: 'Klik her for at opdatere',
				duration: 10000,
				action: {
					label: 'Opdater nu',
					onClick: async () => {
						await update.downloadAndInstall();
						await relaunch();
					}
				}
			});
		}
	});

	$: title =
		$page.url.pathname === '/' || $page.url.pathname === '/home'
			? 'BetterLectio'
			: toTitleCase(decodeURIComponent($page.url.pathname.replace('/', ''))) + ' - BetterLectio';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<Toaster />
<Changelog />
<ModeWatcher />
<SiteSearch />
<SiteNavigation>
	{#if hasCredentials}
		{#await (checkCookie(), $page.url.pathname)}
			<div class="flex items-center justify-center h-full">
				<Spinner />
			</div>
		{:then}
			<div class="mt-10">
				{#key PageRefresher}
					<slot />
				{/key}
			</div>
		{:catch error}
			<div class="flex flex-col items-center justify-center h-full">
				{#if error.message === 'Cookie is invalid'}
					<p>Dine login oplysninger er ugyldige</p>
					<AccountSheet />
				{:else}
					<Alert.Root variant="destructive">
						<ShieldAlert class="w-4 h-4" />
						<Alert.Title>Fejl</Alert.Title>
						<Alert.Description>Der skete en fejl, prøv at genindlæse siden</Alert.Description>
					</Alert.Root>
				{/if}
			</div>
		{/await}
	{:else}
		<div class="flex flex-col items-center justify-center h-full">
			<p>Din konto er ikke sat op</p>
			<AccountSheet />
		</div>
	{/if}
</SiteNavigation>
