<script lang="ts">
	import { round } from '$lib/utils';
	import { filter } from 'fuzzy';
	import { ChevronsUpDown, Loader2, LocateIcon, X } from 'lucide-svelte';
	import { Button } from '../button';
	import { toast } from 'svelte-sonner';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as Dialog from '$lib/components/ui/dialog';

	import { LECTIO_OAUTH_API } from '$lib/lectio';
	import Input from '../input/input.svelte';
	import type { ClosestSchool } from '$lib/types/location';
	import { isMediumScreen } from '$lib/utils';

	let open = false;

	export let schools: { [k: string]: number } = {};
	export let value = 0;
	$: valueKey = Object.keys(schools).find((key) => schools[key] === value);

	let searchTerm = '';
	$: filteredSchools = filter(searchTerm, Object.keys(schools), {
		post: '</strong>',
		pre: '<strong>'
	});

	let locating = false;
	let closestSchool: string | null = null;
	const locate = async () => {
		locating = true;
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const resp = await fetch(
					`${LECTIO_OAUTH_API}/locate?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
				);
				if (!resp.ok) {
					toast.error('Kunne ikke finde nærmeste skole.');
					locating = false;
					return;
				}

				const data = await resp.json() as ClosestSchool;
				value = data.id;
				if (data.distance > 1000) closestSchool = `${round(data.distance / 1000, 2)}km`;
				else closestSchool = `${round(data.distance)}m`;
				locating = false;
			},
			(error) => {
				toast.error(error.message);
				locating = false;
			}
		);
	};
</script>

{#if $isMediumScreen}
	<Dialog.Root bind:open>
		<Dialog.Trigger asChild let:builder>
			<Button variant="outline" builders={[builder]}>
				{#if value > 0}{valueKey}{:else}Vælg din skole{/if}
				<ChevronsUpDown class="square-5" />
			</Button>
		</Dialog.Trigger>
		<Dialog.Content class="w-[30rem]">
			<Dialog.Header>
				<Dialog.Title>Vælg Skole</Dialog.Title>
			</Dialog.Header>
			<Input
				placeholder="Søg efter skole"
				class="w-full"
				bind:value={searchTerm}
				on:input={() => {
					open = true;
				}}
			/>
			<ScrollArea
				class="h-[200px] w-[calc(30rem - 3rem)] border-border rounded-lg border-[1px] mb-2"
			>
				<div class="flex flex-col gap-2 p-4">
					{#each filteredSchools as school}
						<Button
							variant="outline"
							class="w-[428px] truncate"
							on:click={() => {
								value = schools[school.original];
								open = false;
							}}
						>
							{@html school.string}
						</Button>
					{/each}
				</div>
			</ScrollArea>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open preventScroll>
		<Drawer.Trigger asChild let:builder>
			<Button variant="outline" builders={[builder]}>
				{#if value > 0}{valueKey}{:else}Vælg din skole{/if}
				<ChevronsUpDown class="square-5" />
			</Button>
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>Vælg Skole</Drawer.Title>
			</Drawer.Header>
			<Input
				placeholder="Søg efter skole"
				class="w-[calc(100%-2rem)] h-12 mx-4 mb-2"
				bind:value={searchTerm}
				on:input={() => {
					open = true;
				}}
			/>
			<ScrollArea
				class="h-[200px] w-[calc(100%-2rem)] border-border rounded-lg border-[1px] mx-4 mb-2"
			>
				<div class="flex flex-col gap-2 p-4">
					{#each filteredSchools as school}
						<Button
							variant="outline"
							class="justify-start max-w-full text-left truncate text-wrap line-clamp-2 h-fit"
							on:click={() => {
								value = schools[school.original];
								open = false;
							}}
						>
							{@html school.string}
						</Button>
					{/each}
				</div>
			</ScrollArea>
			<Drawer.Footer class="pt-2">
				<Drawer.Close asChild let:builder>
					<Button variant="outline" builders={[builder]}>Afbryd</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
