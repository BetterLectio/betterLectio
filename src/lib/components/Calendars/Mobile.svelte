<script>
	import { fag, indstillinger } from '$lib/js/store.js';
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import { getModulColor, standardizeTimeRange } from '$lib/js/LectioUtils.js';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { get } from '$lib/js/http.js';
	import { register } from 'swiper/element/bundle';
	register();

	// Event calendar skema
	let skemaBefore = null;
	let skema = null;
	let skemaAfter = null;

	// Date picker
	const dage = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
	const måneder = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];

	let selectedDay = new Date();
	let viewDate = selectedDay;
	let swiperElement = null;
	const dates = [ [], [], [] ];
	function updateDates(day) {
		// if (day.getDay() === 0) day.setDate(day.getDate() + 1);

		for (let i = 0; i < 3; i++) for (let j = 0; j < 7; j++) dates[i][j] = new Date(day.getTime() + (((7 * (i === 0 ? 7 : i - 1)) - day.getDay() + 1 + j) * 24 * 60 * 60 * 1000));
		if (swiperElement) swiperElement.swiper.slideTo(1, 0);
	}
	updateDates(selectedDay);

	function swiperEvents(swiper) {
		swiper.on('slideChangeTransitionEnd', () => {
			// eslint-disable-next-line prefer-destructuring
			viewDate = dates[swiper.realIndex][0];
		});
	}

	function getWeekNumber(_date = new Date()) {
		if (_date.getWeekNumber) return _date.getWeekNumber();

		const date = new Date(Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate()));
		const weekDays = 7;
		const dayNum = date.getUTCDay() || weekDays;
		date.setUTCDate(date.getUTCDate() + 4 - dayNum);
		const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
		const sinceYearStart = date - yearStart;
		const msInDay = 86400000;
		const daysSinceStartOfYear = sinceYearStart / msInDay;
		return Math.ceil((daysSinceStartOfYear + 1) / weekDays);
	}

	function changeSelected(selected) {
		selectedDay = selected;
		skema.setOption('date', selectedDay);
		skemaBefore.setOption('date', new Date(selectedDay.getTime() - (1 * 24 * 60 * 60 * 1000)));
		skemaAfter.setOption('date', new Date(selectedDay.getTime() + (1 * 24 * 60 * 60 * 1000)));
	}

	// Skema
	$: skemaId = new URLSearchParams(window.location.search).get('id');

	let cookie = null;
	cookieInfo().then(data => {
		cookie = data;
		if (skemaId === null) {
			skemaId = `S${ cookie.userId}`;
			const url = new URL(location);
			url.searchParams.set('id', skemaId);
		}
	});

	const plugins = [TimeGrid];
	const mobileTheme = {
		active: 'hidden',
		allDay: 'hidden',
		bgEvent: 'hidden',
		bgEvents: 'hidden',
		body: '',
		button: 'hidden',
		buttonGroup: 'hidden',
		calendar: 'ec-calendar school-schedule',
		compact: 'hidden',
		content: 'ec-content',
		day: 'ec-day',
		dayFoot: 'hidden',
		dayHead: 'hidden',
		daySide: 'hidden',
		days: 'ec-days',
		draggable: 'hidden',
		dragging: 'hidden',
		event: 'btn btn-xs absolute flex-nowrap w-full h-full overflow-hidden visible hover:scale-105 z-5 hover:z-0 border-0 m-0.5',
		eventBody: '',
		eventTag: 'hidden',
		eventTime: 'ec-event-time',
		eventTitle: 'ec-event-title',
		events: 'ec-events',
		extra: 'hidden',
		ghost: 'hidden',
		handle: 'hidden',
		header: 'hidden',
		hiddenScroll: 'ec-hidden-scroll',
		hiddenTimes: 'ec-hidden-times',
		highlight: 'hidden',
		icon: 'hidden',
		line: '',
		lines: '',
		list: 'hidden',
		month: 'hidden',
		noEvents: 'hidden',
		nowIndicator: 'ec-now-indicator',
		otherMonth: 'hidden',
		pointer: 'hidden',
		popup: 'hidden',
		preview: 'hidden',
		resizer: 'hidden',
		resizingX: 'hidden',
		resizingY: 'hidden',
		resource: 'hidden',
		resourceTitle: 'hidden',
		sidebar: '',
		sidebarTitle: 'hidden',
		time: 'ec-time mr-2',
		title: 'hidden',
		today: 'bg-base-300',
		toolbar: 'hidden',
		uniform: 'hidden',
		week: 'ec-week',
		withScroll: 'ec-hidden-scroll'
	};
	const options = {
		view: 'timeGridDay',
		theme: mobileTheme,
		flexibleSlotTimeLimits: true,
		slotMinTime: '08:00:00',
		slotMaxTime: '17:00:00',
		events: [],
		eventDidMount: event => {
			// if the event is cancelled, add a class to the event
			if (event.event.extendedProps.status === 'aflyst') event.el.classList.add('line-through'); event.el.classList.add('hover:decoration-2');

			if (event.event.extendedProps.hasContent) {
				event.el.classList.add('after:text-base',
					"after:content-['_📑']",
					'after:px-1',
					'text-left',
					'justify-between');
			} else {
				event.el.classList.add('text-left', 'justify-start');
			}
		},
		viewDidMount: () => {
			skema.setOption('date', selectedDay);
			skemaBefore.setOption('date', new Date(selectedDay.getTime() - (1 * 24 * 60 * 60 * 1000)));
			skemaAfter.setOption('date', new Date(selectedDay.getTime() + (1 * 24 * 60 * 60 * 1000)));
		}
	};

	const skemaData = {};
	const addedEventsId = [];
	function loadSkema(date) {
		const week = getWeekNumber(viewDate);
		const year = viewDate.getFullYear();

		if (!skemaData[`${week}${year}`]) {
			get(`/skema?id=${skemaId}&uge=${`0${week}`.slice(-2)}&år=${year}`).then(data => {
				skemaData[`${week}${year}`] = data;
				loadSkema(date);
			});
		} else {
			skemaData[`${week}${year}`].moduler.forEach(modul => {
				let titel = '';
				if (modul.navn !== null) {
					titel = modul.navn !== null && modul.navn !== 'Ændret!' ? modul.navn : $fag[modul.hold_id];
					if (modul.status === 'eksamen') {
						titel
							= `Eksamen! ${
								titel.replace('mdt.', 'mundtlig').replace('skr.', 'skriftlig')
									.replace('prv.', 'prøve')
									.replace('eks.', 'eksamen')}`;
					} else if (modul.lokale) {
						titel += ` · ${ modul.lokale.split(/(?:[\uD800-\uDBFF][\uDC00-\uDFFF])/u)[0]}`;
					}
				} else {
					if ($indstillinger.brugHoldOversætter) titel = $fag[modul.hold_id];
					else titel = modul.hold;

					if (modul.lokale) titel += ` · ${ modul.lokale.split(/(?:[\uD800-\uDBFF][\uDC00-\uDFFF])/u)[0]}`;
				}

				const hasContent = modul.andet !== null;
				const [modulStart, modulEnd] = standardizeTimeRange(modul.tidspunkt);
				const modulCalenderObj = {
					title: titel,
					start: modulStart,
					end: modulEnd,
					id: modul.absid,
					backgroundColor: getModulColor(modul, $indstillinger.skema.classesWithDifferentColors),
					extendedProps: { hasContent, status: modul.status }
				};
				let isAdded = false;
				for (let j = 0; j < addedEventsId.length; j++) {
					// check if it has been added before
					if (addedEventsId[j] === modulCalenderObj.id) isAdded = true;
				}
				if (!isAdded) {
					addedEventsId.push(modulCalenderObj.id);
					skema.addEvent(modulCalenderObj);
					skemaBefore.addEvent(modulCalenderObj);
					skemaAfter.addEvent(modulCalenderObj);
				}
			});
		}
	}

	let calendarSwiperElement = null;
	function calendarSwiper(swiper) {
		swiper.on('slideChangeTransitionEnd', () => {
			// eslint-disable-next-line prefer-destructuring
			selectedDay = [skemaBefore, skema, skemaAfter][swiper.realIndex].getOption('date');
			viewDate = selectedDay.getDay() === 0 ? new Date(selectedDay.getTime() - (1 * 24 * 60 * 60 * 1000)) : selectedDay;
			skema.setOption('date', selectedDay);
			skemaBefore.setOption('date', new Date(selectedDay.getTime() - (1 * 24 * 60 * 60 * 1000)));
			skemaAfter.setOption('date', new Date(selectedDay.getTime() + (1 * 24 * 60 * 60 * 1000)));
			swiper.slideTo(1, 0);
		});
	}

	// Listeners
	$: if (swiperElement) swiperEvents(swiperElement.swiper);
	$: if (calendarSwiperElement) calendarSwiper(calendarSwiperElement.swiper);
	$: if (viewDate) updateDates(viewDate);
	$: if (selectedDay) loadSkema(selectedDay);
</script>

<div class="-mt-8 text-2xl">
	<p><b>Uge {getWeekNumber(viewDate)}</b> ({måneder[viewDate.getMonth()]} {viewDate.getFullYear()})</p>
</div>

{#if dates[2][6]}
	<div class="w-screen">
		<swiper-container bind:this={swiperElement} initial-slide="1">
			{#each Array(3) as _, i}
				<swiper-slide class="flex items-stretch space-x-2 p-1">
					{#each Array(7) as _, j}
						<button on:click={() => changeSelected(dates[i][j])} class="flex items-center justify-center text-base-300 w-full {`${selectedDay.getDate()}${selectedDay.getMonth()}${selectedDay.getFullYear()}` === `${dates[i][j].getDate()}${dates[i][j].getMonth()}${dates[i][j].getFullYear()}` ? 'bg-primary' : 'bg-base-content'} rounded-lg p-1">
							<div class="text-center">
								<p class="font-bold text-2xl">{dates[i][j].getDate()}</p>
								<p>{dage[dates[i][j].getDay()]}</p>
							</div>
						</button>
					{/each}
				</swiper-slide>
			{/each}
		</swiper-container>
	</div>
{/if}

<div class="w-screen">
	<swiper-container bind:this={calendarSwiperElement} initial-slide="1">
		<swiper-slide><Calendar bind:this={skemaBefore} {plugins} {options} /></swiper-slide> <!-- Måske hvis dagen for skemaet er tom efter den er loaded så lav en besked med det-->
		<swiper-slide><Calendar bind:this={skema} {plugins} {options} /></swiper-slide> <!-- Måske hvis dagen for skemaet er tom efter den er loaded så lav en besked med det-->
		<swiper-slide><Calendar bind:this={skemaAfter} {plugins} {options} /></swiper-slide> <!-- Måske hvis dagen for skemaet er tom efter den er loaded så lav en besked med det-->
	</swiper-container>
</div>
