<script lang="ts">
	import Header from '$lib/customComponents/Header.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { LightningBolt, Trash } from 'radix-icons-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Setup from './_components/Setup.svelte';
	import Sync from './_components/Sync.svelte';

	let state: 'logged-out' | 'ready' | 'loading' = 'logged-out';

	onMount(() => {
		if (localStorage.getItem('googleToken')) {
			state = 'ready';
		}
	});

	let token = '';

	const deleteEvents = async () => {
		state = 'loading';
		const statusToast = toast.loading('Sletter...', { duration: 10000 });
		
		const res = await fetch('https://betterlectio-oauth.vercel.app/events/delete', {
			method: 'POST',
			headers: {
				google: localStorage.getItem('googleToken') || ''
			}
		});
		if (!res.ok) {
			console.log(res);
			switch (res.status) {
				case 401:
					state = 'logged-out';
					toast.error('Din google kode er ugyldig. Venligst log ind igen.', { id: statusToast });
					break;
				default:
					state = 'ready';
					toast.error(
						'Der skete en fejl under synkroniseringen. Prøv igen senere eller tjek din internetforbindelse.',
						{ id: statusToast }
					);
					break;
			}
			return;
		}
		const data = await res.json();
		toast.success(
			`Sletning af Google Kalender-moduler er færdig. ${data.success} moduler er blevet slettet. ${data.failed} moduler kunne ikke slettes.`,
			{ id: statusToast }
		);
		state = 'ready';
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
			{#if state === 'logged-out'}
				<Setup bind:token bind:state />
			{:else}
				<div class="space-y-2">
					<Sync bind:state />
					<Alert.Root class="pt-4">
						<Trash />
						<div class="flex items-center justify-between w-full">
							<div>
								<Alert.Title>Slet Google Kalender-moduler</Alert.Title>
								<Alert.Description>Slet alle moduler fra din Google Kalender</Alert.Description>
							</div>
							<Button on:click={deleteEvents} disabled={state === 'loading'} variant="destructive"
								>Slet</Button
							>
						</div>
					</Alert.Root>
				</div>
			{/if}
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
			localStorage.removeItem('googleToken');
			state = 'logged-out';
		}}>Reset</Button
	>
</div>
