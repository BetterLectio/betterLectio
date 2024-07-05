<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import { Input } from '$lib/components/ui/input';
	import { pageState } from '.';
	import { authStore } from '$lib/stores';

	let token: string = '';

	const saveToken = () => {
		$authStore.googleToken = token;
		$pageState = 'ready';
	};
</script>

<Alert.Root class="border-destructive">
	<TriangleAlert />
	<div class="flex items-center justify-between w-full">
		<div>
			<Alert.Title>Mangler konto</Alert.Title>
			<Alert.Description>Du har ikke tilføjet en Google-konto endnu.</Alert.Description>
		</div>
		<Dialog.Root closeOnOutsideClick={false} closeOnEscape={false}>
			<Dialog.Trigger
				><Button href="https://betterlectio-oauth.vercel.app/" target="_blank">
					Log på med Google
				</Button></Dialog.Trigger
			>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Indsæt koden her</Dialog.Title>
					<Dialog.Description>
						Indsæt koden fra popup-vinduet herunder. (husk det sidste tegn)
					</Dialog.Description>
				</Dialog.Header>
				<Input bind:value={token} placeholder="Kode" />
				<Dialog.Footer>
					<Button type="submit" on:click={saveToken}>Gem</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</Alert.Root>
