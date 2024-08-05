export type GradeNote = {
	hold: {
		id: string;
		navn: string;
	};
	indskrevet: string;
	karakter: string;
	karakternote: string;
	karaktertype: string;
};

export type PermanetGrade = {
	evalueringsform: string;
	hold: {
		id: string;
		navn: string;
	};
	karakter: string;
	medtæller: string;
	skala: string;
	termin: string;
	type: string;
	'type/termin': string;
	vægt: string;
	xprs_fag: {
		id: string;
		navn: string;
	};
};

export type GradeLine = {
	'1.standpunkt': string;
	'2.standpunkt': string;
	'afsluttende års-/standpunktskarakter': string;
	'eksamens-/årsprøvekarakter': string;
	'intern prøve': string;
	årskarakter: string;
	evalueringsform: string;
	fag: string;
	niveau: string;
	vægtning: string;
};

export type RawGrade = {
	karakternoter: GradeNote[];
	karakterer: { [key: string]: GradeLine };
	protokollinjer: PermanetGrade[];
};
