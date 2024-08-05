
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import { google as googleLib } from 'googleapis';
import type { RequestHandler } from './$types';
import { CORS_HEADERS, errorResponse } from '$lib/utils';

export const GET: RequestHandler = async ({ request, fetch }) => {
    const headers = request.headers;
    const googleToken = headers.get('google');

    if (!googleToken) return errorResponse('Missing google auth', 400);

    const calAuth = new googleLib.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    let decodedGoogleToken = JSON.parse(atob(googleToken));
    calAuth.setCredentials(decodedGoogleToken);
    const calApi = googleLib.calendar({ version: 'v3', auth: calAuth });

    try {
        await calApi.calendarList.list();
    } catch (e) {
        return errorResponse("Invalid google token", 401);
    }
    return new Response("OK", { headers: CORS_HEADERS });
};

export const OPTIONS: RequestHandler = async () => {
    return new Response(null, { headers: CORS_HEADERS });
};