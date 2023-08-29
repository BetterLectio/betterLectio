<script>
	import { fag, indstillinger } from '$lib/js/store.js';
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import { cookieInfo } from '$lib/js/LectioCookieHandler';
	import { error } from '@sveltejs/kit';
	import { get } from '$lib/js/http.js';
	import { goto } from '$app/navigation';
	import { holdOversætterNy } from '$lib/js/HoldOversætter.js';

	let skema = {};
	let heading = 'Skema';
	let mySkema = null;

	$fag = $fag ?? {};

	$: skemaId = new URLSearchParams(window.location.search).get('id');

	let cookie = null;
	cookieInfo().then(data => {
		cookie = data;
		if (skemaId === null) {
			skemaId = `S${ cookie.userid}`;
			const url = new URL(location);
			url.searchParams.set('id', skemaId);
			history.replaceState({}, '', url);
		}
	});

	// to store the calendar instance and access it's methods
	let calenderInstance = null;
	const plugins = [TimeGrid];

	const customTheme = {
		active: 'ec-active',
		allDay: 'ec-all-day border-b-0 relative -mt-4 md:mt-0',
		bgEvent: 'ec-bg-event',
		bgEvents: 'ec-bg-events',
		body: 'ec-body rounded-b-2xl',
		button: 'btn btn-primary btn-sm ONCHANGE visible',
		buttonGroup: 'btn-group visible',
		calendar: 'ec-calendar school-schedule',
		compact: 'ec-compact',
		content: 'ec-content',
		day: 'ec-day',
		dayFoot: 'ec-day-foot',
		dayHead: 'ec-day-head',
		daySide: 'ec-day-side',
		days: 'ec-days capitalize',
		draggable: 'ec-draggable',
		dragging: 'ec-dragging',
		event:
			'btn btn-xs absolute flex-nowrap w-full h-full overflow-hidden hover:shadow-[0_3px_12px_rgba(0,0,0,0.1)] visible hover:scale-105 z-5 hover:z-0 border-0 m-0.5',
		eventBody: '',
		eventTag: 'ec-event-tag',
		eventTime: 'ec-event-time',
		eventTitle: 'ec-event-title',
		events: 'ec-events',
		extra: 'ec-extra',
		ghost: 'ec-ghost',
		handle: 'ec-handle',
		header: window.innerWidth < 768 ? 'flex hidden' : 'ec-header rounded-t-2xl',
		hiddenScroll: 'ec-hidden-scroll',
		hiddenTimes: 'ec-hidden-times',
		highlight: 'ec-highlight',
		icon: 'ec-icon',
		line: '',
		lines: '',
		list: 'ec-list',
		month: 'ec-month',
		noEvents: 'ec-no-events',
		nowIndicator: 'ec-now-indicator',
		otherMonth: 'ec-other-month',
		pointer: 'ec-pointer',
		popup: 'ec-popup',
		preview: 'ec-preview',
		resizer: 'ec-resizer',
		resizingX: 'ec-resizing-x',
		resizingY: 'ec-resizing-y',
		resource: 'ec-resource',
		resourceTitle: 'ec-resource-title',
		sidebar: 'ec-sidebar',
		sidebarTitle: 'hidden',
		time: 'ec-time',
		title: 'md:ec-title',
		today: 'bg-base-300',
		toolbar:
			'flex items-center ec-toolbar bg-base-200 md:text-base-content md:bg-base-100 p-2 rounded-t-2xl -mt-8 md:mt-0 border border-base-content md:border-0',
		uniform: 'ec-uniform',
		week: 'ec-week',
		withScroll: 'ec-hidden-scroll'
	};

	function dertermineView() {
		if (window.innerWidth < 768) return 'timeGridDay';
		return 'timeGridWeek';
	}

	let globalWeek = 0;
	let globalYear = 0;
	const addedEventsId = [];

	// add the week to the url
	// const url = new URL(location);
	// url.searchParams.set("week", globalWeek);
	// history.replaceState({}, "", url);

	// fixme: Date.prototype.getWeekNumber is implemented in another route
	function getWeekNumber() {
		const now = new Date();
		if (now.getWeekNumber) return now.getWeekNumber();

		const today = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
		const weekDays = 7;
		const dayNum = today.getUTCDay() || weekDays;
		today.setUTCDate(today.getUTCDate() + 4 - dayNum);
		const yearStart = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
		const sinceYearStart = today - yearStart;
		const msInDay = 86400000;
		const daysSinceStartOfYear = sinceYearStart / msInDay;
		return Math.ceil((daysSinceStartOfYear + 1) / weekDays);
	}

	function changeWeek(task) {
		if (task === 0) globalWeek = getWeekNumber();
		else globalWeek += task;
	}

	function onload() {
		const btns = document.getElementsByClassName('ONCHANGE');

		btns[0].addEventListener('click', () => {
			changeWeek(0);
		});
		btns[1].addEventListener('click', () => {
			changeWeek(-1);
		});
		btns[2].addEventListener('click', () => {
			changeWeek(1);
		});
	}

	const options = {
		locale: 'da',
		view: 'timeGridWeek',
		nowIndicator: true,
		theme: customTheme,
		hiddenDays: [0, 6],
		flexibleSlotTimeLimits: true,
		slotMinTime: '08:00:00',
		slotMaxTime: '17:00:00',
		events: [],
		dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'numeric' },
		buttonText: {
			today: 'I dag',
			dayGridMonth: 'måned',
			listDay: 'list',
			listWeek: 'list',
			listMonth: 'list',
			listYear: 'list',
			resourceTimeGridDay: 'dag',
			resourceTimeGridWeek: 'uge',
			timeGridDay: 'dag',
			timeGridWeek: 'uge'
		},
		eventDidMount: event => {
			// if the event is cancelled, add a class to the event
			if (event.event.backgroundColor === 'hsl(var(--er))') event.el.classList.add('line-through', 'hover:decoration-2');

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
		viewDidMount: view => {
			dertermineView();
			const dateObj = new Date(view.currentEnd.toISOString());
			globalYear = dateObj.getFullYear();
			const dayOfYear = 2 + Math.floor((dateObj - new Date(dateObj.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
			globalWeek = Math.floor(dayOfYear / 7);
			onload();
		},
		eventClick: info => {
			goto(`/modul?absid=${info.event.id}`);
		}
	};

	onresize = () => {
		// if the window is less than 768px wide, change the view to "listDay"
		options.view = dertermineView();
	};

	function getHoldToColor() {
		const holdToColor = {};
		try {
			if (!skema[String(globalYear) + globalWeek].hold) throw error;

			for (let i = 0; i < skema[String(globalYear) + globalWeek].hold.length; i++) holdToColor[skema[String(globalYear) + globalWeek].hold[i].navn] = 255 / (skema[String(globalYear) + globalWeek].hold.length - 1) * i;

			return holdToColor;
		} catch {
			console.log('could not get hold to color, proceeding with default');
			return holdToColor;
		}
	}

	const lectioDateLocale = 'en-DK';
	const lectioDateOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	};

	/**
	 * Input Lectio timestamp and output "Date constructor"-valid timestamp
	 *
	 * @example
	 * ```javascript
	 * reformatTime("21/8-2023 09:15 til 10:45")
	 * // Expected output: ["2023-08-21T09:15", "2023-08-21T10:45"]
	 * ```
	 * @param time Lectio time string
	 * @returns Date timestamp(s)
	 */
	function reformatTime(timeRangeRaw) {
		const dateTimestampSymbols = ['-', '-', 'T', ':', ''];
		const nowTimestamp = new Date().toLocaleString(lectioDateLocale, lectioDateOptions)
			.replace(',', '');
		const result = [];

		const rawTimeArray = timeRangeRaw.split('til').map(timestamp => timestamp.trim());
		for (let i = 0; i < rawTimeArray.length; i++) {
			// First, second (and third) are arbitrary
			// as they may be either a date or a time
			const [first, second, third, ...rest] = rawTimeArray[i].match(/(?:\d+\.)?\d+/gu).map(number => number.padStart(2, '0'));

			const timeTwoDigit = rest.length
				? [third, second, first, ...rest].join('-')
				: [first, second].join('-');

			let standardizedDate = timeTwoDigit.padStart(nowTimestamp.length, nowTimestamp);

			// If end time is relative
			if (!rest.length) {
				const startTimestamp = result[0] || nowTimestamp;
				standardizedDate = timeTwoDigit.padStart(startTimestamp.length, startTimestamp);
			}

			const timeFormatted = standardizedDate.split(/[^0-9]/gu)
				.map((number, j) => number + dateTimestampSymbols[j])
				.join('');
			result.push(timeFormatted);
		}

		return result;
	}

	async function addSkemaToCalendar(_skema) {
		options.view = dertermineView();
		const holdToColor = getHoldToColor();
		for (let i = 0; i < _skema.moduler.length; i++) {
			const modul = _skema.moduler[i];
			let titel = '';

			// can be "normal" "ændret" "aflyst" or "eksamen"
			const { status } = modul;

			if (modul.hold_id !== null && $fag[modul.hold_id] === undefined) {
				// eslint-disable-next-line no-await-in-loop
				await holdOversætterNy(modul.hold_id).then(_fag => {
					$fag[modul.hold_id] = _fag === 'Andet' ? modul.hold : _fag;
				});
			}

			if (modul.navn !== null) {
				titel = modul.navn !== null && modul.navn !== 'Ændret!' ? modul.navn : $fag[modul.hold_id];
				if (status === 'eksamen') {
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
			let backgroundColor = 'hsl(0, 0%, 0%, 0.1)';
			if (status === 'normal' || status === 'ændret') {
				if (holdToColor[modul.hold] && $indstillinger.skema.classesWithDifferentColors === true) backgroundColor = `hsla(${holdToColor[modul.hold]}, 75%, 65%, 0.25)`;
				else backgroundColor = 'hsla(212.5, 75%, 65%, 0.25)';
			} else if (status === 'eksamen') {
				backgroundColor = 'hsla(262, 100%, 65%, 0.25)';
			}
			const hasContent = modul.andet !== null;

			const [modulStart, modulEnd] = reformatTime(modul.tidspunkt);

			// console.log(modulStart, modulEnd);
			const modulCalenderObj = {
				title: titel,
				start: new Date(modulStart),
				end: new Date(modulEnd),
				id: modul.absid,
				backgroundColor,
				extendedProps: { hasContent }
			};

			let isAdded = false;
			for (let j = 0; j < addedEventsId.length; j++) {
				// check if it has been added before
				if (addedEventsId[j] === modulCalenderObj.id) isAdded = true;
			}
			if (!isAdded) {
				addedEventsId.push(modulCalenderObj.id);
				calenderInstance.addEvent(modulCalenderObj);
			}
		}
	}

	function addButtonsToDagsnoter(year, week) {
		const slots = document.getElementsByClassName('ec-day');
		const slotsFiltered = [];
		if (window.innerWidth < 768) slotsFiltered.push(slots[1]);
		else for (let i = 0; i < slots.length; i++) if (i >= 5 && i <= 9) slotsFiltered.push(slots[i]);

		// add buttons to slots
		for (let i = 0; i < slotsFiltered.length; i++) {
			const infoobj = skema[String(year) + week].dagsNoter[i];
			const [currentDay] = Object.keys(infoobj);
			const currentInfoArr = infoobj[currentDay];
			let currentInfo = `<p>`;
			for (let j = 0; j < currentInfoArr.length; j++) currentInfo += `${currentInfoArr[j] }</p><p>`;

			slotsFiltered[i].innerHTML = `
			<div tabindex="0" class="collapse collapse-arrow">
				<div class="collapse-title font-medium">
					Se dagsnoter
				</div>
				<div class="collapse-content">
					${currentInfo}
				</div>
			</div>
			`;
		}
	}

	function getSkema() {
		if (!skema) skema = {};

		get(`/skema?id=${skemaId}&uge=${globalWeek}&år=${globalYear}`).then(data => {
			skema[String(globalYear) + globalWeek] = data;
			heading = skema?.[String(globalYear) + globalWeek]?.overskrift || 'skema';

			mySkema = cookie.userid === skemaId.slice(1);

			options.slotMinTime = parseInt(Object.values(skema[String(globalYear) + globalWeek].modulTider)[0]
				.split(' - ')[0]
				.split(':')[0] - 1).toString();
			options.slotMaxTime = (
				parseInt(Object.values(skema[String(globalYear) + globalWeek].modulTider)
					.slice(-1)[0]
					.split(' - ')[1]
					.split(':')[0]) + 1
			).toString();

			addButtonsToDagsnoter(globalYear, globalWeek);
		});
	}

	$: if (globalWeek) console.log(`week changed to: ${ globalWeek}`);
	$: if (globalWeek && globalYear) getSkema();
	$: if (skema?.[String(globalYear) + globalWeek]) addSkemaToCalendar(skema[String(globalYear) + globalWeek]);
</script>

<div class="my-2 flex justify-between">
	<h1 class="heading">{heading}</h1>

	{#if cookie?.userid}
		<a
			class="btn hidden md:flex"
			href={`https://www.lectio.dk/lectio/${cookie.school}/studieplan.aspx?elevid=${cookie.userid}`}
			target="_blank"
		>
			Se studieplan
		</a>
	{/if}
</div>

<div class="translate-y-5 md:translate-y-0">
	<Calendar bind:this={calenderInstance} {plugins} {options} />
</div>

<div class="divider hidden md:flex" />
{#if mySkema}
	<a
		href="/værktøjer/googlecalsync?week={globalWeek}&from=skema"
		class="btn btn-sm pl-1 rounded-full shadow-sm hidden md:inline-flex items-center"
	><p class="btn btn-xs btn-accent font-black rounded-full">NY!</p>
		synkroniser denne uge med Google Kalender
	</a>
{/if}
