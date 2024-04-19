import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { DateTime, Interval } from 'luxon';
import { Buffer } from 'buffer';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const constructInterval = (input: string) => {
	const parts = input.split(' ');
	let fromDate, fromTime, toDate, toTime;
	if (parts.length === 4) {
		[fromDate, fromTime, , toTime] = parts;
		toDate = fromDate;
	} else if (parts.length === 5) {
		[fromDate, fromTime, , toDate, toTime] = parts;
	} else {
		return Interval.invalid('Invalid input string for interval');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const from = DateTime.fromFormat(`${fromDate} ${fromTime}`, 'd/M-yyyy HH:mm', { locale: 'da' });
	const to = DateTime.fromFormat(`${toDate} ${toTime}`, 'd/M-yyyy HH:mm', { locale: 'da' });
	return Interval.fromDateTimes(from, to);
};

export const stringToColor = (str: string, saturation = 100, lightness = 75) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
		hash &= hash;
	}
	return {
		h: hash % 360,
		l: lightness,
		s: saturation,
		string: `hsl(${hash % 360}, ${saturation}%, ${lightness}%)`
	};
};
export const decodeUserID = (cookie: string): string => {
	try {
		let data = [];
		if (typeof window !== 'undefined') data = JSON.parse(window.atob(cookie));
		else data = JSON.parse(Buffer.from(cookie, 'base64').toString());
		return data.filter((item: { name: string }) => item.name == 'LastLoginElevId')[0].value;
		return data.filter((item) => item.name == 'LastLoginElevId')[0].value;
	} catch (error) {
		console.log(error);
		return '54443227086'; // My user id xD
	}
};
