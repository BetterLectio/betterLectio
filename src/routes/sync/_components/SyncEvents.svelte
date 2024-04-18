<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { LightningBolt, PlusCircled, Trash } from 'radix-icons-svelte';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import { LECTIO_OAUTH_API } from '$lib/lectio';
	import { pageState } from '.';

	let eventReminders: {
		method: 'popup' | 'email';
		quantity: string;
		unit: 'minutes' | 'hours' | 'days';
	}[] = [{ method: 'popup', quantity: '5', unit: 'minutes' }];
	const syncEvents = async () => {
		$pageState = 'loading';
		const statusToast = toast.loading('Synkroniserer...', { duration: 10000 });

		const reminders = eventReminders.map((reminder) => {
			const minutes =
				reminder.unit === 'minutes'
					? +reminder.quantity
					: reminder.unit === 'hours'
						? +reminder.quantity * 60
						: +reminder.quantity * 24 * 60;
			return {
				minutes,
				method: reminder.method
			};
		});

		const res = await fetch(`${LECTIO_OAUTH_API}/events/sync`, {
			method: 'POST',
			headers: {
				lectio: localStorage.getItem('lectio-cookie') || '',
				google: localStorage.getItem('googleToken') || ''
			},
			body: JSON.stringify({
				eventReminders: reminders
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
		toast.success(
			`Synkronisering af Google Kalender-moduler er færdig.`,
			{ id: statusToast }
		);
		$pageState = 'ready';
	};
</script>

<Alert.Root class="pt-4">
	<LightningBolt />
	<div class="flex items-center justify-between w-full">
		<div>
			<Alert.Title>Synkronisering af skema</Alert.Title>
			<Alert.Description
				>Automatisk synkroniser dit Lectio skema til din Google Kalender</Alert.Description
			>
		</div>
		<Dialog.Root>
			<Dialog.Trigger>
				<Button disabled={$pageState === 'loading'}>Synkroniser nu</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Synkroniseringsindstillinger</Dialog.Title>
					<Dialog.Description>
						Her kan du konfigurere detaljer for hvordan du vil synkronisere dine moduler.
					</Dialog.Description>
				</Dialog.Header>
				<div class="flex flex-col space-y-4">
					<div class="p-2 border rounded-md">
						<h2>Påmindelser</h2>
						<p class="pb-2 text-sm text-muted-foreground">
							Indstil hvornår og hvordan du vil blive påmindet af Google Kalender for hvert modul.
						</p>
						<div class="space-y-2">
							{#each eventReminders as reminder}
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2">
										<Button
											variant="outline"
											on:click={() => {
												reminder.method = reminder.method === 'popup' ? 'email' : 'popup';
											}}>{reminder.method === 'popup' ? 'Notifikation' : 'Email'}</Button
										>
										<div class="flex items-center">
											<Input
												bind:value={reminder['quantity']}
												class="rounded-r-none"
												max={reminder.unit === 'minutes'
													? 20160
													: reminder.unit === 'hours'
														? 336
														: 14}
												type="number"
												placeholder="Antal"
											/>
											<Button
												on:click={() => {
													reminder.unit =
														reminder.unit === 'minutes'
															? 'hours'
															: reminder.unit === 'hours'
																? 'days'
																: 'minutes';
												}}
												class="rounded-l-none"
												variant="outline"
											>
												{reminder.unit === 'minutes'
													? 'Minutter'
													: reminder.unit === 'hours'
														? 'Timer'
														: 'Dage'}
											</Button>
										</div>
									</div>
									<Button
										on:click={() => {
											eventReminders = eventReminders.filter((r) => r !== reminder);
										}}
										variant="destructive"
										size="icon"
									>
										<Trash />
									</Button>
								</div>
							{/each}
							<div class="flex items-center justify-center pt-2 mt-2 border-t">
								<Button
									on:click={() => {
										eventReminders = [
											...eventReminders,
											{ method: 'popup', quantity: '5', unit: 'minutes' }
										];
									}}
									size="icon"
								>
									<PlusCircled />
								</Button>
							</div>
						</div>
					</div>
				</div>
				<Dialog.Footer>
					<Button on:click={syncEvents} disabled={$pageState === 'loading'}>Synkroniser nu</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</Alert.Root>
