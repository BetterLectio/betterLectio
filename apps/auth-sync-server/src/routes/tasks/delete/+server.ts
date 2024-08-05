import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import type { GoogleResponse } from '$lib/types/google';
import { CORS_HEADERS, errorResponse } from '$lib/utils';
import { google as googleLib, tasks_v1 } from 'googleapis';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    const headers = request.headers;
    const googleToken = headers.get('google');

    if (!googleToken) return errorResponse('Missing google token header');

    const options = await request.json() as { tasklist: string };
    if (!options) return errorResponse('Missing tasklist');
    if (typeof options.tasklist !== 'string') return errorResponse('tasklist must be a string');

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
        return errorResponse('Invalid google token', 401);
    }

    const events = tasks.data.items;
    if (!events) return errorResponse('No tasks found');

    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (!event.notes?.includes(`BetterLectio ID (skal beholdes)`)) continue;
        await tasksApi.tasks.delete({
            tasklist: options.tasklist,
            task: event.id!
        });
    }

    return new Response("OK", {
        headers: CORS_HEADERS
    });
};

export const OPTIONS: RequestHandler = async () => {
    return new Response(null, {
        headers: CORS_HEADERS
    });
};
