<script>
	import { onMount } from "svelte";
	import { fly, fade } from "svelte/transition";
	import { quintIn, quintInOut, quintOut } from "svelte/easing";
	import { Canvas, Layer, t } from "svelte-canvas";
	import Countup from "svelte-countup";

	$: render = ({ context, width, height }) => {
		context.filter = "blur(150px)";
		for (let i = 0; i < 30; i++) {
			context.fillStyle = `hsl(${215.75 + Math.random() * 80 - 40} 70.196% 50%)`;
			context.fillRect(
				Math.random() * width - width / 14,
				(Math.random() * height) / 3,
				width / 7,
				100
			);
		}
	};
	let width;

	let titels;

	let canvasReady = false;
	onMount(async () => {
		width = window.innerWidth - 17;
		canvasReady = true;
		console.log(window.innerWidth);
		// redraw on resize
		window.addEventListener("resize", () => {
			width = window.innerWidth - 17;
		});
		titels = findSections();

		window.addEventListener("scroll", () => {
			findDivsInView();
		});
	});

	function scrollTo(id) {
		document.getElementById(id).scrollIntoView({ behavior: "smooth" });
	}

	function findSections() {
		let divs = document.getElementsByTagName("section");
		let divsArray = Array.from(divs);
		let divsArrayIds = divsArray.map((div) => div.id);
		return divsArrayIds;
	}

	function findDivsInView() {
		const divs = document.getElementsByTagName("section");
		const divsInView = [];
		for (const div of divs) {
			const rect = div.getBoundingClientRect();
			if (rect.top < window.innerHeight && rect.bottom > 0) {
				divsInView.push(div.id);
			}
		}
		if (divsInView === []) {
			return;
		}
		divsInView.forEach((divTitle) => {
			let menuTitleId = divTitle.replace(" ", "-");
			const element = document.getElementById(menuTitleId + "-menu");
			element.classList.add("border-l-2");
		});
		// remove border from all elements that are not in view
		titels.forEach((titel) => {
			if (!divsInView.includes(titel)) {
				let menuTitleId = titel.replace(" ", "-");
				const element = document.getElementById(menuTitleId + "-menu");
				element.classList.remove("border-l-2");
			}
		});
	}
</script>

{#if canvasReady}
	<div in:fade={{ duration: 2000, easing: quintInOut }}>
		<Canvas {width} height={700} class="absolute -z-50 overflow-y-clip filter blur-3xl">
			<Layer {render} />
		</Canvas>
	</div>
{/if}
<a class="btn m-4" href="/">tilbage</a>
<div class="container mx-auto relative z-50 pt-10 p-2">
	<div class="flex flex-row-reverse justify-between">
		<!-- important div DONT DELETE -->
		<div class="w-72 hidden xl:inline-flex" />

		<div class="fixed hidden xl:inline-flex">
			<ul
				class=" rounded-3xl p-4 w-56 filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg"
			>
				<li class="opacity-50">
					<span>Kapitler</span>
				</li>
				{#if titels}
					{#each titels as titel, i}
						<li in:fade={{ delay: 200 * i }} class="relative">
							<div
								id={titel.replace(" ", "-") + "-menu"}
								on:click={() => scrollTo(titel)}
								class="transition-all duration-150 p-2 border-info hover:bg-white/10 cursor-pointer"
							>
								{titel}
							</div>
						</li>
					{/each}
				{:else}
					<li class="disabled"><span>Loading</span></li>
				{/if}
			</ul>
		</div>
		<div>
			<div
				class="p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg"
			>
				<h1 class="font-bold text-4xl md:text-5xl">Bidrag til BetterLectio</h1>
				<h2 class="text-xl">
					Er du interesseret i at være med til at udvikle BetterLectio? vi har lavet denne guide så
					du ved hvordan du kan bidrage til projektet.
				</h2>
			</div>
			<section id="Setup">
				<div class="divider" />
				<h3 class="font-bold text-2xl mb-2">Setup</h3>
				<p
					class="p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg mb-4 w-fit"
				>
					Før du starter det vigtigt at du har installeret <a
						class="btn btn-xs btn-info"
						href="https://git-scm.com/downloads">Git</a
					>
					og <a class="btn btn-xs btn-info" href="https://nodejs.org/en/">Node.js</a> på din computer.
				</p>
				<div
					class="flex flex-col justify-between lg:flex-row p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg mb-4"
				>
					<p class="lg:pr-10 lg:mb-0 mb-4 lg:w-64">
						Først skal du clone projektet fra GitHub, dette gøres ved at åbne en terminal og skrive
						følgende kommando:
					</p>
					<div class="mockup-code lg:w-fit">
						<pre data-prefix=">"><code>git clone https://github.com/BetterLectio/betterLectio</code
							></pre>
						<pre class="text-info" data-prefix=""><code /></pre>
						<pre class="text-info" data-prefix=""><code>Cloning into 'betterLectio'...</code></pre>
						<pre class="text-info" data-prefix=""><code
								>remote: Enumerating objects: 6634, done.</code
							></pre>
						<pre class="text-info" data-prefix=""><code
								>remote: Counting objects: 100% (1392/1392), done.</code
							></pre>
						<pre class="text-info" data-prefix=""><code
								>remote: Compressing objects: 100% (572/572), done.</code
							></pre>
						<pre class="text-info" data-prefix=""><code
								>remote: Total 6634 (delta 773), reused 1261 (delta 671), pack-reused 5242</code
							></pre>
						<pre class="text-info" data-prefix=""><code
								>Receiving objects: 100% (6634/6634), 33.12 MiB | 19.91 MiB/s, done.</code
							></pre>
						<pre class="text-info" data-prefix=""><code
								>Resolving deltas: 100% (4099/4099), done.</code
							></pre>
					</div>
				</div>

				<div
					class="flex flex-col justify-between lg:flex-row p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg mb-4"
				>
					<p class="lg:pr-10 lg:mb-0 mb-4 lg:w-64">
						Nu kan du åbne mappen ved at skrive følgende kommando:
					</p>
					<div class="mockup-code lg:w-fit">
						<pre data-prefix=">"><code>cd betterLectio</code></pre>
					</div>
				</div>

				<div
					class="flex flex-col justify-between lg:flex-row p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg mb-4"
				>
					<p class="lg:pr-10 lg:mb-0 mb-4 lg:w-64">
						Nu skal du installere alle de nødvendige pakker, dette gøres ved at skrive følgende
						kommando:
					</p>
					<div class="mockup-code lg:w-fit">
						<pre data-prefix=">"><code>npm install</code></pre>
						<pre class="text-info" data-prefix=""><code /></pre>
						<pre class="text-info" data-prefix=""><code
								>added ___ packages, and audited ___ packages in 1s</code
							></pre>
						<pre class="text-info" data-prefix=""><code>found _ vulnerabilities</code></pre>
					</div>
				</div>
			</section>

			<section id="Kør BetterLectio">
				<div class="divider" />
				<h3 class="font-bold text-2xl mb-2">Kør BetterLectio</h3>

				<div
					class="flex flex-col justify-between lg:flex-row p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg mb-4"
				>
					<p class="lg:pr-10 lg:mb-0 mb-4 lg:w-64">
						Nu kan du starte projektet ved at skrive følgende kommando:
					</p>
					<div class="mockup-code lg:w-fit">
						<pre data-prefix=">"><code>npm run dev</code></pre>
						<pre class="text-info" data-prefix=""><code /></pre>
						<pre class="text-info" data-prefix=""><code>VITE v4.0.4  ready in 911 ms</code></pre>
						<pre class="text-info" data-prefix=""><code /></pre>
						<pre class="text-info-content bg-info" data-prefix=""><code
								>➜  Local:   http://localhost:5173/</code
							></pre>
						<pre class="text-info" data-prefix=""><code>➜  Network: use --host to expose</code
							></pre>
						<pre class="text-info" data-prefix=""><code>➜  press h to show help</code></pre>
					</div>
				</div>

				<div
					class="p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg mb-4 w-fit"
				>
					<p class="mb-2">
						Nu kan du åbne projektet i din browser ved at gå ind på <a
							class="btn btn-xs btn-info"
							href="http://localhost:5173/">http://localhost:5173/</a
						>
					</p>
					<p class="border-l-2 border-warning pl-4">
						Det kan være at Vite bruger en anden port end 5173, dette kan du se i terminalen.
					</p>
				</div>
			</section>

			<section id="Rediger kildekoden">
				<div class="divider" />
				<h3 class="font-bold text-2xl mb-2" >Rediger kildekoden</h3>
				<p class="text-error">todo</p>
			</section>

			<section id="Lav et commit">
				<div class="divider" />
				<h3 class="font-bold text-2xl mb-2" >Lav et commit</h3>
				<p class="text-error">todo</p>
			</section>

			<section id="Lav en pull request">
				<div class="divider" />
				<h3 class="font-bold text-2xl mb-2" >Lav en pull request</h3>
				<p class="text-error">todo</p>
			</section>

			<section id="Bugs">
				<div class="divider" />
				<h3 class="font-bold text-2xl mb-2">Bugs</h3>
				<p class="text-error">todo</p>
			</section>

			<section id="Eksterne ressourcer">
				<div class="divider" />
				<h3 class="font-bold text-2xl mb-2">Eksterne ressourcer</h3>

				<div class="">
					<table class="table w-full table-zebra table-compact">
						<!-- head -->
						<thead>
							<tr>
								<th>Navn</th>
								<th>link</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Svelte docs</td>
								<td
									><a class="btn btn-xs btn-info" href="https://svelte.dev/docs">svelte.dev/docs</a
									></td
								>
							</tr>
							<tr>
								<td>SvelteKit docs</td>
								<td
									><a class="btn btn-xs btn-info" href="https://kit.svelte.dev/docs/"
										>kit.svelte.dev/docs/</a
									></td
								>
							</tr>
							<tr>
								<td>Tailwind css</td>
								<td
									><a class="btn btn-xs btn-info" href="https://tailwindcss.com/docs"
										>tailwindcss.com/docs</a
									></td
								>
							</tr>
							<tr>
								<td>DaisyUI</td>
								<td><a class="btn btn-xs btn-info" href="https://daisyui.com/">daisyui.com/</a></td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	</div>
</div>
