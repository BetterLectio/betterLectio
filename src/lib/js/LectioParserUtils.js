/**
 * Udregn elevens navn, userId, klasse og klasse indeks fra string parameter
 *
 * @param {string} navnOgKlasse Et string der definerer brugerens navn og klasse
 * @param {string} userId Brugerens Id. Kommer f.eks. fra value'en af $informationer.elever
 * @returns Objekt der inkluderer elevens navn, userId og (optional) klasse og indeks i klassen
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
