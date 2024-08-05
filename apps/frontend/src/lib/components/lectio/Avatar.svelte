<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import * as Avatar from '$lib/components/ui/avatar';
	import { authStore, avatarStore } from '$lib/stores';
	import { LECTIO_API } from '$lib/lectio';

	export let id = '';
	export let navn = '';

	//export let size = 'w-12';

	let element: HTMLElement | null = null;
	let source: string | null = null;

	async function fetchImage() {
		if ($avatarStore?.[id]) {
			source = `data:image/png;base64, ${$avatarStore[id]}`;
			return;
		}
		const response = await fetch(`${LECTIO_API}/profil_billed?id=${id}&fullsize=1`, {
			headers: { 'lectio-cookie': $authStore.cookie || '' }
		});
		if (response.ok) {
			const text = await response.text();
			$avatarStore[id] = text;
			source = `data:image/png;base64, ${text}`;
		}
	}
</script>

<IntersectionObserver {element} once={true} on:intersect={fetchImage}>
	<div bind:this={element}>
		<Avatar.Root>
			<Avatar.Image src={source} class="object-cover" />
			{@const initials = navn
				.split(' ')
				.map((navn) => navn[0])
				.join('')
				.replace(/[.,()-]/g, '')
				.slice(0, 3)}
			<Avatar.Fallback>{initials}</Avatar.Fallback>
		</Avatar.Root>
	</div>
</IntersectionObserver>
