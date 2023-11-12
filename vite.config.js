import { defineConfig, loadEnv } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(() => {
	const env = loadEnv('', process.cwd());

	return {
		build: { sourcemap: true },
		plugins: [
			sveltekit(),

			// Put the Sentry vite plugin after all other plugins
			sentryVitePlugin({
				org: 'betterlectio',
				project: 'javascript-sveltekit',
				authToken: env.VITE_SENTRY_AUTH_TOKEN,
				cleanArtifacts: true,
				rewrite: false
			})
		]
	};
});
