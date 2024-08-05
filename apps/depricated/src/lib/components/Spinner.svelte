<script>
	export let duration = '0.6s';
	export let size = '70';
	const smallSize = Number(size) / 7;
	const top = (Number(size) / 2) - (smallSize / 2);
</script>

<div class="wrapper" style="--size: {size}px; --innerSize: {top}px; --duration: {duration};">
	<div class="circle-one bg-primary" />
	<div class="circle-two border-primary" />
</div>

<style>
.wrapper {
	height: var(--size);
	width: var(--size);
	border-radius: 100%;
	animation: stretchDelay var(--duration) 0s infinite linear;
	animation-fill-mode: forwards;
	position: relative;
}
.circle-one {
	top: var(--innerSize);
	width: calc(var(--size) / 7);
	height: calc(var(--size) / 7);
	border-radius: 100%;
	animation: stretchDelay var(--duration) 0s infinite linear;
	animation-fill-mode: forwards;
	opacity: 0.8;
	position: absolute;
}
.circle-two {
	opacity: 0.2;
	border-style: solid;
	border-width: calc(60px / 7);
	height: var(--size);
	width: var(--size);
	border-radius: 100%;
	box-sizing: border-box;
}
@keyframes stretchDelay {
	100% {
		transform: rotate(360deg);
	}
}
</style>
