import type { Lesson, RawLesson } from "./lesson";

export type RawHomework = {
    aktivitet: RawLesson;
    lektier: string;
};

export type Homework = {
    homework: string;
    lesson: Lesson;
};