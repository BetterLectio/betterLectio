import { lessonsStore } from "$lib/stores";
import type { RawLesson } from "$lib/types/lesson";
import { get } from "svelte/store";
import { constructInterval } from "./other";

export const getSourroundingLessons = (currentLesson: RawLesson) => {
    let rawLessons = get(lessonsStore);
    let lessons: RawLesson[] = [];

    let previous = null;
    let next = null;
    let previousTeam = null;
    let nextTeam = null;

    for (const week of Object.keys(rawLessons)) {
        lessons = lessons.concat(rawLessons[Number(week)]);
    }

    lessons.sort((a, b) => {
        const aStart = constructInterval(a.tidspunkt).start;
        const bStart = constructInterval(b.tidspunkt).start;
        return (aStart && bStart) ? aStart.toMillis() - bStart.toMillis() : 0;
    });
    const teamLessons = lessons.filter((lesson) => lesson.hold_id === currentLesson.hold_id);


    for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        if (lesson.absid === currentLesson.absid) {
            previous = lessons[i - 1];
            next = lessons[i + 1];
        }
    }
    for (let i = 0; i < teamLessons.length; i++) {
        const lesson = teamLessons[i];
        if (lesson.absid === currentLesson.absid) {
            previousTeam = teamLessons[i - 1];
            nextTeam = teamLessons[i + 1];
        }
    }

    return {
        next: next,
        previous: previous,
        nextTeam: nextTeam,
        previousTeam: previousTeam
    };
}