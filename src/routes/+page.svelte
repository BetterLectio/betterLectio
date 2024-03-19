<script lang="ts">
	import { goto } from '$app/navigation';
	import { hasAutoSync } from '$lib/js/store';

	if (!$hasAutoSync) {
		goto('/home');
	}
</script>
