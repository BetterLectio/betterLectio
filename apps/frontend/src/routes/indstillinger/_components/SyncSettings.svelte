<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Switch } from '$lib/components/ui/switch';
	import * as Alert from '$lib/components/ui/alert';
	import { googleSyncStore } from '$lib/stores';
	import CalenderSettings from './CalenderSettings.svelte';
	import { Badge } from '$lib/components/ui/badge';
</script>

<Card.Root>
	<Card.Header class="p-4 pb-0">
		<Card.Title>Synkroniseringsindstillinger</Card.Title>
		<Card.Description>
			Indstillinger for synkronisering af data mellem BetterLectio og Google Kalender.
		</Card.Description>
	</Card.Header>
	<Card.Content class="p-3">
		<div class="relative w-full p-4 mb-2 border rounded-lg bg-background text-foreground">
			<div class="flex items-center justify-between w-full gap-2">
				<div>
					<Alert.Title>Kalender synkronisering</Alert.Title>
					<Alert.Description
						>Få dine moduler fra BetterLectio ind i din Google Calendar.</Alert.Description
					>
				</div>
				<div>
					<Switch bind:checked={$googleSyncStore.CalenderEnabled} />
				</div>
			</div>
			{#if $googleSyncStore.CalenderEnabled}
				<div class="mt-3">
					<CalenderSettings />
				</div>
			{/if}
		</div>
		<div class="relative w-full p-4 border rounded-lg bg-background text-foreground">
			<div class="flex items-center justify-between w-full gap-2">
				<div>
					<Alert.Title>Opgave synkronisering <Badge>Kommer Snart!</Badge></Alert.Title>
					<Alert.Description>
						Få dine opgaver fra BetterLectio ind i Google Tasks.
					</Alert.Description>
				</div>
				<div>
					<Switch disabled bind:checked={$googleSyncStore.TaskEnabled} />
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>
