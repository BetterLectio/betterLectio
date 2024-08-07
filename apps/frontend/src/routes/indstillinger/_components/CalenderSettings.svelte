<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { Select, ValueSelect } from '$lib/components/ui/select';
	import { authStore, googleSyncStore } from '$lib/stores';
	import type { GCalendar, GoogleSyncCheckTokenObject, GoogleSyncObject } from '$lib/types/google';
	import { onMount } from 'svelte';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import Button from '$lib/components/ui/button/button.svelte';
	import calendarWorker from '$lib/workers/calendarWorker?worker';

	import { DateTime } from 'luxon';
	import Spinner from '$lib/components/Spinner.svelte';
	import { Badge } from '$lib/components/ui/badge';

	let worker: Worker;

	let working = false;

	let numOfWeeks = $googleSyncStore.calendar?.amountOfWeeks.toString() || '2';
	$: if (numOfWeeks) {
		if ($googleSyncStore.calendar) {
			$googleSyncStore.calendar.amountOfWeeks = parseInt(numOfWeeks);
		}
	}

	let howOftenToSync = $googleSyncStore.calendar?.syncInterval || 'every week';
	$: if (howOftenToSync) {
		if ($googleSyncStore.calendar) {
			$googleSyncStore.calendar.syncInterval = howOftenToSync;

			if (howOftenToSync === 'manual') {
				$googleSyncStore.calendar.autoSync = false;
			} else {
				$googleSyncStore.calendar.autoSync = true;
			}
		}
	}

	let useNotifications =
		$googleSyncStore.calendar?.notifications == null
			? true
			: $googleSyncStore.calendar?.notifications;
	$: if (useNotifications || !useNotifications) {
		if ($googleSyncStore.calendar) {
			$googleSyncStore.calendar.notifications = useNotifications;
		}
	}

	//fetching the calendar
	function fetchCalendars() {
		worker = new calendarWorker();

		worker.onmessage = (event) => {
			if (event.data.task != 'listCalendars') return;
			if ($googleSyncStore.calendar == null) {
				$googleSyncStore.calendar = {
					calendars: [],
					preferredCalendar: null,
					autoSync: true,
					syncInterval: 'manual',
					amountOfWeeks: 2,
					notifications: true,
					lastSync: null,
					nextSync: null
				};
			}
			$googleSyncStore.calendar.calendars = event.data.data;
			$googleSyncStore.calendar.preferredCalendar = event.data.data[0];
		};

		const req: GoogleSyncCheckTokenObject = {
			token: $googleSyncStore.googleToken
		};
		worker.postMessage({ task: 'listCalendars', req });
	}

	onMount(() => {
		fetchCalendars();
	});

	function syncNow() {
		if (!$googleSyncStore.calendar) return;

		working = true;
		$googleSyncStore.calendar.lastSync = DateTime.now();
		if ($googleSyncStore.calendar.syncInterval === 'manual') {
			$googleSyncStore.calendar.nextSync = $googleSyncStore.calendar.lastSync;
		} else if ($googleSyncStore.calendar.syncInterval === 'every day') {
			$googleSyncStore.calendar.nextSync = $googleSyncStore.calendar.lastSync.plus({ days: 1 });
		} else if ($googleSyncStore.calendar.syncInterval === 'every week') {
			$googleSyncStore.calendar.nextSync = $googleSyncStore.calendar.lastSync.plus({ weeks: 1 });
		}
		$googleSyncStore.lectioToken = $authStore.cookie || '';
		worker = new Worker(new URL('$lib/workers/calendarWorker.ts', import.meta.url), {
			type: 'module'
		});

		worker.onmessage = (event) => {
			working = false;
			if (event.data.task != 'syncEvents') return;
			console.log(event.data);
		};

		let req: GoogleSyncObject = {
			settings: $googleSyncStore,
			startWeek: DateTime.now().weekNumber,
			syncToCalendar: true,
			syncToTasks: false
		};

		worker.postMessage({ task: 'syncEvents', req });
	}

	function deleteFromCal() {
		if (!$googleSyncStore.calendar) return;
		working = true;
		$googleSyncStore.lectioToken = $authStore.cookie || '';

		worker = new calendarWorker();

		worker.onmessage = (event) => {
			working = false;
			if (event.data.task != 'deleteEvents') return;
			console.log(event.data);
		};

		let req: GoogleSyncObject = {
			settings: $googleSyncStore,
			startWeek: DateTime.now().weekNumber,
			syncToCalendar: true,
			syncToTasks: false
		};

		worker.postMessage({ task: 'deleteEvents', req });
	}
</script>

<h4 class="mt-2 font-bold">Kalender</h4>
{#if $googleSyncStore.calendar?.calendars && $googleSyncStore.calendar?.calendars.length > 0 && $googleSyncStore.calendar?.preferredCalendar}
	<Select
		class="w-full sm:w-80"
		bind:value={$googleSyncStore.calendar.preferredCalendar}
		items={$googleSyncStore.calendar?.calendars}
	/>
{:else}
	vent mens vi henter dine kalendere
{/if}

<h4 class="mt-2 font-bold">Antal uger frem</h4>
<Tabs.Root bind:value={numOfWeeks}>
	<Tabs.List class="w-full sm:w-80">
		<Tabs.Trigger class="w-full" value="1">1 uge</Tabs.Trigger>
		<Tabs.Trigger class="w-full" value="2">2 uger</Tabs.Trigger>
		<Tabs.Trigger class="w-full" value="3">3 uger</Tabs.Trigger>
		<Tabs.Trigger class="w-full" value="4">4 uger</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>

<h4 class="mt-2 font-bold">frekvens</h4>

<Tabs.Root bind:value={howOftenToSync}>
	<Tabs.List class="w-full sm:w-80">
		<Tabs.Trigger class="w-full" value="every day">Hver dag</Tabs.Trigger>
		<Tabs.Trigger class="w-full" value="every week">Hver uge</Tabs.Trigger>
		<Tabs.Trigger class="w-full" value="manual">Manuelt</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>

<h4 class="mt-2 font-bold">Notifikationer</h4>

<div class="flex items-center justify-between w-full gap-2 sm:w-80">
	<Label for="notifikationer">send notifikationer</Label>
	<Switch id="notifikationer" bind:checked={useNotifications} />
</div>

{#if $googleSyncStore.calendar?.autoSync}
	<h4 class="mt-2 font-bold">Status</h4>
{:else}
	<h4 class="mt-2 font-bold">Aktioner</h4>
{/if}

{#if $googleSyncStore.calendar?.autoSync}
	<Badge class="bg-green-500">Aktiv</Badge>
	<p class="w-full italic sm:w-80 opacity-65 text-sx">
		Det anbefales at du genindlæser siden hvis du ændre dine indstillinger
	</p>
{:else if working}
	<!-- content here -->
	<Spinner />
{:else}
	<!-- else content here -->
	<Button size="sm" on:click={syncNow}>synkroniser nu</Button>
	<Button size="sm" variant="destructive" on:click={deleteFromCal}>Slet Moduler</Button>
{/if}

{#if $googleSyncStore.CalenderEnabled}
	<!-- content here -->
{/if}
