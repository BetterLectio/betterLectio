export type Information = {
	students: Student[];
	groups: string[];
};
export type RawInformation = {
	elever: { [key: string]: string };
	lærere: { [key: string]: string };
	hold_og_grupper: { [key: string]: string };
};
export type Student = { id: string; name: string; klasse: string };
