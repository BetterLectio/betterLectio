import { writable } from "svelte/store";
export const notifications = writable([]);

export function addNotification(message, bgColor) {
  notifications.update((n) => {
    n.push({ message, bgColor });
    return n;
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
notifications.subscribe((n) => {
  n.forEach((notification) => {
    setTimeout(() => {
      notifications.update((notifications) => {
        const index = notifications.indexOf(notification);
        if (index !== -1) {
          notifications.splice(index, 1);
        }
        return notifications;
      });
    }, 5000);
  });
});

// on the first fime the following code is run, add a notification if its not the first time do nothing
if (localStorage.getItem("firstTime") === null) {
  addNotification("Hej og velkommen til BetterLectio, tusind tak fordi du bruger BetterLectio", "alert-success");
  localStorage.setItem("firstTime", "false");
}
