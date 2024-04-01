import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { google as googleLib } from 'googleapis';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import type { GaxiosResponse } from 'gaxios';
import type { calendar_v3 } from 'googleapis';

function getWeekNumber(d: Date): number {
	d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
	let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	let weekNo = Math.ceil(((d.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7);
	return weekNo;
}

export const GET: RequestHandler = async ({ url, request, fetch }) => {
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

	const calendar = googleLib.calendar('v3');
	//list the next 10 events
	let events: GaxiosResponse<calendar_v3.Schema$Events>;
	try {
		let week = getWeekNumber(new Date());
		let year = new Date().getFullYear();
		console.log(week, year);

		//remove all events from the calendar with the uid "betterlectio..." from the given week
		let list = await calendar.events.list({
			auth: oauth2Client,
			calendarId: 'primary',
			q: 'betterlectio',
			timeMin: new Date().toISOString(),
			timeMax: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
		});
		console.log(list.data.items?.length);
		list.data.items?.forEach(async (event) => {
			await calendar.events.delete({
				auth: oauth2Client,
				calendarId: 'primary',
				eventId: event.id as string
			});
			console.log('Event deleted: %s', event.id);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		});
		await new Promise((resolve) => setTimeout(resolve, 1000));

		let res = await fetch(`${lectioAPI}/skema?uge=${week}&år=${year}`, {
			headers: {
				'lectio-cookie': String(lectio)
			}
		});
		let skema = await res.json();

		let events = formatModuler(skema.moduler);

		//use the google calendar api to insert the events one by one
		events.forEach(async (event) => {
			await calendar.events.insert(
				{
					auth: oauth2Client,
					calendarId: 'primary',
					requestBody: event
				},
				function (err, event) {
					if (err) {
						console.log('There was an error contacting the Calendar service: ' + err);
						return;
					}
					console.log('Event created: %s', event);
				}
			);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		});
	} catch (e) {
		console.error(error);
		return error(500, 'An error occured');
	}

	//console.log(events.data.items);

	return new Response('OK');
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

	// month is 0-indexed
	const startDate = new Date(
		Number(startYear),
		Number(startMonth) - 1,
		Number(startDay),
		Number(startHour),
		Number(startMinute),
		0
	);

	// month is 0-indexed
	const endDate = new Date(
		Number(startYear),
		Number(startMonth) - 1,
		Number(startDay),
		Number(endHour),
		Number(endMinute),
		0
	);

	const formattedStartDate = startDate.toISOString();
	const formattedEndDate = endDate.toISOString();
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
		id: `betterlectio${modul.absid}at${new Date().getUTCMilliseconds() + new Date().getUTCSeconds()}`,
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
