<script lang="ts">
	import { LectioAvatar, NewTabLink } from '$lib/components';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import type { FullMessage } from '$lib/types/messages';
	import { relativeTime } from '$lib/utils';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import Pencil from 'lucide-svelte/icons/pencil';
	import SvelteMarkdown from 'svelte-markdown';

	export let message: FullMessage['messages'][0];
</script>

<Card.Root class="my-2 ml-[{message.indent}] shadow-none">
	<Card.Header class="flex-row items-center gap-2">
		<LectioAvatar navn={message.sender.name} id={message.sender.id} />
		<div>
			<Card.Title>{message.sender.name}</Card.Title>
			<Card.Description><p use:relativeTime={message.date.toJSDate()} /></Card.Description>
		</div>
	</Card.Header>
	<Card.Content>
		{#if message.attachments.length}
			<div class="flex flex-row flex-wrap">
				{#each message.attachments as attachment}
					<Badge class="mb-1 mr-1" href={attachment.link}>{attachment.name}</Badge>
				{/each}
			</div>
		{/if}
		<SvelteMarkdown source={message.body} renderers={{ link: NewTabLink }} />
		{#if message.edits.length}
			{#each message.edits as edit}
				<div class="flex items-center text-gray-400">
					<p class="text-sm">{edit}</p>
					<Pencil class="w-4 h-4 ml-1" />
				</div>
			{/each}
		{/if}
		{#if message.client}
			<div class="flex items-center text-gray-400">
				<a target="_blank" href={message.client.link} class="text-sm"
					>Sendt fra {message.client.name}</a
				>
				<ExternalLink class="w-4 h-4 ml-1" />
			</div>
		{/if}
	</Card.Content>
</Card.Root>
