<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { FancyInput } from '$lib/components/ui/fancyinput';
	import { Label } from '$lib/components/ui/label';
	import { SchoolSelect } from '$lib/components/ui/schoolselect';
	import { authStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { LECTIO_API } from '$lib/lectio';
	import { Spinner } from '$lib/components';

	let schools: { [k: string]: number } = {};
	let school = 0;
	onMount(async () => {
		const tempSchools = (await fetch(`${LECTIO_API}/skoler`).then((res) => res.json())) as {
			id: number;
			skole: string;
		}[];
		schools = {};
		for (const item of tempSchools) {
			schools[item.skole] = +item.id;
		}
	});

	let username = '';
	let password = '';
	let loading = false;

	async function login() {
		loading = true;
		const response = await fetch(`${LECTIO_API}/auth`, {
			headers: {
				adgangskode: password,
				brugernavn: username,
				skoleid: String(school)
			}
		});

		if (response.ok) {
			authStore.update((store) => ({
				...store,
				cookie: response.headers.get('set-lectio-cookie') ?? '',
				school,
				username,
				password
			}));

			loading = false;
			return;
		}

		username = '';
		password = '';
		toast.error('Dit brugernavn, kodeord eller din skole er forkert.');
		loading = false;
	}
</script>

<div class="flex h-full mt-10">
	<div class="page-container !pt-28">
		<div class="md:flex">
			<div class="flex-col justify-between hidden mr-auto md:flex not-prose">
				<div class="xl:space-y-4">
					<div class="inline-flex items-center text-2xl font-semibold leading-8 max-xl:mb-10">
						<img src="/favicon.png" alt="BetterLectio favicon" class="w-8 h-8 mr-2" />
						<h1>BetterLectio</h1>
					</div>
					<div class="flex">
						<svg
							class="min-w-[1.25rem] max-w-[1.25rem] max-h-[1.25rem] mr-2"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							></path>
						</svg>
						<div>
							<h3 class="mb-2 text-xl font-bold leading-4 unstyled">
								Hurtigere overblik af dit skema
							</h3>
							<p class="mb-2 text-zinc-600">
								Unikke farver for hvert hold sikrer, at du kan kende forskel hurtigere.
							</p>
						</div>
					</div>
					<div class="flex">
						<svg
							class="min-w-[1.25rem] max-w-[1.25rem] max-h-[1.25rem] mr-2"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							></path>
						</svg>
						<div>
							<h3 class="mb-2 text-xl font-bold leading-4 unstyled">Se dine opgaver</h3>
							<p class="mb-2 text-zinc-600">
								Få et hurtigt overblik over alle dine kommende opgaver. Filtrér efter, om opgaver
								har fået feedback fra læreren.
							</p>
						</div>
					</div>
					<div class="flex">
						<svg
							class="min-w-[1.25rem] max-w-[1.25rem] max-h-[1.25rem] mr-2"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							></path>
						</svg>
						<div>
							<h3 class="mb-2 text-xl font-bold leading-4 unstyled">Få styr på dit fravær</h3>
							<p class="mb-2 text-zinc-600">
								Visualiser dit fravær med forskellige grafer, eller regn ud, hvor meget fravær du
								kan få, for at blive under en bestemt procent.
							</p>
						</div>
					</div>
					<div class="flex">
						<svg
							class="min-w-[1.25rem] max-w-[1.25rem] max-h-[1.25rem] mr-2"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							></path>
						</svg>
						<div>
							<h3 class="mb-2 text-xl font-bold leading-4 unstyled">Planlæg dine lektier</h3>
							<p class="mb-2 text-zinc-600">Se de næste 14 dages lektier i en oversigt.</p>
						</div>
					</div>
					<div class="flex">
						<svg
							class="min-w-[1.25rem] max-w-[1.25rem] max-h-[1.25rem] mr-2"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							></path>
						</svg>
						<div>
							<h3 class="mb-2 text-xl font-bold leading-4 unstyled">Og meget mere...</h3>
							<p class="mb-2 text-zinc-600">
								Alle essentielle lectio funktioner er understøttet, og du vil også finde nogle nye.
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="flex justify-center">
				<div
					class="inline-flex items-center mb-6 text-2xl font-semibold leading-8 md:hidden not-prose"
				>
					<img src="/favicon.png" alt="BetterLectio favicon" class="w-8 h-8 mr-2" />
					<h1>BetterLectio</h1>
				</div>
			</div>
			<Card class="md:w-full xl:w-[40rem] md:ml-10">
				<CardHeader>
					<CardTitle class="mb-0 text-xl">Velkommen</CardTitle>
					<CardDescription>Log ind med din Lectio konto her.</CardDescription>
				</CardHeader>
				<CardContent class="grid gap-4">
					<div class="grid gap-2">
						<Label for="username">Brugernavn</Label>
						<FancyInput autocomplete="username" bind:value={username} id="username" type="text" />
					</div>
					<div class="grid gap-2">
						<Label for="password">Kodeord</Label>
						<FancyInput
							autocomplete="current-password"
							bind:value={password}
							id="password"
							type="password"
						/>
					</div>
					<div class="grid gap-2">
						<Label for="school">Skole</Label>
						<SchoolSelect bind:value={school} {schools} />
					</div>
				</CardContent>
				<CardFooter>
					<Button
						class="w-full"
						disabled={loading || !username || !password || !school}
						on:click={login}
					>
						{#if loading}
							<Spinner class="mr-2" />
						{/if}
						Log ind
					</Button>
				</CardFooter>
			</Card>
		</div>
	</div>
</div>
