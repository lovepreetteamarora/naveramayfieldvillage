# naveramayfieldvillage

Navera at Mayfield Village website for `naveramayfieldhomes.com`, operated by Team Arora. The public design follows the supplied Navera landing-page reference.

## Project files

- `site/`: editable HTML, CSS, JavaScript and optimized/reference media.
- `worker/index.js`: server-side registration handler and public-file serving.
- `scripts/build.mjs`: packages the website into the Sites Worker artifact.
- `tests/registration.test.mjs`: validation, project attribution, persistence failures and abuse checks.
- `research/`: dated source, asset and release records.

## Run checks and build

Requires Node.js 22 or newer. No dependency installation is needed.

```sh
npm test
npm run build
npm run validate
```

Output: `dist/server/index.js` and `dist/.openai/hosting.json`.

## Supabase lead capture

`POST /api/register` validates the public registration and sends it to Team Arora’s shared Supabase capture gateway. Navera uses the project slug `navera-mayfield-village` and domain `naveramayfieldhomes.com`. Private database reads are not exposed to visitors.

Configure these **server-only** secrets in hosting:

- `LEAD_API_URL`
- `LEAD_API_TOKEN` — Navera’s own project token
- `LEAD_IP_SALT`

The matching SHA-256 token hash must be registered in Supabase `lead_projects`. Never use another project’s token or place secrets in `site/`, source control or the hosting manifest.

The form reports success only after a confirmed gateway save. Consent choices and project-specific answers are stored in `details`. No automatic email/SMS campaigns are created. Website rate limits are best-effort per server instance, with input limits and a honeypot in addition to gateway authentication.

The existing Sites project remains the publishing target. GitHub is the source repository. Custom-domain activation requires the pending DNS records documented in `research/domain-setup.md`.

## Activation status

The server integration is implemented and locally tested. Supabase project registration and production activation are pending a renewed Supabase authorization. The currently published site retains its existing email-preparation flow until activation is verified. See `research/supabase-connection-status.md`.
