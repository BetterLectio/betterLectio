<script lang="ts">
	import '../app.css';

	import { Toaster } from '$lib/components/ui/sonner';
	import Navbar from '$lib/customComponents/navbar.svelte';
	import Command from '$lib/customComponents/command.svelte';
	import Banner from '$lib/customComponents/banner.svelte'; //fejlen giver ikke mening lol (den er ikke fatal)
	import Spinner from '$lib/customComponents/spinner.svelte';
	import { brugeren, banners, isAuthed } from '$lib/js/store';
	import { navigating } from '$app/stores';
	$banners = [];

	//check if credentials are set, if not add a banner
	function checkIfCredentialsAreSet() {
		const credentials = localStorage.getItem('credentials');
		console.log(credentials);
		if (credentials === null) {
			$banners = [
				...$banners,
				{
					text: 'BetterLectio mangler dine login oplysninger',
					type: 'fatalFixable',
					to: '/indstillinger'
				}
			];
			return true;
		} else {
			//filter out the banner
			$banners = $banners.filter(
				(banner: any) => banner.text !== 'BetterLectio mangler dine login oplysninger'
			);
		}
		return false;
	}

	async function checkCookie() {
		let cookie = localStorage.getItem('lectio-cookie');
		let res = await fetch('https://api.betterlectio.dk/check-cookie', {
			headers: {
				'lectio-cookie': cookie
			}
		});
		let data = await res.json();
		console.log(data);
		// data = {valid: true}
		console.log(data.valid);
		if (!data.valid) {
			//cookie is invalid
			//remove cookie
			localStorage.removeItem('lectio-cookie');
			return false;
		}
		return true;
	}

	async function login() {
		let credentials = JSON.parse(localStorage.getItem('credentials') as string);
		await fetch(`https://api.betterlectio.dk/auth`, {
			headers: {
				brugernavn: credentials.username,
				adgangskode: credentials.password,
				skoleid: credentials.schoolId.toString()
			}
		})
			.then((res) => {
				console.log(res.headers.get('Set-Lectio-Cookie'));
				let cookie = res.headers.get('Set-Lectio-Cookie');
				if (cookie === null) return;
				localStorage.setItem('lectio-cookie', cookie);
				$isAuthed = true;
				document.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}
</script>

<Command />
<Navbar />
{#each $banners as banner}
	<Banner to={banner.to} type={banner.type} text={banner.text} />
{/each}
<Toaster />

{#if $navigating}
	<div class="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2">
		<Spinner />
	</div>
{:else}
	{#await checkCookie()}
		<div class="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2">
			<Spinner />
		</div>
	{:then value}
		{#if value}
			<div class="w-screen">
				<slot />
			</div>
		{:else}
			<div class="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2" use:login>
				<Spinner />
			</div>
		{/if}
	{:catch error}
		<div class="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2">
			<p>Fejl</p>
			<p>
				{error.message}
			</p>
		</div>
	{/await}
{/if}
