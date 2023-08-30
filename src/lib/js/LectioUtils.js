function makeCRCTable() {
	let num = 0;
	const crcTable = [];
	for (let i = 0; i < 256; i++) {
		num = i;
		for (let k = 0; k < 8; k++) num = ((num & 1) ? (0xEDB88320 ^ (num >>> 1)) : (num >>> 1));

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
	let crc = 0 ^ (-1);

	for (let i = 0; i < string.length; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ string.charCodeAt(i)) & 0xFF];

	return (crc ^ (-1)) >>> 0;
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
	switch (modul.status) {
	case 'normal':
	case 'ændret':
		if (useDifferentColors) return `hsl(${getHoldHue(modul.hold)}, 75%, 65%, 0.25)`;
		return 'hsl(212.5, 75%, 65%, 0.25)';
	case 'eksamnen':
		return 'hsl(262, 100%, 65%, 0.25)';
	default:
		return 'hsl(0, 0%, 0%, 0.1)';
	}
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
