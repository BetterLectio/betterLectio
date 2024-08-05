<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import SvelteMarkdown from 'svelte-markdown';

	export let data: PageData;
	console.log(data);
</script>

<div class="container max-w-xl mx-auto mt-6">
	<h1 class="mb-1 text-2xl font-bold">Udgivelser af BetterLectio</h1>
	<p class="mb-6 font-mono opacity-75">fandt {data.releases.length} udgivelser på {data.time}ms</p>

	{#each data.releases as release, i}
		<Card.Root class="mb-4">
			<Card.Header>
				<Card.Title>
					{release.tag}
					{#if i === 0}
						<span
							class="ml-3 rounded-full border-[1px] border-green-500 p-0.5 px-2 text-sm text-green-500"
							>Latest</span
						>
					{/if}
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="prose prose-zinc dark:prose-invert">
					<SvelteMarkdown source={release.releaseNotes} />
				</div>
			</Card.Content>
			<Card.Footer>
				<p>Published at: {release.publishedAt}</p>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
