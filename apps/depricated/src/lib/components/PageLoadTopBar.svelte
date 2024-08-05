<script>
	import { navigating } from '$app/stores';
	let header = 'inactive';
	$: if ($navigating) {
		// if $navigating is true for more than 300ms, show loading bar
		setTimeout(() => {
			if ($navigating) header = 'active';
			else header = 'inactive';
		}, 500);
	} else {
		header = 'inactive';
	}
</script>

{#key header}
	<div class="{header} load-indicator transition-all duration-200 w-full overflow-clip">
		<div class="bg-accent h-full rounded-full w-1/3 animate-slide overflow-clip" />
	</div>
{/key}

<style>
.load-indicator {
	height: 0px;
}

.load-indicator.active {
	height: 4px;
}

.animate-slide {
	animation: slide 1s ease-in-out infinite;
}

@keyframes slide {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(300%);
	}
}
</style>
