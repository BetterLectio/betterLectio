<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { LightningBolt } from 'radix-icons-svelte';
	import { DateTime } from 'luxon';
	import { Badge } from '$lib/components/ui/badge';
	import { LECTIO_OAUTH_API } from '$lib/lectio';
	import { toast } from 'svelte-sonner';
	import { Switch } from '$lib/components/ui/switch';
	import Select from '$lib/components/ui/select/Select.svelte';
	import { fetchTasklists, pageState, tasklist, tasklists } from '.';
	import Spinner from '$lib/customComponents/spinner.svelte';

	const maxAgePresets = [
		{ dt: null, label: '∞' },
		{ dt: DateTime.now().minus({ months: 1 }), label: '1 måned' },
		{ dt: DateTime.now().minus({ months: 3 }), label: '3 måneder' },
		{ dt: DateTime.now().minus({ months: 6 }), label: '6 måneder' },
		{ dt: DateTime.now().minus({ months: 12 }), label: '12 måneder' }
	];
	let maxAge: DateTime | null = null;
	let addFinishedTasks = false;

	$: console.log($tasklist);

	const syncTasks = async () => {
		$pageState = 'loading';
		const statusToast = toast.loading('Synkroniserer...', { duration: 10000 });

		let options: Record<string, string | boolean> = {
			tasklist: $tasklist.value,
			addFinishedTasks
		};
		if (maxAge) {
			options.maxAge = maxAge.toISO()!;
		}

		const res = await fetch(`${LECTIO_OAUTH_API}/tasks/sync`, {
			method: 'POST',
			headers: {
				lectio: localStorage.getItem('lectio-cookie') || '',
				google: localStorage.getItem('googleToken') || ''
			},
			body: JSON.stringify(options)
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
		toast.success(`Synkronisering af opgaver er færdig.`, { id: statusToast });
		$pageState = 'ready';
	};
</script>

<Alert.Root class="pt-4">
	<LightningBolt />
	<div class="flex items-center justify-between w-full">
		<div>
			<Alert.Title>Synkronisering af opgaver</Alert.Title>
			<Alert.Description>Automatisk synkroniser dine opgaver til Google Tasks</Alert.Description>
		</div>
		<Dialog.Root>
			<Dialog.Trigger>
				<Button on:click={fetchTasklists} disabled={$pageState === 'loading'}>Synkroniser nu</Button
				>
			</Dialog.Trigger>
			<Dialog.Content>
				{#if $tasklists.length === 0}
					<Spinner />
				{:else}
					<Dialog.Header>
						<Dialog.Title>Synkroniseringsindstillinger</Dialog.Title>
						<Dialog.Description>
							Her kan du konfigurere detaljer for Google Tasks-synkroniseringen.
						</Dialog.Description>
					</Dialog.Header>
					<div class="flex flex-col space-y-4">
						<div class="p-2 border rounded-md">
							<h2 class="font-semibold leading-4">Google Tasks-liste</h2> 
							<p class="pb-2 text-sm text-muted-foreground">
								Hvilken Google Tasks-liste skal opgaver blive synkroniseret til?
							</p>
							{#key $tasklists}
								<Select bind:value={$tasklist} items={$tasklists} />
							{/key}
						</div>
						<div class="p-2 border rounded-md">
							<h2 class="font-semibold leading-4">Afleverede opgaver</h2>
							<p class="pb-2 text-sm text-muted-foreground">
								Skal afleverede opgaver blive synkroniseret til Google Tasks?
							</p>
							<Switch bind:checked={addFinishedTasks} />
						</div>
						<div class="p-2 border rounded-md">
							<h2 class="font-semibold leading-4">Opgavealder</h2>
							<p class="pb-2 text-sm text-muted-foreground">
								Hvor gammel må en opgave være for at den bliver synkroniseret til Google Tasks?
							</p>
							<div class="flex space-x-1">
								{#each maxAgePresets as preset}
									<Badge
										on:click={() => {
											maxAge = preset.dt;
										}}
										variant={maxAge === preset.dt ? 'default' : 'outline'}
									>
										{preset.label}
									</Badge>
								{/each}
							</div>
						</div>
						<Button on:click={syncTasks} disabled={$pageState === 'loading'}>Synkroniser nu</Button>
					</div>
				{/if}
			</Dialog.Content>
		</Dialog.Root>
	</div>
</Alert.Root>
