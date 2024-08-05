<script lang="ts">
	import { FileText, FileDown } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let link: string;
	export let text: string;

	//TODO: local download if available (also show loader)
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button
			href={link}
			target="_blank"
			variant="outline"
			size="sm"
			class="justify-start overflow-hidden max-w-52 group md:max-w-96"
		>
			<span class="flex items-center gap-1">
				<FileText class="size-4 group-hover:hidden" />
				<FileDown class="hidden size-4 group-hover:block" />
				{text}
			</span>
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>Download dokument</Tooltip.Content>
</Tooltip.Root>
