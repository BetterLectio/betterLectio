import { writable } from 'svelte/store';

export { default as DeleteEvents } from './DeleteEvents.svelte';
export { default as DeleteTasks } from './DeleteTasks.svelte';
export { default as SyncEvents } from './SyncEvents.svelte';
export { default as SyncTasks } from './SyncTasks.svelte';
export { default as Setup } from './Setup.svelte';


export const tasklists = writable<{ label: string; value: string }[]>([]); 
