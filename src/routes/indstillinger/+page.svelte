<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import {
		ArrowLeft as Back,
		ExclamationTriangle,
		Check,
		CaretSort,
		LightningBolt,
		Update
	} from 'radix-icons-svelte';
	import AccountSheet from '$lib/customComponents/AccountSheet.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { tick } from 'svelte';
	import { get } from '$lib/js/http';
	import { banners } from '$lib/js/store';
	import { isAuthed } from '$lib/js/store';
	import Header from '$lib/customComponents/Header.svelte';
	import { version } from '$app/environment';
	import { check } from '@tauri-apps/plugin-updater';
	import { relaunch } from '@tauri-apps/plugin-process';
	banners ?? [];

	let showAccountError = !checkIfCredentialsAreSet();

	function checkIfCredentialsAreSet() {
		const credentials = localStorage.getItem('credentials');
		if (credentials === null) return false;
		const { username, password, schoolId } = JSON.parse(credentials);
		if (username === undefined || password === undefined || schoolId === undefined) return false;
		if (username === '' || password === '' || schoolId === '') return false;

		if (
			$banners.find((banner: any) => banner.text === 'BetterLectio mangler dine login oplysninger')
		) {
			$banners = $banners.filter(
				(banner: any) => banner.text !== 'BetterLectio mangler dine login oplysninger'
			);
		}
		return true;
	}

	async function checkForUpdate() {
		console.log('checking for updates');
		const update = await check();
		console.log(update);
		if (update?.available) {
			return true;
		} else {
			return false;
		}
	}

	async function update() {
		console.log('checking for updates');
		const update = await check();
		console.log(update);
		if (update?.available) {
			await update.downloadAndInstall();
			await relaunch();
		} else {
			return false;
		}
	}
</script>

<Header>Instillinger</Header>
<div class="container mx-auto">
	<h3 class="text-lg font-semibold scroll-m-20">Version</h3>
	<p>BetterLectio <span class="text-green-400">v{version}</span></p>
	<Alert.Root class="mt-2">
		{#await checkForUpdate()}
			<Update class="w-4 h-4 animate-spin" />
			<div class="flex justify-between w-full pt-1">
				<div>
					<Alert.Title>Opdatering</Alert.Title>
					<Alert.Description>Tjekker for opdateringer...</Alert.Description>
				</div>
			</div>
		{:then value}
			{#if value}
				<Check class="w-4 h-4" />
				<div class="flex justify-between w-full pt-1">
					<div>
						<Alert.Title>Opdatering</Alert.Title>
						<Alert.Description>Opdatering tilgængelig</Alert.Description>
					</div>
					<Button on:click={update}>Opdater</Button>
				</div>
			{:else}
				<LightningBolt class="w-4 h-4" />
				<div class="flex justify-between w-full pt-1">
					<div>
						<Alert.Title>Opdatering</Alert.Title>
						<Alert.Description>Du har den nyeste version</Alert.Description>
					</div>
				</div>
			{/if}
		{:catch error}
			<ExclamationTriangle class="w-4 h-4" />
			<div class="flex justify-between w-full pt-1">
				<div>
					<Alert.Title>Opdatering</Alert.Title>
					<Alert.Description>Der skete en fejl ved at tjekke for opdateringer</Alert.Description>
				</div>
			</div>
		{/await}
	</Alert.Root>
</div>
<Separator class="my-4" />
<div class="container mx-auto">
	<h3 class="text-lg font-semibold scroll-m-20">Lectio Konto</h3>
	{#if showAccountError}
		<!-- content here -->
		<Alert.Root variant="destructive">
			<ExclamationTriangle class="w-4 h-4" />
			<Alert.Title>Konto Fejl</Alert.Title>
			<Alert.Description>
				Din lectio konto er ikke sat op. Du kan ikke bruge BetterLectio uden at have sat din lectio
				konto op.
			</Alert.Description>
		</Alert.Root>
	{/if}
	<p>BetterLectio bruger din lectio konto til at hente dine data fra lectio.</p>
	<AccountSheet />
</div>
