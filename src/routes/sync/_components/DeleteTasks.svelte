<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Trash } from 'radix-icons-svelte';
	import { toast } from 'svelte-sonner';
	import { LECTIO_OAUTH_API } from '$lib/lectio';
	import { Select } from '$lib/components/ui/select';
	import { fetchTasklists, pageState, tasklist, tasklists } from '.';
	import Spinner from '$lib/customComponents/spinner.svelte';

	const deleteTasks = async () => {
		$pageState = 'loading';
		const statusToast = toast.loading('Sletter...', { duration: Number.POSITIVE_INFINITY });

		const res = await fetch(`${LECTIO_OAUTH_API}/tasks/delete`, {
			method: 'POST',
			headers: {
				google: localStorage.getItem('googleToken') || ''
			},
			body: JSON.stringify({
				tasklist: $tasklist.value
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
						'Der skete en fejl under sletningen. Prøv igen senere eller tjek din internetforbindelse.',
						{ id: statusToast }
					);
					break;
			}
			return;
		}
		toast.success(`Sletning af Google Tasks er færdig.`, { id: statusToast });
		$pageState = 'ready';
	};
</script>

<Alert.Root class="pt-4">
	<Trash />
	<div class="flex items-center justify-between w-full">
		<div>
			<Alert.Title>Slet opgaver</Alert.Title>
			<Alert.Description>Slet alle opgaver fra Google Tasks</Alert.Description>
		</div>
		<Dialog.Root>
			<Dialog.Trigger>
				<Button on:click={fetchTasklists} variant="destructive" disabled={$pageState === 'loading'}
					>Slet</Button
				>
			</Dialog.Trigger>
			<Dialog.Content>
				{#if $tasklists.length === 0}
					<Spinner />
				{:else}
					<Dialog.Header>
						<Dialog.Title>Sletning af opgaver</Dialog.Title>
						<Dialog.Description>
							Slet alle opgaver fra Google Tasks. Du kan slette opgaver manuelt i Google Tasks.
						</Dialog.Description>
					</Dialog.Header>
					<div class="flex flex-col space-y-4">
						{#key $tasklists}
							<Select bind:value={$tasklist} items={$tasklists} />
						{/key}
						<Button on:click={deleteTasks} disabled={$pageState === 'loading'} variant='destructive'>Slet</Button>
					</div>
				{/if}
			</Dialog.Content>
		</Dialog.Root>
	</div>
</Alert.Root>
