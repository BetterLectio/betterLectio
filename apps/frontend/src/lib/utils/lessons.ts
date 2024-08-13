import { lessonsStore } from '$lib/stores';
import type { RawLesson } from '$lib/types/lesson';
import { get } from 'svelte/store';
import { constructInterval } from './other';

export const getSurroundingLessons = (currentLesson: RawLesson) => {
  const rawLessons = get(lessonsStore);

  const lessons: RawLesson[] = Object.values(rawLessons).flat();

  lessons.sort((a, b) => {
    const aStart = constructInterval(a.tidspunkt).start;
    const bStart = constructInterval(b.tidspunkt).start;

    if (aStart && bStart) {
      return aStart.toMillis() - bStart.toMillis();
    } else if (aStart) {
      return -1;
    } else if (bStart) {
      return 1;
    } else {
      return 0;
    }
  });

  const teamLessons = lessons.filter(lesson => lesson.hold_id === currentLesson.hold_id);

  const findSurroundingLessons = (lessonsArray: RawLesson[]) => {
    const index = lessonsArray.findIndex(lesson => lesson.absid === currentLesson.absid);
    return {
      previous: lessonsArray[index - 1] || null,
      next: lessonsArray[index + 1] || null
    };
  };

  const { previous, next } = findSurroundingLessons(lessons);
  const { previous: previousClass, next: nextClass } = findSurroundingLessons(teamLessons);

  return { previous, next, previousClass, nextClass };
};