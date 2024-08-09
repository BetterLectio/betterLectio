<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { Globe, Download } from "lucide-svelte";
	import { onMount } from "svelte";

	let os = "dit OS";
	onMount(() => {
		os = getOS() || "dit OS";
	});

	function getOS() {
		var userAgent = window.navigator.userAgent,
			platform = window.navigator.platform,
			macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
			windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
			iosPlatforms = ["iPhone", "iPad", "iPod"],
			os = null;

		if (macosPlatforms.indexOf(platform) !== -1) {
			os = "MacOS";
		} else if (iosPlatforms.indexOf(platform) !== -1) {
			os = "iOS";
		} else if (windowsPlatforms.indexOf(platform) !== -1) {
			os = "Windows";
		} else if (/Android/.test(userAgent)) {
			os = "Android";
		} else if (!os && /Linux/.test(platform)) {
			os = "Linux";
		}

		console.log(os);

		return os;
	}
</script>

<div class="flex flex-wrap items-center justify-center gap-4 mb-7">
	{#if os == "Windows"}
		<!-- Only show download button if the user is on A supported OS -->
		<!-- not ready yet -->
		<!-- <Button size="sm" href="/download">Download til {os}<Download class="ml-2 size-5" /></Button> -->
	{/if}
	<Button size="sm" href="https://app.betterlectio.dk"
		>Åben i browseren<Globe class="ml-2 size-5" /></Button
	>
</div>
