import { dev } from '$app/environment';

export const LECTIO_API = 'https://api.betterlectio.dk';
export const LECTIO_OAUTH_API = dev ? 'http://localhost:5174' : 'https://auth.betterlectio.dk';
