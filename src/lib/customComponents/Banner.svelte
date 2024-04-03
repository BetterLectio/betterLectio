<script lang="ts">
	import {
		Cross1,
		ExclamationTriangle as Warning,
		InfoCircled as Info,
		CheckCircled as Success,
		CrossCircled as Fatal
	} from 'radix-icons-svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	export let text: string;
	export let type: 'info' | 'success' | 'warning' | 'fatalFixable' | 'fatal' = 'info';
	export let to: string = '/';
</script>

<div class="w-screen h-fit flex items-center bg-foreground text-background justify-between px-4">
	<div class="flex items-center">
		{#if type === 'info'}
			<Info class="w-4 h-4 mr-2" />
		{:else if type === 'success'}
			<Success class="w-4 h-4 mr-2" />
		{:else if type === 'warning'}
			<Warning class="w-4 h-4 mr-2" />
		{:else if type === 'fatalFixable'}
			<Fatal class="w-4 h-4 mr-2" />
		{:else if type === 'fatal'}
			<Fatal class="w-4 h-4 mr-2" />
		{/if}
		<p>{text}</p>
	</div>
	{#if type !== 'fatalFixable'}
		<Cross1 class="w-4 h-4 ml-2 mr-1" />
	{:else}
		<Button
			on:click={() => {
				goto(to);
			}}
			class="h-6 text-background font-black"
			variant="link">Fiks Nu!</Button
		>
	{/if}
</div>
