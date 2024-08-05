import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import { LECTIO_API_URL, checkLectioCookie, convertLectioExamName, convertLectioInterval } from '$lib/lectio';
import type { CalendarEvent, EventSyncOptions, GoogleResponse } from '$lib/types/google';
import type { Modul } from '$lib/types/lectio';
import { CORS_HEADERS, errorResponse } from '$lib/utils';
import { batchFetchImplementation } from '@jrmdayn/googleapis-batcher';
import { calendar_v3, google as googleLib } from 'googleapis';
import { DateTime } from 'luxon';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const fetchImpl = batchFetchImplementation();
	const headers = request.headers;
	const googleToken = headers.get('google');
	const lectioCookie = headers.get('lectio');

	if (!googleToken || !lectioCookie) return errorResponse('Missing auth headers');

	const options = await request.json() as EventSyncOptions;
	if (!options) return errorResponse('Missing options');
	if (!options.calendarId) return errorResponse('Missing calendarId');
	if (!options.week) return errorResponse('Missing week');
	if (!options.year) return errorResponse('Missing year');
	if (typeof options.blacklist !== 'string') return errorResponse('Missing blacklist');
	if (options.blacklist === '') options.blacklist = 'YouShallNotPass';
	try {
		new RegExp(options.blacklist);
	} catch (e) {
		return errorResponse('Blacklist must be a valid regex');
	}
	if (!options.eventReminders) return errorResponse('Missing eventReminders');
	if (typeof options.eventReminders !== 'object') return errorResponse('eventReminders must be an array');

	const isCookieValid = await checkLectioCookie(lectioCookie);
	if (!isCookieValid) return errorResponse('Invalid lectio cookie', 401);

	const calendarAuth = new googleLib.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
	let decodedGoogleToken = JSON.parse(atob(googleToken));
	calendarAuth.setCredentials(decodedGoogleToken);
	const calendarApi = googleLib.calendar({
		version: 'v3'
	});
	const batchCalendarApi = googleLib.calendar({
		version: 'v3',
		fetchImplementation: fetchImpl
	});

	const week = options.week;
	const year = options.year;
	const startOfWeek = DateTime.fromObject({ weekYear: year, weekNumber: week, weekday: 1 }).toISO() ?? '';
	const endOfWeek = DateTime.fromObject({ weekYear: year, weekNumber: week, weekday: 7 }).toISO() ?? '';

	// List all events from the calendar with the uid "betterlectio..." in the current week
	let list: GoogleResponse<calendar_v3.Schema$Events>;
	try {
		list = await calendarApi.events.list({
			auth: calendarAuth,
			calendarId: options.calendarId,
			q: 'betterlectio',
			timeMin: startOfWeek,
			timeMax: endOfWeek,
			singleEvents: true,
			orderBy: 'startTime',
			maxResults: 1000
		});
	} catch (e) {
		return errorResponse('Invalid google token', 401);
	}

	// Delete all events from the calendar with the uid "betterlectio..." from the current week
	await Promise.all(
		(list.data.items ?? []).map((event) => {
			return batchCalendarApi.events.delete({
				auth: calendarAuth,
				calendarId: options.calendarId,
				eventId: event.id!
			});
		})
	);

	const res = await fetch(`${LECTIO_API_URL}/skema?uge=${week}&år=${year}`, {
		headers: {
			'lectio-cookie': String(lectioCookie)
		}
	});
	const skema = await res.json() as { moduler: Modul[] };
	const events = formatModuler(skema.moduler, options);

	// Create the calendar events
	const insertedEvents = await Promise.all(
		events.map((event) => {
			return batchCalendarApi.events.insert({
				auth: calendarAuth,
				calendarId: options.calendarId,
				requestBody: event
			});
		})
	);

	const success = insertedEvents.filter((event) => event.status === 200).length;
	return new Response(JSON.stringify({ total: insertedEvents.length, success, failed: insertedEvents.length - success }), {
		headers: CORS_HEADERS
	});
};

function formatModuler(moduler: Modul[], options: EventSyncOptions): CalendarEvent[] {
	let filteredEvents = moduler.filter((modul) => modul.tidspunkt);
	filteredEvents = filteredEvents.filter((modul) => modul.status !== 'aflyst');
	const blacklist = new RegExp(options.blacklist);
	filteredEvents = filteredEvents.filter((modul) => !blacklist.test(modul.navn?.toLowerCase() || ''));

	return filteredEvents.map((modul) => {
		const [startDate, endDate] = convertLectioInterval(modul.tidspunkt!);

		return {
			summary: modul.navn ? convertLectioExamName(modul.navn) : modul.hold,
			id: `betterlectio${modul.absid}at${DateTime.now().toFormat('yyyyMMddHHmmss')}`,
			description: `https://app.betterlectio.dk/modul?absid=${modul.absid}`,
			start: {
				dateTime: startDate,
				timeZone: 'Europe/Copenhagen'
			},
			end: {
				dateTime: endDate,
				timeZone: 'Europe/Copenhagen'
			},
			location: modul.lokale,
			reminders: {
				useDefault: false,
				overrides: options.eventReminders
			}
		}
	})
}

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		headers: CORS_HEADERS
	});
};


