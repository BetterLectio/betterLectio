
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { calendar_v3, google as googleLib } from 'googleapis';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import { batchFetchImplementation } from '@jrmdayn/googleapis-batcher';
import type { GoogleResponse } from '$lib/types/calendar';

export const POST: RequestHandler = async ({ request, fetch }) => {
    const fetchImpl = batchFetchImplementation();
    const headers = request.headers;
    const googleToken = headers.get('google');

    if (!googleToken) return error(400, 'Missing google token header');

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
            calendarId: 'primary',
            q: 'betterlectio',
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: 1000
        });
    } catch (e) {
        return error(401, 'Invalid google token');
    }

    // Delete all events from the calendar with the uid "betterlectio..."
    const deletedEvents = await Promise.all(
        (events.data.items ?? []).map((event) => {
            return batchCalendarApi.events.delete({
                auth: calendarAuth,
                calendarId: 'primary',
                eventId: event.id!
            });
        })
    );

    const success = deletedEvents.filter((event) => event.status === 204).length;
    return new Response(JSON.stringify({ total: deletedEvents.length, success, failed: deletedEvents.length - success }), {
        headers: {
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
