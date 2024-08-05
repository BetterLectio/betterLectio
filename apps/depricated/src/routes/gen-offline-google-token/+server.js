import { google } from 'googleapis';

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const oauth2Client = new google.auth.OAuth2('24684948206-b038d60s5g6vgfn25v7fdopkl4ii6557.apps.googleusercontent.com',
	'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',
	'http://localhost:5173/oauth2callback');

// Access scopes for read-only Drive activity.
const scopes = [
	'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks'
];

// Generate a url that asks permissions for the Drive activity scope


/** @type {import('./$types').RequestHandler} */
export function GET() {
	const authorizationUrl = oauth2Client.generateAuthUrl({
		// 'online' (default) or 'offline' (gets refresh_token)
		// eslint-disable-next-line camelcase
		access_type: 'offline',

		// Pass in the scopes array defined above.
		//  Alternatively, if only one scope is needed, you can pass a scope URL as a string
		scope: scopes,

		// Enable incremental authorization. Recommended as a best practice.
		// eslint-disable-next-line camelcase
		include_granted_scopes: true
	});
	return new Response(authorizationUrl);
}
