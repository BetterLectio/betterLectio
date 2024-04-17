
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { google as googleLib, tasks_v1 } from 'googleapis';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import { DateTime } from 'luxon';
import type { Opgave } from '$lib/types/lectio';
import { LECTIO_API_URL, checkLectioCookie, convertLectioTime } from '$lib/lectio';
import type { GoogleResponse, GoogleTask, TaskSyncOptions } from '$lib/types/google';
import { compareTwoStrings } from '$lib/utils';

export const POST: RequestHandler = async ({ request, fetch }) => {
    const headers = request.headers;
    const googleToken = headers.get('google');
    const lectioCookie = headers.get('lectio');

    if (!googleToken || !lectioCookie) return error(400, 'Missing auth headers');

    const options = await request.json() as TaskSyncOptions;
    if (options) {
        if (typeof options.tasklist !== 'string') return error(400, 'tasklist must be a string');
        if (!("addFinishedTasks" in options)) return error(400, 'Missing addFinishedTasks');
    }

    const isCookieValid = await checkLectioCookie(lectioCookie);
    if (!isCookieValid) return error(401, 'Invalid lectio cookie');

    const tasksAuth = new googleLib.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    let decodedGoogleToken = JSON.parse(atob(googleToken));
    tasksAuth.setCredentials(decodedGoogleToken);
    const tasksApi = googleLib.tasks("v1");

    let rawExistingTasks: GoogleResponse<tasks_v1.Schema$Tasks>;
    try {
        rawExistingTasks = await tasksApi.tasks.list({
            auth: tasksAuth,
            tasklist: options.tasklist
        })
    } catch (e) {
        return error(401, 'Invalid google token');
    }
    const existingTasks = rawExistingTasks.data.items;
    console.log(existingTasks);

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
                const updatedTask = await tasksApi.tasks.update({
                    tasklist: options.tasklist,
                    task: task.task.id!,
                    requestBody: task.task
                });
            }
        } else {
            const createdTask = await tasksApi.tasks.insert({
                auth: tasksAuth,
                tasklist: options.tasklist,
                requestBody: task.task
            });
        }
    }

    // const success = insertedEvents.filter((event) => event.status === 200).length;
    return new Response("OK", {
        headers: {
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        }
    });
};

function formatTasks(tasks: Opgave[], options: TaskSyncOptions): { id: string, task: GoogleTask }[] {
    return tasks.filter((task) => options.addFinishedTasks ? true : task.status === "Afleveret" || task.status === "Afsluttet" ? false : true).map((task) => {
        const date = convertLectioTime(task.frist);

        return {
            id: task.exerciseid,
            task: {
                title: task.opgavetitel,
                due: date,
                completed: task.status === 'Afsluttet' || task.status === 'Afleveret' ? date : null,
                notes: `${task.opgavenote == '' ? '' : task.opgavenote + '\n\n'}Elevtid: ${task['elev-tid']}\n\nBetterLectio ID (skal beholdes): ${task.exerciseid}`,
            }
        }
    });
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
