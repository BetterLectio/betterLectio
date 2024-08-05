import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import type { GoogleResponse } from '$lib/types/google';
import { CORS_HEADERS, errorResponse } from '$lib/utils';
import { batchFetchImplementation } from '@jrmdayn/googleapis-batcher';
import { calendar_v3, google as googleLib } from 'googleapis';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
    const fetchImpl = batchFetchImplementation();
    const headers = request.headers;
    const googleToken = headers.get('google');

    if (!googleToken) return errorResponse('Missing google token header');

    const options = await request.json() as { calendarId: string };
    if (!options) return errorResponse('Missing calendarId');
    if (typeof options.calendarId !== 'string') return errorResponse('calendarId must be a string');

    const calendarAuth = new googleLib.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    let decodedGoogleToken = JSON.parse(atob(googleToken));
    calendarAuth.setCredentials(decodedGoogleToken);
    const calendarApi = googleLib.calendar({
        version: 'v3'
    });
    const batchCalendarApi = googleLib.calendar({
        version: 'v3',
        fetchImplementation: fetchImpl
    });

    // List all events from the calendar with the uid "betterlectio..."
    let events: GoogleResponse<calendar_v3.Schema$Events>;
    try {
        events = await calendarApi.events.list({
            auth: calendarAuth,
            calendarId: options.calendarId,
            q: 'betterlectio',
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: 1000
        });
    } catch (e) {
        return errorResponse('Invalid google token', 401);
    }

    // Delete all events from the calendar with the uid "betterlectio..."
    const deletedEvents = await Promise.all(
        (events.data.items ?? []).map((event) => {
            return batchCalendarApi.events.delete({
                auth: calendarAuth,
                calendarId: options.calendarId,
                eventId: event.id!
            });
        })
    );

    const success = deletedEvents.filter((event) => event.status === 204).length;
    return new Response(JSON.stringify({ total: deletedEvents.length, success, failed: deletedEvents.length - success }), {
        headers: CORS_HEADERS
    });
};

export const OPTIONS: RequestHandler = async () => {
    return new Response(null, {
        headers: CORS_HEADERS
    });
};
