import { sequence } from '@sveltejs/kit/hooks';
import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	environment: import.meta.env.MODE,
	dsn: 'https://b22f2fafee56f8eff792d5e03987fc0c@o4506184019476480.ingest.sentry.io/4506184022491136',
	tracesSampleRate: 1.0,
	tracesSampler: () => {
		if (import.meta.env.MODE === 'development' || navigator.userAgent.includes('HeadlessChrome')) {
			// Drop this transaction, by setting its sample rate to 0%
			return 0;
		}

		// Default sample rate for all others (replaces tracesSampleRate)
		return 1;
	}
});

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle());

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
