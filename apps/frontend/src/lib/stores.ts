import type { RawSimpleAssignment } from '$lib/types/assignments';
import type { Message, RawMessage } from '$lib/types/messages';
import type { RawGrade } from './types/grades';
import { writable, type Writable } from 'svelte/store';
import type { RawAbsence } from './types/absence';
import { localStore } from './utils/localStore';
import { lectioDataStore } from '$lib/utils/lectioDataStore';
import type { FrontPage, RawFrontPage } from '$lib/types/frontpage';
import { stringToColor } from '$lib/utils';
import { NAME_REGEX } from '$lib/utils/other';
import type { GoogleSyncSettings } from '$lib/types/google';
import type { RawLesson } from './types/lesson';
import type { RawHomework } from './types/homework';
import type { Rooms } from './types/rooms';

export { screenSizeStore } from '$lib/utils'; // To allow importing screenSizeStore from 'stores'

export const sidebarStore = writable({ alwaysOpen: false, isOpen: false });

export const avatarStore: Writable<Record<string, string>> = writable({});

export const loadingStore = writable<boolean>(false);

export const versionStore = localStore<string | null>('version', null);

export const connectionStore = writable<boolean>(true);

export const authStore = localStore<{
  cookie: string | null;
  googleToken: string | null;
  school: number | null;
  username: string | null;
  password: string | null;
  name: string | null;
}>('auth', {
  cookie: null,
  googleToken: null,
  school: null,
  username: null,
  password: null,
  name: null
});

export const googleSyncStore = localStore<GoogleSyncSettings>('googleSettings', {
  enabled: false,
  CalenderEnabled: false,
  TaskEnabled: false,
  googleToken: '',
  lectioToken: '',
  tokenValid: false,
  calendar: null,
  tasks: null
});

export const assignmentStore = lectioDataStore<RawSimpleAssignment[] | null>(
  '/opgaver',
  'assignments',
  null
);

export const homeworkStore = lectioDataStore<RawHomework[]>('/lektier', 'homework', [], (data) =>
  data.map((homework) => ({
    ...homework,
    lesson: {
      color: stringToColor(homework.aktivitet.hold ?? '', 100, 90).string,
      id: homework.aktivitet.absid,
      date: homework.aktivitet.tidspunkt,
      class: homework.aktivitet.hold,
      name: homework.aktivitet.navn,
      note: homework.aktivitet.andet,
      room: homework.aktivitet.lokale,
      status: homework.aktivitet.status,
      teacher: homework.aktivitet.lærer
    }
  }))
);

export const roomsStore = lectioDataStore<Rooms>('/lokale_dagsorden', 'rooms', [], (data) => {
  return data.map((room) => ({
    id: room.id,
    moduler: room.moduler,
    navn: room.navn
  }));
});

export const messageStore = lectioDataStore<Message[] | null, RawMessage[]>(
  '/beskeder2',
  'messages',
  null,
  (data) =>
    data.map((message) => ({
      date: message.dato,
      id: message.message_id,
      receivers: message.modtagere,
      sender: message.førsteBesked.split(' (')[0].split(' -')[0],
      title: message.emne
    }))
);

export const frontPageStore = lectioDataStore<FrontPage | null, RawFrontPage>(
  '/forside',
  'frontpage',
  null,
  (data) => {
    let userName = data.overskrift;
    const matches = NAME_REGEX.exec(data.overskrift);
    if (matches) {
      userName = matches[1];
    }

    return {
      lessons: data.skema.map((lesson) => ({
        color: stringToColor(lesson.hold ?? '', 100, 90).string,
        id: lesson.absid,
        date: lesson.tidspunkt,
        class: lesson.hold,
        name:
          lesson.navn
            ?.replace('prv.', 'prøve')
            .replace('mdt.', 'mundtlig')
            .replace('skr.', 'skriftlig') ?? null,
        note: lesson.andet,
        room: lesson.lokale,
        status: lesson.status,
        teacher: lesson.lærer
      })),
      assignments:
        data.undervisning?.opgaveaflevering?.map((assignment) => ({
          id: +assignment.id,
          name: assignment.navn,
          date: assignment.dato
        })) ?? [],
      messages: data.kommunikation.beskeder.map((message) => ({
        date: message.dato,
        id: +message.id,
        sender: message.afsender,
        title: message.navn
      })),
      news: data.aktuelt.map((item) => ({
        description: item.text.replaceAll('@', '@<!-- -->') // Without this, emails get obfuscated with random hex characters. https://github.com/github/markup/issues/1168
      })),
      name: userName
    };
  }
);

export const absenceStore = lectioDataStore<RawAbsence | null>('/fravaer', 'absence', null);

export const gradesStore = lectioDataStore<RawGrade | null>('/karakterer', 'grades', null);

export const informationStore = lectioDataStore<
  {
    students: { id: string; name: string }[];
    groups: string[];
  } | null,
  {
    elever: { [key: string]: string };
    lærere: { [key: string]: string };
    hold_og_grupper: { [key: string]: string };
  }
>('/informationer', 'information', null, (data) => {
  const students = Object.entries({ ...data.elever, ...data.lærere }).map(([name, id]) => {
    const formatted = name.split(' (')[0].split(' -')[0];
    return {
      id,
      name: formatted
    };
  });
  const groups = Object.entries(data.hold_og_grupper ?? {}).map(([name]) => name);
  return {
    students,
    groups
  };
});

export const lessonsStore = localStore<{ [key: number]: RawLesson[] }>('lessons', {});
