<script lang="ts">
	import Header from '$lib/customComponents/Header.svelte';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import Spinner from '$lib/customComponents/spinner.svelte';
	import { onMount } from 'svelte';
	import {
		Setup,
		DeleteEvents,
		DeleteTasks,
		SyncEvents,
		SyncTasks,
		tasklists
	} from './_components';
	import { HamburgerMenu, Calendar } from 'radix-icons-svelte';
	import { toast } from 'svelte-sonner';
	import { LECTIO_OAUTH_API } from '$lib/lectio';

	let state: 'logged-out' | 'ready' | 'loading' | 'initialLoad' = 'initialLoad';

	onMount(async () => {
		if (localStorage.getItem('googleToken')) {
			const res = await fetch(`${LECTIO_OAUTH_API}/tasks/tasklists`, {
				method: 'GET',
				headers: {
					google: localStorage.getItem('googleToken') || ''
				}
			});
			if (!res.ok) {
				state = 'logged-out';
				toast.error('Din google kode er ugyldig. Venligst log ind igen.');
				return;
			}
			const data = (await res.json()) as { title: string; id: string }[];
			tasklists.set(
				data.map((tasklist) => ({
					label: tasklist.title,
					value: tasklist.id
				}))
			);
			state = 'ready';
		} else {
			state = 'logged-out';
		}
	});

	let token = '';
</script>

<Header>Google Synkronisering</Header>

<div class="container mx-auto">
	{#if state === 'logged-out'}
		<Setup bind:token bind:state />
	{:else if state === 'initialLoad'}
		<div class="absolute transform translate-x-1/2 -translate-y-1/2 right-1/2 top-1/2">
			<Spinner />
		</div>
	{:else}
		<div class="space-y-4">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-lg leading-4"
						><Calendar /> Skema Synkronisering</Card.Title
					>
					<Card.Description>
						Denne feature er til dig, der gerne vil have dine Lectio-moduler smidigt ind i din
						Google Kalender! Det er en fantastisk måde at holde styr på alt dit skolearbejde og
						moduler på.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						<SyncEvents bind:state />
						<DeleteEvents bind:state />
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
						><HamburgerMenu /> Opgavesynkronisering</Card.Title
					>
					<Card.Description>
						Denne feature overfører dine opgaver fra Lectio til Google Tasks.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						<SyncTasks bind:state />
						<DeleteTasks bind:state />
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
				state = 'logged-out';
			}}>Log ud</Button
		>
	{/if}
</div>
