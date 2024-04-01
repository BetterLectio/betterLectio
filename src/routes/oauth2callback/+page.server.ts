import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const urlParams = new URLSearchParams(url.search);
	const code = urlParams.get('code') || '';

	// exchange the code for a token
	let token = {};

	//can be done using the googleapis library, but I could not get it working
	const res = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			code: code,
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			redirect_uri: REDIRECT_URI,
			grant_type: 'authorization_code'
		})
	});
	token = await res.json();

	//if the error is not null, then the token is invalid
	if ((token as any).error) {
		throw error(400, (token as any).error);
	}

	const b64Token = btoa(JSON.stringify(token));

	return { b64Token };
}) satisfies PageServerLoad;
