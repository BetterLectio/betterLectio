import type { Lesson, RawLesson } from "./lesson"

export type Module = {
    homework: null | string;
    lesson: Lesson;
    note: null | string;
    otherContent: null | string;
    presentation: null | string;
}

export type RawModule = {
    aktivitet: RawLesson;
    lektier: null | string;
    note: null | string;
    "præsentation": null | string;
    "øvrigtIndhold": null | string;
}