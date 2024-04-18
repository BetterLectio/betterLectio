import { LECTIO_OAUTH_API } from '$lib/lectio';
import { toast } from 'svelte-sonner';
import { get, writable } from 'svelte/store';

export { default as DeleteEvents } from './DeleteEvents.svelte';
export { default as DeleteTasks } from './DeleteTasks.svelte';
export { default as SyncEvents } from './SyncEvents.svelte';
export { default as SyncTasks } from './SyncTasks.svelte';
export { default as Setup } from './Setup.svelte';

export const pageState = writable<'logged-out' | 'ready' | 'loading'>('logged-out');
export const tasklists = writable<{ label: string; value: string }[]>([]);
export const tasklist = writable<{ label: string; value: string }>({ label: '', value: '' });

export const fetchTasklists = async () => {
    if (get(tasklists).length > 0) return;

    const res = await fetch(`${LECTIO_OAUTH_API}/tasks/tasklists`, {
        headers: {
            google: localStorage.getItem('googleToken') || ''
        }
    });
    if (!res.ok) {
        switch (res.status) {
            case 401:
                pageState.set('logged-out');
                toast.error('Din google kode er ugyldig. Venligst log ind igen.');
                break;
            default:
                pageState.set('ready');
                toast.error(
                    'Der skete en fejl under synkroniseringen. Prøv igen senere eller tjek din internetforbindelse.'
                );
                break;
        }
        return;
    }
    const data = (await res.json() as { title: string; id: string }[]).map((tasklist) => ({ label: tasklist.title, value: tasklist.id }));
    tasklist.set(data[0]);
    tasklists.set(data);
}
