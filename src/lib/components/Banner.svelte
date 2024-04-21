<script lang="ts">
	import Cross1 from 'svelte-radix/Cross1.svelte'
	import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte'
	import InfoCircled from 'svelte-radix/InfoCircled.svelte'
	import CheckCircled from 'svelte-radix/CheckCircled.svelte'
	import CrossCircled from 'svelte-radix/CrossCircled.svelte'
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	export let text: string;
	export let type: 'info' | 'success' | 'warning' | 'fatalFixable' | 'fatal' = 'info';
	export let to: string = '/';
</script>

<div class="flex items-center justify-between w-screen px-4 h-fit bg-foreground text-background">
	<div class="flex items-center">
		{#if type === 'info'}
			<InfoCircled class="mr-2" />
		{:else if type === 'success'}
			<CheckCircled class="mr-2" />
		{:else if type === 'warning'}
			<ExclamationTriangle class="mr-2" />
		{:else if type === 'fatalFixable'}
			<CrossCircled class="mr-2" />
		{:else if type === 'fatal'}
			<CrossCircled class="mr-2" />
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
			class="h-6 font-black text-background"
			variant="link">Fiks Nu!</Button
		>
	{/if}
</div>
