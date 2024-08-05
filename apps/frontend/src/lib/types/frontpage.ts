import type { Lesson, RawLesson } from '$lib/types/lesson';
import type { RawSimpleMessage, SimpleMessage } from '$lib/types/messages';
import type { News, RawNews } from '$lib/types/news';

export type RawFrontPage = {
	overskrift: string;
	skema: RawLesson[];
	aktuelt: RawNews[];
	undervisning: { opgaveaflevering?: { id: string; dato: string; navn: string }[] };
	kommunikation: {
		beskeder: RawSimpleMessage[];
	};
}

export type FrontPage = {
	lessons: Lesson[];
	assignments: { id: number; name: string; date: string }[];
	messages: SimpleMessage[];
	news: News[];
	name: string;
}