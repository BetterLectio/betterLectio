import { redirect } from '@sveltejs/kit';


export function load({ cookies }) {
	// if the lectio-cookie is set, delete it and redirect to the auth page
	if (cookies.get('lectio-cookie')) cookies.delete('lectio-cookie');


	// if the lectio-cookie is not set, redirect to the auth page
	throw redirect(302, '/auth');
}
