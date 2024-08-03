<script lang="ts">
	import { onMount } from "svelte";
	import { Mail, Phone, MapPin } from "lucide-svelte";
</script>

<footer class="py-12 bg-muted">
	<div
		class="container grid grid-cols-1 gap-8 px-4 mx-auto sm:grid-cols-2 md:grid-cols-3 md:px-6 lg:max-w-7xl"
	>
		<div class="flex flex-col items-start gap-4">
			<a href="/" class="flex items-center gap-2">
				<span class="text-lg font-semibold">BetterLectio</span>
			</a>
			<p class="text-sm">Den ultimative Lectio forbedring</p>
			<img src="https://contrib.rocks/image?repo=BetterLectio/betterlectio" alt="" class="w-56" />
		</div>
		<div class="grid grid-cols-2 gap-8">
			<div class="grid gap-2">
				<h4 class="text-sm font-semibold">Virksomhed</h4>
				<a href="/om" class="text-sm"> Om os </a>
				<a href="/teamet" class="text-sm"> Teamet </a>
				<a href="/bliv udvikler" class="text-sm"> Bliv en del af os </a>
			</div>
			<div class="grid gap-2">
				<h4 class="text-sm font-semibold">Ressourcer</h4>
				<a href="https://api.betterlectio.dk/" class="text-sm"> API Dokumentation </a>
				<a href="/tos" class="text-sm"> Privatlivspolitik </a>
				<a href="/tos" class="text-sm"> Vilkår og betingelser </a>
			</div>
		</div>
		<div class="grid gap-4">
			<h4 class="text-sm font-semibold">Kontakt</h4>
			<div class="grid gap-2">
				<div class="flex items-center gap-2">
					<Mail class="size-5" />
					<a href="mailto:support@betterlectio.dk" class="text-sm"> support@betterlectio.dk </a>
				</div>
				<div class="flex items-center gap-2">
					<Phone class="size-5" />
					<a href="tel:+4571781950" class="text-sm"> 71781950 </a>
				</div>
				<div class="flex items-center gap-2">
					<MapPin class="size-5" />
					<span class="text-sm">2800 Lyngby, Danmark</span>
				</div>
			</div>
		</div>
	</div>
</footer>
