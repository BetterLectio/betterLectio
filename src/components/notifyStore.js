import { writable } from "svelte/store";
export const notifications = writable([]);

export function addNotification(message, bgColor) {
  notifications.update((n) => {
    n.push({ message, bgColor });
    return n;
  });
}

// auto remove notifications after 5 seconds
notifications.subscribe((n) => {
  setTimeout(() => {
    notifications.update((n) => {
      n.shift();
      return n;
    });
  }, 5000);
});
