<script>
	import { onMount } from "svelte";
	import { fly, fade } from "svelte/transition";
	import Countup from "svelte-countup";
	//make a function that will be called when the page is loaded then it will figure out what os the user is using and then it will show the download button for that os
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

	let loaded = false;
	let latestRelease;
	let latestAndroidRelease;
	let stats;
	let netlifyStatus = "";
	let vercelStatus = "";
	let lectioStatus = "";

	onMount(async () => {

		latestRelease = await (
			await fetch("https://api.github.com/repos/BetterLectio/betterLectio/releases/latest")
		).json();

		latestAndroidRelease = await (
			await fetch("https://api.github.com/repos/BetterLectio/Android/releases/latest")
		).json();

		loaded = true;
		netlifyStatus = await (await fetch("https://www.netlifystatus.com/api/v2/status.json")).json();
		console.log(netlifyStatus);

		vercelStatus = await (await fetch("https://www.vercel-status.com/api/v2/status.json")).json();
		console.log(vercelStatus);

		lectioStatus = await (await fetch("/api/lectio-status")).json();
		console.log(lectioStatus);

		stats = await (await fetch("https://db.betterlectio.dk/stats")).json();
	});

	function scrollIntoView({ target }) {
		const el = document.querySelector(target.getAttribute("href"));
		if (!el) return;
		el.scrollIntoView({
			behavior: "smooth"
		});
	}
</script>

<div class="container mx-auto w-full mt-4 -z-60 relative" in:fade={{ duration: 1000 }}>
	{#if loaded}
		<input type="checkbox" id="linux-download" class="modal-toggle" />
		<label for="linux-download" class="modal cursor-pointer">
			<label class="modal-box relative" for="">
				<h3 class="text-lg font-bold">Tak fordi interessere dig for BetterLectio på Linux!</h3>
				<p class="py-4">
					Vi er stadig i tidlig beta, derfor er udgivelsen også bare et AppImage. I fremtiden kommer
					BetterLectio til at være bedre integreret i dit system
				</p>
				<div class="modal-action">
					<a
						class="btn"
						href="https://github.com/BetterLectio/betterLectio/releases/download/{latestRelease.tag_name}/BetterLectio-{latestRelease.tag_name}.AppImage"
						>Download alligevel</a
					>
				</div></label
			>
		</label>
	{/if}

	<div class="mx-2 sm:mx-0">
		<div class="flex navbar">
			<div class="navbar-start" />
			<div class="navbar-center hidden lg:flex">
				<ul class="menu menu-horizontal px-1">
					<!-- <li><a href="#om" on:click|preventDefault={scrollIntoView} class="font-bold">Om</a></li> -->
					<li>
						<!-- <a href="#downloads" on:click|preventDefault={scrollIntoView} class="font-bold"
							>Download</a
						> -->
					</li>
					<li>
						<a href="/docs" class="font-bold">Docs</a>
					</li>
				</ul>
			</div>
			<div class="navbar-end hidden lg:flex">
				<a href="https://app.betterlectio.dk" class="btn">Åben app</a>
			</div>
		</div>
	</div>
</div>

<div class="flex flex-col items-center justify-center mt-36 w-full select-none">
	<h1 class="font-black mb-2 text-6xl sm:text-7xl md:text-8xl lg:text-9xl">BetterLectio</h1>
	<h2 class="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">Den Ultimative Lectio Forbedring</h2>

	<div class="mt-20 h-32 w-full relative flex flex-col items-center justify-center">
		<div class="absolute -z-30 -translate-y-16">
			<img src="/b7.png" alt="b1" />
		</div>
		<div
			class="h-32 w-32 bg-base-300 rounded-3xl flex items-center justify-center p-4 absolute shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
		>
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				class="mx-0 h-80 w-80 fill-current p-0"
				><path
					d="M428.033,162.858C422.975,72.232,347.87,0,256,0S89.025,72.232,83.967,162.858c-0.323,3.179-0.489,6.402-0.489,9.663c0,15.543,0,320.162,0,322.783c0,9.22,7.475,16.696,16.696,16.696h111.304c119.87,0,217.043-97.174,217.043-217.043V172.522C428.522,169.261,428.356,166.037,428.033,162.858z M256,33.391c42.163,0,79.93,18.923,105.464,48.641c-8.722-2.662-17.967-4.119-27.551-4.119c-32.296,0-60.834,16.291-77.913,41.06c-17.079-24.77-45.617-41.06-77.913-41.06c-9.584,0-18.829,1.457-27.551,4.119C176.07,52.314,213.837,33.391,256,33.391z M163.169,360.642c-5.842-7.12-16.37-8.174-23.494-2.326c-6.988,5.731-14.635,10.267-22.804,13.595v-97.801c26.505,36.201,66.686,61.636,112.937,68.728c-18.13,49.489-60.64,87.32-112.937,98.783v-34.418h-0.001c16.082-4.569,30.884-12.325,43.979-23.061C167.978,378.293,169.017,367.772,163.169,360.642z M395.13,294.957c0,101.261-82.386,183.652-183.652,183.652H116.87v-2.97c70.214-12.524,126.789-63.872,147.277-131.009c53.767-2.53,101.081-29.682,130.984-70.521V294.957z M256,311.652c-76.718,0-139.13-62.413-139.13-139.13c0-33.75,27.462-61.217,61.217-61.217s61.217,27.468,61.217,61.217c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-33.75,27.462-61.217,61.217-61.217c33.755,0,61.217,27.468,61.217,61.217C395.13,249.239,332.718,311.652,256,311.652z"
				></path><path
					d="M301.195,216.369c-3.26-3.26-7.532-4.891-11.804-4.891c-4.272,0-8.544,1.631-11.804,4.892L256,237.956l-21.587-21.588c-6.521-6.521-17.087-6.521-23.609,0c-6.521,6.521-6.521,17.087,0,23.609l33.391,33.391c6.521,6.521,17.087,6.521,23.609,0l33.391-33.391C307.716,233.456,307.716,222.89,301.195,216.369z"
				></path><path
					d="M178.087,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261s22.261-9.99,22.261-22.261 S190.364,150.261,178.087,150.261z"
				></path><path
					d="M333.913,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261c12.277,0,22.261-9.99,22.261-22.261 S346.19,150.261,333.913,150.261z"
				></path></svg
			>
		</div>
	</div>
</div>

<div class="flex flex-row justify-center items-center relative h-[912px] mt-32 group select-none hidden lg:flex">
	<div
		class="h-[800px] absolute translate-x-14 -translate-y-14 transition-all duration-500 ease-springback group-hover:translate-y-18 group-hover:rotate-3 group-hover:translate-x-20"
	>
		<img src="/uno.png" alt="" height="800px" class="h-[800px]" />
	</div>
	<div
		class="h-[800px] absolute -translate-x-14 translate-y-14 transition-all duration-500 ease-springback group-hover:translate-y-10 group-hover:-rotate-3 group-hover:-translate-x-20"
	>
		<img src="/dos.png" alt="" height="800px" class="h-[800px]" />
	</div>
	<div class="absolute -z-30 -translate-x-32 translate-y-14">
		<img src="/b5.png" alt="b1" />
	</div>
	<div class="absolute -z-30 translate-x-32 -translate-y-14">
		<img src="/b5.png" alt="b1" />
	</div>
</div>

<div class="container mx-auto relative rounded-4xl p-4 overflow-hidden mt-40 hidden lg:flex" style="background: url(bentobackdrop.jpg); background-size: cover;">
	<div class="grid grid-cols-5 grid-rows-5 gap-4 aspect-[16/9]">
		<div class=" overflow-hidden rounded-3xl pt-4 pl-4 filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg row-span-3">
			<h6 class="xl:text-xl font-bold mb-3">
				Gør BetterLectio
				<br>
				Dit Eget Med Temaer!
			</h6>
			<img src="tema.png" alt="tema dropdown" class="rounded-tl-3xl">
		</div>
		<div class=" overflow-hidden rounded-3xl p-4 filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg col-span-2 row-span-2 col-start-1 row-start-4">
			<div class="flex flex-row justify-between w-full h-full relative">
				<div class="w-1/2">
					<h6 class="font-bold text-xl">Vink Farvel Til <br> Lectio's Dårlige <br> Brugerflade</h6>
				</div>
				<img src="3phone.png" alt="" class="absolute translate-x-36 -translate-y-20">
			</div>
		</div>
		<div class=" overflow-hidden rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg col-span-2 row-span-3 col-start-3 row-start-2">
			<div class="flex flex-row h-full w-full ">
				<div style="background-image: url(tri.png); background-size: cover;"  class="w-1/2 h-full"></div>
				<div class="p-4 w-1/2">
					{#if stats}
					<p>Brugt Af</p>
					<div class="font-black text-3xl xl:text-5xl">
						<Countup value={stats["antal_brugere"]} duration={5000} format={false} />+
					</div>
					<p>Elever på</p>
					<div class="font-black text-4xl xl:text-7xl">
						<Countup value={stats["antal_skoler"]} duration={3000} format={false} />+
					</div>
					<p>Skoler</p>
					{:else}
					<div class="loading">
					</div>
					{/if}
					<div class="divider my-1 xl:my-4 w-1/2"/>
					<h6 class="text-xl font-bold">Stabil Tjeneste</h6>
					<p class="text-xs xl:text-sm 2xl:text-md">
						BetterLectio har i over et år leveret en stabil tjeneste til hudredevis af elever på gymnasier og erhvervsskoler i hele landet.
					</p>
				</div>
			</div>
		</div>
		<div class=" overflow-hidden rounded-3xl p-4 filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg col-start-2 row-start-3">
			<div class="flex flex-col items-center justify-center text-center h-full ">
				<h6 class="font-black text-sm xl:text-2xl 2xl:text-3xl">Gratis &<br>Open Source</h6>
				<div class="divider my-1"></div>
				<a href="https://github.com/BetterLectio">
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
						<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
					  </svg>
				</a>
			</div>
		</div>
		<div class=" overflow-hidden rounded-3xl p-4 filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg row-span-2 col-start-2 row-start-1">
			<h6 class="font-bold xl:text-xl text-xs">Overfør Dine Moduler Og Opgaver Problemfrit Til Din Google Kalender</h6>
			<div class="mt-10 w-full flex flex-row 2xl:flex-col gap-4 justify-center items-center">
				<svg
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					class="mx-0 h-10 w-10 fill-current p-0"
					><path
						d="M428.033,162.858C422.975,72.232,347.87,0,256,0S89.025,72.232,83.967,162.858c-0.323,3.179-0.489,6.402-0.489,9.663c0,15.543,0,320.162,0,322.783c0,9.22,7.475,16.696,16.696,16.696h111.304c119.87,0,217.043-97.174,217.043-217.043V172.522C428.522,169.261,428.356,166.037,428.033,162.858z M256,33.391c42.163,0,79.93,18.923,105.464,48.641c-8.722-2.662-17.967-4.119-27.551-4.119c-32.296,0-60.834,16.291-77.913,41.06c-17.079-24.77-45.617-41.06-77.913-41.06c-9.584,0-18.829,1.457-27.551,4.119C176.07,52.314,213.837,33.391,256,33.391z M163.169,360.642c-5.842-7.12-16.37-8.174-23.494-2.326c-6.988,5.731-14.635,10.267-22.804,13.595v-97.801c26.505,36.201,66.686,61.636,112.937,68.728c-18.13,49.489-60.64,87.32-112.937,98.783v-34.418h-0.001c16.082-4.569,30.884-12.325,43.979-23.061C167.978,378.293,169.017,367.772,163.169,360.642z M395.13,294.957c0,101.261-82.386,183.652-183.652,183.652H116.87v-2.97c70.214-12.524,126.789-63.872,147.277-131.009c53.767-2.53,101.081-29.682,130.984-70.521V294.957z M256,311.652c-76.718,0-139.13-62.413-139.13-139.13c0-33.75,27.462-61.217,61.217-61.217s61.217,27.468,61.217,61.217c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-33.75,27.462-61.217,61.217-61.217c33.755,0,61.217,27.468,61.217,61.217C395.13,249.239,332.718,311.652,256,311.652z"
					></path><path
						d="M301.195,216.369c-3.26-3.26-7.532-4.891-11.804-4.891c-4.272,0-8.544,1.631-11.804,4.892L256,237.956l-21.587-21.588c-6.521-6.521-17.087-6.521-23.609,0c-6.521,6.521-6.521,17.087,0,23.609l33.391,33.391c6.521,6.521,17.087,6.521,23.609,0l33.391-33.391C307.716,233.456,307.716,222.89,301.195,216.369z"
					></path><path
						d="M178.087,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261s22.261-9.99,22.261-22.261 S190.364,150.261,178.087,150.261z"
					></path><path
						d="M333.913,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261c12.277,0,22.261-9.99,22.261-22.261 S346.19,150.261,333.913,150.261z"
					></path></svg
				>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-down 2xl:rotate-0 -rotate-90" viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
				</svg>
				<div class="h-10 w-10">

					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Livello_1" x="0px" y="0px" viewBox="0 0 200 200" enable-background="new 0 0 200 200" xml:space="preserve"><link xmlns="" type="text/css" rel="stylesheet" id="dark-mode-custom-link"/><link xmlns="" type="text/css" rel="stylesheet" id="dark-mode-general-link"/><style xmlns="" lang="en" type="text/css" id="dark-mode-custom-style"/><style xmlns="" lang="en" type="text/css" id="dark-mode-native-style"/><style xmlns="" lang="en" type="text/css" id="dark-mode-native-sheet"/>
						<g>
							<g transform="translate(3.75 3.75)">
								<path fill="#FFFFFF" d="M148.882,43.618l-47.368-5.263l-57.895,5.263L38.355,96.25l5.263,52.632l52.632,6.579l52.632-6.579    l5.263-53.947L148.882,43.618z"/>
								<path fill="#1A73E8" d="M65.211,125.276c-3.934-2.658-6.658-6.539-8.145-11.671l9.132-3.763c0.829,3.158,2.276,5.605,4.342,7.342    c2.053,1.737,4.553,2.592,7.474,2.592c2.987,0,5.553-0.908,7.697-2.724s3.224-4.132,3.224-6.934c0-2.868-1.132-5.211-3.395-7.026    s-5.105-2.724-8.5-2.724h-5.276v-9.039H76.5c2.921,0,5.382-0.789,7.382-2.368c2-1.579,3-3.737,3-6.487    c0-2.447-0.895-4.395-2.684-5.855s-4.053-2.197-6.803-2.197c-2.684,0-4.816,0.711-6.395,2.145s-2.724,3.197-3.447,5.276    l-9.039-3.763c1.197-3.395,3.395-6.395,6.618-8.987c3.224-2.592,7.342-3.895,12.342-3.895c3.697,0,7.026,0.711,9.974,2.145    c2.947,1.434,5.263,3.421,6.934,5.947c1.671,2.539,2.5,5.382,2.5,8.539c0,3.224-0.776,5.947-2.329,8.184    c-1.553,2.237-3.461,3.947-5.724,5.145v0.539c2.987,1.25,5.421,3.158,7.342,5.724c1.908,2.566,2.868,5.632,2.868,9.211    s-0.908,6.776-2.724,9.579c-1.816,2.803-4.329,5.013-7.513,6.618c-3.197,1.605-6.789,2.421-10.776,2.421    C73.408,129.263,69.145,127.934,65.211,125.276z"/>
								<path fill="#1A73E8" d="M121.25,79.961l-9.974,7.25l-5.013-7.605l17.987-12.974h6.895v61.197h-9.895L121.25,79.961z"/>
								<path fill="#EA4335" d="M148.882,196.25l47.368-47.368l-23.684-10.526l-23.684,10.526l-10.526,23.684L148.882,196.25z"/>
								<path fill="#34A853" d="M33.092,172.566l10.526,23.684h105.263v-47.368H43.618L33.092,172.566z"/>
								<path fill="#4285F4" d="M12.039-3.75C3.316-3.75-3.75,3.316-3.75,12.039v136.842l23.684,10.526l23.684-10.526V43.618h105.263    l10.526-23.684L148.882-3.75H12.039z"/>
								<path fill="#188038" d="M-3.75,148.882v31.579c0,8.724,7.066,15.789,15.789,15.789h31.579v-47.368H-3.75z"/>
								<path fill="#FBBC04" d="M148.882,43.618v105.263h47.368V43.618l-23.684-10.526L148.882,43.618z"/>
								<path fill="#1967D2" d="M196.25,43.618V12.039c0-8.724-7.066-15.789-15.789-15.789h-31.579v47.368H196.25z"/>
							</g>
						</g>
					</svg>
				</div>
			</div>
		</div>
		<div class=" overflow-hidden rounded-3xl p-4 pt-2 xl:pt-4 filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg col-span-2 col-start-3 row-start-1">
			<h6 class="font-bold xl:text-3xl">Hvad Er BetterLectio?</h6>
			<p class="text-xs 2xl:text-sm line-clamp-3 xl:line-clamp-none">
				BetterLectio er udviklet med det formål at gøre det lettere at bruge Lectio ved at tilføje flere funktioner og forbedringer. Disse inkluderer en mere brugervenlig og moderne brugerflade, lettere adgang til information og bedre overblik over ens skolegang.
			</p>
		</div>
		<div class=" overflow-hidden rounded-3xl p-4 filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg row-span-1 col-start-5 row-start-1">
			<div class="flex flex-col items-center justify-center w-full h-full">
				<svg
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					class="mx-0 h-14 w-14 fill-current p-0 xl:mb-3"
					><path
						d="M428.033,162.858C422.975,72.232,347.87,0,256,0S89.025,72.232,83.967,162.858c-0.323,3.179-0.489,6.402-0.489,9.663c0,15.543,0,320.162,0,322.783c0,9.22,7.475,16.696,16.696,16.696h111.304c119.87,0,217.043-97.174,217.043-217.043V172.522C428.522,169.261,428.356,166.037,428.033,162.858z M256,33.391c42.163,0,79.93,18.923,105.464,48.641c-8.722-2.662-17.967-4.119-27.551-4.119c-32.296,0-60.834,16.291-77.913,41.06c-17.079-24.77-45.617-41.06-77.913-41.06c-9.584,0-18.829,1.457-27.551,4.119C176.07,52.314,213.837,33.391,256,33.391z M163.169,360.642c-5.842-7.12-16.37-8.174-23.494-2.326c-6.988,5.731-14.635,10.267-22.804,13.595v-97.801c26.505,36.201,66.686,61.636,112.937,68.728c-18.13,49.489-60.64,87.32-112.937,98.783v-34.418h-0.001c16.082-4.569,30.884-12.325,43.979-23.061C167.978,378.293,169.017,367.772,163.169,360.642z M395.13,294.957c0,101.261-82.386,183.652-183.652,183.652H116.87v-2.97c70.214-12.524,126.789-63.872,147.277-131.009c53.767-2.53,101.081-29.682,130.984-70.521V294.957z M256,311.652c-76.718,0-139.13-62.413-139.13-139.13c0-33.75,27.462-61.217,61.217-61.217s61.217,27.468,61.217,61.217c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-33.75,27.462-61.217,61.217-61.217c33.755,0,61.217,27.468,61.217,61.217C395.13,249.239,332.718,311.652,256,311.652z"
					></path><path
						d="M301.195,216.369c-3.26-3.26-7.532-4.891-11.804-4.891c-4.272,0-8.544,1.631-11.804,4.892L256,237.956l-21.587-21.588c-6.521-6.521-17.087-6.521-23.609,0c-6.521,6.521-6.521,17.087,0,23.609l33.391,33.391c6.521,6.521,17.087,6.521,23.609,0l33.391-33.391C307.716,233.456,307.716,222.89,301.195,216.369z"
					></path><path
						d="M178.087,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261s22.261-9.99,22.261-22.261 S190.364,150.261,178.087,150.261z"
					></path><path
						d="M333.913,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261c12.277,0,22.261-9.99,22.261-22.261 S346.19,150.261,333.913,150.261z"
					></path></svg
				>
				<p class="font-black text-lg xl:text-2xl 2xl:text-4xl">BetterLectio</p>
			</div>
		</div>
		<div class=" overflow-hidden rounded-3xl p-4 filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg row-span-3 col-start-5 row-start-2">
			<div>
				<h6 class="text-md">
					Tilgængelig På Alle Dine Enheder
				</h6>
				<div class="divider my-0 xl:my-1"></div>
				<div class="flex flex-col gap-1 xl:gap-6 mx-4">
					<div class="flex w-full justify-between items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-android" viewBox="0 0 16 16">
							<path d="M2.76 3.061a.5.5 0 0 1 .679.2l1.283 2.352A8.94 8.94 0 0 1 8 5a8.94 8.94 0 0 1 3.278.613l1.283-2.352a.5.5 0 1 1 .878.478l-1.252 2.295C14.475 7.266 16 9.477 16 12H0c0-2.523 1.525-4.734 3.813-5.966L2.56 3.74a.5.5 0 0 1 .2-.678ZM5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
						</svg>
						<p class="font-bold">Android</p>
					</div>
					<div class="flex w-full justify-between items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-browser-safari" viewBox="0 0 16 16">
						  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm.25-14.75v1.5a.25.25 0 0 1-.5 0v-1.5a.25.25 0 0 1 .5 0Zm0 12v1.5a.25.25 0 1 1-.5 0v-1.5a.25.25 0 1 1 .5 0ZM4.5 1.938a.25.25 0 0 1 .342.091l.75 1.3a.25.25 0 0 1-.434.25l-.75-1.3a.25.25 0 0 1 .092-.341Zm6 10.392a.25.25 0 0 1 .341.092l.75 1.299a.25.25 0 1 1-.432.25l-.75-1.3a.25.25 0 0 1 .091-.34ZM2.28 4.408l1.298.75a.25.25 0 0 1-.25.434l-1.299-.75a.25.25 0 0 1 .25-.434Zm10.392 6 1.299.75a.25.25 0 1 1-.25.434l-1.3-.75a.25.25 0 0 1 .25-.434ZM1 8a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 0 .5h-1.5A.25.25 0 0 1 1 8Zm12 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 1 1 0 .5h-1.5A.25.25 0 0 1 13 8ZM2.03 11.159l1.298-.75a.25.25 0 0 1 .25.432l-1.299.75a.25.25 0 0 1-.25-.432Zm10.392-6 1.299-.75a.25.25 0 1 1 .25.433l-1.3.75a.25.25 0 0 1-.25-.434ZM4.5 14.061a.25.25 0 0 1-.092-.341l.75-1.3a.25.25 0 0 1 .434.25l-.75 1.3a.25.25 0 0 1-.342.091Zm6-10.392a.25.25 0 0 1-.091-.342l.75-1.299a.25.25 0 1 1 .432.25l-.75 1.3a.25.25 0 0 1-.341.09ZM6.494 1.415l.13.483a.25.25 0 1 1-.483.13l-.13-.483a.25.25 0 0 1 .483-.13ZM9.86 13.972l.13.483a.25.25 0 1 1-.483.13l-.13-.483a.25.25 0 0 1 .483-.13ZM3.05 3.05a.25.25 0 0 1 .354 0l.353.354a.25.25 0 0 1-.353.353l-.354-.353a.25.25 0 0 1 0-.354Zm9.193 9.193a.25.25 0 0 1 .353 0l.354.353a.25.25 0 1 1-.354.354l-.353-.354a.25.25 0 0 1 0-.353ZM1.545 6.01l.483.13a.25.25 0 1 1-.13.483l-.483-.13a.25.25 0 1 1 .13-.482Zm12.557 3.365.483.13a.25.25 0 1 1-.13.483l-.483-.13a.25.25 0 1 1 .13-.483Zm-12.863.436a.25.25 0 0 1 .176-.306l.483-.13a.25.25 0 1 1 .13.483l-.483.13a.25.25 0 0 1-.306-.177Zm12.557-3.365a.25.25 0 0 1 .176-.306l.483-.13a.25.25 0 1 1 .13.483l-.483.13a.25.25 0 0 1-.306-.177ZM3.045 12.944a.299.299 0 0 1-.029-.376l3.898-5.592a.25.25 0 0 1 .062-.062l5.602-3.884a.278.278 0 0 1 .392.392L9.086 9.024a.25.25 0 0 1-.062.062l-5.592 3.898a.299.299 0 0 1-.382-.034l-.005-.006Zm3.143 1.817a.25.25 0 0 1-.176-.306l.129-.483a.25.25 0 0 1 .483.13l-.13.483a.25.25 0 0 1-.306.176ZM9.553 2.204a.25.25 0 0 1-.177-.306l.13-.483a.25.25 0 1 1 .483.13l-.13.483a.25.25 0 0 1-.306.176Z"/>
						</svg>
						<p class="font-bold">Safari</p>
					</div>
					<div class="flex w-full justify-between items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-browser-firefox" viewBox="0 0 16 16">
						  <path d="M13.384 3.408c.535.276 1.22 1.152 1.556 1.963a7.98 7.98 0 0 1 .503 3.897l-.009.077a8.533 8.533 0 0 1-.026.224A7.758 7.758 0 0 1 .006 8.257v-.04c.016-.363.055-.724.114-1.082.01-.074.075-.42.09-.489l.01-.051a6.551 6.551 0 0 1 1.041-2.35c.217-.31.46-.6.725-.87.233-.238.487-.456.758-.65a1.5 1.5 0 0 1 .26-.137c-.018.268-.04 1.553.268 1.943h.003a5.744 5.744 0 0 1 1.868-1.443 3.597 3.597 0 0 0 .021 1.896c.07.047.137.098.2.152.107.09.226.207.454.433l.068.066.009.009a1.933 1.933 0 0 0 .213.18c.383.287.943.563 1.306.741.201.1.342.168.359.193l.004.008c-.012.193-.695.858-.933.858-2.206 0-2.564 1.335-2.564 1.335.087.997.714 1.839 1.517 2.357a3.72 3.72 0 0 0 .439.241c.076.034.152.065.228.094.325.115.665.18 1.01.194 3.043.143 4.155-2.804 3.129-4.745v-.001a3.005 3.005 0 0 0-.731-.9 2.945 2.945 0 0 0-.571-.37l-.003-.002a2.679 2.679 0 0 1 1.87.454 3.915 3.915 0 0 0-3.396-1.983c-.078 0-.153.005-.23.01l-.042.003V4.31h-.002a3.882 3.882 0 0 0-.8.14 6.454 6.454 0 0 0-.333-.314 2.321 2.321 0 0 0-.2-.152 3.594 3.594 0 0 1-.088-.383 4.88 4.88 0 0 1 1.352-.289l.05-.003c.052-.004.125-.01.205-.012C7.996 2.212 8.733.843 10.17.002l-.003.005.003-.001.002-.002h.002l.002-.002a.028.028 0 0 1 .015 0 .02.02 0 0 1 .012.007 2.408 2.408 0 0 0 .206.48c.06.103.122.2.183.297.49.774 1.023 1.379 1.543 1.968.771.874 1.512 1.715 2.036 3.02l-.001-.013a8.06 8.06 0 0 0-.786-2.353Z"/>
						</svg>
						<p class="font-bold">Firefox</p>
					</div>
					<div class="flex w-full justify-between items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-browser-chrome" viewBox="0 0 16 16">
						  <path fill-rule="evenodd" d="M16 8a8.001 8.001 0 0 1-7.022 7.94l1.902-7.098a2.995 2.995 0 0 0 .05-1.492A2.977 2.977 0 0 0 10.237 6h5.511A8 8 0 0 1 16 8ZM0 8a8 8 0 0 0 7.927 8l1.426-5.321a2.978 2.978 0 0 1-.723.255 2.979 2.979 0 0 1-1.743-.147 2.986 2.986 0 0 1-1.043-.7L.633 4.876A7.975 7.975 0 0 0 0 8Zm5.004-.167L1.108 3.936A8.003 8.003 0 0 1 15.418 5H8.066a2.979 2.979 0 0 0-1.252.243 2.987 2.987 0 0 0-1.81 2.59ZM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
						</svg>
						<p class="font-bold">Chrome</p>
					</div>
					<div class="flex w-full justify-between items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-browser-edge" viewBox="0 0 16 16">
						  <path d="M9.482 9.341c-.069.062-.17.153-.17.309 0 .162.107.325.3.456.877.613 2.521.54 2.592.538h.002c.667 0 1.32-.18 1.894-.519A3.838 3.838 0 0 0 16 6.819c.018-1.316-.44-2.218-.666-2.664l-.04-.08C13.963 1.487 11.106 0 8 0A8 8 0 0 0 .473 5.29C1.488 4.048 3.183 3.262 5 3.262c2.83 0 5.01 1.885 5.01 4.797h-.004v.002c0 .338-.168.832-.487 1.244l.006-.006a.594.594 0 0 1-.043.041Z"/>
						  <path d="M.01 7.753a8.137 8.137 0 0 0 .753 3.641 8 8 0 0 0 6.495 4.564 5.21 5.21 0 0 1-.785-.377h-.01l-.12-.075a5.45 5.45 0 0 1-1.56-1.463A5.543 5.543 0 0 1 6.81 5.8l.01-.004.025-.012c.208-.098.62-.292 1.167-.285.129.001.257.012.384.033a4.037 4.037 0 0 0-.993-.698l-.01-.005C6.348 4.282 5.199 4.263 5 4.263c-2.44 0-4.824 1.634-4.99 3.49Zm10.263 7.912c.088-.027.177-.054.265-.084-.102.032-.204.06-.307.086l.042-.002Z"/>
						  <path d="M10.228 15.667a5.21 5.21 0 0 0 .303-.086l.082-.025a8.019 8.019 0 0 0 4.162-3.3.25.25 0 0 0-.331-.35c-.215.112-.436.21-.663.294a6.367 6.367 0 0 1-2.243.4c-2.957 0-5.532-2.031-5.532-4.644.002-.135.017-.268.046-.399a4.543 4.543 0 0 0-.46 5.898l.003.005c.315.441.707.821 1.158 1.121h.003l.144.09c.877.55 1.721 1.078 3.328.996Z"/>
						</svg>
						<p class="font-bold">Edge</p>
					</div>
					<div class="flex w-full justify-between items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-microsoft" viewBox="0 0 16 16">
						  <path d="M7.462 0H0v7.19h7.462V0zM16 0H8.538v7.19H16V0zM7.462 8.211H0V16h7.462V8.211zm8.538 0H8.538V16H16V8.211z"/>
						</svg>
						<p class="font-bold">Windows</p>
					</div>
					<div class="flex w-full justify-between items-center">
						<svg
							  xmlns="http://www.w3.org/2000/svg"
							  width="30"
							  height="30"
							  fill="currentColor"
							  class="bi bi-ubuntu"
							  viewBox="0 0 640 640"
						  >
							  <path
								  d="M354.796 460.541c-51.201 23.847-98.848 23.552-130.856 21.284-38.15-2.764-68.835-13.193-82.312-22.312-8.315-5.634-19.595-3.448-25.252 4.89-5.658 8.327-3.45 19.583 4.89 25.24 21.673 14.682 60.024 25.596 100.123 28.49 6.803.483 14.244.802 22.287.802 34.879 0 79.159-3.33 126.521-25.358 9.118-4.229 13.052-15.048 8.8-24.154-4.24-9.118-15.036-13.051-24.154-8.8l-.048-.082zm202.042-26.906c1.76-157.927 17.965-456.372-284.366-432.253C-26.055 25.418 53.103 340.742 48.674 446.344 44.717 502.223 26.197 570.515 0 639.988l80.67.012c8.28-29.433 14.41-58.572 16.985-86.351a190.202 190.202 0 0 0 15.65 9.791c9.047 5.327 16.795 12.402 25.04 19.878 19.204 17.528 40.996 37.359 83.563 39.84 2.835.165 5.705.247 8.552.247 43.087 0 72.52-18.838 96.166-34.004 11.327-7.24 21.119-13.524 30.367-16.524 26.197-8.197 49.075-21.437 66.201-38.28a124.86 124.86 0 0 0 7.477-8.079c9.531 34.926 22.56 74.245 37.04 113.446l172.29-.012c-41.363-63.874-84.037-126.474-83.163-206.365v.048zM77.553 347.71v-.036c-2.965-51.532 21.685-94.89 55.075-96.851 33.402-1.973 62.848 38.28 65.8 89.8v.047c.166 2.764.237 5.516.237 8.233-10.571 2.645-20.115 6.52-28.678 11.008-.047-.39-.047-.756-.07-1.158-2.847-29.244-18.485-51.355-34.926-49.359-16.453 1.985-27.438 27.355-24.567 56.6 1.24 12.756 4.913 24.153 10.04 32.764-1.288.992-4.89 3.638-9.001 6.638-3.118 2.28-6.874 5.031-11.445 8.397-12.437-16.323-20.953-39.709-22.477-66.201l.012.118zm338.248 127.407c-1.193 27.248-36.804 52.89-69.733 63.166l-.19.07c-13.688 4.454-25.89 12.25-38.799 20.517-21.72 13.878-44.162 28.24-76.56 28.24-2.114 0-4.323-.07-6.437-.189-29.681-1.724-43.607-14.41-61.158-30.437-9.284-8.433-18.874-17.197-31.229-24.45l-.295-.164c-26.681-15.072-43.229-33.804-44.327-50.115-.508-8.115 3.094-15.119 10.724-20.882 16.642-12.485 27.804-20.634 35.162-26.032 8.197-6 10.677-7.796 12.52-9.555a183.84 183.84 0 0 0 4.24-4.123c15.284-14.846 40.831-39.72 80.08-39.72 24 0 50.551 9.236 78.84 27.437 13.322 8.681 24.92 12.685 39.59 17.764 10.087 3.484 21.567 7.44 36.875 14.008l.248.118c14.28 5.882 31.205 16.595 30.402 34.323l.047.024zm-7.878-64.017a102.134 102.134 0 0 0-8.599-3.91c-13.807-5.928-24.886-9.92-34.087-13.121 5.091-9.922 8.245-22.312 8.528-35.753.732-32.717-15.791-59.327-36.874-59.363-21.072-.023-38.717 26.446-39.438 59.162a36.16 36.16 0 0 0 0 3.201c-12.957-5.953-25.713-10.323-38.233-12.957-.047-1.24-.13-2.433-.165-3.673v-.035c-1.205-59.647 35.363-109.005 81.71-110.245 46.358-1.24 84.875 46.075 86.115 105.675v.047c.555 26.953-6.685 51.792-19.004 71.044l.047-.07z"
							  />
						  </svg>
						<p class="font-bold">Linux</p>
					</div>
				</div>

			</div>
		</div>
		<div class=" overflow-hidden rounded-3xl p-4 filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg col-span-2 col-start-3 row-start-5">
			<div class="flex flex-col h-full justify-between">
				<h6 class="font-bold xl:text-xl text-center">
					Af Gymnasieelever, Til Gymnasieelever
				</h6>
				<div class="divider my-1"></div>
				<img src="https://contrib.rocks/image?repo=BetterLectio/betterlectio" alt=""/>
			</div>
		</div>
		<div class=" overflow-hidden rounded-3xl p-4 filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg col-start-5 row-start-5">
			<div class="flex flex-col items-center justify-center w-full h-full">
				<p class="font-black text-xl xl:text-3xl 2xl:text-5xl">&</p>
				<p class="font-bold text-xl xl:text-2xl">Meget Mere</p>
				<a href="https://app.betterlectio.dk/" class="btn btn-sm rounded-full mt-1 xl:mt-3 btn-neutral">Åben app</a>
			</div>
		</div>
	</div>
</div>

<div class="bg-base-content">
	<div class="container mx-auto my-20">
		<div class="flex justify-between p-4 rounded-3xl flex-col lg:flex-row">
			<h3 class="text-4xl mb-2 font-bold text-base-100">
				Se Forbedringerne I Skemaet!
			</h3>
			<div class="diff aspect-[16/9] max-w-5xl rounded-xl">
				<div class="diff-item-1">
					<img alt="daisy" src="betlec1.png" />
				</div>
				<div class="diff-item-2">
					<img alt="daisy" src="lectio1.png" />
				</div>
				<div class="diff-resizer"></div>
			</div>
		</div>
	</div>
</div>

<div class="bg-base-content">
	<div class="container mx-auto my-20">
		<div class="flex justify-between  p-4 rounded-3xl flex-col lg:flex-row-reverse">
			<h3 class="text-4xl mb-2 font-bold text-base-100 lg:text-right">
				Se Forbedringerne På Opgave Siden!
			</h3>
			<div class="diff aspect-[16/9] max-w-5xl rounded-xl">
				<div class="diff-item-1">
					<img alt="daisy" src="betlec2.png" />
				</div>
				<div class="diff-item-2">
					<img alt="daisy" src="lectio2.png" />
				</div>
				<div class="diff-resizer"></div>
			</div>
		</div>
	</div>
</div>

<div class="container mx-auto w-full mt-4 z-30 relative">
	<div>
		{#if loaded}
			<div
				id="downloads"
				class="p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg"
			>
				<h1 class="mb-2 text-4xl font-extrabold">Downloads</h1>
				<p class="mb-2">
					BetterLectio appen er ikke helt færdig endnu. Hvis du gerne vil teste den kan du finde den
					på vores Github
				</p>
				<div class="flex flex-col lg:flex-row">
					<!-- make 3 cards thae are nex to each other-->
					<div class="bg-base-300 p-4 lg:mr-4 mb-4 lg:mb-0 rounded-lg w-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="72"
							height="72"
							fill="currentColor"
							class="bi bi-microsoft w-full"
							viewBox="0 0 16 16"
						>
							<path
								d="M7.462 0H0v7.19h7.462V0zM16 0H8.538v7.19H16V0zM7.462 8.211H0V16h7.462V8.211zm8.538 0H8.538V16H16V8.211z"
							/>
						</svg>
						<p class="text-center w-full font-bold text-3xl mt-2">Windows</p>

						<a
							on:click={() => {
								alert(
									"BetterLectio appen er ikke helt færdig endnu. Hvis du gerne vil teste den kan du finde den på vores Github"
								);
							}}
							class="btn {getOS() == 'Windows' ? 'btn-primary' : ''} w-full mt-6 cursor-not-allowed"
							>Download (Ikke tilgængelig endnu)</a
						>
					</div>
					<div class="bg-base-300 p-4 lg:mr-4 mb-4 lg:mb-0 rounded-lg w-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="72"
							height="72"
							fill="currentColor"
							class="bi bi-apple w-full"
							viewBox="0 0 16 16"
						>
							<path
								d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"
							/>
							<path
								d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z"
							/>
						</svg>
						<p class="text-center w-full font-bold text-3xl mt-2">MacOS</p>

						<a
							on:click={() => {
								alert(
									"BetterLectio appen er ikke helt færdig endnu. Hvis du gerne vil teste den kan du finde den på vores Github"
								);
							}}
							class="btn {getOS() == 'MacOS' ? 'btn-primary' : ''} w-full mt-6 cursor-not-allowed"
							>Download (Ikke tilgængelig endnu)</a
						>
					</div>
					<div class="bg-base-300 p-4 lg:mr-4 mb-4 lg:mb-0 rounded-lg w-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="72"
							height="72"
							fill="currentColor"
							class="bi bi-ubuntu w-full"
							viewBox="0 0 640 640"
						>
							<path
								d="M354.796 460.541c-51.201 23.847-98.848 23.552-130.856 21.284-38.15-2.764-68.835-13.193-82.312-22.312-8.315-5.634-19.595-3.448-25.252 4.89-5.658 8.327-3.45 19.583 4.89 25.24 21.673 14.682 60.024 25.596 100.123 28.49 6.803.483 14.244.802 22.287.802 34.879 0 79.159-3.33 126.521-25.358 9.118-4.229 13.052-15.048 8.8-24.154-4.24-9.118-15.036-13.051-24.154-8.8l-.048-.082zm202.042-26.906c1.76-157.927 17.965-456.372-284.366-432.253C-26.055 25.418 53.103 340.742 48.674 446.344 44.717 502.223 26.197 570.515 0 639.988l80.67.012c8.28-29.433 14.41-58.572 16.985-86.351a190.202 190.202 0 0 0 15.65 9.791c9.047 5.327 16.795 12.402 25.04 19.878 19.204 17.528 40.996 37.359 83.563 39.84 2.835.165 5.705.247 8.552.247 43.087 0 72.52-18.838 96.166-34.004 11.327-7.24 21.119-13.524 30.367-16.524 26.197-8.197 49.075-21.437 66.201-38.28a124.86 124.86 0 0 0 7.477-8.079c9.531 34.926 22.56 74.245 37.04 113.446l172.29-.012c-41.363-63.874-84.037-126.474-83.163-206.365v.048zM77.553 347.71v-.036c-2.965-51.532 21.685-94.89 55.075-96.851 33.402-1.973 62.848 38.28 65.8 89.8v.047c.166 2.764.237 5.516.237 8.233-10.571 2.645-20.115 6.52-28.678 11.008-.047-.39-.047-.756-.07-1.158-2.847-29.244-18.485-51.355-34.926-49.359-16.453 1.985-27.438 27.355-24.567 56.6 1.24 12.756 4.913 24.153 10.04 32.764-1.288.992-4.89 3.638-9.001 6.638-3.118 2.28-6.874 5.031-11.445 8.397-12.437-16.323-20.953-39.709-22.477-66.201l.012.118zm338.248 127.407c-1.193 27.248-36.804 52.89-69.733 63.166l-.19.07c-13.688 4.454-25.89 12.25-38.799 20.517-21.72 13.878-44.162 28.24-76.56 28.24-2.114 0-4.323-.07-6.437-.189-29.681-1.724-43.607-14.41-61.158-30.437-9.284-8.433-18.874-17.197-31.229-24.45l-.295-.164c-26.681-15.072-43.229-33.804-44.327-50.115-.508-8.115 3.094-15.119 10.724-20.882 16.642-12.485 27.804-20.634 35.162-26.032 8.197-6 10.677-7.796 12.52-9.555a183.84 183.84 0 0 0 4.24-4.123c15.284-14.846 40.831-39.72 80.08-39.72 24 0 50.551 9.236 78.84 27.437 13.322 8.681 24.92 12.685 39.59 17.764 10.087 3.484 21.567 7.44 36.875 14.008l.248.118c14.28 5.882 31.205 16.595 30.402 34.323l.047.024zm-7.878-64.017a102.134 102.134 0 0 0-8.599-3.91c-13.807-5.928-24.886-9.92-34.087-13.121 5.091-9.922 8.245-22.312 8.528-35.753.732-32.717-15.791-59.327-36.874-59.363-21.072-.023-38.717 26.446-39.438 59.162a36.16 36.16 0 0 0 0 3.201c-12.957-5.953-25.713-10.323-38.233-12.957-.047-1.24-.13-2.433-.165-3.673v-.035c-1.205-59.647 35.363-109.005 81.71-110.245 46.358-1.24 84.875 46.075 86.115 105.675v.047c.555 26.953-6.685 51.792-19.004 71.044l.047-.07z"
							/>
						</svg>
						<p class="text-center w-full font-bold text-3xl mt-2">Linux</p>

						<label
							class="btn {getOS() == 'Linux' ? 'btn-primary' : ''} w-full mt-6"
							for="linux-download">Download</label
						>
					</div>

					<div class="bg-base-300 p-4 rounded-lg w-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="72"
							height="72"
							fill="currentColor"
							class="bi bi-apple w-full"
							viewBox="0 0 16 16"
						>
							<path
								d="m10.213 1.471.691-1.26c.046-.083.03-.147-.048-.192-.085-.038-.15-.019-.195.058l-.7 1.27A4.832 4.832 0 0 0 8.005.941c-.688 0-1.34.135-1.956.404l-.7-1.27C5.303 0 5.239-.018 5.154.02c-.078.046-.094.11-.049.193l.691 1.259a4.25 4.25 0 0 0-1.673 1.476A3.697 3.697 0 0 0 3.5 5.02h9c0-.75-.208-1.44-.623-2.072a4.266 4.266 0 0 0-1.664-1.476ZM6.22 3.303a.367.367 0 0 1-.267.11.35.35 0 0 1-.263-.11.366.366 0 0 1-.107-.264.37.37 0 0 1 .107-.265.351.351 0 0 1 .263-.11c.103 0 .193.037.267.11a.36.36 0 0 1 .112.265.36.36 0 0 1-.112.264Zm4.101 0a.351.351 0 0 1-.262.11.366.366 0 0 1-.268-.11.358.358 0 0 1-.112-.264c0-.103.037-.191.112-.265a.367.367 0 0 1 .268-.11c.104 0 .19.037.262.11a.367.367 0 0 1 .107.265c0 .102-.035.19-.107.264ZM3.5 11.77c0 .294.104.544.311.75.208.204.46.307.76.307h.758l.01 2.182c0 .276.097.51.292.703a.961.961 0 0 0 .7.288.973.973 0 0 0 .71-.288.95.95 0 0 0 .292-.703v-2.182h1.343v2.182c0 .276.097.51.292.703a.972.972 0 0 0 .71.288.973.973 0 0 0 .71-.288.95.95 0 0 0 .292-.703v-2.182h.76c.291 0 .54-.103.749-.308.207-.205.311-.455.311-.75V5.365h-9v6.404Zm10.495-6.587a.983.983 0 0 0-.702.278.91.91 0 0 0-.293.685v4.063c0 .271.098.501.293.69a.97.97 0 0 0 .702.284c.28 0 .517-.095.712-.284a.924.924 0 0 0 .293-.69V6.146a.91.91 0 0 0-.293-.685.995.995 0 0 0-.712-.278Zm-12.702.283a.985.985 0 0 1 .712-.283c.273 0 .507.094.702.283a.913.913 0 0 1 .293.68v4.063a.932.932 0 0 1-.288.69.97.97 0 0 1-.707.284.986.986 0 0 1-.712-.284.924.924 0 0 1-.293-.69V6.146c0-.264.098-.491.293-.68Z"
							/>
						</svg>
						<p class="text-center w-full font-bold text-3xl mt-2">Android</p>

						<a
							class="btn {getOS() == 'Android' ? 'btn-primary' : ''} w-full mt-6"
							href="https://github.com/BetterLectio/Android/releases/download/{latestAndroidRelease.tag_name}/betterlectio.apk"
							>Download</a
						>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<footer class="footer p-10 bg-base-200 text-base-content mt-56">
	<aside>
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			class="mx-0 h-14 w-14 fill-current p-0 xl:mb-3"
			><path
				d="M428.033,162.858C422.975,72.232,347.87,0,256,0S89.025,72.232,83.967,162.858c-0.323,3.179-0.489,6.402-0.489,9.663c0,15.543,0,320.162,0,322.783c0,9.22,7.475,16.696,16.696,16.696h111.304c119.87,0,217.043-97.174,217.043-217.043V172.522C428.522,169.261,428.356,166.037,428.033,162.858z M256,33.391c42.163,0,79.93,18.923,105.464,48.641c-8.722-2.662-17.967-4.119-27.551-4.119c-32.296,0-60.834,16.291-77.913,41.06c-17.079-24.77-45.617-41.06-77.913-41.06c-9.584,0-18.829,1.457-27.551,4.119C176.07,52.314,213.837,33.391,256,33.391z M163.169,360.642c-5.842-7.12-16.37-8.174-23.494-2.326c-6.988,5.731-14.635,10.267-22.804,13.595v-97.801c26.505,36.201,66.686,61.636,112.937,68.728c-18.13,49.489-60.64,87.32-112.937,98.783v-34.418h-0.001c16.082-4.569,30.884-12.325,43.979-23.061C167.978,378.293,169.017,367.772,163.169,360.642z M395.13,294.957c0,101.261-82.386,183.652-183.652,183.652H116.87v-2.97c70.214-12.524,126.789-63.872,147.277-131.009c53.767-2.53,101.081-29.682,130.984-70.521V294.957z M256,311.652c-76.718,0-139.13-62.413-139.13-139.13c0-33.75,27.462-61.217,61.217-61.217s61.217,27.468,61.217,61.217c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-33.75,27.462-61.217,61.217-61.217c33.755,0,61.217,27.468,61.217,61.217C395.13,249.239,332.718,311.652,256,311.652z"
			></path><path
				d="M301.195,216.369c-3.26-3.26-7.532-4.891-11.804-4.891c-4.272,0-8.544,1.631-11.804,4.892L256,237.956l-21.587-21.588c-6.521-6.521-17.087-6.521-23.609,0c-6.521,6.521-6.521,17.087,0,23.609l33.391,33.391c6.521,6.521,17.087,6.521,23.609,0l33.391-33.391C307.716,233.456,307.716,222.89,301.195,216.369z"
			></path><path
				d="M178.087,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261s22.261-9.99,22.261-22.261 S190.364,150.261,178.087,150.261z"
			></path><path
				d="M333.913,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261c12.277,0,22.261-9.99,22.261-22.261 S346.19,150.261,333.913,150.261z"
			></path></svg
		>		
		<p>BetterLectio<br/>Den Ultimative Lectio Forbedring</p>
	</aside> 
	<nav>
		<header class="footer-title">Links</header>
		<a class="link link-hover" href="https://app.betterlectio.dk/">App</a>
		<a class="link link-hover" href="https://dev--betlec.netlify.app/">Beta App</a>
		<a class="link link-hover" href="https://betterlectio.dk/docs">Docs</a>
		<a class="link link-hover" href="https://app.betterlectio.dk/help">Hjælp</a>
		<a class="link link-hover" href="https://app.betterlectio.dk/discord">Discord</a>
		<a class="link link-hover" href="https://app.betterlectio.dk/discord">Feedback</a>
	</nav> 
	<nav>
		<header class="footer-title">Find Os</header> 
		<a class="link link-hover" href="https://www.youtube.com/@betterlectio">YouTube</a>
		<a class="link link-hover" href="https://www.tiktok.com/@betterlectio">TikTok</a>
		<a class="link link-hover" href="https://github.com/BetterLectio">GitHub</a>
	</nav> 
	<nav>
		<header class="footer-title">Politikker</header>
		<a class="link link-hover" href="https://app.betterlectio.dk/tos">Servicevilkår</a>
		<a class="link link-hover" href="https://app.betterlectio.dk/tos">Privatlivspolitik</a>
	</nav>
</footer>

<div class="w-full hidden md:flex items-center p-2 pl-4 h-10 bg-base-300">
	<span class="font-bold">Driftstatus: </span>
	<span class="divider divider-horizontal"></span>
	<span>BetterLectio app:</span>
	{#if netlifyStatus}
		<span
			class={netlifyStatus.status.indicator === "none"
				? "ml-2 h-4 w-4 rounded-full bg-green-500"
				: netlifyStatus.status.indicator === "minor"
				? "ml-2 h-4 w-4 rounded-full bg-yellow-500"
				: "ml-2 h-4 w-4 rounded-full bg-red-500"}
		></span>
	{:else}
		<span class="ml-2 h-4 w-4 rounded-full bg-yellow-500"></span>
	{/if}
	<span class="divider divider-horizontal"></span>
	<span>BetterLectio api:</span>
	{#if vercelStatus}
		<span
			class={vercelStatus.status.indicator === "none"
				? "ml-2 h-4 w-4 rounded-full bg-green-500"
				: vercelStatus.status.indicator === "minor"
				? "ml-2 h-4 w-4 rounded-full bg-yellow-500"
				: "ml-2 h-4 w-4 rounded-full bg-red-500"}
		></span>
	{:else}
		<span class="ml-2 h-4 w-4 rounded-full bg-yellow-500"></span>
	{/if}
	<span class="divider divider-horizontal"></span>
	<span>Lectio:</span>
	{#if lectioStatus}
		<span
			class={lectioStatus.status === "green"
				? "ml-2 h-4 w-4 rounded-full bg-green-500"
				: lectioStatus.status === "yellow"
				? "ml-2 h-4 w-4 rounded-full bg-yellow-500"
				: "ml-2 h-4 w-4 rounded-full bg-red-500"}
		></span>
	{:else}
		<span class="ml-2 h-4 w-4 rounded-full bg-yellow-500"></span>
	{/if}
	<span class="divider divider-horizontal"></span>
	<span class="mr-2">BetterLectio:</span>
	<img
		src="https://app.netlify.com/access-control/bb-api/api/v1/badges/e94b60ca-d0f9-4ebf-bffb-d1b0e83aca81/deploy-status"
		alt="status"
	/>

	<span class="divider divider-horizontal"></span>

	<!--lav et repo med noget json vi nemt kan opdaterer hvis en bug skulle poppe op idk-->
</div>

<style>
	.background-cover {
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		background-image: url(/background.jpg);
	}

	.ease-springback {
		transition-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1.2);
	}

	.rounded-4xl {
		border-radius: 2rem;
	}
</style>
