<script lang="ts">
  import { goto } from '$app/navigation';
  import { Spinner } from '$lib/components';
  import { Assignment } from '$lib/components/lectio';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { ValueSelect } from '$lib/components/ui/select';
  import { Separator } from '$lib/components/ui/separator';
  import * as Table from '$lib/components/ui/table';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { assignmentStore, assignmentsPageSettingsStore } from '$lib/stores';
  import type { RawSimpleAssignment } from '$lib/types/assignments';
  import { relativeTime } from '$lib/utils';
  import { DateTime } from 'luxon';
  import { onMount } from 'svelte';
  import Archive from 'svelte-radix/Archive.svelte';
  import ChatBubble from 'svelte-radix/ChatBubble.svelte';
  import EnvelopeOpen from 'svelte-radix/EnvelopeOpen.svelte';
  import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte';
  import Rocket from 'svelte-radix/Rocket.svelte';
  import fuzzy from 'fuzzy';

  let opgaver = $assignmentStore;
  let filteredOpgaver: RawSimpleAssignment[] = [];
  let originalOpgaver: RawSimpleAssignment[] = [];
  $: if (opgaver) filteredOpgaver = opgaver;
  $: if (status) searchString = '';
  let searchString = '';
  let status = 'Skal Afleveres';

  $: if (searchString) search();

  onMount(async () => {
    await assignmentStore.fetch();
    originalOpgaver = $assignmentStore || [];
    search();
  });

  $: if ($assignmentStore) {
    filteredOpgaver = $assignmentStore?.filter((opgave) => {
      switch (status) {
        case 'Alle':
          return true;
        case 'Skal Afleveres':
          return opgave.status === 'Venter' || opgave.status === 'Mangler';
        case 'Er Afleveret':
          return opgave.status === 'Afleveret' || opgave.status === 'Afsluttet';
      }
    });

    if ($assignmentsPageSettingsStore) {
      // filter to only include assignments that are in the current school year
      // school year is not the same as calendar year
      // each school year starts in august and ends in august the following year
      const now = DateTime.now();
      const currentYear = now.month >= 8 ? now.year : now.year - 1;
      filteredOpgaver = filteredOpgaver.filter((opgave) => {
        const frist = DateTime.fromFormat(opgave.frist, 'd/M-yyyy HH:mm');
        const fristYear = frist.month >= 8 ? frist.year : frist.year - 1;
        return fristYear === currentYear;
      });
    }
  }

  function search() {
    if (!searchString) return;
    console.log('searching for:', searchString);
    status = 'Alle';

    filteredOpgaver = originalOpgaver.filter((opgave: RawSimpleAssignment) => {
      const titleMatch = fuzzy.match(searchString.toLowerCase(), opgave.opgavetitel.toLowerCase());
      const holdMatch = fuzzy.match(searchString.toLowerCase(), opgave.hold.toLowerCase());
      return titleMatch || holdMatch;
    });
  }

  function elevtidNum(elevtid: string) {
    return Number(elevtid.replace(',', '.'));
  }
</script>

<div class="w-full page-container">
  <div class="flex flex-col justify-between gap-4 md:flex-row">
    <div class="flex items-center space-x-2">
      <h1>Opgaver</h1>
      {#if !$assignmentStore}
        <Spinner />
      {/if}
    </div>
    <div class="flex flex-col items-center w-full gap-2 lg:w-fit sm:flex-row">
      {#key status}
        <ValueSelect
          class=""
          bind:value={status}
          items={['Alle', 'Skal Afleveres', 'Er Afleveret']}
        />
      {/key}
      <Input
        type="text"
        class="w-full h-10 lg:w-fit"
        placeholder="Søg efter opgaver..."
        bind:value={searchString}
      />
    </div>
  </div>

  <Table.Root class="overflow-x-auto" containerClass="hidden md:block !mt-4">
    <Table.Header>
      <Table.Row>
        <Table.Head></Table.Head>
        <Table.Head class="sm:table-cell">Elev tid</Table.Head>
        <Table.Head></Table.Head>
        <Table.Head class="sm:table-cell">Hold</Table.Head>
        <Table.Head class="sm:table-cell">Frist</Table.Head>
        <Table.Head class="sm:table-cell">Opgavetitel</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#if filteredOpgaver}
        {#each filteredOpgaver as opgave}
          <Table.Row
            on:click={async () => await goto(`/opgave?id=${opgave.exerciseid}`)}
            class="cursor-pointer select-none"
          >
            <!-- handed in -->
            <div class="flex items-center ml-2 h-9">
              <Tooltip.Root>
                {#if opgave.status === 'Afleveret'}
                  <Tooltip.Trigger>
                    <Rocket class="w-4 h-4 text-green-800 dark:text-green-400" />
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>Afleveret</p>
                  </Tooltip.Content>
                {:else if opgave.status === 'Afsluttet'}
                  <Tooltip.Trigger>
                    <Archive class="w-4 h-4 text-blue-800 dark:text-blue-400" />
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>Afsluttet</p>
                  </Tooltip.Content>
                {:else if opgave.status === 'Venter'}
                  <Tooltip.Trigger>
                    <EnvelopeOpen class="w-4 h-4" />
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>Venter</p>
                  </Tooltip.Content>
                {:else}
                  <Tooltip.Trigger>
                    <ExclamationTriangle class="w-4 h-4 text-red-800 dark:text-red-400" />
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>Mangler</p>
                  </Tooltip.Content>
                {/if}
              </Tooltip.Root>
            </div>
            <Table.Cell class="sm:table-cell">
              <Tooltip.Root>
                {#if elevtidNum(opgave['elev-tid']) >= 10}
                  <Tooltip.Trigger>
                    <Badge class="bg-orange-400">{opgave['elev-tid']}</Badge>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>Opgaven har {opgave['elev-tid']} elev timer</p>
                  </Tooltip.Content>
                {:else if elevtidNum(opgave['elev-tid']) >= 5}
                  <Tooltip.Trigger>
                    <Badge class="text-black bg-yellow-400">{opgave['elev-tid']}</Badge>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>Opgaven har {opgave['elev-tid']} elev timer</p>
                  </Tooltip.Content>
                {:else if elevtidNum(opgave['elev-tid']) > 0}
                  <Tooltip.Trigger>
                    <Badge variant="outline" class="border-green-400">{opgave['elev-tid']}</Badge>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>
                      Opgaven har {opgave['elev-tid']} elev time{elevtidNum(opgave['elev-tid']) ===
                      1
                        ? ''
                        : 'r'}
                    </p>
                  </Tooltip.Content>
                {:else}
                  <Tooltip.Trigger>
                    <Badge variant="outline">{opgave['elev-tid']}</Badge>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>Opgaven har ingen elev timer</p>
                  </Tooltip.Content>
                {/if}
              </Tooltip.Root>
            </Table.Cell>
            <Table.Cell class="sm:table-cell">
              {#if opgave.karakter || opgave.elevnote}
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <ChatBubble class="w-4 h-4" />
                  </Tooltip.Trigger>
                  <Tooltip.Content class="w-52">
                    {#if opgave.karakter}
                      <p>Karakter: {opgave.karakter}</p>
                    {/if}
                    {#if opgave.karakter && opgave.elevnote}
                      <Separator class="my-2" />
                    {/if}
                    {#if opgave.elevnote}
                      <p>Besked: {opgave.elevnote}</p>
                    {/if}
                  </Tooltip.Content>
                </Tooltip.Root>
              {/if}
            </Table.Cell>
            <Table.Cell class="text-nowrap line-clamp-1 sm:table-cell">{opgave.hold}</Table.Cell>
            <Table.Cell class="sm:table-cell text-nowrap">
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <p
                    use:relativeTime={DateTime.fromFormat(
                      opgave.frist,
                      'd/M-yyyy HH:mm'
                    ).toJSDate()}
                  />
                </Tooltip.Trigger>
                <Tooltip.Content>
                  {opgave.frist}
                </Tooltip.Content>
              </Tooltip.Root>
            </Table.Cell>
            <Table.Cell class="text-nowrap line-clamp-1 sm:table-cell"
              >{opgave.opgavetitel}</Table.Cell
            >
          </Table.Row>
        {/each}
      {/if}
    </Table.Body>
  </Table.Root>
  <!-- mobile version here, based on list not table, without tooltips -->
  <div class="flex-col w-full gap-2 max-md:flex md:hidden">
    {#if filteredOpgaver}
      {#each filteredOpgaver as opgave}
        <Assignment assignment={opgave} />
      {/each}
    {/if}
  </div>
</div>
