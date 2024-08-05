import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { validCookie } from '$lib/js/serverCookies.js';
import { z } from 'zod';


const schema = z.object({
	username: z.string().min(2).max(64),
	password: z.string().min(2).max(64),
	school: z.object({
		id: z.string().min(2).max(4),
		skole: z.string().min(2).max(268),
		skoleid: z.string().min(2).max(4)
	}),
	remember: z.boolean().optional()
});

export const load = (async ({ cookies, url }) => {
	const lectioCookie = cookies.get('lectio-cookie');
	if (lectioCookie) {
		if (await validCookie(lectioCookie)) {
			const urlParams = new URLSearchParams(url.href);
			const redirectUrl = urlParams.get('redirect');
			throw redirect(302, redirectUrl ? redirectUrl : '/forside');
		}
	}
	const form = await superValidate(schema);

	let persistantSession = cookies.get('persistant-session');
	if (persistantSession) {
		persistantSession = JSON.parse(persistantSession);
		form.data.username = persistantSession.username;
		form.data.school = persistantSession.school;

		// login and redirect if valid
		const response = await fetch(`https://api.betterlectio.dk/auth`, {
			headers: {
				brugernavn: persistantSession.username,
				adgangskode: persistantSession.password,
				skoleid: persistantSession.school.skoleid
			}
		});

		if (response.ok) {
			// get the set-lectio-cookie header
			const lectioCookie = response.headers.get('set-lectio-cookie');

			// set a cookie with the lectio cookie
			cookies.set('lectio-cookie', lectioCookie, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});

			// if remember me is checked, set a persistant session cookie
			if (form.data.remember) {
				cookies.set('persistant-session', JSON.stringify({
					username: form.data.username,
					password: form.data.password,
					school: form.data.school
				}), {
					path: '/',
					secure: true,
					maxAge: 60 * 60 * 24 * 365 // 1 year
				});
			}

			// redirect to the homepage (in future change to the page the user was on before logging in, but for now just redirect to the homepage because im lazy :) )
			throw redirect(302, '/forside');
		}
	}

	return { form };
});


export const actions = {
	default: async ({ request, cookies, fetch }) => {
		const form = await superValidate(request, schema);
		if (!form.valid) return fail(400, { form });

		// authenticate user with lectio
		// VIGTIGT: VIL IKKE VIRKE MED APPEN (DIFF API)
		const response = await fetch(`https://api.betterlectio.dk/auth`, {
			headers: {
				brugernavn: form.data.username,
				adgangskode: form.data.password,
				skoleid: form.data.school.skoleid
			}
		});
		if (response.ok) {
			// get the set-lectio-cookie header
			const lectioCookie = response.headers.get('set-lectio-cookie');

			// set a cookie with the lectio cookie
			cookies.set('lectio-cookie', lectioCookie, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
		} else {
			// delete the cookie if it exists
			if (cookies.get('lectio-cookie')) cookies.delete('lectio-cookie');

			// return the form with an error
			return fail(401, { form });
		}

		// if remember me is checked, set a persistant session cookie
		if (form.data.remember) {
			cookies.set('persistant-session', JSON.stringify({
				username: form.data.username,
				password: form.data.password,
				school: form.data.school
			}), {
				path: '/',
				secure: true,
				maxAge: 60 * 60 * 24 * 365 // 1 year
			});
		}

		return { form };
	}
};
