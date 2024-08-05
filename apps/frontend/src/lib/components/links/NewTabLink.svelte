<script lang="ts">
	export let href = '';
	$: link = href.startsWith('/') ? `https://www.lectio.dk${href}` : href;
	export let title: string | undefined = undefined;
</script>

<a target="_blank" href={link} {title}><slot /></a>
