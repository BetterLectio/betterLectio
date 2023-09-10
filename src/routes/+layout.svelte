<script>
	import '../app.css';
	import { api, get } from '$lib/js/http.js';
	import { brugeren, hold, indstillinger } from '$lib/js/store.js';
	import ErrorMsg from '$lib/components/ErrorMsg.svelte';
	import GlobalSearch from '$lib/components/GlobalSearch.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import Notify from '$lib/components/Notify.svelte';
	import PageLoadTopBar from '$lib/components/PageLoadTopBar.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import { addNotification } from '$lib/js/notifyStore.js';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { themeChange } from 'theme-change';
	import { version } from '$app/environment';

	export let data = null;
	let appVersion = null;
	let windowWidth = window.innerWidth;

	window.addEventListener('resize', () => {
		windowWidth = window.innerWidth;
	});

	cookieInfo();
	if (!window.location.href.includes('auth')) {
		get('/mig').then(userData => {
			$brugeren = userData;
		});
	}

	onMount(async() => {
		await themeChange(false);

		if (await window.navigator.userAgent.includes('BetterLectio Mobile')) {
			const _version = await fetch(`${api}/app_version`);
			appVersion = await _version.text();
		}
	});

	onNavigate(navigation => {
		if (!document.startViewTransition) return;
		// eslint-disable-next-line consistent-return
		return new Promise(resolve => {
			document.startViewTransition(async() => {
				resolve();
				await navigation.complete;
			});
		});
	});

	$indstillinger = $indstillinger ?? {};
	$indstillinger = {
		...{
			sidebar: false,
			brugHoldOversætter: true,
			opgaver: {
				visFristAbsolut: false,
				visHeleBeskrivelsen: false
			},
			skema: { classesWithDifferentColors: true }
		},
		...$indstillinger
	};
	if (($hold instanceof Array && $hold.length === 0) || !$hold) {
		$hold = [
			{ fag: 'Dansk', forkortelse: 'da' },
			{ fag: 'Matematik', forkortelse: 'ma' },
			{ fag: 'Teknologi', forkortelse: 'ti' },
			{ fag: 'Engelsk', forkortelse: 'en' },
			{ fag: 'Historie', forkortelse: 'hi' },
			{ fag: 'Biologi', forkortelse: 'bi' },
			{ fag: 'Kemi', forkortelse: 'ke' },
			{ fag: 'Fysik', forkortelse: 'fy' },
			{ fag: 'Samfundsfag', forkortelse: '/*  */sa' },
			{ fag: 'komm/it', forkortelse: 'kit' }
		];
	}

	// add a welcoming notification if the user is visting
	// for the first time
	if (localStorage.getItem('firstTime') === null) {
		addNotification('Hej og velkommen, tusind tak fordi at bruge BetterLectio', 'alert-success');
		localStorage.setItem('firstTime', 'false');
	}

</script>

{#if appVersion && appVersion !== version}
	<div class="flex flex-col h-screen justify-center items-center">
		<p class="mb-4 text-xl font-bold">BetterLectio skal opdateres</p>
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-56 fill-current animate-pulse"><path d="M428.033,162.858C422.975,72.232,347.87,0,256,0S89.025,72.232,83.967,162.858c-0.323,3.179-0.489,6.402-0.489,9.663c0,15.543,0,320.162,0,322.783c0,9.22,7.475,16.696,16.696,16.696h111.304c119.87,0,217.043-97.174,217.043-217.043V172.522C428.522,169.261,428.356,166.037,428.033,162.858z M256,33.391c42.163,0,79.93,18.923,105.464,48.641c-8.722-2.662-17.967-4.119-27.551-4.119c-32.296,0-60.834,16.291-77.913,41.06c-17.079-24.77-45.617-41.06-77.913-41.06c-9.584,0-18.829,1.457-27.551,4.119C176.07,52.314,213.837,33.391,256,33.391z M163.169,360.642c-5.842-7.12-16.37-8.174-23.494-2.326c-6.988,5.731-14.635,10.267-22.804,13.595v-97.801c26.505,36.201,66.686,61.636,112.937,68.728c-18.13,49.489-60.64,87.32-112.937,98.783v-34.418h-0.001c16.082-4.569,30.884-12.325,43.979-23.061C167.978,378.293,169.017,367.772,163.169,360.642z M395.13,294.957c0,101.261-82.386,183.652-183.652,183.652H116.87v-2.97c70.214-12.524,126.789-63.872,147.277-131.009c53.767-2.53,101.081-29.682,130.984-70.521V294.957z M256,311.652c-76.718,0-139.13-62.413-139.13-139.13c0-33.75,27.462-61.217,61.217-61.217s61.217,27.468,61.217,61.217c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-33.75,27.462-61.217,61.217-61.217c33.755,0,61.217,27.468,61.217,61.217C395.13,249.239,332.718,311.652,256,311.652z"></path><path d="M301.195,216.369c-3.26-3.26-7.532-4.891-11.804-4.891c-4.272,0-8.544,1.631-11.804,4.892L256,237.956l-21.587-21.588c-6.521-6.521-17.087-6.521-23.609,0c-6.521,6.521-6.521,17.087,0,23.609l33.391,33.391c6.521,6.521,17.087,6.521,23.609,0l33.391-33.391C307.716,233.456,307.716,222.89,301.195,216.369z"></path><path d="M178.087,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261s22.261-9.99,22.261-22.261 S190.364,150.261,178.087,150.261z"></path><path d="M333.913,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261c12.277,0,22.261-9.99,22.261-22.261 S346.19,150.261,333.913,150.261z"></path></svg>
		<a href="https://github.com/BetterLectio/Android/releases/tag/{version}" class="mt-4 btn btn-primary btn-wide">Opdater BetterLectio</a>
		<button on:click={() => {
			appVersion = null;
		}} class="mt-4 btn btn-error btn-wide">Forsæt uden at opdatere<br/>(Ikke anbefaldet)</button>
	</div>
{:else}
	<!-- error modal -->
	<ErrorMsg />
	<!--Log ud pop up-->
	<Notify />
	<input type="checkbox" id="logud-modal" class="modal-toggle" />
	<label for="logud-modal" class="modal cursor-pointer">
		<span class="modal-box relative">
			<h3 class="text-lg font-bold">Er du sikker på at du vil logge ud?</h3>
			<p class="py-4">Du vil blive logget ud af BetterLectio. Når du logger ind igen, skal du indtaste dit lectio brugernavn og kodeord.</p>
			<span class="flex">
				<div class="modal-action">
					<label for="logud-modal" class="btn">Forbliv logget ind</label>
				</div>
				<div class="modal-action ml-2">
					<button
						on:click={() => {
							const schoolId = localStorage.getItem('schoolId');
							const theme = localStorage.getItem('theme');

							localStorage.clear();

							localStorage.setItem('schoolId', schoolId);
							localStorage.setItem('theme', theme);

							window.location.href = '/auth';
						}}
						class="btn-error btn">Log mig ud!</button
					>
				</div>
			</span>
		</span>
	</label>
	<GlobalSearch />

	<PageLoadTopBar />
	{#if $indstillinger?.sidebar && windowWidth > 768}
		<SideBar />
		<div class="md:ml-16">
			<main class="md:w-[calc(100%-32px)] w-[calc(100%-16px)] md:pt-10 mx-2 md:mx-4 2xl:container 2xl:mx-auto 2xl:w-full">
				<PageTransition pathname={data.pathname}>
					<slot />
				</PageTransition>
			</main>
		</div>
	{:else}
		<NavBar>
			<main class="md:w-[calc(100%-32px)] w-[calc(100%-16px)] mx-2 md:mx-4 2xl:container 2xl:mx-auto 2xl:w-full">
				<PageTransition pathname={data.pathname}>
					<slot />
				</PageTransition>
			</main>
		</NavBar>
	{/if}

{/if}
