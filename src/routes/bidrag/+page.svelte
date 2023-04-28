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

  let canvasReady = false;
	onMount(async () => {
		width = window.innerWidth - 17;
		canvasReady = true;
		console.log(window.innerWidth);
		// redraw on resize
		window.addEventListener("resize", () => {
			width = window.innerWidth - 17;
		});
  });
</script>

{#if canvasReady}
	<div
		in:fade={{ duration: 2000, easing: quintInOut }}
	>
		<Canvas {width} height={700} class="absolute -z-50 overflow-y-clip filter blur-3xl">
			<Layer {render} />
		</Canvas>
	</div>
{/if}
<a  class="btn m-4" href="/">tilbage</a>
<div class="container mx-auto relative z-50 pt-10 p-2">
  <div class="p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2">
    <h1 class="font-bold text-4xl md:text-5xl">
      Bidrag til BetterLectio
    </h1>
    <h2 class="text-xl">
      Er du interesseret i at være med til at udvikle BetterLectio? vi har lavet denne guide så du ved hvordan du kan bidrage til projektet.
    </h2>
  </div>
  <div class="divider"></div>
  <p class="p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 mb-4 w-fit">
    Før du starter det vigtigt at du har installeret <a class="btn btn-xs btn-info" href="https://git-scm.com/downloads">Git</a> og <a class="btn btn-xs btn-info" href="https://nodejs.org/en/">Node.js</a> på din computer.
  </p>
  <div class="flex flex-col justify-between lg:flex-row p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 mb-4">
    <p class="lg:pr-10 lg:mb-0 mb-4 lg:w-64" >
      Først skal du clone projektet fra GitHub, dette gøres ved at åbne en terminal og skrive følgende kommando:
    </p>
    <div class="mockup-code lg:w-fit">
      <pre data-prefix=">"><code>git clone https://github.com/BetterLectio/betterLectio</code></pre>
      <pre class="text-info" data-prefix=""><code></code></pre>
      <pre class="text-info" data-prefix=""><code>Cloning into 'betterLectio'...</code></pre>
      <pre class="text-info" data-prefix=""><code>remote: Enumerating objects: 6634, done.</code></pre>
      <pre class="text-info" data-prefix=""><code>remote: Counting objects: 100% (1392/1392), done.</code></pre>
      <pre class="text-info" data-prefix=""><code>remote: Compressing objects: 100% (572/572), done.</code></pre>
      <pre class="text-info" data-prefix=""><code>remote: Total 6634 (delta 773), reused 1261 (delta 671), pack-reused 5242</code></pre>
      <pre class="text-info" data-prefix=""><code>Receiving objects: 100% (6634/6634), 33.12 MiB | 19.91 MiB/s, done.</code></pre>
      <pre class="text-info" data-prefix=""><code>Resolving deltas: 100% (4099/4099), done.</code></pre>
    </div>
  </div>

  <div class="flex flex-col justify-between lg:flex-row p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 mb-4">
    <p class="lg:pr-10 lg:mb-0 mb-4 lg:w-64" >
      Nu kan du åbne mappen ved at skrive følgende kommando:
    </p>
    <div class="mockup-code lg:w-fit">
      <pre data-prefix=">"><code>cd betterLectio</code></pre>
    </div>
  </div>

  <div class="flex flex-col justify-between lg:flex-row p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 mb-4">
    <p class="lg:pr-10 lg:mb-0 mb-4 lg:w-64" >
      Nu skal du installere alle de nødvendige pakker, dette gøres ved at skrive følgende kommando:
    </p>
    <div class="mockup-code lg:w-fit">
      <pre data-prefix=">"><code>npm install</code></pre>
      <pre class="text-info" data-prefix=""><code></code></pre>
      <pre class="text-info" data-prefix=""><code>added ___ packages, and audited ___ packages in 1s</code></pre>
      <pre class="text-info" data-prefix=""><code>found _ vulnerabilities</code></pre>
    </div>
  </div>
</div>