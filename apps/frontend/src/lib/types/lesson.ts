export type RawLesson = {
  absid: null | string;
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
  id: string | null;
  date: string;
  class: string | null;
  name: string | null;
  note: string | null;
  room: string | null;
  status: string | null;
  teacher: string | null;
};
