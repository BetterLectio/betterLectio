// @ts-nocheck

// function getHoldToColor() {
// 	const holdToColor = {};
// 	try {
// 		// if (!skema[String(globalYear) + globalWeek].hold) throw error;
// 		for (let i = 0; i < skema[String(globalYear) + globalWeek].hold.length; i++) holdToColor[skema[String(globalYear) + globalWeek].hold[i].navn] = 255 / (skema[String(globalYear) + globalWeek].hold.length - 1) * i;
// 		return holdToColor;
// 	} catch {
// 		console.log('could not get hold to color, proceeding with default');
// 		return holdToColor;
// 	}
// }
function makeCRCTable() {
	let num = 0;
	const crcTable = [];
	for (let i = 0; i < 256; i++) {
		num = i;
		for (let k = 0; k < 8; k++) num = num & 1 ? 0xedb88320 ^ (num >>> 1) : num >>> 1;

		crcTable[i] = num;
	}
	return crcTable;
}

const crcTable = makeCRCTable();

/**
 * Lav en unsigned 32-bit hashsum fra et stykke tekst
 *
 * @param {string} string String at lave hashsum fra
 * @returns {number} Hashsum som et 32-bit nummer
 */
function crc32(string) {
	let crc = 0 ^ -1;

	for (let i = 0; i < string.length; i++)
		crc = (crc >>> 8) ^ crcTable[(crc ^ string.charCodeAt(i)) & 0xff];

	return (crc ^ -1) >>> 0;
}

/**
 * Udregn hashsum af et (hold) string og returner
 * en hue udfra den hashsum.
 *
 * @param {string} hold Hold som string
 * @returns {number} Hue i range 0-360 som nummer
 */
export function getHoldHue(hold) {
	const float = (crc32(hold) >>> 0) / Math.pow(2, 32);

	return Math.round(float * 360);
}

/**
 * Generer farven for et skema-modul
 *
 * @param {Object} modul Modul-objektet
 * @param {boolean} useDifferentColors Skal modulet renderes i farver baseret på holdet?
 * @returns {string} CSS farve i hsl format
 */
export function getModulColor(modul, useDifferentColors) {
	const alpha = 0.4;
	try {
		switch (modul.status) {
			case 'aflyst':
				return `hsl(0, 100%, 50%, ${alpha})`;
			case 'normal':
			case 's2normal':
			case 'ændret':
				if (useDifferentColors) return `hsl(${getHoldHue(modul.hold)}, 75%, 50%, ${alpha})`;
			case 'eksamen':
			default:
		}
	} catch (error) {}
}

/**
 * Udregn elevens navn, userId, klasse og klasse indeks fra string parameter
 *
 * @param {string} navnOgKlasse Et string der definerer brugerens navn og klasse
 * @param {string} userId Brugerens Id. Kommer f.eks. fra value'en af $informationer.elever
 * @returns {Object} Objekt der inkluderer elevens navn, userId og (optional) klasse og indeks i klassen
 */
export function parseStudentInfo(navnOgKlasse, userId) {
	const lastParentheses = navnOgKlasse.lastIndexOf('(') || 0;
	const navn = navnOgKlasse.substring(0, lastParentheses) || navnOgKlasse;
	let klasse = navnOgKlasse.substring(lastParentheses);
	if (!klasse) {
		return {
			navn,
			userId,
			elevIndeks: ''
		};
	}

	const lastSpace = klasse.lastIndexOf(' ');
	let elevIndeks = klasse.slice(lastSpace, -1);

	if (isNaN(parseInt(elevIndeks))) {
		elevIndeks = '';
		klasse = klasse.slice(1, -1);
	} else {
		elevIndeks = ` ${elevIndeks}`;
		klasse = klasse.slice(1, lastSpace);
	}

	return {
		navn,
		userId,
		klasse,
		elevIndeks
	};
}

const lectioDateOptions = [
	'en-DK',
	{
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	}
];

/**
 * Input Lectio timestamp and output "Date constructor"-valid timestamp
 *
 * @example
 * ```javascript
 * standardizeTimeRange("21/8-2023 09:15 til 10:45")
 * // Expected output: [new Date("2023-08-21T09:15"), new Date("2023-08-21T10:45")]
 * ```
 * @param time Lectio time string
 * @returns Date timestamp(s)
 */
export function standardizeTimeRange(timeRangeRaw) {
	const dateTimestampSymbols = ['-', '-', 'T', ':', ''];
	const nowTimestamp = new Date().toLocaleString(...lectioDateOptions).replace(',', '');
	const result = [];

	const rawTimeArray = timeRangeRaw.split('til').map((timestamp) => timestamp.trim());
	for (let i = 0; i < rawTimeArray.length; i++) {
		// First, second (and third) are arbitrary
		// as they may be either a date or a time
		const [first, second, third, ...rest] = rawTimeArray[i]
			.match(/(?:\d+\.)?\d+/gu)
			.map((number) => number.padStart(2, '0'));

		const timeTwoDigit = rest.length
			? [third, second, first, ...rest].join('-')
			: [first, second].join('-');

		let standardizedDate = timeTwoDigit.padStart(nowTimestamp.length, nowTimestamp);

		// If end time is relative
		if (!rest.length) {
			const startTimestamp = result[0] || nowTimestamp;
			standardizedDate = timeTwoDigit.padStart(startTimestamp.length, startTimestamp);
		}

		const timeFormatted = standardizedDate
			.split(/[^0-9]/gu)
			.map((number, j) => number + dateTimestampSymbols[j])
			.join('');
		result.push(timeFormatted);
	}

	return result.map((timestamp) => new Date(timestamp));
}

const localeOptions = [
	'da-DK',
	{
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	}
];

/**
 * Iterér over et array af moduler og opdel dem i et map efter startdato, hvor key'en er en lokal datostreng
 *
 * @param modules Modul-array fra Lectio
 * @returns Nyt map med modulerne opdelt
 */
export function seperateModulesByDays(modules) {
	const result = new Map();
	const iterator = modules[Symbol.iterator]();

	let done = false;
	while (!done) {
		const module = iterator.next();
		if (module.done) {
			done = true;
			break;
		}
		const [moduleStart] = standardizeTimeRange(module.value.tidspunkt);

		const dateString = moduleStart.toLocaleDateString(...localeOptions);
		const existingEntry = result.get(dateString);
		if (existingEntry === undefined) {
			result.set(dateString, [module.value]);
		} else {
			existingEntry.push(module.value);
		}

		if (module.done) done = true;
	}

	return result;
}
