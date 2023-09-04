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
		}, 3000);
	});
});
