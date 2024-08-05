<script lang="ts">
	export let href = '';
	export let title: string | undefined = undefined;
</script>

<a class="font-medium underline break-all" target="_blank" {href} {title}><slot /></a>
