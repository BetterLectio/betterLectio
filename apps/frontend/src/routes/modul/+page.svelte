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
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { authStore } from '$lib/stores';
  import type { RawModule } from '$lib/types/module';
  import { get } from '$lib/utils/http.js';
  import { onMount } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import { getSurroundingLessons } from '$lib/utils/lessons';
  import { goto } from '$app/navigation';
  import { Card } from '$lib/components/ui/card';
  import { cn } from '$lib/utils';

  const absid = $page.url.searchParams.get('absid');

  let modul: RawModule | null = null;
  let surroundingLessons: ReturnType<typeof getSurroundingLessons> = {
    previous: null,
    next: null,
    previousLesson: null,
    nextLesson: null
  };

  onMount(async () => {
    modul = await get(`/modul?absid=${absid}`);
    if (!modul) return;

    surroundingLessons = getSurroundingLessons(modul?.aktivitet);
  });
</script>

<div class="page-container">
  {#if modul}
    {#if modul.forløb}
      <span class="text-sm text-muted-foreground">{modul.forløb}</span>
    {/if}
    <div class="!mt-0 flex flex-col md:flex-row md:justify-between">
      <h1 class="max-md:text-2xl truncate">{modul.aktivitet.navn ? modul.aktivitet.navn : modul.aktivitet.hold}</h1>
      <div class="hidden md:flex items-center gap-2">
        <TextTooltip text="Forrige hold">
          <Button on:click={()=> goto(`/modul?absid=${surroundingLessons.previousLesson?.absid}`)} size="icon"
                  variant="ghost" disabled={!surroundingLessons.previousLesson}>
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
          <Button on:click={()=> goto(`/modul?absid=${surroundingLessons.nextLesson?.absid}`)} size="icon"
                  variant="ghost"
                  disabled={!surroundingLessons.nextLesson}>
            <ChevronsRight />
          </Button>
        </TextTooltip>
        <Button
          href={`https://www.lectio.dk/lectio/${$authStore.school}/aktivitet/aktivitetforside2.aspx?absid=${absid}&lectab=elevindhold`}
          target="_blank"
          variant="outline">Åben Elevfeedback
        </Button>
      </div>
    </div>

    <Separator class="hidden md:block my-4" />

    <div class="flex flex-col-reverse max-md:!mt-0 md:grid md:grid-cols-[1fr_minmax(auto,_33%)] gap-4">
      <div>
        {#if modul.note}
          <section class="mb-8">
            <h2 class="!my-0">Note</h2>
            <SvelteMarkdown source={modul.note} renderers={{ link: NewTabLink }} />
          </section>
        {/if}
        {#if modul.lektier}
          <section class="mb-8">
            <h2 class="!my-0">Lektier</h2>
            <SvelteMarkdown
              source={modul.lektier.replaceAll('\n', '<br>')}
              renderers={{ link: NewTabLink }}
            />
          </section>
        {/if}
        {#if modul.øvrigtIndhold}
          <section class="mb-8">
            <h2 class="!my-0">Øvrigt Indhold</h2>
            <SvelteMarkdown
              source={modul.øvrigtIndhold.replaceAll(')', ')<br>')}
              renderers={{ link: NewTabLink }}
            />
          </section>
        {/if}
        {#if modul.præsentation}
          <section class="mb-8">
            <h2 class="!my-0">Præsentation</h2>
            <SvelteMarkdown source={modul.præsentation} renderers={{ link: NewTabLink }} />
          </section>
        {/if}
      </div>
      <div>
        <Card class="max-md:!my-6 p-4 space-y-2" level="1">
          {#if modul.aktivitet.hold}
            <div>
              <span class="text-sm font-medium text-muted-foreground">Hold</span>
              <p>{modul.aktivitet.hold}</p>
            </div>
          {/if}
          {#if modul.aktivitet.lærer}
            <div>
              <span
                class="text-sm font-medium text-muted-foreground">Lærer{modul.aktivitet.lærer.includes(",") ? "e" : ""}</span>
              <p>{modul.aktivitet.lærer}</p>
            </div>
          {/if}
          {#if modul.aktivitet.lokale}
            <div>
              <span class="text-sm font-medium text-muted-foreground">Lokale</span>
              <p>{modul.aktivitet.lokale}</p>
            </div>
          {/if}
          {#if modul.aktivitet.tidspunkt}
            <div>
              <span class="text-sm font-medium text-muted-foreground">Tidspunkt</span>
              <p>{modul.aktivitet.tidspunkt}</p>
            </div>
          {/if}
        </Card>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 right-0 sm:left-[72px] flex justify-evenly py-2 md:hidden">
      <a class={cn("flex flex-col p-2 unstyled", {"opacity-50": !surroundingLessons.previousLesson})}
         href={surroundingLessons.previousLesson ? `/modul?absid=${surroundingLessons.previousLesson?.absid}` : null}>
        <ChevronsLeft class="size-8" />
        <span class="text-xs">Hold</span>
      </a>
      <a class={cn("flex flex-col p-2 unstyled", {"opacity-50": !surroundingLessons.previous})}
         href={surroundingLessons.previous ? `/modul?absid=${surroundingLessons.previous?.absid}` : null}>
        <ChevronLeft class="size-8" />
        <span class="text-xs">Modul</span>
      </a>
      <a class={cn("flex flex-col p-2 unstyled", {"opacity-50": !surroundingLessons.next})}
         href={surroundingLessons.next ? `/modul?absid=${surroundingLessons.next?.absid}` : null}>
        <ChevronRight class="size-8" />
        <span class="text-xs">Modul</span>
      </a>
      <a class={cn("flex flex-col p-2 unstyled", {"opacity-50": !surroundingLessons.nextLesson})}
         href={surroundingLessons.nextLesson ? `/modul?absid=${surroundingLessons.nextLesson?.absid}` : null}>
        <ChevronsRight class="size-8" />
        <span class="text-xs">Hold</span>
      </a>
    </div>
  {:else}
    <div class="flex items-center justify-center h-full">
      <LoaderCircle size="24" class="animate-spin" />
    </div>
  {/if}
</div>
