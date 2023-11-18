<script>
	import { onMount } from "svelte";
	import { fly, fade } from "svelte/transition";
	import { quintIn, quintInOut, quintOut } from "svelte/easing";
	import { Canvas, Layer, t } from "svelte-canvas";
	import Countup from "svelte-countup";

	$: render = ({ context, width, height }) => {
		context.filter = "blur(150px)";
		for (let i = 0; i < 30; i++) {
			context.fillStyle = `hsl(${315.75 + Math.random() * 80 - 40} 70.196% 50%)`;
			context.fillRect(
				Math.random() * width - width / 14,
				(Math.random() * height) / 3,
				width / 7,
				100
			);
		}
	};
	let width;

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
		width = window.innerWidth - 17;
		console.log(window.innerWidth);
		// redraw on resize
		window.addEventListener("resize", () => {
			width = window.innerWidth - 17;
		});

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
	<h1 class="text-9xl font-black mb-2">BetterLectio</h1>
	<h2 class="text-2xl font-bold">Den Ultimative Lectio Forbedring</h2>

	<div class="mt-20 h-32 w-full relative flex flex-col items-center justify-center">
		<div class="absolute -z-30">
			<img src="/b1.png" alt="b1" />
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

<div class="flex flex-row justify-center items-center relative h-[912px] mt-32 group select-none">
	<div
		class="h-[800px] absolute translate-x-14 -translate-y-14 transition-all duration-500 ease-out group-hover:translate-y-18 group-hover:rotate-3 group-hover:translate-x-20"
	>
		<img src="/uno.png" alt="" height="800px" class="h-[800px]" />
	</div>
	<div
		class="h-[800px] absolute -translate-x-14 translate-y-14 transition-all duration-500 ease-out group-hover:translate-y-10 group-hover:-rotate-3 group-hover:-translate-x-20"
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

<div class="container mx-auto my-20">
	<div class="flex justify-between bg-base-content p-4 rounded-3xl flex-col lg:flex-row">
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

<div class="container mx-auto my-20">
	<div class="flex justify-between bg-base-content p-4 rounded-3xl flex-col lg:flex-row-reverse">
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

<div class="container mx-auto w-full mt-4 z-30 relative">
	<div>
		{#if stats}
			<div class="w-full flex justify-center">
				<div
					id="stats"
					class="p-4 rounded-3xl filter backdrop-blur-lg bg-base-300/30 border-base-200/10 border-2 shadow-lg mb-32"
				>
					<h1 class="mb-6 text-4xl font-extrabold">Hvor mange bruger BetterLectio?</h1>
					<div class="flex flex-col lg:flex-row">
						<div class="stats shadow">
							<div class="stat">
								<div class="stat-title">Elever</div>
								<div class="stat-value text-6xl">
									<Countup value={stats["antal_brugere"]} duration={3000} format={false} />
								</div>
								<div class="stat-desc">Elever der bruger BetterLectio</div>
							</div>
						</div>
						<div class="stats shadow lg:ml-6 mt-6 lg:mt-0">
							<div class="stat">
								<div class="stat-title">Skoler</div>
								<div class="stat-value">
									<Countup value={stats["antal_skoler"]} duration={3000} format={false} />
								</div>
								<div class="stat-desc">Skoler med BetterLectio</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

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
<div class="w-full hidden mt-56 md:flex items-center p-2 pl-4 h-10 bg-base-300">
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
</style>
