<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Spinner } from '$lib/components';
	import { Button } from '$lib/components/ui/button';
	import { authStore } from '$lib/stores';
	import type { RawLesson } from '$lib/types/lesson';
	import { constructInterval, decodeUserID, NAME_REGEX, stringToColor } from '$lib/utils/other';
	import { get } from '$lib/utils/http';
	import { Calendar, type EventSourceFunc } from '@fullcalendar/core';
	import daLocale from '@fullcalendar/core/locales/da';
	import luxonPlugin from '@fullcalendar/luxon3';
	import timeGridPlugin from '@fullcalendar/timegrid';
	import DOMPurify from 'dompurify';
	import { DateTime } from 'luxon';
	import { mode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import tippy from 'tippy.js';
	import 'tippy.js/animations/shift-away.css';
	import { isMediumScreen } from '$lib/utils';

	let userId: string;
	let searchId: string;
	let userName = '';

	const getEvents: EventSourceFunc = (fetchInfo, successCallback) => {
		const start: DateTime = DateTime.fromJSDate(fetchInfo.start);
		get(`/skema?id=${userId}&uge=${start.weekNumber}&år=${start.year}`).then(
			(data: { moduler: RawLesson[]; overskrift: string }) => {
				if (userId.startsWith('S')) {
					const matches = NAME_REGEX.exec(data.overskrift);
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
						borderColor: color,
						color: $mode == 'dark' ? `color-mix(in srgb, ${color} 25%, transparent)` : color,
						//text is black in light mode and white in dark mode
						textColor: $mode == 'light' ? 'hsl(0, 0%, 0%)' : 'hsl(0, 0%, 90%)',
						end,
						extendedProps: {
							cancelled: lesson.status === 'aflyst',
							description: `${lesson.navn ? `${lesson.navn}<br>` : ''}${
								lesson.tidspunkt
							}<br>Hold: ${className}<br>Lærer: ${lesson.lærer}<br>Lokale: ${lesson.lokale}${
								lesson.andet ? `<br><br>${lesson.andet}` : ''
							}`
						},
						className: 'backdrop-blur-md',
						id: lesson.absid,
						start,
						title: `${lesson.navn ?? className}${lesson.lokale ? ` • ${lesson.lokale}` : ''}`,
						url: lesson.absid.startsWith('PH') ? `/eksamen?id=${lesson.absid.substring(2)}&navn=${userName}` : `/modul?absid=${lesson.absid}`
					};
				});
				successCallback(events);
			}
		);
	};

	let loading = true;
	let calendarEl: HTMLElement;
	let calendar: Calendar;
	let showBackToWeekViewButton = false;

	const start = () => {
		loading = true;

		searchId = $page.url.searchParams.get('id') ?? '';
		const meId = `S${decodeUserID($authStore.cookie ?? '0')}`;
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
			dayHeaderContent: function(renderProps) {
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
				tippy(arg.el, {
					content: DOMPurify.sanitize(arg.event.extendedProps.description, {
						USE_PROFILES: { html: true }
					}),
					placement: 'top',
					duration: 150,
					animation: 'shift-away',
					arrow: false,
					delay: [500, 0],
					allowHTML: true,
					touch: false
				});
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
			initialView: $isMediumScreen ? 'timeGridWeek' : 'timeGridDay',
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
			windowResize: function() {
				calendar.changeView($isMediumScreen ? 'timeGridWeek' : 'timeGridDay');
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

		return () => {
			calendar && calendar.destroy();
		};
	};

	let mounted = false;
	onMount(() => {
		start();
		mounted = true;
	});

	$: if (($mode === undefined || $mode === 'light' || $mode === 'dark') && mounted) {
		calendar?.destroy();
		start();
		console.log('mode changed');
	}

	let customDate: string;
	$: if (customDate) {
		const date = DateTime.fromISO(customDate);
		if (date.isValid) {
			calendar.gotoDate(date.toJSDate());
		}
	}
</script>

<div class="page-container">
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-4">
			<h1>Skema {userId === searchId ? `(${userName})` : ''}</h1>
			{#if loading}
				<Spinner />
			{/if}
		</div>
		<div class="flex space-x-1">
			{#if showBackToWeekViewButton}
				<Button
					on:click={() => {
						calendar.changeView('timeGridWeek');
						showBackToWeekViewButton = false;
					}}
					variant="outline">Ugevisning
				</Button
				>
			{/if}
		</div>
	</div>
	<div bind:this={calendarEl} class="!mt-0 unstyled" />
</div>
