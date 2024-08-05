<script>
	import MobileCalendar from '$lib/components/Calendars/Mobile.svelte';
	import Desktop from '$lib/components/Calendars/Desktop.svelte';

	let innerWidth = 0;
	$: md = innerWidth >= 768;
</script>

<svelte:window bind:innerWidth/>

{#if md}
	<Desktop />
{:else}
	<MobileCalendar />
{/if}
