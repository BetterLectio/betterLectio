<script lang="ts">
  import { page } from '$app/stores';
  import { NewTabLink } from '$lib/components/links';
  import { Button } from '$lib/components/ui/button';
  import { Separator } from '$lib/components/ui/separator';
  import { TextTooltip } from '$lib/components/ui/tooltip/';
  import * as Table from '$lib/components/ui/table';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import ChevronRight from 'lucide-svelte/icons/chevron-right';
  import ChevronsLeft from 'lucide-svelte/icons/chevrons-left';
  import ChevronsRight from 'lucide-svelte/icons/chevrons-right';
  import { authStore } from '$lib/stores';
  import type { RawModule } from '$lib/types/module';
  import { get } from '$lib/utils/http.js';
  import { onMount } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import { getSurroundingLessons } from '$lib/utils/lessons';
  import { goto } from '$app/navigation';

  const absid = $page.url.searchParams.get('absid');

  let modul: RawModule | null = null;
  let items = {};
  let surroundingLessons: ReturnType<typeof getSurroundingLessons> = {
    previous: null,
    next: null,
    previousClass: null,
    nextClass: null
  };

  onMount(async () => {
    modul = await get(`/modul?absid=${absid}`);
    if (!modul) return;

    items = {
      Tidspunkt: modul?.aktivitet?.tidspunkt,
      Lokale: modul?.aktivitet?.lokale,
      Lærer: modul?.aktivitet?.lærer
    };
    surroundingLessons = getSurroundingLessons(modul?.aktivitet);
  });
</script>

<div class="page-container">
  <div class="flex justify-between">
    {#if modul}
      <h1>{modul.aktivitet.navn ? modul.aktivitet.navn : modul.aktivitet.hold}</h1>
    {:else}
      <h1>Loading...</h1>
    {/if}
    <div class="items-center gap-2 flex">
      <TextTooltip text="Forrige hold">
        <Button on:click={()=> goto(`/modul?absid=${surroundingLessons.previousClass?.absid}`)} size="icon"
                variant="ghost" disabled={!surroundingLessons.previousClass}>
          <ChevronsLeft />
        </Button>
      </TextTooltip>
      <TextTooltip text="Forrige modul">
        <Button on:click={()=> goto(`/modul?absid=${surroundingLessons.previous?.absid}`)} size="icon" variant="ghost"
                disabled={!surroundingLessons.previous}>
          <ChevronLeft />
        </Button>
      </TextTooltip>
      <TextTooltip text="Næste modul">
        <Button on:click={()=> goto(`/modul?absid=${surroundingLessons.next?.absid}`)} size="icon" variant="ghost"
                disabled={!surroundingLessons.next}>
          <ChevronRight />
        </Button>
      </TextTooltip>
      <TextTooltip text="Næste hold">
        <Button on:click={()=> goto(`/modul?absid=${surroundingLessons.nextClass?.absid}`)} size="icon" variant="ghost"
                disabled={!surroundingLessons.nextClass}>
          <ChevronsRight />
        </Button>
      </TextTooltip>
      {#if modul}
        <Button
          variant="outline"
          href={`https://www.lectio.dk/lectio/${$authStore.school}/aktivitet/aktivitetforside2.aspx?absid=${absid}&lectab=elevindhold`}
          target="_blank">Åben Elevfeedback
        </Button
        >
      {:else}
        <Button variant="outline" disabled={true}>Åben Elevfeedback</Button>
      {/if}
    </div>
  </div>
  <Table.Root>
    <Table.Header>
      <Table.Row>
        {#each Object.entries(items) as [key, value]}
          {#if key && value}
            <Table.Head>{key}</Table.Head>
          {/if}
        {/each}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        {#each Object.entries(items) as [key, value]}
          {#if key && value}
            <Table.Cell>{value}</Table.Cell>
          {/if}
        {/each}
      </Table.Row>
    </Table.Body>
  </Table.Root>

  <Separator class="my-4" />

  {#if modul}
    {#if modul.note}
      <section>
        <h2 class="!mb-0">Note</h2>
        <SvelteMarkdown source={modul.note} renderers={{ link: NewTabLink }} />
      </section>
    {/if}
    {#if modul.lektier}
      <section>
        <h2 class="!mb-0">Lektier</h2>
        <SvelteMarkdown
          source={modul.lektier.replaceAll('\n', '<br>')}
          renderers={{ link: NewTabLink }}
        />
      </section>
    {/if}
    {#if modul.øvrigtIndhold}
      <section>
        <h2 class="!mb-0">Øvrigt Indhold</h2>
        <SvelteMarkdown
          source={modul.øvrigtIndhold.replaceAll(')', ')<br>')}
          renderers={{ link: NewTabLink }}
        />
      </section>
    {/if}
    {#if modul.præsentation}
      <section>
        <h2 class="!mb-0">Præsentation</h2>
        <SvelteMarkdown source={modul.præsentation} renderers={{ link: NewTabLink }} />
      </section>
    {/if}
  {/if}
</div>
