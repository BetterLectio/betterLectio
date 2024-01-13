<script lang="ts">
	import '../app.css';

	import { Toaster } from '$lib/components/ui/sonner';
	import Navbar from '$lib/customComponents/navbar.svelte';
	import Command from '$lib/customComponents/command.svelte';
	import Banner from '$lib/customComponents/banner.svelte'; //fejlen giver ikke mening lol (den er ikke fatal)

	import { brugeren, banners } from '$lib/js/store';
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
		}
		return false;
	}

	checkIfCredentialsAreSet();
</script>

<Command />
<Navbar />
{#each $banners as banner}
	<Banner to={banner.to} type={banner.type} text={banner.text} />
{/each}
<Toaster />

<div class="w-screen">
	<slot />
</div>
