import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import { LECTIO_API_URL, checkLectioCookie, convertLectioTime } from '$lib/lectio';
import type { GoogleResponse, GoogleTask, TaskSyncOptions } from '$lib/types/google';
import type { Opgave } from '$lib/types/lectio';
import { CORS_HEADERS, compareTwoStrings, errorResponse } from '$lib/utils';
import { google as googleLib, tasks_v1 } from 'googleapis';
import { DateTime } from 'luxon';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
    const headers = request.headers;
    const googleToken = headers.get('google');
    const lectioCookie = headers.get('lectio');

    if (!googleToken || !lectioCookie) return errorResponse('Missing auth headers');

    const options = await request.json() as TaskSyncOptions;
    if (!options) return errorResponse('Missing options');
    if (typeof options.tasklist !== 'string') return errorResponse('tasklist must be a string');
    if (!("addFinishedTasks" in options)) return errorResponse('Missing addFinishedTasks');
    if (options.maxAge && typeof options.maxAge !== 'string') return errorResponse('maxAge must be a string');
    if (options.maxAge && !DateTime.fromISO(options.maxAge).isValid) return errorResponse('maxAge must be a valid date');

    const isCookieValid = await checkLectioCookie(lectioCookie);
    if (!isCookieValid) return errorResponse('Invalid lectio cookie', 401);

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
        return errorResponse('Invalid google token', 401);
    }
    const existingTasks = rawExistingTasks.data.items;

    const resp = await fetch(`${LECTIO_API_URL}/opgaver`, {
        headers: {
            'lectio-cookie': String(lectioCookie)
        }
    });
    const opgaver = await resp.json() as Opgave[];
    const tasks = formatTasks(opgaver, options);

    let newTasks = 0;
    let updatedTasks = 0;
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const existingTask = existingTasks?.find((t) => t.notes?.includes(`BetterLectio ID (skal beholdes): ${task.id}`));
        if (existingTask) {
            tasks[i].task.completed = existingTask.completed;

            if (existingTask.due !== `${task.task.due?.split('T')[0]}T00:00:00.000Z` || compareTwoStrings(existingTask.notes || "", task.task.notes || "") !== 1 || existingTask.title !== task.task.title) {
                await tasksApi.tasks.update({
                    tasklist: options.tasklist,
                    task: existingTask.id!,
                    requestBody: { ...task.task, id: existingTask.id! }
                });
                updatedTasks++;
            }
        } else {
            await tasksApi.tasks.insert({
                tasklist: options.tasklist,
                requestBody: task.task
            });
            newTasks++;
        }
    }

    return new Response(JSON.stringify({ new: newTasks, updated: updatedTasks }), {
        headers: CORS_HEADERS
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
        headers: CORS_HEADERS
    });
};
