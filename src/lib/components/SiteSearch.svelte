<script lang="ts">
	import { goto } from '$app/navigation';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Command from '$lib/components/ui/command';
	import { SITE_LINKS } from '$lib/links';
	import { onMount } from 'svelte';

	let open = false;
	onMount(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				open = !open;
			}
		}
		document.addEventListener('keydown', handleKeydown);

		//handle the routing of the commands
		function handleRouting(e: MouseEvent | KeyboardEvent) {
			if (e instanceof MouseEvent) {
				const target = e.target as HTMLElement;
				const routeto = target.dataset.routeto;
				if (routeto) {
					open = false;
					goto(routeto);
				}
			} else if (e instanceof KeyboardEvent && e.key === 'Enter') {
				//find the data-selected element that has a child with the data-routeto attribute
				const target = document.querySelector('[data-selected] [data-routeto]');
				if (!target) return;
				const routeto = (target as HTMLElement).dataset.routeto;
				if (routeto) {
					open = false;
					goto(routeto);
				}
			}
		}

		document.addEventListener('click', handleRouting);
		document.addEventListener('keydown', handleRouting);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
			document.removeEventListener('click', handleRouting);
		};
	});

	//find the element with the data-command-opener attribute and attach a click event listener to it to open the command dialog
	function handleCommandOpenerClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const opener = target.closest('[data-command-opener]');
		if (opener) {
			open = !open;
		}
	}
	document.addEventListener('click', handleCommandOpenerClick);
</script>

<Command.Dialog bind:open data-global-command>
	<Command.Input placeholder="Søg efter en side..." />
	<Command.List>
		<Command.Empty>Ingen sider fundet.</Command.Empty>
		{#each Object.entries(SITE_LINKS) as categoryEntry}
			{@const category = categoryEntry[1]}
			<Command.Group heading={category.label}>
				{#each category.links as link}
					<Command.Item>
						<p data-routeto={link.href} class="w-full h-full cursor-pointer">Gå til {link.label}</p>
					</Command.Item>
				{/each}
			</Command.Group>
		{/each}
	</Command.List>
</Command.Dialog>
