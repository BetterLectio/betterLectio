<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Trash } from 'radix-icons-svelte';

	export let state: string;
</script>

<Alert.Root class="pt-4">
	<Trash />
	<div class="flex items-center justify-between w-full">
		<div>
			<Alert.Title>Slet opgaver</Alert.Title>
			<Alert.Description>Slet alle opgaver fra Google Tasks</Alert.Description>
		</div>
		<Button on:click={() => alert('Denne feature er ikke implementeret')} variant="destructive"
			>Slet</Button
		>
	</div>
</Alert.Root>
