<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { toast } from 'svelte-sonner';

	export let data: PageData;
	console.log(data);

	async function copyButtonHandler() {
		await navigator.clipboard.writeText(data.b64Token);
		toast('Kopieret til udklipsholderen, du kan sikkert lukke dette vindue nu');
	}
</script>

<div class="flex min-h-screen w-full items-center justify-center">
	<Card.Root class="mx-auto max-w-lg">
		<Card.Header>
			<Card.Title class="text-2xl">Kopier denne kode ind i BetterLectio</Card.Title>
		</Card.Header>
		<Card.Content>
			<code class="break-all text-xs">{data.b64Token}</code>
		</Card.Content>
		<Card.Footer>
			<Button variant="outline" class="w-full" on:click={copyButtonHandler}>Kopier</Button>
		</Card.Footer>
	</Card.Root>
</div>
