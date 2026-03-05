---
title: "Setting Up a Serverless OAuth Server"
description: "Deploying Ory Hydra on Google Cloud Run for a fully serverless, OpenID Connect-certified OAuth 2.0 server."
date: "Sep 12 2024"
---

**TL;DR:** You can run a fully serverless [OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749) server by deploying [Ory Hydra](https://www.ory.sh/hydra/) as two services on serverless infrastructure like Google Cloud Run (one public, one admin), backed by Postgres. The whole setup is two 3-line Dockerfiles, one config template, and a deploy script. Full source: [vana-oauth on GitHub](https://github.com/vana-com/vana-oauth).

## OAuth in 60 seconds

OAuth 2.0 is a delegation protocol. A user grants a third-party application limited access to their resources without sharing their password. [OpenID Connect](https://openid.net/developers/how-connect-works/) (OIDC) adds an identity layer on top, giving the application a standardized way to verify who the user is. [PKCE](https://datatracker.ietf.org/doc/html/rfc7636) (Proof Key for Code Exchange) extends the authorization code flow to protect against interception attacks, which matters for public clients like single-page apps that can't keep a client secret.

Managed OAuth providers like [Auth0](https://auth0.com/intro-to-iam/what-is-oauth-2) handle all of this for you. They work well until you need full control over token lifetimes, consent flows, subject identifier strategies, or multi-tenant client management through an API. At that point, you need your own server.

## Why Ory Hydra

[Ory Hydra](https://www.ory.sh/docs/hydra/) is a headless OAuth 2.0 and OpenID Connect server. It's a single Go binary, [OpenID Certified](https://openid.net/certification/), and API-driven. It handles the OAuth protocol (token issuance, client management, consent challenges) and delegates everything else (login UI, user management, consent screens) to your application through redirect-based flows.

[Keycloak](https://www.keycloak.org/) does something similar but ships as a full identity platform with its own login pages, user database, and admin console. That's a lot of surface area when you just need the OAuth plumbing. [Dex](https://dexidp.io/) is lighter but limited to upstream identity federation; it can't act as a standalone authorization server with its own client registry.

Hydra sits in between. It does one thing (OAuth/OIDC) and does it correctly, and it lets you build everything else however you want.

## The architecture

Two Cloud Run services, one Postgres database, one secrets manager:

```
                         +------------------+
                         |   Cloud SQL      |
                         |   (Postgres)     |
                         +--------+---------+
                                  |
              +-------------------+-------------------+
              |                                       |
    +---------+---------+               +-------------+-----------+
    |  Cloud Run        |               |  Cloud Run              |
    |  ory-hydra-public |               |  ory-hydra-admin        |
    |  (public traffic) |               |  (IAM-restricted)       |
    +---------+---------+               +-------------+-----------+
              |                                       |
    +---------+---------+               +-------------+-----------+
    |  /oauth2/auth     |               |  /clients               |
    |  /oauth2/token    |               |  /keys                  |
    |  /.well-known/*   |               |  /oauth2/introspect     |
    |  /userinfo        |               |  /oauth2/flush          |
    +-------------------+               +-------------------------+
```

The **public** service handles user-facing OAuth flows: authorization, token exchange, discovery endpoints. It's open to the internet.

The **admin** service handles client registration, key management, and token introspection. It's locked behind [Cloud Run IAM authentication](https://cloud.google.com/run/docs/authenticating/overview), so only service accounts with the right permissions can call it.

Both services connect to the same Cloud SQL Postgres instance. Secrets (database URL, system secret, OIDC salt) are managed by a secrets manager and injected at deploy time. (This repo uses [Doppler](https://www.doppler.com/), but any secrets manager works.)

Cloud SQL works fine here but isn't serverless in the scale-to-zero sense. For a stack where the database also scales to zero, [Neon](https://neon.tech) is a better fit since it scales to zero and bills per query.

## The Hydra config

Hydra's configuration lives in `hydra.template.yml`, a YAML file with environment variable placeholders that get resolved at deploy time via `envsubst`:

```yaml
serve:
  admin:
    port: 8080
    cors:
      enabled: true
      allowed_origins:
        - $LOGIN_URL
      allow_credentials: true

  public:
    port: 8080
    cors:
      enabled: true
      allowed_origins:
        - $LOGIN_URL
      allow_credentials: true

  cookies:
    same_site_mode: None
    same_site_legacy_workaround: true
    domain: .vana.com
    secure: true

urls:
  self:
    public: $ORY_PUBLIC_URL
    admin: $ORY_ADMIN_URL
    issuer: $ORY_PUBLIC_URL
  consent: $LOGIN_URL/consent
  login: $LOGIN_URL/login
  logout: $LOGIN_URL/logout
  error: $LOGIN_URL/error

dsn: $DATABASE_URL

secrets:
  system:
    - $SYSTEM_SECRET

oidc:
  subject_identifiers:
    supported_types:
      - pairwise
      - public
    pairwise:
      salt: $OIDC_PAIRWISE_SALT

ttl:
  access_token: 168h
  id_token: 168h
```

Both admin and public listen on port 8080, which is Cloud Run's default. The CORS origins are restricted to `$LOGIN_URL` (the consent/login app), and `allow_credentials: true` is required because the OAuth flow involves cookies.

The cookie config uses `SameSite=None` with `secure: true`. This is necessary because the consent flow involves cross-origin redirects between the OAuth server and the login application. `same_site_legacy_workaround` handles older browsers that don't understand `SameSite=None`.

Under `urls`, the `consent`, `login`, `logout`, and `error` entries point to a separate login application. Hydra redirects the user there during the authorization flow, and that application calls back to the admin API to accept or reject the consent challenge. This is the headless pattern: Hydra handles the protocol, your app handles the UI.

Subject identifiers support both `pairwise` (different subject ID per client, for privacy) and `public` (same subject ID everywhere). The pairwise salt ensures that the same user gets different IDs across different clients, so clients can't correlate users by comparing IDs.

Token TTLs are set to 168 hours (7 days). That's generous, but appropriate when the OAuth server is used for first-party applications where long-lived sessions are acceptable.

Every `$VARIABLE` in the template gets replaced with real values from the secrets manager before the config is baked into the Docker image.

## Dockerfiles

Each service gets a Dockerfile. They're almost identical:

```dockerfile
# Dockerfile-public
FROM oryd/hydra:v2.1.2
COPY hydra.yml /etc/config/hydra/hydra.yml
CMD ["serve", "public", "-c", "/etc/config/hydra/hydra.yml"]
```

```dockerfile
# Dockerfile-admin
FROM oryd/hydra:v2.1.2
COPY hydra.yml /etc/config/hydra/hydra.yml
CMD ["serve", "admin", "-c", "/etc/config/hydra/hydra.yml"]
```

Three lines each. The base image is the official Hydra v2.1.2 image, which contains the Go binary. The only thing added is the resolved config file. The `CMD` tells Hydra which mode to run in.

The `hydra.yml` that gets copied in is the already-resolved version (after `envsubst` ran on the template), so secrets are baked into the image at build time. This means the images should be stored in a private container registry. The deploy script uses Google Container Registry (`gcr.io`).

## The deploy script

`scripts/deploy-hydra.sh` takes two arguments: the service type (`admin` or `public`) and the environment (`development`, `staging`, or `production`).

```bash
#!/bin/bash
hydra_service=$1  # admin or public
env=$2            # development, staging, production
service_name="ory-hydra-${hydra_service}-${env}"
image_name="gcr.io/corsali-${env}/ory-hydra-${hydra_service}"

# Pull secrets from Doppler and export as env vars
doppler setup --project vana-oauth --config ${env}
doppler secrets download --no-file --format env > .env
export $(cat .env | xargs)

# Resolve template variables and clean up
envsubst < hydra.template.yml > hydra.yml
unset $(cat .env | cut -d= -f1 | xargs)
rm .env

# Build and push
docker build --no-cache --platform linux/amd64 \
  -t ${image_name} -f docker/Dockerfile-${hydra_service} .
docker push ${image_name}

# Deploy with auth distinction
if [ ${hydra_service} == "admin" ]; then
  gcloud run deploy ${service_name} \
    --image ${image_name} \
    --region us-central1 \
    --no-allow-unauthenticated
else
  gcloud run deploy ${service_name} \
    --image ${image_name} \
    --region us-central1 \
    --allow-unauthenticated
fi
```

The public service gets `--allow-unauthenticated` because users need to hit it directly. The admin service gets `--no-allow-unauthenticated`, which means Cloud Run rejects any request without a valid identity token from an authorized service account. This is how you protect the admin API without running a separate API gateway or firewall.

The `--platform linux/amd64` flag in the Docker build handles the case where you're building on an ARM Mac but deploying to Cloud Run's x86 infrastructure.

## CI/CD with GitHub Actions

The workflow triggers on pushes to `development`, `staging`, and `production` branches:

```yaml
name: Build, Push, Deploy
on:
  push:
    branches: [development, staging, production]

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      ENVIRONMENT: ${{ github.ref_name }}
      DOPPLER_TOKEN: ${{ secrets.DOPPLER_SERVICE_TOKEN }}
    steps:
      - uses: actions/checkout@v2
      - uses: dopplerhq/cli-action@v1
      - uses: google-github-actions/auth@v1
        with:
          credentials_json: "${{ secrets.GCP_SERVICE_ACCOUNT }}"
      - uses: google-github-actions/setup-gcloud@v0

      - name: Build and deploy admin
        run: bash scripts/deploy-hydra.sh admin ${{ env.ENVIRONMENT }}
      - name: Build and deploy public
        run: bash scripts/deploy-hydra.sh public ${{ env.ENVIRONMENT }}
```

The branch name maps directly to the environment. Push to `development`, and the script deploys to the development GCP project with the corresponding secrets. The same code path handles all three environments. Secrets manager and GCP credentials are stored as GitHub Actions secrets.

## The consent flow

The repo includes a vanilla JS demo (`index.html`) that implements the PKCE Authorization Code flow:

```javascript
// Generate a random code_verifier and derive the challenge
const code_verifier = generateRandomString();
const code_challenge = await pkceChallengeFromVerifier(code_verifier);

// Store the verifier for later (we'll need it for the token exchange)
localStorage.setItem("pkce_code_verifier", code_verifier);

// Redirect to the authorization endpoint
window.location =
  config.authorization_endpoint +
  "?response_type=code" +
  "&client_id=" + encodeURIComponent(config.client_id) +
  "&scope=" + encodeURIComponent("openid offline") +
  "&redirect_uri=" + encodeURIComponent(config.redirect_uri) +
  "&code_challenge=" + encodeURIComponent(code_challenge) +
  "&code_challenge_method=S256";
```

The `code_verifier` is a random string. The `code_challenge` is its SHA-256 hash, base64url-encoded:

```javascript
async function pkceChallengeFromVerifier(v) {
  const encoder = new TextEncoder();
  const data = encoder.encode(v);
  const hashed = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, new Uint8Array(hashed)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
```

PKCE matters here because this is a public client (a browser app). There's no client secret to authenticate the token exchange request. Without PKCE, anyone who intercepts the authorization code can exchange it for tokens. With PKCE, the token endpoint requires the original `code_verifier` that only the legitimate client has. The authorization server compares `SHA256(code_verifier)` against the `code_challenge` it received earlier. If they don't match, the exchange is rejected.

After the user authorizes, the server redirects back with an authorization code. The client exchanges it for tokens by sending the code along with the stored `code_verifier`:

```javascript
sendPostRequest(config.token_endpoint, {
  grant_type: "authorization_code",
  code: q.code,
  client_id: config.client_id,
  redirect_uri: config.redirect_uri,
  code_verifier: localStorage.getItem("pkce_code_verifier"),
}, function(request, body) {
  // body.access_token is now available
});
```

## What this unlocks

**Own your auth infrastructure.** No vendor lock-in, no per-user pricing, no rate limits on token introspection. You control the consent screens, the token lifetimes, the subject identifier strategies. If you need to change how consent works, you change your login app, not your OAuth provider.

**Multi-tenant client management.** Hydra's admin API lets you create, update, and delete OAuth clients programmatically. If you're building a platform where each tenant needs their own OAuth client with its own redirect URIs and scopes, you can automate the entire lifecycle through the admin API.

**Data portability with user-controlled scopes.** Custom scopes let users grant fine-grained access to their data. A research partner could request access to `posts:read` without getting `messages:read`. The user sees exactly what's being requested in the consent screen and decides what to share.

## Further reading

- [vana-oauth](https://github.com/vana-com/vana-oauth) - Full source code for this setup
- [Ory Hydra documentation](https://www.ory.sh/docs/hydra/)
- [RFC 6749 - OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [RFC 7636 - PKCE](https://datatracker.ietf.org/doc/html/rfc7636)
- [OpenID Connect specification](https://openid.net/developers/how-connect-works/)
- [Google Cloud Run documentation](https://cloud.google.com/run/docs)
- [Neon - Serverless Postgres](https://neon.tech)
- [Doppler - Secrets management](https://www.doppler.com/)
