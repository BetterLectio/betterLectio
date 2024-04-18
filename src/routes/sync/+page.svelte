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
		pageState
	} from './_components';
	import { HamburgerMenu, Calendar } from 'radix-icons-svelte';

	onMount(async () => {
		if (localStorage.getItem('googleToken')) {
			$pageState = 'ready';
		}
	});
</script>

<Header>Google Synkronisering</Header>

<div class="container mx-auto">
	{#if $pageState === 'logged-out'}
		<Setup />
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
						><HamburgerMenu /> Opgavesynkronisering</Card.Title
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
