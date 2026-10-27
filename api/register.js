import { register } from '../lib/registration.js';

// Vercel supplies Web Request/Response handlers on the Node.js runtime.
export async function POST(request) {
  const headers = new Headers(request.headers);
  // On Vercel, use the platform's forwarded client address rather than a
  // visitor-supplied Cloudflare header when hashing and limiting requests.
  const forwarded = headers.get('x-vercel-forwarded-for') || headers.get('x-forwarded-for') || '';
  headers.set('cf-connecting-ip', forwarded.split(',')[0].trim());
  return register(new Request(request, { headers }), process.env);
}
