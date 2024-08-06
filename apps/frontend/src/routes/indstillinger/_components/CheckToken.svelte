<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import { Input } from '$lib/components/ui/input';
	import { authStore, googleSyncStore } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';
	import type { GoogleSyncCheckTokenObject } from '$lib/types/google';

	let worker: Worker;

	onMount(() => {
		worker = new Worker(new URL('$lib/workers/calendarWorker.ts', import.meta.url), {
			type: 'module'
		});

		worker.onmessage = (event) => {
			console.log(event.data);
			if (event.data.task != 'checkToken') return;

			$googleSyncStore.tokenValid = event.data.ok;

			if (!event.data) {
				$googleSyncStore.googleToken = '';
				$googleSyncStore.enabled = false;
			}
		};

		const req: GoogleSyncCheckTokenObject = {
			token: $googleSyncStore.googleToken
		};

		worker.postMessage({ task: 'checkToken', req });
	});

	onDestroy(() => {
		worker.terminate();
	});
</script>

<Alert.Root class="border-destructive">
	<TriangleAlert />
	<div class="flex items-center justify-between w-full">
		<div>
			<Alert.Title>Vent venligst</Alert.Title>
			<Alert.Description>Mens vi tjekker din Google-konto.</Alert.Description>
		</div>
	</div>
</Alert.Root>
