<script>
	import { brugeren, forside, indstillinger, lektier, nyheder } from '$lib/js/store.js';
	import Avatar from '$lib/components/Avatar.svelte';
	import MarkdownIt from 'markdown-it';
	import StandaloneModul from '$lib/components/StandaloneModul.svelte';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { get } from '$lib/js/http.js';
	import purifier from 'dompurify';
	import { seperateModulesByDays } from '$lib/js/LectioUtils.js';

	const { sanitize } = purifier();

	const md = new MarkdownIt();

	get('/mig').then(data => {
		$brugeren = data;
	});

	get('/forside').then(data => {
		$forside = data;
	});

	get('/lektier').then(data => {
		$lektier = data;
	});

	let cookie = null;
	cookieInfo().then(data => {
		cookie = data;
	});

	fetch('https://raw.githubusercontent.com/BetterLectio/news/main/news.json')
		.then(response => response.json())
		.then(data => {
			$nyheder = data.news;
		});

	function getGreeting() {
		const alldayGreetings = ['Velkommen tilbage', 'Hejsa', 'Velkommen'];
		const morningGreetings = ["Go' morgen", 'Godmorgen'];
		const afternoonGreetings = ['God eftermiddag'];
		const eveningGreetings = ['Tak for i dag', 'Godnat', 'Sov godt'];
		let chosenGreeting = '';

		// Get the current time
		const currentTime = new Date().getHours();
		if (Math.random() > 0.5) {
			if (currentTime >= 5 && currentTime < 12) chosenGreeting = morningGreetings[Math.floor(Math.random() * morningGreetings.length)];
			else if (currentTime >= 12 && currentTime < 17) chosenGreeting = afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)];
			else chosenGreeting = eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)];
		} else {
			chosenGreeting = alldayGreetings[Math.floor(Math.random() * alldayGreetings.length)];
		}
		return chosenGreeting;
	}
</script>

<body>
	<!-- greeting -->

	{#if $brugeren && localStorage.getItem('lectio-cookie') && cookie}
		<div class="flex justify-start">
			<div class="flex flex-row">
				<div class="hidden md:inline-block">
					<Avatar id={`S${ cookie.userId}`} navn={$brugeren.navn} size="w-20" />
				</div>
				<div class="flex flex-col align-top mx-4">
					<h1 class="text-3xl font-bold line-clamp-1">
						{#if $brugeren}
							{$brugeren.navn}
						{/if}
					</h1>
					{getGreeting()}
				</div>
			</div>
			<!--
			<div class="flex flex-rox">
				<div class="bg-base-200 m-1 p-2 rounded-xl flex justify-center items-center aspect-square">Skema</div>
			</div>
			-->
		</div>
		<div class="divider" />
	{/if}

	<!-- main content -->
	<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
		<ul class="list p-4 shadow-lg md:col-span-2 xl:row-span-4">
			<h2 class="mb-4 text-2xl font-bold">Aktuelt</h2>
			{#if $forside}
				{#each $forside.aktuelt as aktuelt}
					{#if aktuelt.punkt_farve === 'rød'}
						<li class="element border-l-4 !rounded-l-none border-l-red-400">
							<div class="">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html sanitize(md.render(aktuelt.text.replaceAll('\n', '  \n'))).replaceAll('<a',
									'<a  class="btn btn-xs btn-primary" target="_blank"')}
							</div>
						</li>
					{:else if aktuelt.punkt_farve === 'gul'}
						<li class="element border-l-4 !rounded-l-none border-l-yellow-300">
							<div class="">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html sanitize(md.render(aktuelt.text.replaceAll('\n', '  \n'))).replaceAll('<a',
									'<a   class="btn btn-xs btn-primary" target="_blank"')}
							</div>
						</li>
					{:else if aktuelt.punkt_farve === 'grå'}
						<li class="element">
							<div class="">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html sanitize(md.render(aktuelt.text.replaceAll('\n', '  \n'))).replaceAll('<a',
									'<a   class="btn btn-xs btn-primary" target="_blank"')}
							</div>
						</li>
					{:else}
						<li class="element border-l-4 !rounded-l-none border-l-green-400">
							<div class="">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html sanitize(md.render(aktuelt.text.replaceAll('\n', '  \n'))).replaceAll('<a',
									'<a   class="btn btn-xs btn-primary" target="_blank"')}
							</div>
						</li>
					{/if}
				{/each}
			{/if}
			{#if $forside?.eksamener?.length}
				<div class="flex flex-row">
					<h2 class="mb-4 text-2xl font-bold">Eksamener</h2>
					<a href="/værktøjer/eksamener" class="btn btn-primary ml-auto">Se alle</a>
				</div>
				{#each $forside?.eksamener as eksamen}
					<a href={eksamen.link} target="_blank">
						<li class="element border-l-0 border-primary transition-all duration-100 hover:border-l-4 hover:rounded-l-none">
							<span class="text-xl font-bold">{eksamen.navn}</span>
							<p>Tryk for at se på lectio.</p>
						</li>
					</a>
				{/each}
			{/if}
		</ul>
		<ul class="list max-h-96">
			<h2 class="mb-4 text-2xl font-bold">Kommende moduler</h2>
			{#if $forside?.skema.length > 0}
				{#each [...seperateModulesByDays($forside.skema)] as [date, moduler]}
					<div class="element">
						<h2 class="mb-4 text-xl font-bold capitalize">{date}</h2>
						{#each moduler as modul}
							<StandaloneModul modul={modul} renderWithColor={$indstillinger.skema.classesWithDifferentColors}></StandaloneModul>
						{/each}
					</div>
				{/each}
			{:else}
				<p class="mb-4">Ingen kommende moduler</p>
			{/if}
		</ul>
		<div class="list max-h-96">
			<h2 class="mb-4 text-2xl font-bold">Ulæste beskeder</h2>
			{#if $forside?.kommunikation.beskeder.length > 0}
				{#each $forside.kommunikation.beskeder as besked}
					<a href="/besked?id={besked.id}">
						<div class="element border-l-0 border-primary transition-all duration-100 hover:border-l-4 hover:rounded-l-none">
							<p class="text-xl font-bold">{besked.navn}</p>
							<p class="text-sm">{besked.afsender}</p>
							<p class="text-xs">{besked.dato}</p>
						</div>
					</a>
				{/each}
			{:else}
				<p class="mb-4">Ingen ulæste beskeder</p>
			{/if}
		</div>
		<ul class="list max-h-96">
			<h2 class="mb-4 text-2xl font-bold">Lektier</h2>
			{#if $lektier?.length > 0}
				{#each $lektier as lektie}
					<a href="/modul?absid={lektie.aktivitet.absid}">
						<li class="element border-l-0 border-primary transition-all duration-100 hover:border-l-4 hover:rounded-l-none">
							<p class="text-xl font-bold">
								<span class="font-bold">{lektie.aktivitet.navn ? `${lektie.aktivitet.navn } · ` : ''}{lektie.aktivitet.hold}</span>
								({lektie.aktivitet.tidspunkt})
							</p>
							<p>{lektie.lektier.beskrivelse}</p>
						</li>
					</a>
				{/each}
			{:else}
				<p class="mb-4">Ingen lektier</p>
			{/if}
		</ul>
		<ul class="list max-h-96">
			<h2 class="mb-4 text-2xl font-bold">Nyheder</h2>
			{#if $nyheder}
				{#each $nyheder as newsItem}
					<li class="element">
						<h3 class="text-xl font-bold">{newsItem.title}</h3>
						<p class="text-sm">{newsItem.date}</p>
						<p>{newsItem.body}</p>
						<!--if the newsItem has a link then use it-->
						{#if newsItem.link}
							<a href={newsItem.link} target="_blank" rel="noreferrer" class="btn-primary btn-sm btn mt-2">{newsItem.linkText}</a>
						{/if}
					</li>
				{/each}
			{:else}
				<p class="mb-4">Ingen nyheder</p>
			{/if}
		</ul>
	</div>
</body>
