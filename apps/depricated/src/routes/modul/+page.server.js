import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export function load({ url }) {
	// the following checks if the user if trying to access a eksamens modul and redirects them to the forside if they are
	if (url.searchParams.get('absid').includes('proevehold')) throw redirect(302, `/forside`);

	return {};
}
