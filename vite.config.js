import { sveltekit } from '@sveltejs/kit/vite';

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
 
const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);


const config = {
  plugins: [sveltekit()],
  define: {
    '__APP_VERSION__': JSON.stringify(pkg.version),
  }
};

export default config;
