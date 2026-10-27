import { cp, mkdir, rm, access } from 'node:fs/promises';

await rm('public', { recursive: true, force: true });
await mkdir('public', { recursive: true });
await cp('site', 'public', { recursive: true });
await access('public/index.html');
await access('public/app.js');
await access('api/register.js');
console.log('Built Vercel static output in public/; registration runs at /api/register.');
