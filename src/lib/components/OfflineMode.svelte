<script lang="ts">
	import { connectionStore } from '$lib/stores';
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { isDesktop } from '$lib/utils/environment';

	onMount(() => {
		if (!isDesktop) return; // Only works on desktop, mobile devices use the `get()` logic in http.ts

		connectionStore.set(window.navigator.onLine);

		const offlineEventListener = () => {
			connectionStore.set(false);
		};
		addEventListener('offline', offlineEventListener);

		const onlineEventListener = () => {
			connectionStore.set(true);
		};
		addEventListener('online', onlineEventListener);

		return () => {
			removeEventListener('offline', offlineEventListener);
			removeEventListener('online', onlineEventListener);
		};
	});
</script>

{#if !$connectionStore}
	<div
		class="fixed z-10 w-full top-10 bg-background"
		in:fly={{ y: -100, delay: 200, duration: 200 }}
		out:fly={{ y: -100, duration: 200 }}
	>
		<Alert.Root variant="destructive" class="rounded-none">
			<CircleAlert class="w-4 h-4" />
			<Alert.Title>Ingen forbindelse</Alert.Title>
			<Alert.Description>Forbind til internettet for at hente data.</Alert.Description>
		</Alert.Root>
	</div>
{/if}
