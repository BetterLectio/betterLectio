<script lang="ts">
	import { page } from '$app/stores';
    import { Button } from '$lib/components/ui/button';
</script>

<div class="flex flex-col items-center justify-center h-full space-y-2">
	{#if $page.status === 404}
		<h1>404 - Siden findes ikke</h1>
		<p>Du er vist på en side som ikke eksisterer</p>
		<Button href="/" variant="outline">Tilbage til forsiden</Button>
	{:else}
		<h1>Der skete en fejl</h1>
		<p>Der skete en fejl, prøv at genindlæse siden</p>
	{/if}
</div>
