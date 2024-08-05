<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import * as Card from '$lib/components/ui/card/index.js';

	async function getToken() {
		const res = await fetch('/token/generate');
		const token = await res.text();
		console.log(token);
		return token;
	}

	async function handleClick() {
		const token = await getToken();
		window.location.href = token;
	}
</script>

<div class="flex items-center justify-center w-full min-h-screen">
	<Card.Root class="max-w-sm mx-auto">
		<Card.Header>
			<Card.Title class="text-2xl">Log ind</Card.Title>
			<Card.Description
				>Log ind med din Google konto for at give adgang til at synkonisere dine data.</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<Button variant="outline" class="w-full" on:click={handleClick}>Log ind med Google</Button>
			</div>
			<div class="mt-4 text-sm text-center">
				Læs BetterLectio prvatlivspolitik og servicevilkår
				<a href="https://app.betterlectio.dk/tos" class="underline"> Her </a>
			</div>
		</Card.Content>
	</Card.Root>
</div>
