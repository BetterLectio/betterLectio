<script lang="ts">
  import { Spinner } from '$lib/components';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Card } from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';
  import { frontPageStore, screenSizeStore } from '$lib/stores';
  import type { Lesson } from '$lib/types/lesson';
  import { cn, constructInterval, isLargeScreen, isSmallScreen, relativeTime, toTitleCase } from '$lib/utils';
  import ArrowRight from 'lucide-svelte/icons/arrow-right';
  import Clock from 'lucide-svelte/icons/clock';
  import DoorOpen from 'lucide-svelte/icons/door-open';
  import { goto } from '$app/navigation';
  import { DateTime, Interval } from 'luxon';
  import { onMount } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import { NewTabLink } from '$lib/components/links';
  import { calculateRemainingHeight } from '$lib/utils/size';
  import { SectionHeader } from './(components)';

  onMount(async () => {
    await frontPageStore.fetch();
  });

  $: nextClass =
    $frontPageStore && $frontPageStore.lessons && $frontPageStore.lessons.length > 0
      ? {
        ...$frontPageStore.lessons[0],
        interval: constructInterval($frontPageStore.lessons[0].date)
      }
      : null;
  $: nextClassLoading = !$frontPageStore || !$frontPageStore.lessons;
  $: classes = $frontPageStore
    ? $frontPageStore?.lessons.reduce<
      { name: string; lessons: (Lesson & { interval: Interval })[] }[]
    >((acc, lesson) => {
      const interval = constructInterval(lesson.date);
      const dayName = interval.start?.hasSame(DateTime.now(), 'day')
        ? 'I dag'
        : interval.start?.hasSame(DateTime.now().plus({ days: 1 }), 'day')
          ? 'I morgen'
          : toTitleCase(interval.start?.toFormat('EEEE d/M') ?? 'N/A');
      if (acc.find((day) => day.name === dayName))
        acc[acc.findIndex((day) => day.name === dayName)].lessons.push({ ...lesson, interval });
      else acc.push({ name: dayName, lessons: [{ ...lesson, interval }] });
      return acc;
    }, [])
    : null;
  $: assignments = $frontPageStore
    ? $frontPageStore.assignments.map((assignment) => {
      return {
        ...assignment,
        date: DateTime.fromFormat(assignment.date, 'd/M-yyyy HH:mm', {
          locale: 'da'
        })
      };
    })
    : null;
  $: messages = $frontPageStore
    ? $frontPageStore.messages.map((message) => {
      return {
        ...message,
        date: DateTime.fromFormat(message.date, 'd/M-yyyy HH:mm', {
          locale: 'da'
        })
      };
    })
    : null;
  $: news = $frontPageStore ? $frontPageStore.news : null;

  let container: HTMLDivElement;
  $: if (container) {
    const height = $screenSizeStore.height;
    container.style.height = $isLargeScreen ? `${calculateRemainingHeight(container, height)}px` : 'unset';
  }
</script>

<div bind:this={container} class="page-container">
  <div class="h-full grid grid-cols-1 lg:grid-cols-3 grid-rows-[minmax(0,1fr)] gap-4 lg:overflow-hidden">
    <div class="flex flex-col gap-4">
      <a
        class="unstyled"
        href={nextClass ? (nextClass.id?.startsWith('PH') ? `/eksamen?id=${nextClass.id.substring(2)}&navn=${$frontPageStore?.name}` : `/modul?absid=${nextClass.id}`) : ''}
      >
        <Card class={cn("p-2 overflow-auto border-2", {"shrink-0": !nextClass})}>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium unstyled">Næste Modul</h2>
            {#if nextClassLoading}
              <Spinner />
            {:else if nextClass && nextClass.room}
              <Badge>{nextClass.room}</Badge>
            {/if}
          </div>
          {#if nextClass}
            <div class="flex flex-col mt-1">
              <p>{nextClass.class}</p>
              {#if nextClass.name}
                <p>{nextClass.name}</p>
              {/if}
              <p class="mt-1 text-sm text-muted-foreground">
                begynder {nextClass.interval.start?.toRelative()}
              </p>
            </div>
          {:else if !nextClassLoading}
            <p class="text-sm text-muted-foreground">Ingen kommende moduler.</p>
          {/if}
        </Card>
      </a>
      <Card class={cn("p-2 overflow-auto border-2", {"shrink-0": !assignments || !assignments.length})}>
        <SectionHeader label="Opgaver" link="/opgaver" loading={!assignments} />
        {#if assignments}
          {#if assignments.length > 0}
            <div class="space-y-2 mt-1">
              {#each assignments as assignment}
                <a
                  href={`/opgave?id=${assignment.id}`}
                  class="flex flex-col p-3 border rounded-md shadow dark:bg-dark-2 bg-card unstyled"
                >
                  <p class="overflow-hidden whitespace-nowrap text-ellipsis">{assignment.name}</p>
                  <p
                    use:relativeTime={assignment.date.toJSDate()}
                    class="text-sm text-muted-foreground"
                  />
                </a>
              {/each}
            </div>
          {:else}
            <p class="text-sm text-muted-foreground">Ingen kommende opgaver.</p>
          {/if}
        {/if}
      </Card>
      <Card class={cn("p-2 overflow-auto border-2", {"shrink-0": !messages || !messages.length})}>
        <SectionHeader label="Beskeder" link="/beskeder" loading={!messages} />
        {#if messages}
          {#if messages.length > 0}
            <div class="space-y-2 mt-1">
              {#each messages as message}
                <a
                  href={`/beskeder?id=${message.id}`}
                  class="flex flex-col p-3 border rounded-md shadow dark:bg-dark-2 bg-card unstyled"
                >
                  <p class="overflow-hidden whitespace-nowrap text-ellipsis">{message.title}</p>
                  <p
                    class="overflow-hidden text-sm text-muted-foreground whitespace-nowrap text-ellipsis"
                  >
                    {message.sender}
                  </p>
                </a>
              {/each}
            </div>
          {:else}
            <p class="text-sm text-muted-foreground">Ingen ulæste beskeder.</p>
          {/if}
        {/if}
      </Card>
    </div>
    <div class="flex flex-col gap-4 lg:col-span-2">
      <Card class={cn("p-2 overflow-auto border-2", {"shrink-0": !classes || !classes.length})}>
        <SectionHeader label="Skema" link="/skema" loading={!classes} />
        {#if classes}
          {#if classes.length > 0}
            <div class="space-y-2">
              {#each classes as day}
                <h3 class="text-sm font-medium leading-7 unstyled">{day.name}</h3>
                {#each day.lessons as lesson}
                  {@const url = lesson.id ? lesson.id.startsWith("PH") ? `/eksamen?id=${lesson.id.substring(2)}&navn=${$frontPageStore?.name}` : `/modul?absid=${lesson.id}` : null}
                  <Card level="2" class="flex items-center p-3" error={lesson.status === 'aflyst'}
                        on:click={() => !$isSmallScreen && url && goto(url)}>
                    <div
                      class="flex items-stretch sm:items-center max-sm:flex-col-reverse max-sm:content-start flex-1 h-full min-w-0">
                      <div class="max-sm:hidden flex justify-center shrink-0 w-11">
												<span class="text-lg font-medium"
                        >{lesson.interval.start?.toFormat('HH:mm')}</span
                        >
                      </div>
                      <Separator orientation="vertical" class="max-sm:hidden h-10 mx-3" />
                      <div class="flex flex-col w-32 shrink-0">
                        <div class="flex items-center">
                          <Clock class="mr-1 size-4" />
                          <p class="text-sm">{lesson.interval.toFormat('HH:mm')}</p>
                        </div>
                        <div class="flex items-center">
                          <DoorOpen class="mr-1 size-4" />
                          {#if lesson.room}
                            <p class="text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">{lesson.room}</p>
                          {:else}
                            <p class="text-sm text-transparent">.</p>
                          {/if}
                        </div>
                      </div>
                      <Separator class="my-4 sm:hidden" />
                      <div class="flex flex-col min-w-0">
                        <p class="overflow-hidden text-sm overflow-ellipsis whitespace-nowrap">
                          {lesson.name ?? lesson.class}
                        </p>
                        {#if lesson.teacher}
                          <p
                            class="overflow-hidden text-sm whitespace-nowrap text-muted-foreground overflow-ellipsis"
                          >
                            {lesson.teacher}
                          </p>
                        {:else}
                          <p class="text-sm text-transparent">.</p>
                        {/if}
                      </div>
                    </div>
                    {#if url}
                      <Button
                        href={url}
                        variant="ghost" size="sm" class="max-sm:hidden">
                        Vis
                        <ArrowRight class="ml-1 size-4" />
                      </Button>
                    {/if}
                  </Card>
                {/each}
              {/each}
            </div>
          {:else}
            <p class="text-sm text-muted-foreground">Ingen kommende moduler.</p>
          {/if}
        {/if}
      </Card>
      <Card class={cn("p-2 overflow-auto border-2", {"shrink-0": !news || !news.length})}>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium unstyled">Aktuelt</h2>
          {#if !news}
            <Spinner />
          {/if}
        </div>
        {#if news}
          {#if news.length > 0}
            <div class="space-y-2">
              {#each news as item, i}
                <SvelteMarkdown source={item.description} renderers={{ link: NewTabLink }} />
                {#if i !== news.length - 1}
                  <hr class="!my-4 dark:border-t-zinc-600/50" />
                {/if}
              {/each}
            </div>
          {:else}
            <p class="text-sm text-muted-foreground">Ingen aktuelle nyheder.</p>
          {/if}
        {/if}
      </Card>
    </div>
  </div>
</div>
