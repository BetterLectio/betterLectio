<script lang="ts">
	import { LECTIO_OAUTH_API } from '$lib/lectio';
	import { toast } from 'svelte-sonner';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Trash } from 'radix-icons-svelte';

	export let state: string;

	const deleteEvents = async () => {
		state = 'loading';
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

<Alert.Root class="pt-4">
	<Trash />
	<div class="flex items-center justify-between w-full">
		<div>
			<Alert.Title>Slet moduler</Alert.Title>
			<Alert.Description>Slet alle moduler fra din Google Kalender</Alert.Description>
		</div>
		<Button on:click={deleteEvents} disabled={state === 'loading'} variant="destructive"
			>Slet</Button
		>
	</div>
</Alert.Root>
