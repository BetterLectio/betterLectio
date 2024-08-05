<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover';
	import * as Sheet from '$lib/components/ui/sheet';
	import { LECTIO_API } from '$lib/lectio';
	import { authStore } from '$lib/stores';
	import { get } from '$lib/utils/http';
	import { tick } from 'svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import Check from 'svelte-radix/Check.svelte';

	type skole = {
		id: number;
		skole: string;
	};

	let skoler: skole[] = [];
	get('/skoler').then((res) => {
		console.log(res);
		skoler = res;
	});

	let open = false;

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	let cookie: string | null = null;

	let value: number;
	let username = '';
	let password = '';

	function setValues() {
		//if credentials are set, set the values to the credentials
		if (
			$authStore.username !== null &&
			$authStore.password !== null &&
			$authStore.school !== null
		) {
			username = $authStore.username;
			password = $authStore.password;
			value = $authStore.school;
		}
	}
	setValues();

	$: selectedSchool = skoler.find((skole) => skole.id === value)?.skole ?? 'Vælg skole';
	async function login() {
		const res = await fetch(`${LECTIO_API}/auth`, {
			headers: {
				brugernavn: username,
				adgangskode: password,
				skoleid: value.toString()
			}
		});
		cookie = res.headers.get('Set-Lectio-Cookie');
		if (cookie === null) return;
		authStore.update((store) => ({
			...store,
			cookie,
			school: value,
			username,
			password
		}));
		document.location.reload();
	}
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} on:click={setValues} variant="default">Rediger konto</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Rediger din Lectio konto</Sheet.Title>
			<Sheet.Description>
				Fortag ændringer til din Lectio konto her, når du er færdig tryk på "Gem ændringer"
			</Sheet.Description>
		</Sheet.Header>
		<div class="grid gap-4 py-4">
			<div class="grid items-center grid-cols-4 gap-4">
				<Label for="Brugernavn" class="text-right">Brugernavn</Label>
				<Input
					id="username-field"
					bind:value={username}
					class="col-span-3"
					autocomplete="true"
					type="text"
				/>
			</div>
			<div class="grid items-center grid-cols-4 gap-4">
				<Label for="Kodeord" class="text-right">Kodeord</Label>
				<Input
					id="current-password-field"
					bind:value={password}
					class="col-span-3"
					autocomplete="current-password"
					type="password"
				/>
			</div>
			<div class="grid items-center grid-cols-4 gap-4">
				<Label for="skole" class="text-right">Skole</Label>
				<Popover.Root bind:open let:ids>
					<Popover.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="outline"
							role="combobox"
							aria-expanded={open}
							class="justify-between col-span-3"
						>
							<p class="text-left truncate w-44 line-clamp-1">
								{selectedSchool}
							</p>
							<CaretSort class="w-4 h-4 ml-2 opacity-50 shrink-0" />
						</Button>
					</Popover.Trigger>
					<Popover.Content class="p-0">
						<Command.Root>
							<Command.Input placeholder="Søg efter skole..." class="h-9" />
							<Command.Empty>No framework found.</Command.Empty>
							<Command.Group class="overflow-y-scroll h-60">
								{#each skoler as skole}
									<Command.Item
										value={skole.skole}
										onSelect={() => {
											value = skole.id;
											closeAndFocusTrigger(ids.trigger);
										}}
									>
										<Check class="mr-2 h-4 w-4 {value !== skole.id && 'text-transparent'}" />
										<p class="truncate w-52 line-clamp-1">
											{skole.skole}
										</p>
									</Command.Item>
								{/each}
							</Command.Group>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
		</div>

		<Sheet.Footer>
			<Sheet.Close asChild let:builder>
				<Button builders={[builder]} on:click={login} type="submit">Gem ændringer</Button>
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
