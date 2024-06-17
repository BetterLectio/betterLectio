<script lang="ts">
	import { version } from '$app/environment';
	import AccountSheet from '$lib/components/AccountSheet.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Switch } from '$lib/components/ui/switch';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { authStore } from '$lib/stores';
	import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart';
	import { relaunch } from '@tauri-apps/plugin-process';
	import { check } from '@tauri-apps/plugin-updater';
	import Check from 'lucide-svelte/icons/check';
	import RefreshCw from 'lucide-svelte/icons/refresh-cw';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import Zap from 'lucide-svelte/icons/zap';
	import { isWeb } from '$lib/utils';
	import { isDesktop } from '$lib/utils/environment';

	let showAccountError =
		$authStore.username === null || $authStore.password === null || $authStore.school === null;

	async function checkForUpdate() {
		const update = await check();
		if (update?.available) {
			return true;
		} else {
			return false;
		}
	}

	async function update() {
		const update = await check();
		if (update?.available) {
			await update.downloadAndInstall();
			await relaunch();
		} else {
			return false;
		}
	}

	let autoStartBtn = false;
	let autoStartReady = false;

	async function checkAutostart() {
		autoStartBtn = await isEnabled();
		autoStartReady = true;
	}

	checkAutostart();

	async function toggleAutostart() {
		if (!autoStartReady) return;
		let enabled = await isEnabled();
		if (enabled) {
			await disable();
		} else {
			await enable();
		}
	}
</script>

<div class="page-container">
	<h1>Instillinger</h1>
	<div class="space-y-4">
		{#if !isWeb}
			<div>
				<h3 class="text-lg font-semibold scroll-m-20">Version</h3>
				<p>BetterLectio <span class="text-green-400">v{version}</span></p>
				{#if isDesktop}
					<Alert.Root class="mt-2">
						{#await checkForUpdate()}
							<RefreshCw class="animate-spin" />
							<div class="flex justify-between w-full pt-1">
								<div>
									<Alert.Title>Opdatering</Alert.Title>
									<Alert.Description>Søger efter opdateringer...</Alert.Description>
								</div>
							</div>
						{:then value}
							{#if value}
								<Check />
								<div class="flex justify-between w-full pt-1">
									<div>
										<Alert.Title>Opdatering</Alert.Title>
										<Alert.Description>Opdatering tilgængelig</Alert.Description>
									</div>
									<Button on:click={update}>Opdater</Button>
								</div>
							{:else}
								<Zap />
								<div class="flex justify-between w-full pt-1">
									<div>
										<Alert.Title>Opdatering</Alert.Title>
										<Alert.Description>Du har den nyeste version</Alert.Description>
									</div>
								</div>
							{/if}
						{:catch error}
							<TriangleAlert />
							<div class="flex justify-between w-full pt-1">
								<div>
									<Alert.Title>Opdatering</Alert.Title>
									<Alert.Description
									>Der skete en fejl ved at tjekke for opdateringer
									</Alert.Description
									>
								</div>
							</div>
						{/await}
					</Alert.Root>
				{/if}
			</div>
			<Separator />
		{/if}
		<div>
			<h3 class="text-lg font-semibold scroll-m-20">Lectio Konto</h3>
			{#if showAccountError}
				<!-- content here -->
				<Alert.Root variant="destructive">
					<TriangleAlert />
					<Alert.Title>Konto Fejl</Alert.Title>
					<Alert.Description>
						Din lectio konto er ikke sat op. Du kan ikke bruge BetterLectio uden at have sat din
						lectio konto op.
					</Alert.Description>
				</Alert.Root>
			{/if}
			<p class="mb-2">BetterLectio bruger din lectio konto til at hente dine data fra lectio.</p>
			<AccountSheet />
		</div>
		<Separator />
		<div>
			<h3 class="mb-2 text-lg font-semibold scroll-m-20">Notifikationer</h3>
			<Alert.Root class="mb-2">
				<div class="flex items-center justify-between w-full">
					<div>
						<Alert.Title>Skema ændringer</Alert.Title>
						<Alert.Description>Få besked når dit skema ændres</Alert.Description>
					</div>
					<div>
						<Switch disabled />
					</div>
				</div>
			</Alert.Root>
			<Alert.Root>
				<div class="flex items-center justify-between w-full">
					<div>
						<Alert.Title>Beskeder</Alert.Title>
						<Alert.Description>Få besked når du modtager en besked</Alert.Description>
					</div>
					<div>
						<Switch disabled />
					</div>
				</div>
			</Alert.Root>
		</div>
		<Separator />
		<div>
			<h3 class="mb-2 text-lg font-semibold scroll-m-20">System</h3>
			<Alert.Root>
				<div class="flex items-center justify-between w-full">
					<div>
						<Alert.Title>Åben ved opstart</Alert.Title>
						<Alert.Description>Åben BetterLectio når du starter din computer</Alert.Description>
					</div>
					<div>
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Switch disabled={!isDesktop} bind:checked={autoStartBtn} on:click={toggleAutostart} />
							</Tooltip.Trigger>
							{#if isWeb}
								<Tooltip.Content>
									<p>Download BetterLectio appen for at bruge denne funktion.</p>
								</Tooltip.Content>
							{/if}
						</Tooltip.Root>
					</div>
				</div>
			</Alert.Root>
		</div>
	</div>
</div>
