<script lang="ts">
	import { Calendar, type EventSourceFunc } from '@fullcalendar/core';
	import luxonPlugin from '@fullcalendar/luxon3';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import daLocale from '@fullcalendar/core/locales/da';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { get } from '$lib/js/http';
	import { constructInterval, decodeUserID, stringToColor } from '$lib/utils';
	import type { RawLesson } from '$lib/types/types';
	import { toast } from 'svelte-sonner';
	import { Cross2, Target, Update } from 'radix-icons-svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Header from '$lib/customComponents/Header.svelte';

	const nameRegex = /^(?:[\w]+) (.*)(?:,.*)/;

	let userId: string;
	let searchId: string;
	let userName = '';
	let loadedSettings = false;

	const getEvents: EventSourceFunc = (fetchInfo, successCallback) => {
		const start: DateTime = DateTime.fromJSDate(fetchInfo.start);
		get(`/skema?id=${userId}&uge=${start.weekNumber}&år=${start.year}`).then(
			(data: { moduler: RawLesson[]; overskrift: string }) => {
				if (userId.startsWith('S')) {
					const matches = nameRegex.exec(data.overskrift);
					if (matches) {
						userName = matches[1];
					} else {
						userName = data.overskrift;
					}
				} else {
					userName = data.overskrift.replace('Lokalet ', '').replace(' - Skema', '');
				}

				const events = data.moduler.map((lesson) => {
					const interval = constructInterval(lesson.tidspunkt);
					const start = interval.start?.toISO() ?? 'string';
					const end = interval.end?.toISO() ?? 'string';

					const color = stringToColor(lesson.hold ?? '', 100, 90).string;
					const textColor = color
						? `hsl(${color}, 100%, 30%)`
						: stringToColor(lesson.hold ?? '', 100, 30).string;
					const className = lesson.hold; //classNames?.[lesson.hold ?? ''] ?? lesson.hold ?? '';

					return {
						color: color,
						textColor: textColor,
						end,
						extendedProps: {
							cancelled: lesson.status === 'aflyst',
							description: `${lesson.navn ? `${lesson.navn}<br>` : ''}${
								lesson.tidspunkt
							}<br>Hold: ${className}<br>Lærer: ${lesson.lærer}<br>Lokale: ${lesson.lokale}${
								lesson.andet ? `<br><br>${lesson.andet}` : ''
							}`
						},
						id: lesson.absid,
						start,
						title: `${lesson.navn ?? className}${lesson.lokale ? ` • ${lesson.lokale}` : ''}`,
						url: `/modul?absid=${lesson.absid}`
					};
				});
				successCallback(events);
			}
		);
	};

	let loading = true;
	let width: number;
	let calendarEl: HTMLElement;
	let calendar: Calendar;
	let showBackToWeekViewButton = false;

	onMount(() => {
		searchId = $page.url.searchParams.get('id') ?? '';
		const meId = `S${decodeUserID(localStorage.getItem('lectio-cookie') ?? '0')}`;
		if (searchId) {
			if (
				searchId.length == 12 &&
				(searchId.startsWith('S') ||
					searchId.startsWith('T') ||
					searchId.startsWith('H') ||
					searchId.startsWith('R')) &&
				!isNaN(+searchId.slice(1))
			) {
				userId = searchId;
			} else {
				toast.error('Ugyldigt ID');
				userId = meId;
			}
			goto(`/skema`, { replaceState: true });
		} else {
			userId = meId;
		}

		calendar = new Calendar(calendarEl, {
			// @ts-ignore
			allDaySlot: false,
			contentHeight: 'auto',
			dayHeaderContent: function (renderProps) {
				const date = DateTime.fromJSDate(renderProps.date).setLocale('da');
				const todayClasses = renderProps.isToday
					? 'w-8 h-8 rounded-full bg-primary text-white dark:text-black'
					: '';
				const weekday = date.weekdayShort?.replace('.', '');
				return {
					html: `<div class='flex items-center justify-center h-12 py-3'><span class='flex items-baseline font-normal leading-6'>${weekday}<span class='flex items-center justify-center ml-[0.375rem] font-semibold ${todayClasses}'>${date.day}</span></span></div>`
				};
			},
			dayHeaderFormat: { weekday: 'long' },
			eventDidMount: (arg) => {
				if (arg.event.extendedProps.cancelled) arg.el.classList.add('event-cancelled');
			},
			eventSources: [
				{
					events: getEvents
				}
			],
			loading(isLoading) {
				loading = isLoading;
			},
			headerToolbar: {
				left: 'title',
				right: 'today prev,next'
			},
			initialView: width >= 768 ? 'timeGridWeek' : 'timeGridDay',
			locale: daLocale,
			nowIndicator: true,
			plugins: [luxonPlugin, timeGridPlugin],
			slotDuration: '00:30:00',
			slotEventOverlap: false,
			slotMaxTime: '18:00',
			slotMinTime: '07:00',
			navLinks: true,
			navLinkDayClick(date) {
				calendar.gotoDate(date);
				calendar.changeView('timeGridDay');
				showBackToWeekViewButton = true;
			},
			titleFormat: 'Uge W, yyyy',
			weekends: false,
			windowResize: function () {
				calendar.changeView(width >= 768 ? 'timeGridWeek' : 'timeGridDay');
			}
		});

		//const date = get(calendarStore).date;
		//if (!(userId === searchId) && date) calendar.gotoDate(date);
		calendar.render();

		//calendar.on('datesSet', (info) => {
		//	if (userId === searchId) return;
		//	const date = info.view.currentStart;
		//	calendarStore.update((store) => ({
		//		date: date.toISOString(),
		//		onlyMandatory: store.onlyMandatory
		//	}));
		//});

		//calendar.on('eventsSet', (events) => {
		//	if ($calendarStore.onlyMandatory) {
		//		events.forEach((event) => {
		//			if (event.title && nameBlacklisted(event.title)) event.remove();
		//		});
		//	}
		//});

		//const hammer = new Hammer(calendarEl);
		//hammer.on('swipeleft', () => {
		//	calendar.next();
		//});
		//hammer.on('swiperight', () => {
		//	calendar.prev();
		//});

		return () => {
			calendar && calendar.destroy();
		};
	});

	let customDate: string;
	$: if (customDate) {
		const date = DateTime.fromISO(customDate);
		if (date.isValid) {
			calendar.gotoDate(date.toJSDate());
		}
	}

	//$: if (calendar && $calendarStore.onlyMandatory) {
	//	calendar.getEvents().forEach((event) => {
	//		if (event.title && nameBlacklisted(event.title)) event.remove();
	//	});
	//}
</script>

<svelte:window bind:innerWidth={width} />

<Header
	><div class="flex items-center h-6 space-x-4">
		<h1 class="mb-0">Skema {userId === searchId ? `(${userName})` : ''}</h1>
		{#if loading}
			<Update class="animate-spin" />
		{/if}
	</div>
</Header>

<div class="container mx-auto">
	<div class="flex items-center justify-between">
		<div class="flex space-x-1">
			{#if showBackToWeekViewButton}
				<button
					on:click={() => {
						calendar.changeView('timeGridWeek');
						showBackToWeekViewButton = false;
					}}
					class="h-10 px-3 text-white border-gray-700 rounded bg-primary hover:bg-primary-hover dark:bg-background dark:hover:bg-background-hover dark:text-black"
					>Ugevisning</button
				>
			{/if}
		</div>
	</div>
	<div bind:this={calendarEl} class="!mt-0 not-prose" />
</div>
