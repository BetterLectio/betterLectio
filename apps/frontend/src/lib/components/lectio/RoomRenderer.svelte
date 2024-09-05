<script lang="ts">
  import { Separator } from '$lib/components/ui/separator';
  import type { Room } from '$lib/types/rooms';
  import { cn, constructInterval } from '$lib/utils/other.js';
  import { VisTimeline, VisXYContainer, VisTooltip } from '@unovis/svelte';
  import { Ban, CircleCheck } from 'lucide-svelte';
  import { DateTime, type Interval } from 'luxon';
  import { onDestroy } from 'svelte';
  import IntersectionObserver from 'svelte-intersection-observer';
  import Badge from '../ui/badge/badge.svelte';
  import { Timeline } from '@unovis/ts';

  let node: HTMLElement;

  let now = DateTime.now();

  export let room: Room;
  let className: string | undefined = undefined;
  export { className as class };

  let roomInUseIntervals: Interval[] = [];
  room.moduler.forEach((modul) => {
    roomInUseIntervals.push(constructInterval(modul));
  });

  let roomInUse = roomInUseIntervals.some((interval) => interval.contains(now));

  export { roomInUse };

  type TimeDataRecord = {
    timestamp: Date; // Position on the X axis. Can be `number` or `Date`
    length: number; // Length of the line in X axis values, i.e. milliseconds if you use `Date`
    type: string; // The row it will be displayed in
  };

  let data: TimeDataRecord[] = roomInUseIntervals.map((interval) => {
    return {
      timestamp: interval.start ? interval.start.toJSDate() : new Date(),
      length: interval.length('milliseconds'),
      type: 'Status'
    };
  });

  //add to data array a point at 7am and 5pm with a length of 0
  data.push({
    timestamp: DateTime.fromObject({ hour: 7 }).toJSDate(),
    length: 0,
    type: 'Status'
  });
  data.push({
    timestamp: DateTime.fromObject({ hour: 17 }).toJSDate(),
    length: 0,
    type: 'Status'
  });

  data.push({
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
  document.documentElement.style.setProperty(
    '--vis-tooltip-background-color',
    'hsl(var(--background))'
  );
  document.documentElement.style.setProperty('--vis-tooltip-text-color', 'hsl(var(--foreground)');
  document.documentElement.style.setProperty('--vis-tooltip-border-color', 'hsl(var(--border)');

  const x = (d: TimeDataRecord) => d.timestamp.getTime();

  const triggers = {
    [Timeline.selectors.line]: (d: TimeDataRecord) => {
      if (d.type === 'Nu') {
        return 'Nu';
      }
      return `Modul fra ${DateTime.fromJSDate(d.timestamp).toFormat('HH:mm')} til ${DateTime.fromJSDate(d.timestamp).plus({ milliseconds: d.length }).toFormat('HH:mm')}`;
    }
  };

  onDestroy(() => {
    document.documentElement.style.removeProperty('--vis-timeline-row-odd-fill-color');
    document.documentElement.style.removeProperty('--vis-timeline-row-even-fill-color');
    document.documentElement.style.removeProperty('--vis-tooltip-background-color');
    document.documentElement.style.removeProperty('--vis-tooltip-text-color');
    document.documentElement.style.removeProperty('--vis-tooltip-border-color');
  });
</script>

<IntersectionObserver
  element={node}
  let:intersecting
  once
  on:observe={(e) => {
    document.documentElement.style.setProperty(
      '--vis-timeline-row-odd-fill-color',
      'hsl(var(--background))'
    );
    document.documentElement.style.setProperty(
      '--vis-timeline-row-even-fill-color',
      'hsl(var(--background))'
    );
    document.documentElement.style.setProperty(
      '--vis-tooltip-background-color',
      'hsl(var(--background))'
    );
    document.documentElement.style.setProperty('--vis-tooltip-text-color', 'hsl(var(--foreground)');
    document.documentElement.style.setProperty('--vis-tooltip-border-color', 'hsl(var(--border)');
  }}
>
  <div
    bind:this={node}
    class={cn(
      'flex items-center flex-col w-full justify-between p-2 border-[1px] h-[fit] gap-2 rounded-md shadow-md border-border',
      className
    )}
    {...$$restProps}
  >
    {#if intersecting}
      <div class="flex items-center justify-between w-full">
        <p class="line-clamp-1">{room.navn}</p>
        <Badge class={cn('bg-green-500', roomInUse ? 'bg-red-500' : 'bg-green-500')}>
          {#if roomInUse}
            <Ban />
          {:else}
            <CircleCheck />
          {/if}
        </Badge>
      </div>
      {#if roomInUseIntervals.length > 0}
        <div class="w-full h-[56px]">
          <div class="flex justify-between">
            <span class="text-xs">07:00</span>
            <span class="text-xs">dagsorden</span>
            <span class="text-xs">17:00</span>
          </div>
          <Separator />
          <VisXYContainer {data} height="56px">
            <VisTimeline {x} lineCap={true} showEmptySegments={false} />
            <VisTooltip {triggers} />
          </VisXYContainer>
        </div>
      {:else}
        <Separator />
        <p class="text-xs">Ledig hele dagen</p>
      {/if}
    {/if}
  </div>
</IntersectionObserver>

<style>
  :root {
    --vis-timeline-row-odd-fill-color: hsl(var(--background));
    --vis-timeline-row-even-fill-color: hsl(var(--background));
    --vis-tooltip-background-color: hsl(var(--background));
    --vis-tooltip-text-color: hsl(var(--foreground));
    --vis-tooltip-border-color: hsl(var(--border));
  }
</style>
