<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Autoplay from "embla-carousel-autoplay";
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import Spotlight from "$lib/extras/Spotlight.svelte";
	import { onMount } from "svelte";
	import { Mail } from "lucide-svelte";
	import Footer from "$lib/extras/Footer.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import Badge from "$lib/components/ui/badge/badge.svelte";
	import Bento from "$lib/extras/Bento.svelte";
	import * as Card from "$lib/components/ui/card";
	import Map from "$lib/extras/Map.svelte";
	import { DiscordLogo } from "svelte-radix";
	import SchoolLoop from "$lib/extras/SchoolLoop.svelte";
	import Cta from "$lib/extras/Cta.svelte";

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

<p
	class="bg-orange-400 py-1.5 p-3 text-center text-sm font-medium text-black dark:bg-orange-700 dark:text-white"
>
	BetterLectio er udviklet af HCØ-studerende. Da vi har travlt med skolen på nuværende tidspunkt,
	kan vi ikke garantere, at alt virker perfekt. Kontakt os ved problemer!
</p>
<div
	class="relative flex px-16 overflow-hidden antialiased md:justify-center lg:px-32 bg-background"
>
	<Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
	<div class="z-10 flex flex-col items-center w-full">
		<div class="relative w-full p-4 pt-20 mx-auto max-w-7xl md:pt-36">
			<div class="flex flex-col items-center justify-center w-full text-center">
				<!-- <Badge class="pl-0.5 mb-3 border-purple-500" variant="outline">
					<Badge class="mr-3">NYHED!</Badge>
					Lokale oversigt!
				</Badge> -->
				<h1 class="text-6xl font-black">BetterLectio</h1>
				<h2 class="pt-2 font-bold opacity-80">Den Ultimative Lectio Forbedring</h2>
				<h3 class="mb-3 text-sm opacity-65">Af studerende, til studerende</h3>
			</div>
		</div>
		<Cta />
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
			class="md:container md:mx-auto"
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

<Separator class="my-8" />
<div class=" md:container md:mx-auto">
	<Bento />
</div>

<div class=" md:container md:mx-auto">
	<Card.Root class="flex flex-col rounded-2xl lg:flex-row">
		<div class="p-4 pb-0 lg:pb-4 lg:w-1/2">
			<enhanced:img
				src="/static/tec-i-lyngby.jpg"
				alt="tec-i-lyngby"
				class="w-full overflow-hidden rounded-lg"
			/>
		</div>
		<div class="p-4 lg:w-1/2">
			<div>
				<h4 class="mb-3 text-2xl font-black">Af studerende, til studerende ✨</h4>
				<p class="opacity-80">
					BetterLectio er udviklet af studerende fra HCØ i Lyngby. I vores gymnasietid var vi trætte
					af Lectio's mangler og irritationsmomenter, og vi besluttede os for at gøre noget ved det.
					BetterLectio er resultatet af vores arbejde, og vi håber, at du vil finde glæde i det. 🤗
				</p>
				<Separator class="my-2" />
				<p class="opacity-80">
					Hvis du har erfaring med webudvikling og har lyst til at være en del af vores team, så kan
					du sende en besked på vores email, GitHub eller i vores Discord server. Vi er altid på
					udkig efter nye talenter. Så tøv ikke med at kontakte os!
				</p>
			</div>
			<div class="flex flex-wrap gap-2 mt-4">
				<Button href="mailto:support@betterlectio.dk"><Mail class="p-0.5 mr-2" /> Sig hej!</Button>
				<Button href="/discord" variant="outline" class="border-[#5865f1] border-2"
					><DiscordLogo class="p-0.5 mr-2" /> Discord</Button
				>
			</div>
		</div>
	</Card.Root>
</div>

<div class="mt-8 md:container md:mx-auto">
	<h5 class="mb-1 text-3xl font-black">Brugt i hele landet... Af en grund!</h5>
	<p class="mb-3 opacity-80">
		Zoom ind på kortet for at se, hvor i landet BetterLectio bliver brugt af elever.
	</p>
	<Map />
</div>

<div class="mt-8">
	<div class="mb-2 md:container md:mx-auto">
		<h6 class="text-2xl font-black text-center">Skoler med BetterLectio</h6>
	</div>
	<SchoolLoop />
</div>

<div class="p-4 mt-40 md:container md:mx-auto">
	<h6 class="text-3xl font-black text-center">Hvad venter du på?</h6>
	<p class="mb-3 text-center opacity-80">
		Gør ligesom 400+ andre og gør din Lectio-oplevelse bedre! 100% gratis og uden reklamer.
	</p>
	<Cta />
</div>

<div class="h-40"></div>

<Footer />
