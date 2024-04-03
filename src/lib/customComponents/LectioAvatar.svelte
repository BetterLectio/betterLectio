<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { api } from '$lib/js/http.js';
	import * as Avatar from '$lib/components/ui/avatar';

	export let id = '';
	export let navn = '';

	//export let size = 'w-12';

	let element: HTMLElement | null = null;
	let source: string | null = null;

	async function getImageSource() {
		try {
			const response = await fetch(`${api}/profil_billed?id=${id}&fullsize=1`, {
				headers: { 'lectio-cookie': localStorage.getItem('lectio-cookie') || '' }
			});
			if (response.ok) return await response.text();
			return null;
		} catch (error) {
			return null;
		}
	}
</script>

<IntersectionObserver
	{element}
	once={true}
	on:intersect={() => {
		getImageSource().then((data) => {
			source = data;
		});
	}}
>
	<div bind:this={element}>
		<Avatar.Root>
			<Avatar.Image src={source} />
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
