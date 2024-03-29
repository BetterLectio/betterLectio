<script>
	import { fag, indstillinger } from '$lib/js/store.js';
	import { getModulColor, standardizeTimeRange } from '$lib/js/LectioUtils.js';
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import { addNotification } from '$lib/js/notifyStore.js';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { get } from '$lib/js/http.js';
	import { goto } from '$app/navigation';
	import { holdOversætterNy } from '$lib/js/HoldOversætter.js';

	let skema = {};
	let heading = 'Skema';
	let mySkema = null;

	let globalDay;
	const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

	$fag = $fag ?? {};

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
		days: 'overflow-y-hidden ec-days',
		draggable: 'ec-draggable',
		dragging: 'ec-dragging',
		event:
			'btn btn-xs absolute flex-nowrap w-full h-full overflow-hidden visible hover:scale-105 z-5 hover:z-0 border-0 m-0.5 no-animation',
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
			'flex items-center ec-toolbar bg-base-100 border border-1 md:border-none md:text-base-content md:bg-base-100 p-2 rounded-t-2xl -mt-8 md:mt-0 ',
		uniform: 'ec-uniform',
		week: 'ec-week'
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

	// FIXME: Date.prototype.getWeekNumber is implemented in another route
	function getWeekNumber(date = new Date()) {
		if (date.getWeekNumber) return date.getWeekNumber();

		// const today = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
		const weekDays = 7;
		const dayNum = date.getUTCDay() || weekDays;
		date.setUTCDate(date.getUTCDate() + 4 - dayNum);
		const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
		const sinceYearStart = date - yearStart;
		const msInDay = 86400000;
		const daysSinceStartOfYear = sinceYearStart / msInDay;
		return Math.ceil((daysSinceStartOfYear + 1) / weekDays);
	}

	const options = {
		locale: 'da',
		view: 'timeGridWeek',
		nowIndicator: true,
		theme: customTheme,
		hiddenDays: [0, 6],
		flexibleSlotTimeLimits: true,
		slotMinTime: '00:00:00',
		slotMaxTime: '24:00:00',
		events: [],
		dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'numeric' },
		slotDuration: '00:30:00',
		slotEventOverlap: false,
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
		viewDidMount: view => {
			dertermineView();
			globalDay = calenderInstance.getView().currentStart.getDay();
			const dateObj = new Date(view.currentEnd.toISOString());
			globalYear = dateObj.getFullYear();
			const dayOfYear = 2 + Math.floor((dateObj - new Date(dateObj.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
			globalWeek = Math.floor(dayOfYear / 7);
			onload();
		},
		eventClick: info => {
			if (!info.event.id.includes('privat')) goto(`/modul?absid=${info.event.id}`);
			else addNotification('modul siden er ikke tilgængelig for private moduler', 'alert-warning');
		}
	};

	onresize = () => {
		// if the window is less than 768px wide, change the view to "listDay"
		options.view = dertermineView();
	};

	async function addSkemaToCalendar(_skema) {
		options.view = dertermineView();
		for (let i = 0; i < _skema.moduler.length; i++) {
			const modul = _skema.moduler[i];
			let titel = '';

			// can be "normal" "ændret" "aflyst" or "eksamen"
			const { status } = modul;

			if (modul.hold_id !== null && $fag[modul.hold_id] === undefined) {
				// eslint-disable-next-line no-await-in-loop
				await holdOversætterNy(modul.hold_id, modul.hold).then(_fag => {
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
				calenderInstance.addEvent(modulCalenderObj);
			}
		}
	}

	function onViewChange() {
		const date = calenderInstance.getView().currentEnd;
		globalDay = calenderInstance.getView().currentStart.getDay();
		globalWeek = getWeekNumber(date);
		globalYear = date.getFullYear();
	}

	function addButtonsToDagsnoter(year, week, day) {
		const slots = document.getElementsByClassName('ec-day');
		const slotsFiltered = [];
		if (window.innerWidth < 768) slotsFiltered.push(slots[1]);
		else for (let i = 0; i < slots.length; i++) if (i >= 5 && i <= 9) slotsFiltered.push(slots[i]);


		// add buttons to slots
		for (let i = 0; i < slotsFiltered.length; i++) {
			let infoobj = skema[String(year) + week].dagsNoter[i];
			if (window.innerWidth < 768) infoobj = skema[String(year) + week].dagsNoter[day - 1];
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

	function onload() {
		const btns = document.getElementsByClassName('ONCHANGE');

		btns[0].addEventListener('click', () => {
			onViewChange();
		});
		btns[1].addEventListener('click', () => {
			onViewChange();
		});
		btns[2].addEventListener('click', () => {
			onViewChange();
		});
	}

	function getSkema() {
		if (!skema) skema = {};

		get(`/skema?id=${skemaId}&uge=${`0${ String(globalWeek)}`.slice(-2)}&år=${globalYear}`).then(data => {
			skema[String(globalYear) + globalWeek] = data;
			heading = skema?.[String(globalYear) + globalWeek]?.overskrift || 'skema';

			mySkema = cookie.userId === skemaId.slice(1);

			options.slotMinTime = parseInt(Object.values(skema[String(globalYear) + globalWeek].modulTider)[0]
				.split(' - ')[0]
				.split(':')[0] - 1).toString();
			options.slotMaxTime = (
				parseInt(Object.values(skema[String(globalYear) + globalWeek].modulTider)
					.slice(-1)[0]
					.split(' - ')[1]
					.split(':')[0]) + 1
			).toString();
		});
	}

	$: if (globalWeek) console.log(`week changed to: ${ globalWeek}`);
	$: if (globalWeek && globalYear) getSkema();
	$: if (skema?.[String(globalYear) + globalWeek]) addSkemaToCalendar(skema[String(globalYear) + globalWeek]);
	$: if (globalDay && skema?.[String(globalYear) + globalWeek]) addButtonsToDagsnoter(globalYear, globalWeek, globalDay);
</script>

<div class="my-2 flex justify-between">
	<h1 class="heading">
		<p class={window.innerWidth < 768 ? 'hidden' : 'visible'}>{heading}</p>
		<p class="font-normal">{window.innerWidth < 768 ? `${days[globalDay]} -` : ''} Uge {globalWeek}</p>
	</h1>
	{#if cookie?.userId}
		<a
			class="btn hidden md:flex"
			href="/studieplan"
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
		Synkroniser din uge med Google Kalender
	</a>
{/if}
