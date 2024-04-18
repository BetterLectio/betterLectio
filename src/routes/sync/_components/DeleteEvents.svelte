<script lang="ts">
	import { LECTIO_OAUTH_API } from '$lib/lectio';
	import { toast } from 'svelte-sonner';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Trash } from 'radix-icons-svelte';
	import { pageState } from '.';

	const deleteEvents = async () => {
		$pageState = 'loading';
		const statusToast = toast.loading('Sletter...', { duration: Number.POSITIVE_INFINITY });

		const res = await fetch(`${LECTIO_OAUTH_API}/events/delete`, {
			method: 'POST',
			headers: {
				google: localStorage.getItem('googleToken') || ''
			}
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
		<Button on:click={deleteEvents} disabled={$pageState === 'loading'} variant="destructive"
			>Slet</Button
		>
	</div>
</Alert.Root>
