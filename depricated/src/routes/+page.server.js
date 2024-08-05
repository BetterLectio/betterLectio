import { redirect } from '@sveltejs/kit';


export function load({ cookies, url }) {
	// if the path is "/" and the user has a cookie, redirect to "/forside"
	const lectioCookie = cookies.get('lectio-cookie');
	if (url.pathname === '/' && lectioCookie) throw redirect(302, '/forside');
	return {};
}
