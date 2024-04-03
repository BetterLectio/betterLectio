import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { google as googleLib } from 'googleapis';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import type { GaxiosResponse } from 'gaxios';
import type { calendar_v3 } from 'googleapis';
import { batchFetchImplementation } from '@jrmdayn/googleapis-batcher';
import { DateTime } from 'luxon';

function getWeekNumber(d: Date): number {
	const dt = DateTime.fromJSDate(d);
	return dt.weekNumber;
}

export const GET: RequestHandler = async ({ url, request, fetch }) => {
	const fetchImpl = batchFetchImplementation();
	//get the headers, "google" and "lectio"
	const headers = request.headers;
	let google = headers.get('google');
	let lectio = headers.get('lectio');

	if (google == null || lectio == null) return error(400, 'Missing headers');

	//check if the lectio cookie is valid
	const lectioAPI = `https://api.betterlectio.dk`;
	const lectioResponse = await fetch(lectioAPI + '/check-cookie', {
		headers: {
			'lectio-cookie': String(lectio)
		}
	});

	let json = await lectioResponse.json();
	if (json.valid == false) return error(401, 'Invalid lectio cookie');

	const oauth2Client = new googleLib.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

	let decodedGoogleToken = JSON.parse(atob(google));
	//console.log(decodedGoogleToken);

	oauth2Client.setCredentials(decodedGoogleToken);

	const calendar = googleLib.calendar({
		version: 'v3'
	});

	const calendarBatch = googleLib.calendar({
		version: 'v3',
		fetchImplementation: fetchImpl
	});
	//list the next 10 events
	let events: GaxiosResponse<calendar_v3.Schema$Events>;
	try {
		let week = getWeekNumber(new Date());
		let year = new Date().getFullYear();

		const startOfWeek = new Date(year, 0, 2 + (week - 1) * 7, 1);
		const endOfWeek = new Date(year, 0, 2 + (week - 1) * 7 + 6, 1);

		//remove all events from the calendar with the uid "betterlectio..." from the given week
		let list = await calendar.events.list({
			auth: oauth2Client,
			calendarId: 'primary',
			q: 'betterlectio',
			timeMin: startOfWeek.toISOString(),
			timeMax: endOfWeek.toISOString(),
			singleEvents: true,
			orderBy: 'startTime',
			maxResults: 1000
		});

		const deleteEvents = await Promise.all(
			(list.data.items ?? []).map((event) => {
				return calendarBatch.events.delete({
					auth: oauth2Client,
					calendarId: 'primary',
					eventId: event.id!
				});
			})
		);

		let res = await fetch(`${lectioAPI}/skema?uge=${week}&år=${year}`, {
			headers: {
				'lectio-cookie': String(lectio)
			}
		});
		let skema = await res.json();

		let events = formatModuler(skema.moduler);

		//use the google calendar api to insert the events one by one
		const insertEvents = await Promise.all(
			events.map((event) => {
				return calendarBatch.events.insert({
					auth: oauth2Client,
					calendarId: 'primary',
					requestBody: event
				});
			})
		);
		return new Response('OK');
	} catch (e) {
		console.error(e);
		return error(500, 'An error occured');
	}
};

//TODO: CHORE: ADD TYPES
//TODO: CHORE: ADD TYPES
//TODO: CHORE: ADD TYPES

function convertLectioTime(dateString: string) {
	const [startDateString, endDateString] = dateString.split(' til ');
	const matchArray = startDateString.match(/\d+/gu);
	if (matchArray === null) {
		throw new Error('Invalid date string');
	}
	const [startDay, startMonth, startYear, startHour, startMinute] = matchArray;
	const endMatchArray = endDateString.match(/\d+/gu);
	if (endMatchArray === null) {
		throw new Error('Invalid date string');
	}
	const [endHour, endMinute] = endMatchArray;

	let startDate = DateTime.local(
		Number(startYear),
		Number(startMonth),
		Number(startDay),
		Number(startHour),
		Number(startMinute)
	);

	let endDate = DateTime.local(
		Number(startYear),
		Number(startMonth),
		Number(startDay),
		Number(endHour),
		Number(endMinute)
	);

	//set the start and the end date to the copenhagen timezone
	startDate = startDate.setZone('Europe/Copenhagen'); // utc+1
	endDate = endDate.setZone('Europe/Copenhagen'); // utc+1

	//if denmark is in daylight saving time, set the timezone to utc+2
	if (DateTime.now().setZone('Europe/Copenhagen').offsetNameShort === 'CEST') {
		startDate = startDate.minus({ hours: 1 });
		endDate = endDate.minus({ hours: 1 });
	}

	const formattedStartDate = startDate.toISO();
	const formattedEndDate = endDate.toISO();
	return [formattedStartDate, formattedEndDate];
}

function formatModuler(moduler: any[]) {
	let filteredModuler = moduler;

	// filter out moduler that have a status of 'aflyst'
	filteredModuler = filteredModuler.filter((modul) => modul.status !== 'aflyst');

	const events: any[] = [];
	filteredModuler.forEach((modul) => {
		const [startDate, endDate] = convertLectioTime(modul.tidspunkt);

		// create event does additonal processing of the event
		events.push(
			createEvent({
				...modul,
				googleStart: startDate,
				googleEnd: endDate,
				linkToLectio: `https://app.betterlectio.dk/modul?absid=${modul.absid}`,
				googleLocation: modul.lokale
			})
		);
	});
	return events;
}

function createEvent(modul: any) {
	const event = {
		summary: modul.hold,
		id: `betterlectio${modul.absid}at${DateTime.now().millisecond}`,
		description: modul.linkToLectio,
		start: {
			dateTime: modul.googleStart,
			timeZone: 'Europe/Copenhagen'
		},
		end: {
			dateTime: modul.googleEnd,
			timeZone: 'Europe/Copenhagen'
		},
		location: modul.googleLocation,
		reminders: {
			useDefault: false,
			overrides: [{ method: 'popup', minutes: 5 }]
		}
	};
	return event;
}

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*'
		}
	});
};
