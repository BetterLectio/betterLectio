import { dev } from "$app/environment";

export const LECTIO_API = 'https://api.bedstelectio.dk';
export const LECTIO_OAUTH_API = dev ? 'http://localhost:5174' : 'https://oauth-betterlectio.netlify.app';