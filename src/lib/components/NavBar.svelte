<script>
	import Avatar from '$lib/components/Avatar.svelte';
	import ThemeSelect from './theme-select.svelte';
	import { brugeren } from '$lib/js/store.js';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { reloadData } from '$lib/js/http.js';

	let cookie = null;
	cookieInfo().then(data => {
		cookie = data;
	});

	let checked = '';

	function handleClick() {
		checked = checked === 'checked' ? '' : 'checked';
	}

</script>

<div class="drawer h-[calc(100%-4px)]">
	<input id="menu-drawer" type="checkbox" class="drawer-toggle" bind:checked />
	<!-- h-screen - 4px -->
	<div class="drawer-content">
		<div
			class="navbar justify-between relative z-30 mb-10 before:absolute before:bottom-0 before:left-0 before:content-[''] before:h-px before:w-full before:bg-navbar-line"
			in:fly={{ y: -64, duration: 200 }}
		>
			<div class="navbar-start sm:w-fit">
				<p />
				<div class="dropdown">
					<button on:click={handleClick} class="btn-ghost btn desktop:hidden" aria-label="navbar button">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
						><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg
						>
					</button>
				</div>

				<p
					class="btn-ghost btn mx-0 hidden text-xl normal-case sm:flex group"
					on:keypress={() => {
					/* makes error go away*/
					}}
					on:click={() => {
						goto('/forside');
					}}
				>
					<svg
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
						height="30"
						class="mx-0 fill-current p-0 group-hover:rotate-12 duration-200"
					>
						<path
							d="M428.033,162.858C422.975,72.232,347.87,0,256,0S89.025,72.232,83.967,162.858c-0.323,3.179-0.489,6.402-0.489,9.663c0,15.543,0,320.162,0,322.783c0,9.22,7.475,16.696,16.696,16.696h111.304c119.87,0,217.043-97.174,217.043-217.043V172.522C428.522,169.261,428.356,166.037,428.033,162.858z M256,33.391c42.163,0,79.93,18.923,105.464,48.641c-8.722-2.662-17.967-4.119-27.551-4.119c-32.296,0-60.834,16.291-77.913,41.06c-17.079-24.77-45.617-41.06-77.913-41.06c-9.584,0-18.829,1.457-27.551,4.119C176.07,52.314,213.837,33.391,256,33.391z M163.169,360.642c-5.842-7.12-16.37-8.174-23.494-2.326c-6.988,5.731-14.635,10.267-22.804,13.595v-97.801c26.505,36.201,66.686,61.636,112.937,68.728c-18.13,49.489-60.64,87.32-112.937,98.783v-34.418h-0.001c16.082-4.569,30.884-12.325,43.979-23.061C167.978,378.293,169.017,367.772,163.169,360.642z M395.13,294.957c0,101.261-82.386,183.652-183.652,183.652H116.87v-2.97c70.214-12.524,126.789-63.872,147.277-131.009c53.767-2.53,101.081-29.682,130.984-70.521V294.957z M256,311.652c-76.718,0-139.13-62.413-139.13-139.13c0-33.75,27.462-61.217,61.217-61.217s61.217,27.468,61.217,61.217c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-33.75,27.462-61.217,61.217-61.217c33.755,0,61.217,27.468,61.217,61.217C395.13,249.239,332.718,311.652,256,311.652z"
						/>
						<path
							d="M301.195,216.369c-3.26-3.26-7.532-4.891-11.804-4.891c-4.272,0-8.544,1.631-11.804,4.892L256,237.956l-21.587-21.588c-6.521-6.521-17.087-6.521-23.609,0c-6.521,6.521-6.521,17.087,0,23.609l33.391,33.391c6.521,6.521,17.087,6.521,23.609,0l33.391-33.391C307.716,233.456,307.716,222.89,301.195,216.369z"
						/>
						<path
							d="M178.087,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261s22.261-9.99,22.261-22.261 S190.364,150.261,178.087,150.261z"
						/>
						<path
							d="M333.913,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261c12.277,0,22.261-9.99,22.261-22.261 S346.19,150.261,333.913,150.261z"
						/>
					</svg><span class="hidden md:block">BetterLectio</span>
				</p>
			</div>
			<div class="navbar-center hidden desktop:flex">
				<ul class="menu menu-horizontal p-0">
					{#if $brugeren && localStorage.getItem('lectio-cookie')}
						<li><a class="text-sm font-bold hover:scale-110" href="/skema">Skema</a></li>
						<li><a class="text-sm font-bold hover:scale-110" href="/opgaver">Opgaver</a></li>
						<li><a class="text-sm font-bold hover:scale-110" href="/lektier">Lektier</a></li>
						<li><a class="text-sm font-bold hover:scale-110" href="/fravær">Fravær</a></li>
						<li><a class="text-sm font-bold hover:scale-110" href="/dokumenter">Dokumenter</a></li>
						<li><a class="text-sm font-bold hover:scale-110" href="/beskeder">Beskeder</a></li>
						<li><a class="text-sm font-bold hover:scale-110" href="/forms">Spørgeskemaer</a></li>
						<li><a class="text-sm font-bold hover:scale-110" href="/karakterer">Karakterer</a></li>
						<li><a class="text-sm font-bold hover:scale-110" href="/værktøjer">Værktøjer</a></li>
					{:else}
						<li><a class="text-sm font-bold hover:scale-110" href="/">Forside</a></li>
						<li><a class="text-sm font-bold hover:scale-110" href="/help">Hjælp</a></li>
						<li>
							<a class="text-sm font-bold hover:scale-110" href="/tos">Servicevilkår & Privatlivspolitik</a>
						</li>
					{/if}
				</ul>
			</div>
			<div class="navbar-center flex sm:hidden">
				<p
					class="btn-ghost btn mx-0 text-2xl normal-case sm:hidden"
					on:keypress={() => {
					/* makes error go away*/
					}}
					on:click={() => {
						goto('/forside');
					}}
				>
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="40" class="mx-0 fill-current p-0">
						<path
							d="M428.033,162.858C422.975,72.232,347.87,0,256,0S89.025,72.232,83.967,162.858c-0.323,3.179-0.489,6.402-0.489,9.663c0,15.543,0,320.162,0,322.783c0,9.22,7.475,16.696,16.696,16.696h111.304c119.87,0,217.043-97.174,217.043-217.043V172.522C428.522,169.261,428.356,166.037,428.033,162.858z M256,33.391c42.163,0,79.93,18.923,105.464,48.641c-8.722-2.662-17.967-4.119-27.551-4.119c-32.296,0-60.834,16.291-77.913,41.06c-17.079-24.77-45.617-41.06-77.913-41.06c-9.584,0-18.829,1.457-27.551,4.119C176.07,52.314,213.837,33.391,256,33.391z M163.169,360.642c-5.842-7.12-16.37-8.174-23.494-2.326c-6.988,5.731-14.635,10.267-22.804,13.595v-97.801c26.505,36.201,66.686,61.636,112.937,68.728c-18.13,49.489-60.64,87.32-112.937,98.783v-34.418h-0.001c16.082-4.569,30.884-12.325,43.979-23.061C167.978,378.293,169.017,367.772,163.169,360.642z M395.13,294.957c0,101.261-82.386,183.652-183.652,183.652H116.87v-2.97c70.214-12.524,126.789-63.872,147.277-131.009c53.767-2.53,101.081-29.682,130.984-70.521V294.957z M256,311.652c-76.718,0-139.13-62.413-139.13-139.13c0-33.75,27.462-61.217,61.217-61.217s61.217,27.468,61.217,61.217c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-33.75,27.462-61.217,61.217-61.217c33.755,0,61.217,27.468,61.217,61.217C395.13,249.239,332.718,311.652,256,311.652z"
						/>
						<path
							d="M301.195,216.369c-3.26-3.26-7.532-4.891-11.804-4.891c-4.272,0-8.544,1.631-11.804,4.892L256,237.956l-21.587-21.588c-6.521-6.521-17.087-6.521-23.609,0c-6.521,6.521-6.521,17.087,0,23.609l33.391,33.391c6.521,6.521,17.087,6.521,23.609,0l33.391-33.391C307.716,233.456,307.716,222.89,301.195,216.369z"
						/>
						<path
							d="M178.087,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261s22.261-9.99,22.261-22.261 S190.364,150.261,178.087,150.261z"
						/>
						<path
							d="M333.913,150.261c-12.277,0-22.261,9.99-22.261,22.261s9.984,22.261,22.261,22.261c12.277,0,22.261-9.99,22.261-22.261 S346.19,150.261,333.913,150.261z"
						/>
					</svg>
				</p>
			</div>
			<div class="navbar-end sm:w-fit">
				{#if $brugeren && localStorage.getItem('lectio-cookie')}
					<label for="søg-popup" class="btn-ghost btn gap-1 normal-case">
						<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
							<path
								d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
							/>
						</svg><span class="hidden md:inline">Søg</span></label
					>
				{/if}
				<ThemeSelect tabindex="0" />
				{#if $brugeren && localStorage.getItem('lectio-cookie') && cookie}
					<div class="dropdown dropdown-bottom dropdown-end hidden md:block">
						<div tabindex="0" class="btn-ghost btn flex justify-end gap-1 font-normal normal-case">
							<Avatar id={`S${ cookie.userId}`} navn={$brugeren.navn} size="w-10" />
							<svg
								width="12px"
								height="12px"
								class="ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" /></svg
							>
						</div>

						<ul tabindex="0" class="dropdown-content menu rounded-box bg-base-100 p-2 shadow">
							<div class="mt-2 mb-2 ml-4 mr-4">
								<h1 class="flex justify-start whitespace-nowrap text-lg font-bold">
									{$brugeren.navn.split(', ')[0]}
								</h1>
								<p class="flex justify-start">{$brugeren.navn.split(', ')[1]}</p>
							</div>
							<li>
								<a href="/indstillinger">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
										<path
											d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
										/>
										<path
											d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"
										/>
									</svg>
									Indstillinger
								</a>
							</li>
							<li>
								<a href="/discord">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16">
										<path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
									</svg>
									Discord
								</a>
							</li>
							<li>
								<button
									on:click={() => {
										reloadData();
									}}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="mx-0 fill-current p-0" viewBox="0 0 16 16">
										<path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
										<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
									</svg>
									Reload data
								</button>
							</li>
							<li>
								<label for="logud-modal" class="bg-error">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="fill-error-content" viewBox="0 0 16 16">
										<path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2zm1 13h8V2H4v13z" />
										<path d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" />
									</svg>
									<p class="text-error-content">Log ud</p>
								</label>
							</li>
						</ul>
					</div>
				{/if}
			</div>
		</div>

		<slot />

		<!-- Her vil notificationer/alerts blive tilføjet-->
		<div class="fixed bottom-10 right-10 left-10">
			<div class="flex items-center justify-center">
				<div id="alerts" />
			</div>
		</div>
	</div>
	<div class="drawer-side translate-y-16">
		<label for="menu-drawer" class="drawer-overlay -translate-y-16 z-40" />
		<ul
			class="menu w-80 relative z-50 min-h-screen h-fit bg-base-100/80 p-4 text-base-content pb-20 flex flex-col justify-between backdrop-blur-md flex-nowrap"
		>
			{#if $brugeren && localStorage.getItem('lectio-cookie') && cookie}
				<div>
					<span class="md:hidden">
						<Avatar id={`S${ cookie.userId}`} navn={$brugeren.navn} size="w-20 ml-4" />
						<div class="mt-2 mb-2 ml-4 mr-4">
							<h1 class="flex justify-start whitespace-nowrap text-lg font-bold">
								{$brugeren.navn.split(', ')[0]}
							</h1>
							<p class="flex justify-start">{$brugeren.navn.split(', ')[1]}</p>
						</div>
					</span>
					<div class="divider" />
					<div class="overflow-y-scroll">
						<li on:click={handleClick} on:keyup={handleClick}>
							<a href="/skema"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-calendar2-week-fill"
								viewBox="0 0 16 16"
							>
								<path
									d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zm9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5zM8.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM3 10.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"
								/>
							</svg>Skema</a
							>
						</li>
						<li on:click={handleClick} on:keyup={handleClick}>
							<a href="/opgaver"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-list-task"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"
								/>
								<path
									d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z"
								/>
								<path
									fill-rule="evenodd"
									d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"
								/>
							</svg>Opgaver</a
							>
						</li>
						<li on:click={handleClick} on:keyup={handleClick}>
							<a href="/lektier"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-bookmarks-fill"
								viewBox="0 0 16 16"
							>
								<path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5V4z" />
								<path d="M4.268 1A2 2 0 0 1 6 0h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L13 13.768V2a1 1 0 0 0-1-1H4.268z" />
							</svg>Lektier</a
							>
						</li>
						<li on:click={handleClick} on:keyup={handleClick}>
							<a href="/fravær"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-bar-chart-fill"
								viewBox="0 0 16 16"
							>
								<path
									d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z"
								/>
							</svg>Fravær</a
							>
						</li>
						<li on:click={handleClick} on:keyup={handleClick}>
							<a href="/dokumenter"
							><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16">
								<path
									d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"
								/>
							</svg>Dokumenter</a
							>
						</li>
						<li on:click={handleClick} on:keyup={handleClick}>
							<a href="/karakterer"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-mortarboard-fill"
								viewBox="0 0 16 16"
							>
								<path
									d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"
								/>
								<path
									d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"
								/>
							</svg>Karakterer</a
							>
						</li>
						<li on:click={handleClick} on:keyup={handleClick}>
							<a href="/forms"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-chat-left-text-fill"
								viewBox="0 0 16 16"
							>
								<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
							</svg>Spørgeskemaer</a
							>
						</li>
						<li on:click={handleClick} on:keyup={handleClick}>
							<a href="/beskeder"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-chat-left-text-fill"
								viewBox="0 0 16 16"
							>
								<path
									d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"
								/>
							</svg>Beskeder</a
							>
						</li>
						<li on:click={handleClick} on:keyup={handleClick}>
							<a href="/værktøjer"
							><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
								<path
									d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0Zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708ZM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11Z"
								/>
							</svg>Værktøjer</a
							>
						</li>
					</div>
				</div>
				<div>
					<div class="divider" />
					<li on:click={handleClick} on:keyup={handleClick}>
						<a href="/indstillinger">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
								<path
									d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
								/>
								<path
									d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"
								/>
							</svg>
							Indstillinger
						</a>
					</li>
					<li on:click={handleClick} on:keyup={handleClick}>
						<a href="/discord">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16">
								<path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
							</svg>
							Discord
						</a>
					</li>
					<li on:click={handleClick} on:keyup={handleClick}>
						<button
							on:click={() => {
								reloadData();
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="mx-0 fill-current p-0" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
								<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
							</svg>
							Reload data
						</button>
					</li>
					<div class="divider" />
					<li>
						<label for="logud-modal" class="bg-error">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="fill-error-content" viewBox="0 0 16 16">
								<path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2zm1 13h8V2H4v13z" />
								<path d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" />
							</svg>
							<p class="text-error-content">Log ud</p>
						</label>
					</li>
				</div>
			{:else}
				<div>
					<li><a href="/">Forside</a></li>
					<li><a href="/help">Hjælp</a></li>
					<li><a href="/tos">Servicevilkår & Privatlivspolitik</a></li>
					<li><a href="/discord" target="_blank">Discord</a></li>
				</div>
			{/if}
		</ul>
	</div>
</div>
