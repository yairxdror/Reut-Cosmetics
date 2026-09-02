# Firebase deployment foundation

The repository supports two persistence modes:

- `DATA_BACKEND=file` (default): local JSON files and `backend/src/data/uploads`.
- `DATA_BACKEND=firebase`: Firestore for content, FAQ, reviews and encrypted health declarations, plus Cloud Storage for admin image uploads.

Nothing connects to Firebase unless `DATA_BACKEND=firebase` is explicitly set.

## Architecture

1. `frontend/out` is deployed to Firebase Hosting.
2. Hosting rewrites `/api/**` to the `reut-cosmetics-api` Cloud Run service in `me-west1`.
3. The Express server uses Firebase Admin with Application Default Credentials.
4. Browsers have no direct Firestore or Storage write access. The checked-in rules deny all client access.

## Firebase project setup

1. Create a Firebase project on the Blaze plan and connect the existing domain.
2. Create Firestore and a Cloud Storage bucket.
3. Enable Cloud Run, Cloud Build, Artifact Registry, Firestore and Cloud Storage APIs.
4. Keep the service and Firestore close to the audience. The checked-in Hosting rewrite currently uses `me-west1`.
5. Grant the Cloud Run service account the minimum required Firestore and Storage permissions.

Do not download or commit a service-account key for production. Cloud Run supplies Application Default Credentials automatically.

## Required Cloud Run environment and secrets

```text
DATA_BACKEND=firebase
FIREBASE_PROJECT_ID=<project-id>
FIREBASE_STORAGE_BUCKET=<project-id>.firebasestorage.app
CLIENT_ORIGIN=https://<custom-domain>,https://<project-id>.web.app
ADMIN_EMAIL=<admin-email>
ADMIN_PASSWORD_HASH=<bcrypt-hash>
JWT_SECRET=<secret>
HEALTH_DATA_ENCRYPTION_KEY=<64-hex-character-secret>
```

Store `ADMIN_PASSWORD_HASH`, `JWT_SECRET` and `HEALTH_DATA_ENCRYPTION_KEY` in Google Secret Manager and expose them to Cloud Run as secret-backed environment variables.

## One-time data migration

Before switching production traffic, configure Application Default Credentials locally, set the Firebase variables above, and run from `backend`:

```text
npm run migrate:firebase
```

The migration copies local JSON records and any existing override images. It does not delete local data or remote documents. Health declarations remain encrypted during migration.

## Health-declaration retention

Every health-declaration document has an `expiresAt` Firestore timestamp seven years after submission. Enable Firestore TTL for that field so expired records are deleted even while Cloud Run is scaled to zero:

```text
gcloud firestore fields ttls update expiresAt --collection-group=healthDeclarations --enable-ttl
```

The API also removes expired records at startup, once every 24 hours while running, and whenever the health-declaration endpoint is used. The migration adds `expiresAt` to older local records. If production already contains documents created by an older version, backfill an `expiresAt` timestamp for them before relying on TTL.

## Build the static frontend

From `frontend`, build without the GitHub Pages base path:

```text
$env:FIREBASE_HOSTING="true"
npm run build
```

In production, the frontend uses same-origin `/api` calls, which Firebase Hosting forwards to Cloud Run.

## Deployment order

1. Deploy the Cloud Run service named `reut-cosmetics-api` in `me-west1`.
2. Verify `/api/health` on the Cloud Run URL.
3. Run the one-time data migration.
4. Build the frontend with `FIREBASE_HOSTING=true`.
5. Deploy Firestore/Storage rules and Hosting with the Firebase CLI.
6. Verify login, content editing, image replacement, reviews and health declarations on a preview domain before connecting the custom domain.

Set a Cloud Run maximum instance limit and Firebase/Google Cloud budget controls before opening production traffic.
