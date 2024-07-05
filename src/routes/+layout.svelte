<script lang="ts">
	import '../app.pcss';

	import { dev } from '$app/environment';
	import * as Alert from '$lib/components/ui/alert';
	import {
		AccountSheet,
		Changelog,
		Spinner,
		WelcomePage,
		OfflineMode
	} from '$lib/components';
	import { Toaster } from '$lib/components/ui/sonner';
	import { authStore, connectionStore } from '$lib/stores';
	import { relaunch } from '@tauri-apps/plugin-process';
	import { check } from '@tauri-apps/plugin-updater';
	import { toast } from 'svelte-sonner';

	import { LECTIO_API } from '$lib/lectio';
	import { Settings } from 'luxon';
	import { onMount } from 'svelte';
	import { isDesktop } from '$lib/utils/environment';
	import { ModeWatcher } from 'mode-watcher';
	import { page } from '$app/stores';
	import { toTitleCase } from '$lib/utils/string';
	import { SiteNavigation, SiteSearch } from '$lib/components/navigation';
	import { DrawerFix, ScreenSize } from '$lib/components/services';

	Settings.defaultLocale = 'da';

	$: hasCredentials =
		$authStore.username !== null && $authStore.password !== null && $authStore.school !== null;

	let pageRefresher = 0; // Used to refresh page when cookie is updated after is has been invalidated by lectio

	$: if ($connectionStore) {
		pageRefresher++;
	}

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
			pageRefresher++; // Soft refresh page to use new cookie in slot

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
		$authStore.cookie = res.headers.get('Set-Lectio-Cookie');
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

	async function routeChange(route: string) {
		checkCookie(); // not async on purpose
		console.log('Route changed to', route);
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<Toaster />
<Changelog />
<ModeWatcher />
<ScreenSize />
<DrawerFix />
<SiteSearch />
<SiteNavigation>
	<OfflineMode />
	{#if hasCredentials}
		{#await routeChange($page.url.pathname)}
			<div class="flex items-center justify-center h-full">
				<Spinner />
			</div>
		{:then _}
			<div class="{$connectionStore ? 'mt-10' : 'mt-28'} transition-all duration-200 ease-in-out">
				{#key pageRefresher}
					<slot />
				{/key}
			</div>
		{:catch error}
			<div class="flex flex-col items-center justify-center h-full">
				{#if error.message === 'Cookie is invalid'}
					<p>Dine login oplysninger er ugyldige</p>
					<AccountSheet />
				{:else}
					<h2>Fejl</h2>
					<p>Der skete en fejl, prøv at genindlæse siden</p>
				{/if}
			</div>
		{/await}
	{:else}
		<WelcomePage />
	{/if}
</SiteNavigation>
