import type { DateTime } from 'luxon';

type RawUser = {
  bruger_id: string;
  navn: string;
};

type RawDocument = {
  bruger: RawUser;
  dokument: string;
  indlæg: string;
  tidspunkt: string;
};

export type RawAssignment = {
  mulige_gruppemedlemmer: RawUser[];
  afleveres_af: {
    afsluttet: boolean;
    afventer: string;
    elev: RawUser;
    elevnote: string;
    karakter: string;
    karakternote: string;
    status_fravær: string;
  };
  gruppemedlemmer: RawUser[];
  opgave_indlæg: RawDocument[];
  oplysninger: {
    afleveringsfrist: string;
    ansvarlig: RawUser;
    elevtid: string;
    hold: string;
    i_undervisningsbeskrivelse: 'Ja' | 'Nej';
    karakterskala: string;
    opgavebeskrivelse: null | string;
    opgavenote: string;
    opgavetitel: string;
  };
};

type User = {
  id: string;
  name: string;
};

type Document = {
  date: DateTime;
  name: null | string;
  url: null | string;
  user: User;
};

export type Assignment = {
  billedTime: string;
  class: string;
  date: DateTime;
  description: string;
  details: string;
  documents: Document[];
  participants: User[];
  status: string;
  title: string;
};

export type SimpleAssignment = {
  date: DateTime;
  description: string;
  class: string;
  link: string;
  status: 'Afleveret' | 'Mangler' | 'Venter';
  awaits: '' | 'Elev' | 'Lærer';
  title: string;
};

export type RawSimpleAssignment = {
  afventer: '' | 'Elev' | 'Lærer';
  'elev-tid': string;
  elevnote: string;
  exerciseid: string;
  fravær: string;
  frist: string;
  hold: string;
  karakter: string;
  opgavenote: string;
  opgavetitel: string;
  status: 'Afleveret' | 'Afsluttet' | 'Mangler' | 'Venter';
  uge: string;
};
