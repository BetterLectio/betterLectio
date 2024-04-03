<script lang="ts">
	import Header from '$lib/customComponents/Header.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Alert from '$lib/components/ui/alert';
	import {
		ExclamationTriangle as Error,
		Update,
		LightningBolt,
		Target,
		Rocket,
		ExclamationTriangle
	} from 'radix-icons-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { hasAutoSync } from '$lib/js/store';
	import Input from '$lib/components/ui/input/input.svelte';

	let state = 'loading';

	const start = async () => {
		state = 'not-logged-in';
		if (localStorage.getItem('googleToken')) {
			state = 'ready';
		}
	};
	start();

	let token = '';
	const saveToken = () => {
		console.log(token);
		localStorage.setItem('googleToken', token);
		state = 'ready';
	};

	const sync = async () => {
		console.log('syncing');
		state = 'syncing';
		console.log('token', localStorage.getItem('googleToken'));
		console.log('lectio-cookie', localStorage.getItem('lectio-cookie'));
		let res = null;
		try {
			res = await fetch('https://betterlectio-oauth.vercel.app/sync', {
				headers: {
					lectio: localStorage.getItem('lectio-cookie') || '',
					google: localStorage.getItem('googleToken') || ''
				}
			});
		} catch (e) {
			state = 'error';
			console.log(res);
			return;
		}
		state = 'synced';
		console.log('synced');
	};
</script>

<Header>Google Kalender-synkronisering</Header>

<div class="container mx-auto">
	<Card.Root>
		<Card.Header>
			<Card.Title>Google Kalender-synkronisering</Card.Title>
			<Card.Description>
				<p>
					Denne feature er til dig, der gerne vil have dine Lectio-moduler smidigt ind i din Google
					Kalender! Det er en fantastisk måde at holde styr på alt dit skolearbejde og moduler på.
				</p>
				<h4 class="mt-2 font-bold">Features</h4>
				<ul class="ml-4 list-disc">
					<li>Automatisk synkronisering af moduler, hver gang du åbner BetterLectio</li>
					<li>Automatisk opdatering af moduler, hvis der sker ændringer i dit skema</li>
				</ul>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			{#key state}
				{#if state === 'loading'}
					<Alert.Root class="pt-4">
						<Update class="animate-spin" />
						<div class="flex justify-between w-full">
							<div>
								<Alert.Title>Indlæser</Alert.Title>
								<Alert.Description
									>Vent mens vi klargører Google Kalender-synkronisering</Alert.Description
								>
							</div>
						</div>
					</Alert.Root>
				{:else if state === 'not-logged-in'}
					<Alert.Root class="pt-4 border-destructive">
						<Error />
						<div class="flex items-center justify-between w-full">
							<div>
								<Alert.Title>Mangler konto</Alert.Title>
								<Alert.Description>Du har ikke tilføjet en Google-konto endnu.</Alert.Description>
							</div>
							<Dialog.Root>
								<Dialog.Trigger
									><Button href="https://betterlectio-oauth.vercel.app/" target="_blank">
										Log på med Google
									</Button></Dialog.Trigger
								>
								<Dialog.Content>
									<Dialog.Header>
										<Dialog.Title>Indsæt koden her</Dialog.Title>
										<Dialog.Description>
											Indsæt koden fra popup-vinduet herunder. (husk det sidste tegn)
										</Dialog.Description>
									</Dialog.Header>
									<Input bind:value={token} placeholder="Kode" />
									<Dialog.Footer>
										<Button type="submit" on:click={saveToken}>Gem</Button>
									</Dialog.Footer>
								</Dialog.Content>
							</Dialog.Root>
						</div>
					</Alert.Root>
				{:else if state === 'ready'}
					<Alert.Root class="pt-4">
						<LightningBolt />
						<div class="flex items-center justify-between w-full">
							<div>
								<Alert.Title>Google Kalender-synkronisering</Alert.Title>
								<Alert.Description
									>Automatisk synkroniser dine moduler til din Google Kalender</Alert.Description
								>
							</div>
							<!-- <Switch bind:checked={$hasAutoSync} /> -->
							<Button on:click={sync}>Synkroniser nu</Button>
						</div>
					</Alert.Root>
				{:else if state === 'syncing'}
					<Alert.Root class="pt-4">
						<Update class="animate-spin" />
						<div class="flex items-center justify-between w-full">
							<div>
								<Alert.Title>Google Kalender-synkronisering</Alert.Title>
								<Alert.Description
									>Automatisk synkroniser dine moduler til din Google Kalender</Alert.Description
								>
							</div>
							<!-- <Switch bind:checked={$hasAutoSync} /> -->
							<Button on:click={sync}>Synkroniser nu</Button>
						</div>
					</Alert.Root>
				{:else if state === 'synced'}
					<Alert.Root class="pt-4">
						<Rocket />
						<div class="flex justify-between w-full">
							<div>
								<Alert.Title>Færdig</Alert.Title>
								<Alert.Description>
									Dine moduler er blevet synkroniseret til din Google Kalender
								</Alert.Description>
							</div>
						</div>
					</Alert.Root>
				{:else if state === 'error'}
					<Alert.Root class="pt-4 border-destructive">
						<ExclamationTriangle />
						<div class="flex justify-between w-full">
							<div>
								<Alert.Title>Fejl</Alert.Title>
								<Alert.Description>
									Der skete en fejl under synkroniseringen. Prøv igen senere eller tjek din
									internetforbindelse.
								</Alert.Description>
							</div>
						</div>
					</Alert.Root>
				{:else}
					<!-- else content here -->
				{/if}
			{/key}
		</Card.Content>
		<Card.Footer>
			<p class="text-xs italic opacity-50">
				Denne feature er stadig i beta, der kan forekomme fejl.
			</p>
		</Card.Footer>
	</Card.Root>
	<Button
		class="mt-4"
		variant="destructive"
		size="sm"
		on:click={() => {
			state = 'not-logged-in';
		}}>Reset</Button
	>
</div>
