import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			external: [
				'G:/betterLectio/apps/frontend/src/lib/workers/calendarWorker.ts?worker',
				'G:/betterLectio/apps/frontend/src/routes/indstillinger/_components/CalenderSettings.svelte'
			]
		}
	}
});
