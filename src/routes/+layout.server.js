import { Redirect } from '@sveltejs/kit';

async function validCookie(base64Cookie) {
	const cookies = await JSON.parse(await Buffer.from(base64Cookie, 'base64'));
	const skoleId = cookies[await (await cookies.map(cookie => cookie.name)).indexOf('LastLoginExamno')].value;
	const response = await fetch(`https://www.lectio.dk/lectio/${skoleId}/help/mainhelp.aspx`, { headers: { cookie: await (await cookies.map(cookie => `${cookie.name}=${cookie.value}`)).join('; ') } });

	if ((await response.text()).split('Log ud').length > 1) return true;
	return false;
}

export function load({ cookies, url }) {
	const lectioCookie = cookies.get('lectio-cookie');
	return { lectioCookie, pathname: url.pathname };
}
