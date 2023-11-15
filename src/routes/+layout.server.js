import { Redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, url }) {
	// check cookies to check if user is logged in
	// if not, redirect to /login

	return {};
}
