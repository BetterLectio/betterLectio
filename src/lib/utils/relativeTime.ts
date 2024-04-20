// from BetterLectio main repo

const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const month = day * (365 / 12);
const year = day * 365;

export function formatDate(date: Date): string {
	console.log('formatDate', date);
	const rtf = new Intl.RelativeTimeFormat(`da`, { style: `long` });
	const diff = Number(((date.getTime() - Date.now()) / 1000).toFixed(0));

	// Less than a minute has passed:
	if (Math.abs(diff) < minute) return rtf.format(diff, 'second');
	// Less than an hour has passed:
	else if (Math.abs(diff) < hour) return rtf.format(Math.floor(diff / minute), 'minute');
	// Less than a day has passed:
	else if (Math.abs(diff) < day) return rtf.format(Math.floor(diff / hour), 'hour');
	// Less than a month has passed:
	else if (Math.abs(diff) < month) return rtf.format(Math.floor(diff / day), 'day');
	// Less than a year has passed:
	else if (Math.abs(diff) < year) return rtf.format(Math.floor(diff / month), 'month');

	// More than a year has passed:
	return new Intl.DateTimeFormat('da-DK').format(date);
}
