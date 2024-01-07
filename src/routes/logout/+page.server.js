import { redirect } from '@sveltejs/kit';


export function load({ cookies }) {
	// if the lectio-cookie is set, delete it and redirect to the auth page
	if (cookies.get('lectio-cookie')) cookies.delete('lectio-cookie');

	// also delete the persistant-session cookie
	if (cookies.get('persistant-session')) cookies.delete('persistant-session');


	// if the lectio-cookie is not set, redirect to the auth page
	throw redirect(302, '/auth');
}
