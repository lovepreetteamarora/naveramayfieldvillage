# Vercel build fix — October 27, 2026

Failure: the GitHub repository built an embedded Sites Worker into dist/server/index.js, while Vercel expected a static public/ output directory.

Fix: explicit Vercel Other framework, build command npm run build:vercel, output public/. Static files are copied from site/. The Node.js Web POST handler at api/register.js calls a shared lib/registration.js. The Sites Worker build embeds that same handler, preserving the previous hosting path.

Vercel's trusted forwarding headers supply the client address on that platform. Origin validation includes only the exact Vercel URL/production hostname supplied by the runtime plus the known Navera domains.

Validation: seven server registration tests passed; static Vercel output built; Sites Worker validation passed; vercel build --prod completed successfully and produced api/register as a Node.js 22 function. Supabase activation is independently pending the account reconnect and Navera token registration.
