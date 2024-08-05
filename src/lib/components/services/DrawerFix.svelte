<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * This component is used to fix the scroll lock issue that occurs when a drawer is closed.
	 * For some reason, the scroll lock styles are not properly removed by vaul-svelte after closure.
	 */
	onMount(() => {
		function mutationCallback(mutationsList: MutationRecord[]) {
			for (const mutation of mutationsList) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'data-melt-scroll-lock') {
					if (!document.body.hasAttribute('data-melt-scroll-lock')) {
						document.body.removeAttribute('style');
					}
				}
			}
		}

		const observer = new MutationObserver(mutationCallback);

		observer.observe(document.body, { attributes: true });

		return () => observer.disconnect();
	});
</script>