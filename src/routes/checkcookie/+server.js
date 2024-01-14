import { validCookie } from '$lib/js/serverCookies';
import { json } from '@sveltejs/kit';

// denne funktion burde skrives i rust i betterlectio-next og så kaldes med invoke
// men kunne seriøst ikke finde ud af det :(

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	console.log('checkcookie');
	const cookie = url.searchParams.get('cookie');
	const valid = await validCookie(cookie);
	return json({ valid });
}
