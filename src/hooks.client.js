import * as Sentry from '@sentry/sveltekit';
import { Replay, handleErrorWithSentry } from '@sentry/sveltekit';

Sentry.init({
	environment: import.meta.env.MODE,
	dsn: 'https://b22f2fafee56f8eff792d5e03987fc0c@o4506184019476480.ingest.sentry.io/4506184022491136',
	tracesSampleRate: 1.0,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.1,

	// If the entire session is not sampled, use the below sample rate to sample
	// sessions when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	// If you don't want to use Session Replay, just remove the line below:

	tracesSampler: () => {
		if (import.meta.env.MODE === 'development' || navigator.userAgent.includes('HeadlessChrome')) {
			// Drop this transaction, by setting its sample rate to 0%
			return 0;
		}

		// Default sample rate for all others (replaces tracesSampleRate)
		return 1;
	},
	integrations: [new Replay()]
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
