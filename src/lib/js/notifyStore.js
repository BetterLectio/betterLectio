import { writable } from 'svelte/store';
export const notifications = writable([]);

export function addNotification(message, bgColor) {
	notifications.update(notification => {
		notification.push({ message, bgColor });
		return notification;
	});
}

export function sceduleNotification(message, bgColor, date) {
	const now = new Date();
	const timeToNotification = date.getTime() - now.getTime();
	setTimeout(() => {
		addNotification(message, bgColor);
	}, timeToNotification);
}

export function addNotificationIn(message, bgColor, time) {
	setTimeout(() => {
		addNotification(message, bgColor);
	}, time);
}

// auto remove notifications individually after 5 seconds
notifications.subscribe(noti => {
	noti.forEach(notification => {
		setTimeout(() => {
			notifications.update(_notification => {
				const index = _notification.indexOf(notification);
				if (index !== -1) _notification.splice(index, 1);

				return _notification;
			});
		}, 5000);
	});
});

// on the first fime the following code is run, add a notification if its not the first time do nothing
if (localStorage.getItem('firstTime') === null) {
	addNotification('Hej og velkommen til BetterLectio, tusind tak fordi du bruger BetterLectio', 'alert-success');
	localStorage.setItem('firstTime', 'false');
}
