<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';

	import { onMount } from 'svelte';

	onMount(() => {
		const disableContextMenu = (event: any) => {
			event.preventDefault();
		};

		window.addEventListener('contextmenu', disableContextMenu);

		return () => {
			window.removeEventListener('contextmenu', disableContextMenu);
		};
	});
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>Right click</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item>Profile</ContextMenu.Item>
		<ContextMenu.Item>Billing</ContextMenu.Item>
		<ContextMenu.Item>Team</ContextMenu.Item>
		<ContextMenu.Item>Subscription</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
