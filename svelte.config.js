// Virker med electron: 
// Virker med netlify:
import 'dotenv/config';

import adapterStatic from '@sveltejs/adapter-static';
import adapterAuto from "@sveltejs/adapter-auto";
import preprocess from 'svelte-preprocess';

let config;
if (process.env.BUILD_TYPE === 'app') {
	/** @type {import('@sveltejs/kit').Config} */
	config = {
		// Consult https://github.com/sveltejs/svelte-preprocess
		// for more information about preprocessors
		preprocess: preprocess(),

		kit: {
			adapter: adapterStatic({
				fallback: 'index.html',
			}),
			prerender: { entries: [] },
		},
	};
} else {
	/** @type {import('@sveltejs/kit').Config} */
	config = {
		kit: {
		adapter: adapterAuto(),
		},
		preprocess: [
			preprocess({
				postcss: true,
			}),
		],
	};
}
export default config;