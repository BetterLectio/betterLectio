import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { calendar_v3, google as googleLib } from 'googleapis';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import type { GoogleResponse } from '$lib/types/google';

export const GET: RequestHandler = async ({ request, fetch }) => {
    const headers = request.headers;
    const googleToken = headers.get('google');

    if (!googleToken) return error(400, 'Missing google auth');

    const calAuth = new googleLib.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    let decodedGoogleToken = JSON.parse(atob(googleToken));
    calAuth.setCredentials(decodedGoogleToken);
    const calApi = googleLib.calendar({ version: 'v3', auth: calAuth });

    let calLists: GoogleResponse<calendar_v3.Schema$CalendarList>;
    try {
        calLists = await calApi.calendarList.list();
    } catch (e) {
        return error(401, 'Invalid google token');
    }
    const lists = calLists.data?.items?.filter((list) => list.accessRole === 'owner')?.map((list) => {
        return {
            id: list.id!,
            title: list.summary!,
            color: list.backgroundColor!,
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

export const OPTIONS: RequestHandler = async () => {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        }
    });
};
