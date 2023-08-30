<script>
	import '../app.css';
	import { brugeren, hold, indstillinger } from '$lib/js/store.js';
	import ErrorMsg from '$lib/components/ErrorMsg.svelte';
	import GlobalSearch from '$lib/components/GlobalSearch.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import Notify from '$lib/components/Notify.svelte';
	import PageLoadTopBar from '$lib/components/PageLoadTopBar.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import { addNotification } from '$lib/js/notifyStore';
	import { cookieInfo } from '$lib/js/LectioCookieHandler';
	import { get } from '$lib/js/http.js';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	export let data = null;

	cookieInfo();
	if (!window.location.href.includes('auth')) {
		get('/mig').then(userData => {
			$brugeren = userData;
		});
	}

	onMount(() => {
		themeChange(false);
	});

	let windowWidth = window.innerWidth;
	function handleResize() {
		windowWidth = window.innerWidth;
	}

	window.addEventListener('resize', handleResize);

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
	if ($hold === [] || !$hold) {
		$hold = [
			{ fag: 'Dansk', forkortelse: 'da' },
			{ fag: 'Matematik', forkortelse: 'ma' },
			{ fag: 'Teknologi', forkortelse: 'ti' },
			{ fag: 'Engelsk', forkortelse: 'en' },
			{ fag: 'Historie', forkortelse: 'hi' },
			{ fag: 'Biologi', forkortelse: 'bi' },
			{ fag: 'Kemi', forkortelse: 'ke' },
			{ fag: 'Fysik', forkortelse: 'fy' },
			{ fag: 'Samfundsfag', forkortelse: 'sa' },
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
						const skoleId = localStorage.getItem('skole_id');
						const theme = localStorage.getItem('theme');

						localStorage.clear();

						localStorage.setItem('skole_id', skoleId);
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
