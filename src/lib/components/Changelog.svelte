<script lang="ts">
	import { dev } from '$app/environment';
	import * as Dialog from '$lib/components/ui/alert-dialog';
	import { versionStore } from '$lib/stores';
	import { isDesktop } from '$lib/utils/environment';
	import { getVersion } from '@tauri-apps/api/app';
	import { onMount } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import { NewTabLink } from './links';
	import Button from './ui/button/button.svelte';

	let open = false;
	let current: string;
	let changelog: { name: string; body: string } | null = null;
	onMount(async () => {
		if (!isDesktop || dev) return;

		current = await getVersion();
		console.log(current, $versionStore);
		if (!$versionStore || current !== $versionStore) {
			const resp = await fetch(
				`https://api.github.com/repos/BetterLectio/betterLectio-next/releases/tags/v${current}`
			);
			if (resp.ok) {
				const data = await resp.json();
				changelog = data;
				open = true;
			}
		}
	});

	const markAsRead = () => {
		$versionStore = current;
	};
</script>

{#if changelog}
	<Dialog.Root bind:open>
		<Dialog.Trigger />
		<Dialog.Portal>
			<Dialog.Overlay />
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>{changelog.name}</Dialog.Title>
					<Dialog.Description class="!-mb-8">Hvad er nyt?</Dialog.Description>
				</Dialog.Header>
				<SvelteMarkdown source={changelog.body} renderers={{ link: NewTabLink }} />
				<Dialog.Footer>
					<Button
						href="https://oauth-betterlectio.netlify.app/releases"
						target="_blank"
						variant="outline"
					>
						Se versionshistorikken
					</Button>
					<Dialog.Action on:click={markAsRead}>Fedt 🎉</Dialog.Action>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
{/if}
