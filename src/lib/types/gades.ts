export type Infomation = {
	elev: string;
	skole: string;
	stamklasse: string;
	uddannelse: string;
};

export type GradeSheetEntry = {
	evalueringsform: string;
	fag: string;
	karakter: string;
	niveau: string;
	skoleår: string;
	type: string;
	vægtning: string;
};

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

export type GradeSummary = {
	karakterblad: {
		gennemsnit: number;
		karakterer: number;
	};
	protokollinjer: {
		gennemsnit: number;
		karakterer: number;
	};
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

export type GradeSubject = {
	fag: string;
	niveau: string;
	skoleår: string;
	evalueringsform: string;
};

export type RawGrade = {
	informationer: Infomation;
	karakterblad: GradeSheetEntry[];
	karakternoter: GradeNote[];
	oversigt: GradeSummary;
	protokollinjer: PermanetGrade[];
};
