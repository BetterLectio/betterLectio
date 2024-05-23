<script lang="ts">
	import { Spinner } from '$lib/components';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { LECTIO_OAUTH_API } from '$lib/lectio';
	import { authStore } from '$lib/stores';
	import CalendarPlus from 'lucide-svelte/icons/calendar-plus';
	import LayoutList from 'lucide-svelte/icons/layout-list';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import {
		DeleteEvents,
		DeleteTasks,
		Setup,
		SyncEvents,
		SyncTasks,
		pageState
	} from './_components';

	onMount(async () => {
		if (!$authStore.googleToken) {
			$pageState = 'logged-out';
			return;
		}
		const resp = await fetch(`${LECTIO_OAUTH_API}/token/check`, {
			headers: {
				google: $authStore.googleToken
			}
		});
		if (!resp.ok) {
			$authStore.googleToken = null;
			$pageState = 'logged-out';
			toast.error('Din google kode er ugyldig. Venligst log ind igen.');
			return;
		}
		$pageState = 'ready';
	});
</script>

<div class="page-container">
	<div class="flex items-center gap-2">
		<h1>Google Synkronisering</h1>
		{#if $pageState === 'loading'}
			<Spinner />
		{/if}
	</div>
	{#if $pageState === 'logged-out'}
		<Setup />
	{:else if $pageState === 'ready'}
		<div class="space-y-4">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-lg leading-4"
						><CalendarPlus /> Skema Synkronisering</Card.Title
					>
					<Card.Description>
						Denne feature er til dig, der gerne vil have dine Lectio-moduler smidigt ind i din
						Google Kalender! Det er en fantastisk måde at holde styr på alt dit skolearbejde og
						moduler på.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						<SyncEvents />
						<DeleteEvents />
					</div>
				</Card.Content>
				<Card.Footer>
					<p class="text-xs italic opacity-50">
						Denne feature er stadig i beta, der kan forekomme fejl.
					</p>
				</Card.Footer>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-lg leading-4"
						><LayoutList /> Opgavesynkronisering</Card.Title
					>
					<Card.Description>
						Denne feature overfører dine opgaver fra Lectio til Google Tasks.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						<SyncTasks />
						<DeleteTasks />
					</div>
				</Card.Content>
				<Card.Footer>
					<p class="text-xs italic opacity-50">
						Denne feature er stadig i beta, der kan forekomme fejl.
					</p>
				</Card.Footer>
			</Card.Root>
		</div>
		<Button
			class="mt-4"
			variant="destructive"
			size="sm"
			on:click={() => {
				localStorage.removeItem('googleToken');
				$pageState = 'logged-out';
			}}>Log ud</Button
		>
	{/if}
</div>
