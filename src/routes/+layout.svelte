<script lang="ts">
	import '../app.pcss';

	import { dev } from '$app/environment';
	import { AccountSheet, SiteNavigation, SiteSearch, Spinner } from '$lib/components';
	import * as Alert from '$lib/components/ui/alert';
	import { Toaster } from '$lib/components/ui/sonner';
	import { authStore } from '$lib/stores';
	import { relaunch } from '@tauri-apps/plugin-process';
	import { check } from '@tauri-apps/plugin-updater';
	import { toast } from 'svelte-sonner';

	import { Settings } from 'luxon';
	import { onMount } from 'svelte';
	import { LECTIO_API } from '$lib/lectio';
	import { ShieldAlert } from 'lucide-svelte';
	Settings.defaultLocale = 'da';

	const noCredentials = () => {
		if ($authStore.username === null || $authStore.password === null || $authStore.school === null)
			return true;
		return false;
	};

	async function checkCookie() {
		if (noCredentials()) throw new Error('Credentials are not set');

		let res = await fetch(`${LECTIO_API}/check-cookie`, {
			headers: {
				'lectio-cookie': $authStore.cookie || ''
			}
		});
		let data = await res.json();

		if (!data.valid) {
			$authStore.cookie = null;
			await login();

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
		if (dev) return;
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
</script>

<Toaster />
<SiteSearch />
<SiteNavigation>
	{#await checkCookie()}
		<div class="flex items-center justify-center h-full">
			<Spinner />
		</div>
	{:then}
		<div class="mt-10">
			<slot />
		</div>
	{:catch error}
		<div class="absolute transform translate-x-1/2 -translate-y-1/2 right-1/2 top-1/2">
			{#if error.message === 'Credentials are not set' || error.message === 'Cookie is invalid'}
				{#if error.message === 'Credentials are not set'}
					<p>Din konto er ikke sat op</p>
					<AccountSheet />
				{:else}
					<p>Dine login oplysninger er ugyldige</p>
					<AccountSheet />
				{/if}
			{:else}
				<Alert.Root variant="destructive">
					<ShieldAlert class="w-4 h-4" />
					<Alert.Title>Fejl</Alert.Title>
					<Alert.Description>Der skete en fejl, prøv at genindlæse siden</Alert.Description>
				</Alert.Root>
			{/if}
		</div>
	{/await}
</SiteNavigation>
