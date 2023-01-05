import { writable } from "svelte/store";
export const notifications = writable([]);

export function addNotification(message, bgColor) {
  notifications.update((n) => {
    n.push({ message, bgColor });
    return n;
  });
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
