<script lang="ts">
  import * as HoverCard from '$lib/components/ui/hover-card';
  import type { RawLesson } from '$lib/types/lesson';
  import type { RawSchedule } from '$lib/types/schedule';
  import { constructInterval, get } from '$lib/utils';
  import { VisTimeline, VisXYContainer } from '@unovis/svelte';
  import { DateTime, type Interval } from 'luxon';
  import Badge from '../ui/badge/badge.svelte';
  import Separator from '../ui/separator/separator.svelte';
  import Avatar from './Avatar.svelte';

  let opened = false;
  let loading = false;
  let brugerinfo: RawSchedule | null = null;

  export let id;
  export let navn = '';

  const x = (d: TimeDataRecord) => d.timestamp.getTime();

  let studentOccupiedIntervals: { modul: RawLesson; interval: Interval<boolean> }[] = [];

  let isStudentOccupied = false;
  let occupyingLesson: { modul: RawLesson; interval: Interval<boolean> } | undefined = undefined;

  type TimeDataRecord = {
    timestamp: Date; // Position on the X axis. Can be `number` or `Date`
    length: number; // Length of the line in X axis values, i.e. milliseconds if you use `Date`
    type: string; // The row it will be displayed in
  };

  let scheduleData: TimeDataRecord[] = [];

  const onOpen = async (open: boolean) => {
    if (open == false || opened) return;
    loading = true;
    opened = true;

    await get(`/skema?id=${id}`).then((data: RawSchedule) => {
      //data.hold can be formatted as an array of objects {navn: string, id: string} or as an object {navn: id, ...}
      //make sure to format it as an array of objects
      if (data.hold && !Array.isArray(data.hold)) {
        data.hold = Object.entries(data.hold).map(([navn, id]) => ({ navn, id: id as string }));
      }

      data.moduler.forEach((modul) => {
        studentOccupiedIntervals.push({
          modul: modul,
          interval: constructInterval(modul.tidspunkt)
        });
      });

      let now = DateTime.now();

      isStudentOccupied = studentOccupiedIntervals.some((interval) =>
        interval.interval.contains(now)
      );
      occupyingLesson = studentOccupiedIntervals.find((interval) =>
        interval.interval.contains(now)
      );

      scheduleData = studentOccupiedIntervals.map((interval) => {
        return {
          timestamp: interval.interval.start ? interval.interval.start.toJSDate() : new Date(),
          length: interval.interval.length('milliseconds'),
          type: 'Status'
        };
      });

      //remove all intervals that are not on this day
      scheduleData = scheduleData.filter((interval) => {
        return interval.timestamp.getDate() == now.day;
      });

      //remove all intervals that are not between 7am and 5pm
      scheduleData = scheduleData.filter((interval) => {
        return interval.timestamp.getHours() >= 7 && interval.timestamp.getHours() <= 17;
      });

      //add to data array a point at 7am and 5pm with a length of 0
      scheduleData.push({
        timestamp: DateTime.fromObject({ hour: 7 }).toJSDate(),
        length: 0,
        type: 'Status'
      });
      scheduleData.push({
        timestamp: DateTime.fromObject({ hour: 17 }).toJSDate(),
        length: 0,
        type: 'Status'
      });

      scheduleData.push({
        timestamp: now.toJSDate(),
        length: 230000,
        type: 'Nu'
      });

      // this is a hack to make the timeline background color the same as the rest of the app even though it's set in the global css it for some reason doesn't work, hence the need to set it here
      document.documentElement.style.setProperty(
        '--vis-timeline-row-odd-fill-color',
        'hsl(var(--background))'
      );
      document.documentElement.style.setProperty(
        '--vis-timeline-row-even-fill-color',
        'hsl(var(--background))'
      );

      brugerinfo = data;
    });

    loading = false;
  };
</script>

<HoverCard.Root onOpenChange={onOpen}>
  <HoverCard.Trigger class="no-underline">
    <slot />
  </HoverCard.Trigger>
  <HoverCard.Content>
    {#if opened}
      {#if loading}
        <p>loading...</p>
      {:else}
        <div class="flex flex-col w-full gap-2">
          <Avatar {id} {navn} neverPopup={true} size="w-14 h-14" />
          <p>{navn}</p>
        </div>
        <Separator class="my-2" />
        <span>Skema:</span>
        {#if isStudentOccupied}
          <p class="text-xs">
            {occupyingLesson?.modul.navn
              ? occupyingLesson?.modul.navn
              : occupyingLesson?.modul.hold} i {occupyingLesson?.modul.lokale
              ? occupyingLesson?.modul.lokale
              : 'Ukendt lokale'}
          </p>
        {/if}
        {#if scheduleData.length > 3}
          <div class="w-full h-[56px]">
            <div class="flex justify-between">
              <span class="text-xs">07:00</span>
              <span class="text-xs">dagsorden</span>
              <span class="text-xs">17:00</span>
            </div>
            <VisXYContainer data={scheduleData} height="56px">
              <VisTimeline {x} lineCap={true} showEmptySegments={false} />
            </VisXYContainer>
          </div>
        {:else}
          <p class="text-xs">Fri hele dagen!</p>
        {/if}
        <Separator class="my-2" />
        <span>Hold:</span>
        {#each brugerinfo?.hold || [] as hold}
          <Badge variant="outline" class="mr-0.5">{hold?.navn}</Badge>
        {:else}
          <p>Ingen hold</p>
        {/each}
      {/if}
    {/if}
  </HoverCard.Content>
</HoverCard.Root>
