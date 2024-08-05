import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';


const config = {
	plugins: [
		enhancedImages(),
		sveltekit()
	]
};

export default config;
