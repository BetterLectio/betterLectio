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
