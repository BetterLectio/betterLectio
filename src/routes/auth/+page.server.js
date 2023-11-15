import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const schema = z.object({
	username: z.string().min(2).max(64),
	password: z.string().min(2).max(64),
	school: z.object({
		id: z.string().min(2).max(4),
		skole: z.string().min(2).max(268),
		skoleid: z.string().min(2).max(4)
	})
});

export const load = (async () => {
	// Server API:
	const form = await superValidate(schema);

	// Unless you throw, always return { form } in load and form actions.
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

		return { form };
	}
};
