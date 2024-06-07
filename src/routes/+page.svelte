<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Autoplay from "embla-carousel-autoplay";
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import Spotlight from "$lib/extras/Spotlight.svelte";
	import { onMount } from "svelte";
	import Footer from "$lib/extras/Footer.svelte";
	import { Globe, Download } from "lucide-svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import Badge from "$lib/components/ui/badge/badge.svelte";
	import Bento from "$lib/extras/Bento.svelte";

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

	let netlifyStatus = "";
	let vercelStatus = "";
	let lectioStatus = "";

	onMount(async () => {
		netlifyStatus = await (await fetch("https://www.netlifystatus.com/api/v2/status.json")).json();
		console.log(netlifyStatus);

		vercelStatus = await (await fetch("https://www.vercel-status.com/api/v2/status.json")).json();
		console.log(vercelStatus);

		lectioStatus = await (await fetch("/api/lectio-status")).json();
		console.log(lectioStatus);
	});

	function scrollIntoView({ target }: { target: HTMLAnchorElement }) {
		const el = document.querySelector(target.getAttribute("href") || "");
		if (!el) return;
		el.scrollIntoView({
			behavior: "smooth"
		});
	}
</script>

<div
	class="relative flex px-16 overflow-hidden antialiased mb-7 md:justify-center lg:px-32 bg-background"
>
	<Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
	<div class="z-10 flex flex-col items-center w-full">
		<div class="relative w-full p-4 pt-20 mx-auto max-w-7xl md:pt-36">
			<div class="flex flex-col items-center justify-center w-full text-center">
				<Badge class="pl-0.5 mb-3 border-green-500" variant="outline">
					<Badge class="mr-3">NYT!</Badge>
					BetterLectio version 2.0 netop udgivet!
				</Badge>
				<h1 class="text-6xl font-black">BetterLectio</h1>
				<h2 class="pt-2 font-bold opacity-80">Den Ultimative Lectio Forbedring</h2>
				<h3 class="mb-3 text-sm opacity-65">Af studerende, til studerende</h3>
			</div>
		</div>
		<div class="flex flex-wrap items-center justify-center gap-4 mb-7">
			{#if os == "Windows"}
				<!-- Only show download button if the user is on A supported OS -->
				<Button size="sm" href="/download">Download til {os}<Download class="ml-2 size-5" /></Button
				>
			{/if}
			<Button size="sm" href="https://app.betterlectio.dk" variant="outline"
				>Åben i browseren<Globe class="ml-2 size-5" /></Button
			>
		</div>
		<Carousel.Root
			opts={{
				loop: true,
				skipSnaps: true,
				align: "start"
			}}
			plugins={[
				Autoplay({
					delay: 6000
				})
			]}
			class="container mx-auto"
		>
			<Carousel.Content>
				<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
					<div class="p-1">
						<enhanced:img
							src="/static/forside.png"
							alt="biled"
							class="overflow-hidden rounded-lg shadow-lg"
						/>
					</div>
				</Carousel.Item>
				<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
					<div class="p-1">
						<enhanced:img
							src="/static/skema.png"
							alt="biled"
							class="overflow-hidden rounded-lg shadow-lg"
						/>
					</div>
				</Carousel.Item>
				<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
					<div class="p-1">
						<enhanced:img
							src="/static/fravaer.png"
							alt="biled"
							class="overflow-hidden rounded-lg shadow-lg"
						/>
					</div>
				</Carousel.Item>
				<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
					<div class="p-1">
						<enhanced:img
							src="/static/googlecalsync.png"
							alt="biled"
							class="overflow-hidden rounded-lg shadow-lg"
						/>
					</div>
				</Carousel.Item>
			</Carousel.Content>
			<Carousel.Previous class="hidden lg:flex" />
			<Carousel.Next class="hidden lg:flex" />
		</Carousel.Root>
	</div>
</div>

<Separator />
<div class="md:container md:mx-auto">
	<h4 class="my-6 text-3xl font-bold text-center md:text-left md:text-4xl">
		Hvad kan BetterLectio?
	</h4>
	<Bento />
</div>

<div class="h-screen"></div>

<Footer />
