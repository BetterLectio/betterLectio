<script defer>
	import Spinner from '$lib/components/Spinner.svelte';
	import { cookieInfo } from '$lib/js/LectioCookieHandler.js';
	import { get } from '$lib/js/http.js';
	import moment from 'moment';

	let counterIsVisible = true;
	const timeRegex
		= /(?<date>(?:[1-9]|[12][0-9]|3[01])\/(?:[1-9]|1[012])-(?:19|20)\d\d) (?<startTime>(?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9])) til (?<endTime>(?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9]))/mu;

	let id = null;
	cookieInfo().then(cookie => {
		if (id === null) id = `S${ cookie.userId}`;
	});

	// eslint-disable-next-line no-extend-native
	Date.prototype.getWeekNumber = function() {
		const today = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
		const weekDays = 7;
		const dayNum = today.getUTCDay() || weekDays;
		today.setUTCDate(today.getUTCDate() + 4 - dayNum);
		const yearStart = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
		const sinceYearStart = today - yearStart;
		const msInDay = 86400000;
		const daysSinceStartOfYear = sinceYearStart / msInDay;
		return Math.ceil((daysSinceStartOfYear + 1) / weekDays);
	};

	function nameBlacklisted(name) {
		// Test
		return false;

		let lessonName = name;

		// TODO: Check notes for "frivillig" string (very rare)
		if (lessonName === null) return false;

		lessonName = lessonName.toLowerCase();

		if (['obligatorisk'].some(item => name.includes(item))) return false;

		if (['café',
			'cafe',
			'klub',
			'club',
			'fri',
			'konkurrence',
			'mesterskab',
			'workshop',
			'kemi ol'].some(item => name.includes(item))) return true;

		return false;
	}

	async function getLastLessonOfDay() {
		const week = new Date().getWeekNumber();
		const year = new Date().getFullYear();
		const date = new Date().getDate();
		const month = new Date().getMonth() + 1;
		const filter = `${date}/${month}-${year}`;

		const response = await get(`/skema?id=${id}&uge=${week}&år=${year}`);

		let lastModulOfTheDaytime = '';
		for (const modul of response.moduler) {
			const { status, navn, tidspunkt } = modul;
			if (status !== 'aflyst' && !nameBlacklisted(navn) && tidspunkt.includes(filter)) lastModulOfTheDaytime = tidspunkt;
		}

		if (lastModulOfTheDaytime === '') return 'no lessons today';

		const timeMatch = timeRegex.exec(lastModulOfTheDaytime);
		const { date: endDate, endTime } = timeMatch.groups;
		const momentTime = moment(`${endDate} ${endTime}`, 'D/M-YYYY HH:mm');
		return { time: momentTime };
	}

	let lastLesson = null;
	async function hasId() {
		const refreshTime = 50;
		if (id === null) {
			setTimeout(hasId, refreshTime);
			return;
		}
		lastLesson = await getLastLessonOfDay();
	}
	hasId();

	function getRemainingTime() {
		if (lastLesson === 'no lessons today') {
			const counterel = document.getElementById('counter');
			counterel.parentNode.removeChild(counterel);
			const ingentimerel = document.getElementById('ingentimer');
			ingentimerel.classList.remove('hidden');
			counterIsVisible = false;
			return null;
		}

		const now = moment();
		const duration = moment.duration(lastLesson.time.diff(now));
		const secondsLeft = duration.seconds();
		const minutesLeft = duration.minutes();
		const hoursLeft = duration.hours();
		if (now.isAfter(lastLesson.time)) {
			const counterel = document.getElementById('counter');
			counterel.parentNode.removeChild(counterel);
			const friel = document.getElementById('fri');
			friel.classList.remove('hidden');
			counterIsVisible = false;
			return null;
		}
		return [hoursLeft, minutesLeft, secondsLeft];
	}

	const second = 1000;
	setInterval(async() => {
		if (lastLesson !== null && counterIsVisible) {
			const timeRemaining = await getRemainingTime();
			if (timeRemaining === null) {
				clearInterval(this);
				return;
			}
			document.getElementById('counterElementh').style.setProperty('--value', timeRemaining[0]);
			document.getElementById('counterElementm').style.setProperty('--value', timeRemaining[1]);
			document.getElementById('counterElements').style.setProperty('--value', timeRemaining[2]);
		}
	}, second);
</script>

<div class="grid h-[calc(100vh-104px)] place-items-center -mt-[52px]"> <!--104px/2 = 52px-->
	{#if lastLesson}
		<div class="grid auto-cols-max grid-flow-col gap-5 text-center" id="counter">
			<div class="flex flex-col">
				<span class="countdown font-mono text-6xl md:text-9xl">
					<span id="counterElementh" />
				</span>
				Timer
			</div>
			<div class="flex flex-col">
				<span class="countdown font-mono text-6xl md:text-9xl">
					<span id="counterElementm" />
				</span>
				Minutter
			</div>
			<div class="flex flex-col">
				<span class="countdown font-mono text-6xl md:text-9xl">
					<span id="counterElements" />
				</span>
				Sekunder
			</div>
		</div>
		<p class="hidden font-mono text-6xl font-bold lg:text-9xl" id="fri">Du har fri!</p>
		<p class="hidden font-mono text-2xl font-bold lg:text-4xl" id="ingentimer">Du har ingen timer i dag!</p>
	{:else}
		<Spinner />
	{/if}
</div>
