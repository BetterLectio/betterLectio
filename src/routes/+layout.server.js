import { redirect } from '@sveltejs/kit';
import { validCookie } from '../lib/js/serverCookies.js';

export async function load({ request, cookies, url }) {
	// make the redirect in case redirect its needed
	const redirectFromAuth = encodeURIComponent(url.href);
	// If backend running on mobile
	if (request.headers.get('user-agent') === 'BetterLectio Mobile') return { lectioCookie: 'local', pathname: url.pathname, authed: true, redirectFromAuth };
	try {
		const lectioCookie = cookies.get('lectio-cookie');
		if (url.pathname !== '/auth' && url.pathname !== '/tos') {
			if (!lectioCookie) {
				// redirect to auth page and pass the redirect url
				throw redirect(302, `/auth${redirectFromAuth ? `?redirect=${redirectFromAuth}` : ''}`);
			}

			// Check if the cookie is valid
			const cookieIsValid = await validCookie(lectioCookie);
			if (!cookieIsValid) {
				// delete the cookie if it exists
				if (cookies.get('lectio-cookie')) cookies.delete('lectio-cookie');

				// redirect to auth page
				throw redirect(302, `/auth${redirectFromAuth ? `?redirect=${redirectFromAuth}` : ''}`);
			}
		}
		return { lectioCookie, pathname: url.pathname, authed: Boolean(lectioCookie), redirectFromAuth };
	} catch (error) {
		// redirect to auth page and pass the redirect url and delete the cookie
		console.error('Cookie-check error: ', error);
		if (cookies.get('lectio-cookie')) cookies.delete('lectio-cookie');
		throw redirect(302, `/auth${redirectFromAuth ? `?redirect=${redirectFromAuth}` : ''}`);
	}
}
