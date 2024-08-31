import type { RawLesson } from './lesson';

export type DagNote = {
  [day: string]: string[];
};

export type Hold = {
  id: string;
  navn: string;
};

export type ModulTid = {
  [modul: string]: string;
};

export type RawSchedule = {
  dagsNoter: DagNote[];
  hold: Hold[];
  modulTider: ModulTid[];
  moduler: RawLesson[];
  overskrift: string;
  type: string;
  ugeDage: string[];
};
