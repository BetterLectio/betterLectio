import { LECTIO_OAUTH_API } from '$lib/lectio';
import type { GoogleSyncCheckTokenObject, GoogleSyncObject } from '$lib/types/google';
import { DateTime } from 'luxon';

self.onmessage = (event) => {
	const { task } = event.data;
	if (!task) return;

	const { req } = event.data;
	switch (task) {
		case 'syncEvents':
			syncEvents(req);
			break;
		case 'syncTasks':
			syncTasks(req);
			break;
		case 'checkToken':
			checkToken(req);
			break;
		case 'listCalendars':
			listCalendars(req);
			break;
		case 'listTasks':
			listTasks();
			break;
		case 'deleteEvents':
			deleteEvents(req);
			break;
	}
};

async function syncEvents(req: GoogleSyncObject) {
	if (!req.settings.calendar) return;

	console.log(req);

	let week = DateTime.now().weekNumber;
	let year = DateTime.now().year;

	let weeks = [];

	// use the amount of weeks from the settings to calculate all the weeks that should be synced
	for (let i = 0; i < req.settings.calendar.amountOfWeeks; i++) {
		weeks.push(((week + i - 1) % 52) + 1);
	}

	// sync all the weeks
	for (const week of weeks) {
		const res = await fetch(`${LECTIO_OAUTH_API}/events/sync`, {
			method: 'POST',
			headers: {
				lectio: req.settings.lectioToken,
				google: req.settings.googleToken
			},
			body: JSON.stringify({
				calendarId: req.settings.calendar.preferredCalendar?.value,
				week,
				year,
				blacklist: '',
				eventReminders: req.settings.calendar.notifications
					? formatReminders([{ method: 'Notifikation', quantity: '5', unit: 'Minutter' }])
					: []
			})
		});
		if (!res.ok) {
			switch (res.status) {
				case 401:
					self.postMessage({
						task: 'syncEvents',
						ok: false,
						message: 'Din google kode er ugyldig. Venligst log ind igen.'
					});
					return 'Din google kode er ugyldig. Venligst log ind igen.';
				default:
					self.postMessage({
						task: 'syncEvents',
						ok: false,
						message:
							'Der skete en fejl under synkroniseringen. Prøv igen senere eller tjek din internetforbindelse.'
					});
					return 'Der skete en fejl under synkroniseringen. Prøv igen senere eller tjek din internetforbindelse.';
			}
		}
	}
	self.postMessage({ task: 'syncEvents', ok: true });
}

function syncTasks(req: GoogleSyncObject) {
	console.log(req);
}

async function checkToken(req: GoogleSyncCheckTokenObject) {
	const resp = await fetch(`${LECTIO_OAUTH_API}/token/check`, {
		headers: {
			google: req.token
		}
	});
	self.postMessage({ ok: resp.ok, task: 'checkToken' });
}

async function listCalendars(req: GoogleSyncCheckTokenObject) {
	const res = await fetch(`${LECTIO_OAUTH_API}/events/calendarlists`, {
		headers: {
			google: req.token
		}
	});

	const data = ((await res.json()) as { title: string; id: string }[]).map((calendar) => ({
		label: calendar.title,
		value: calendar.id
	}));

	self.postMessage({ data, task: 'listCalendars' });
}

function listTasks() {}

function formatReminders(arr: Array<any>) {
	const reminders = arr.map((reminder) => {
		const minutes = Math.min(
			reminder.unit === 'Minutter'
				? +reminder.quantity
				: reminder.unit === 'Timer'
					? +reminder.quantity * 60
					: +reminder.quantity * 24 * 60,
			20160
		);
		return {
			minutes,
			method: reminder.method.replace('Notifikation', 'popup').replace('Email', 'email')
		};
	});
	return reminders;
}

async function deleteEvents(req: GoogleSyncObject) {
	if (!req.settings.calendar) return;

	await fetch(`${LECTIO_OAUTH_API}/events/delete`, {
		method: 'POST',
		headers: {
			lectio: req.settings.lectioToken,
			google: req.settings.googleToken
		},
		body: JSON.stringify({
			calendarId: req.settings.calendar.preferredCalendar?.value
		})
	});

	self.postMessage({ task: 'deleteEvents' });
}
