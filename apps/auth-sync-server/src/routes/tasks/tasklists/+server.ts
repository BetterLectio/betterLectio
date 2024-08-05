import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import type { GoogleResponse } from '$lib/types/google';
import { CORS_HEADERS, errorResponse } from '$lib/utils';
import { google as googleLib, tasks_v1 } from 'googleapis';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
    const headers = request.headers;
    const googleToken = headers.get('google');

    if (!googleToken) return errorResponse('Missing google auth');

    const tasksAuth = new googleLib.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    let decodedGoogleToken = JSON.parse(atob(googleToken));
    tasksAuth.setCredentials(decodedGoogleToken);
    const tasksApi = googleLib.tasks({ version: 'v1', auth: tasksAuth });

    let taskLists: GoogleResponse<tasks_v1.Schema$TaskLists>;
    try {
        taskLists = await tasksApi.tasklists.list();
    } catch (e) {
        return errorResponse('Invalid google token', 401);
    }
    const lists = taskLists.data?.items?.map((list) => {
        return {
            id: list.id!,
            title: list.title!
        }
    });

    return new Response(JSON.stringify(lists), {
        headers: CORS_HEADERS
    });
};

export const OPTIONS: RequestHandler = async () => {
    return new Response(null, {
        headers: CORS_HEADERS
    });
};
