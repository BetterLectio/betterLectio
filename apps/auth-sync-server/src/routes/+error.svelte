<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<div class="flex min-h-screen w-full items-center justify-center">
	<Card.Root class="mx-auto max-w-sm border-destructive">
		<Card.Header>
			<Card.Title class="text-2xl">{$page.status}: {$page.error?.message}</Card.Title>
			<Card.Description class="text-sm">der er sket en fejl, prøv igen</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<Button variant="outline" class="w-full" href="/">Gå Tilbage</Button>
			</div>
		</Card.Content>
	</Card.Root>
</div>
