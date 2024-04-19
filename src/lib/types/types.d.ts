import type { Interval } from 'luxon';

type Person = {
	bruger_id: string;
	navn: string;
};

type Inlæg = {
	bruger: Person;
	dokument: string;
	indlæg: string;
	tidspunkt: string;
};

type Opgave = {
	afleveres_af: {
		afsluttet: boolean;
		afventer: 'Elev' | 'Lærer' | '';
		elev: Person;
		elevnote: string;
		karakter: string;
		karakternote: string;
		status_fravær: string;
	};
	gruppemedlemmer: Array<Person>;
	opgave_indlæg: Array<Inlæg>;
	oplysninger: {
		afleveringsfrist: string;
		ansvarlig: Person;
		elevtid: string;
		hold: string;
		i_undervisningsbeskrivelse: 'Ja' | 'Nej';
		karakterskala: string;
		opgavebeskrivelse: string | null;
		opgavenote: string;
		opgavetitel: string;
	};
};

type OpgaveList = {
	afventer: string;
	'elev-tid': string;
	elevnote: string;
	exerciseid: string;
	fravær: string;
	frist: string;
	hold: string;
	karakter: string;
	opgavenote: string;
	opgaver: string;
	opgavetitel: string;
	status: string;
	uge: string;
	date: Date;
};

type Besked = {
	emne: string;
	førsteBesked: string;
	message_id: string;
	modtagere: string[];
	senesteBesked: string;
	ændret: string;
};

export type RawLesson = {
	absid: string;
	andet: null | string;
	hold: null | string;
	hold_id: null | string;
	lokale: null | string;
	lærer: null | string;
	navn: null | string;
	status: 'aflyst' | 'eksamen' | 'normal' | 'ændret' | null | string;
	tidspunkt: string;
};

export type Lesson = {
	color: string;
	textColor: string;
	class: string;
	id: string;
	interval: Interval;
	name: string;
	note: string;
	room: string;
	status: string;
	teacher: string;
};

export type Module = {
	homework: null | string;
	lesson: {
		class: string;
		name: string;
		interval: Interval;
		room: string;
		teacher: string;
	};
	note: null | string;
	otherContent: null | string;
	groups: { name: string; isMe: boolean; members: { name: string; id: string; me: boolean }[] }[];
	presentation: null | string;
};

export type RawModule = {
	aktivitet: RawLesson;
	lektier: null | string;
	note: null | string;
	præsentation: null | string;
	øvrigtIndhold: null | string;
	grupper: Record<string, string[]>;
};
