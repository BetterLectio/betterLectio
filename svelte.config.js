// Virker med electron: 
// Virker med netlify:
import 'dotenv/config';

import adapterStatic from '@sveltejs/adapter-static';
import adapterAuto from "@sveltejs/adapter-auto";
import preprocess from 'svelte-preprocess';

let config;
if (process.env.BUILD_TYPE === 'app') {
	console.log("Building for electron");
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
	console.log("Building for the website");
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