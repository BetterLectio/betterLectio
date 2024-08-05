/* eslint-disable camelcase */
/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const urlParams = new URLSearchParams(url.search);
	const code = urlParams.get('code');

	// exchange the code for a token
	console.log('code:', code);
	let token = {};
	const res = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			code,
			client_id: '24684948206-b038d60s5g6vgfn25v7fdopkl4ii6557.apps.googleusercontent.com',
			client_secret: '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',
			redirect_uri: 'http://localhost:5173/oauth2callback',
			grant_type: 'authorization_code'
		})
	});
	token = await res.json();
	return { token };
}
