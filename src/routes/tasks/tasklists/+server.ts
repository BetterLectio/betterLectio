import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { google as googleLib, tasks_v1 } from 'googleapis';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import type { Opgave } from '$lib/types/lectio';
import { LECTIO_API_URL, checkLectioCookie, convertLectioTime } from '$lib/lectio';
import type { GoogleResponse, GoogleTask, TaskSyncOptions } from '$lib/types/google';
import { compareTwoStrings } from '$lib/utils';
import { DateTime } from 'luxon';

export const GET: RequestHandler = async ({ request, fetch }) => {
    const headers = request.headers;
    const googleToken = headers.get('google');

    if (!googleToken) return error(400, 'Missing google auth');

    const tasksAuth = new googleLib.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    let decodedGoogleToken = JSON.parse(atob(googleToken));
    tasksAuth.setCredentials(decodedGoogleToken);
    const tasksApi = googleLib.tasks({ version: 'v1', auth: tasksAuth });

    let taskLists: GoogleResponse<tasks_v1.Schema$TaskLists>;
    try {
        taskLists = await tasksApi.tasklists.list();
    } catch (e) {
        return error(401, 'Invalid google token');
    }
    const lists = taskLists.data?.items?.map((list) => {
        return {
            id: list.id!,
            title: list.title!
        }
    });

    return new Response(JSON.stringify(lists), {
        headers: {
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        }
    });
};

function formatTasks(tasks: Opgave[], options: TaskSyncOptions): { id: string, datetime: DateTime, task: GoogleTask }[] {
    let filteredTasks = tasks.map((task) => {
        const date = convertLectioTime(task.frist);
        return {
            id: task.exerciseid,
            datetime: date,
            status: task.status,
            task: {
                title: task.opgavetitel,
                due: date.toISO(),
                completed: task.status === 'Afsluttet' || task.status === 'Afleveret' ? date.toISO() : null,
                notes: `${task.opgavenote == '' ? '' : task.opgavenote + '\n\n'}Elevtid: ${task['elev-tid']}\n\nBetterLectio ID (skal beholdes): ${task.exerciseid}`,
            }
        }
    });

    if (options.addFinishedTasks) {
        filteredTasks = filteredTasks.filter((task) => task.status === "Afleveret" || task.status === "Afsluttet" ? false : true);
    }
    if (options.maxAge) {
        const maxAge = DateTime.fromISO(options.maxAge);
        filteredTasks = filteredTasks.filter((task) => task.datetime > maxAge);
    }
    return filteredTasks;
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
