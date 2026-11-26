# Tech Expo registration

Next.js registration PWA with PostgreSQL storage and build-generated QR assets.

## Setup

1. Install Node.js 20.9 or later and dependencies with `npm install`.
2. Fill in `.env.local` with the PostgreSQL settings shown below. This file is ignored by Git and must not be shared. Set `NEXT_PUBLIC_APP_URL` to the public HTTPS URL, including `?source=qr` if scans should be recorded as QR registrations.
3. Run `npm run db:migrate` to create the registration table and indexes in the **existing** database, and `npx prisma generate` to generate the client. The database user needs permission to create tables and indexes. Use a direct database connection for migrations if your provider requires one.
4. Run `npm run dev`. The service worker is disabled in development. QR and install icons are generated during a production build; to generate them before using the development server, run `node scripts/generate-assets.mjs`.

The development server allows its machine's current IPv4 addresses so phones on the same network can load development assets. Restart it if the address changes. Only use the development server on a trusted network; it is not intended for public deployment.

The temporary category list is in `src/lib/registration.ts`. Replace `Visitor` with the final allowed values before collecting registrations. Both the form and API use this list.

### PostgreSQL configuration

```env
DB_HOST=your-postgres-host
DB_PORT=5432
DB_USER=your-postgres-user
DB_PASSWORD=your-postgres-password
DB_NAME=your-existing-database
DB_SSL_MODE=require
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app/?source=qr
```

Use the port and SSL mode provided by your PostgreSQL provider. For local PostgreSQL without SSL, set `DB_SSL_MODE=disable`. In `.env.local`, escape `$` as `\$` in passwords so Next.js does not expand it as an environment variable. Restart the dev server after changing the file. The API connects to PostgreSQL server-side; credentials are never sent to the browser. The migration creates the table but does not create the database itself.

An existing `DATABASE_URL`, if set, takes precedence over the separate `DB_*` settings. Remove it when using the separate settings.

## Build and deploy

Run `npm run build`. The prebuild step generates the Prisma client, `public/qr/app-qr.svg`, `public/qr/app-qr.png` (1024 × 1024), and PWA icons. A missing or invalid `NEXT_PUBLIC_APP_URL` fails the build to avoid producing a misleading QR code. Visit `/qr` for downloads and the A4 print view.

On Vercel, configure the same `DB_*` values and `NEXT_PUBLIC_APP_URL` for each environment and run `npm run db:migrate` against that environment's database before accepting registrations. The QR URL is fixed at build time, so rebuild after changing it. Use a production HTTPS URL for scanning and installation.

Installed apps can reopen cached pages after an initial online visit. Registration requires a connection; failed or offline submissions are not queued and must be retried. Phone numbers are validated and saved in E.164 format; a phone number can be registered only once.

Run `npm run lint` and `npm test` for local checks. The tests require Node.js 22.18 or later.
