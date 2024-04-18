<script lang="ts">
	import { LECTIO_OAUTH_API } from '$lib/lectio';
	import { toast } from 'svelte-sonner';
	import * as Alert from '$lib/components/ui/alert';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Trash } from 'radix-icons-svelte';
	import { calendar, calendars, fetchCalendars, pageState } from '.';
	import { Select } from '$lib/components/ui/select';
	import Spinner from '$lib/customComponents/spinner.svelte';

	const deleteEvents = async () => {
		$pageState = 'loading';
		const statusToast = toast.loading('Sletter...', { duration: Number.POSITIVE_INFINITY });

		const res = await fetch(`${LECTIO_OAUTH_API}/events/delete`, {
			method: 'POST',
			headers: {
				google: localStorage.getItem('googleToken') || ''
			},
			body: JSON.stringify({
				calendarId: $calendar.value
			})
		});
		if (!res.ok) {
			switch (res.status) {
				case 401:
					$pageState = 'logged-out';
					toast.error('Din google kode er ugyldig. Venligst log ind igen.', { id: statusToast });
					break;
				default:
					$pageState = 'ready';
					toast.error(
						'Der skete en fejl under synkroniseringen. Prøv igen senere eller tjek din internetforbindelse.',
						{ id: statusToast }
					);
					break;
			}
			return;
		}
		toast.success(`Sletning af Google Kalender-moduler er færdig.`, { id: statusToast });
		$pageState = 'ready';
	};
</script>

<Alert.Root class="pt-4">
	<Trash />
	<div class="flex items-center justify-between w-full">
		<div>
			<Alert.Title>Slet moduler</Alert.Title>
			<Alert.Description>Slet alle moduler fra din Google Kalender</Alert.Description>
		</div>
		<Dialog.Root>
			<Dialog.Trigger>
				<Button on:click={fetchCalendars} disabled={$pageState === 'loading'} variant="destructive"
					>Slet</Button
				>
			</Dialog.Trigger>
			<Dialog.Content>
				{#if $calendars.length === 0}
					<Spinner />
				{:else}
					<Dialog.Header>
						<Dialog.Title>Sletning af moduler</Dialog.Title>
						<Dialog.Description>Slet alle moduler fra din Google Kalender</Dialog.Description>
					</Dialog.Header>
					<div class="flex flex-col space-y-4">
						{#key $calendars}
							<Select bind:value={$calendar} items={$calendars} />
						{/key}
						<Button
							on:click={deleteEvents}
							disabled={$pageState === 'loading'}
							variant="destructive">Slet</Button
						>
					</div>
				{/if}
			</Dialog.Content>
		</Dialog.Root>
	</div>
</Alert.Root>
