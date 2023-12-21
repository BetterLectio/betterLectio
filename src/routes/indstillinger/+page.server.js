/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, url }) {
	// check if the cookie "persistant-session" exists
	// if it does, return true
	// if it doesn't, return false

	const persistantSession = cookies.get('persistant-session');
	if (persistantSession) return { persistantSession: true, persistantSessionUsername: JSON.parse(persistantSession).username };


	return { persistantSession: false };
}
