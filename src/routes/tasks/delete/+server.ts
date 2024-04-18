
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { calendar_v3, google as googleLib, tasks_v1 } from 'googleapis';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import type { GoogleResponse } from '$lib/types/google';

export const POST: RequestHandler = async ({ request }) => {
    const headers = request.headers;
    const googleToken = headers.get('google');

    if (!googleToken) return error(400, 'Missing google token header');

    const options = await request.json() as { tasklist: string };
    if (!options) return error(400, 'Missing tasklist');
    if (typeof options.tasklist !== 'string') return error(400, 'tasklist must be a string');

    const tasksAuth = new googleLib.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    let decodedGoogleToken = JSON.parse(atob(googleToken));
    tasksAuth.setCredentials(decodedGoogleToken);
    const tasksApi = googleLib.tasks({ version: 'v1', auth: tasksAuth });

    // List all events from the calendar with the uid "betterlectio..."
    let tasks: GoogleResponse<tasks_v1.Schema$Tasks>;
    try {
        tasks = await tasksApi.tasks.list({
            tasklist: options.tasklist
        });
    } catch (e) {
        return error(401, 'Invalid google token');
    }

    const events = tasks.data.items;
    if (!events) return error(400, 'No tasks found');

    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (!event.notes?.includes(`BetterLectio ID (skal beholdes)`)) continue;
        await tasksApi.tasks.delete({
            tasklist: options.tasklist,
            task: event.id!
        });
    }

    return new Response("OK", {
        headers: {
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        }
    });
};

export const OPTIONS: RequestHandler = async () => {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        }
    });
};
