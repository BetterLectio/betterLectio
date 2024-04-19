<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import MarkdownIt from 'markdown-it';
	import purifier from 'dompurify';

	const { sanitize } = purifier;
	const md = new MarkdownIt();

	export let besked: string;
	export let afsender: string;
	export let dato: string;
	export let indent: Number = 0;
</script>

<Card.Root class="my-2 ml-[{indent}] shadow-none">
	<Card.Header>
		<Card.Title>{afsender}</Card.Title>
		<Card.Description>{dato}</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>
			{@html sanitize(md.render(besked))}
		</p>
	</Card.Content>
</Card.Root>
