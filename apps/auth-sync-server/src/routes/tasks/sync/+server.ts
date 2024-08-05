import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { google as googleLib, tasks_v1 } from 'googleapis';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import type { Opgave } from '$lib/types/lectio';
import { LECTIO_API_URL, checkLectioCookie, convertLectioTime } from '$lib/lectio';
import type { GoogleResponse, GoogleTask, TaskSyncOptions } from '$lib/types/google';
import { compareTwoStrings } from '$lib/utils';
import { DateTime } from 'luxon';

export const POST: RequestHandler = async ({ request, fetch }) => {
    const headers = request.headers;
    const googleToken = headers.get('google');
    const lectioCookie = headers.get('lectio');

    if (!googleToken || !lectioCookie) return error(400, 'Missing auth headers');

    const options = await request.json() as TaskSyncOptions;
    if (!options) return error(400, 'Missing options');
    if (typeof options.tasklist !== 'string') return error(400, 'tasklist must be a string');
    if (!("addFinishedTasks" in options)) return error(400, 'Missing addFinishedTasks');
    if (options.maxAge && typeof options.maxAge !== 'string') return error(400, 'maxAge must be a string');
    if (options.maxAge && !DateTime.fromISO(options.maxAge).isValid) return error(400, 'maxAge must be a valid date');

    const isCookieValid = await checkLectioCookie(lectioCookie);
    if (!isCookieValid) return error(401, 'Invalid lectio cookie');

    const tasksAuth = new googleLib.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    let decodedGoogleToken = JSON.parse(atob(googleToken));
    tasksAuth.setCredentials(decodedGoogleToken);
    const tasksApi = googleLib.tasks({ version: 'v1', auth: tasksAuth });

    let rawExistingTasks: GoogleResponse<tasks_v1.Schema$Tasks>;
    try {
        rawExistingTasks = await tasksApi.tasks.list({
            tasklist: options.tasklist
        })
    } catch (e) {
        return error(401, 'Invalid google token');
    }
    const existingTasks = rawExistingTasks.data.items;

    const resp = await fetch(`${LECTIO_API_URL}/opgaver`, {
        headers: {
            'lectio-cookie': String(lectioCookie)
        }
    });
    const opgaver = await resp.json() as Opgave[];
    const tasks = formatTasks(opgaver, options);

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const existingTask = existingTasks?.find((t) => t.notes?.includes(`BetterLectio ID (skal beholdes): ${task.id}`));
        if (existingTask) {
            tasks[i].task.completed = existingTask.completed;

            if (existingTask.due !== `${task.task.due?.split('T')[0]}T00:00:00.000Z` || compareTwoStrings(existingTask.notes || "", task.task.notes || "") !== 1 || existingTask.title !== task.task.title) {
                await tasksApi.tasks.update({
                    tasklist: options.tasklist,
                    task: task.task.id!,
                    requestBody: task.task
                });
            }
        } else {
            await tasksApi.tasks.insert({
                tasklist: options.tasklist,
                requestBody: task.task
            });
        }
    }

    return new Response("OK", {
        headers: {
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    if (!options.addFinishedTasks) {
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
