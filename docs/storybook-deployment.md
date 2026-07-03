# Storybook Cloudflare deployment

The Storybook for `@tinyrack/themes` is deployed as Cloudflare Workers static assets. This follows the same pattern used by `tinyrack/tinyauth` and `tinyrack/dotweave` homepages:

- build static output with Storybook
- point `wrangler.jsonc` assets at the generated directory
- deploy with `wrangler deploy` from GitHub Actions

## Cloudflare project

Wrangler config lives at the repository root:

```jsonc
{
  "name": "tinyrack-themes-storybook",
  "assets": {
    "directory": "./storybook-static",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

The Worker name is `tinyrack-themes-storybook`.

## Required GitHub secrets

Set these repository secrets before pushing a release tag:

| Secret | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | API token allowed to deploy Workers/static assets |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID for the target Worker |

Do not commit token or account values to the repository.

## GitHub Actions

The deploy workflow is `.github/workflows/deploy-storybook.yml`.

It runs only on release version tags:

- `v*.*.*` tag pushes

It does not run on `main` pushes or manual dispatch.

The workflow does the following:

1. Check out the repository.
2. Set up pnpm from `package.json` `packageManager` and Node.js from `.node-version`.
3. Install dependencies with `pnpm install --frozen-lockfile`.
4. Install browser test runtime with `pnpm exec playwright install --with-deps chromium`.
5. Run `pnpm run verify:release`.
6. Deploy `storybook-static` with `pnpm run deploy:storybook`.

## Local validation

Build Storybook locally:

```bash
pnpm run storybook:build
```

Validate Wrangler packaging without publishing:

```bash
pnpm run deploy:storybook:dry-run
```

Deploy manually, when authenticated with Wrangler:

```bash
pnpm run deploy:storybook
```

## Notes

- `storybook-static` is a generated build output and should not be committed.
- `not_found_handling: "404-page"` keeps Cloudflare behavior aligned with the existing Tinyrack homepage Workers.
- The workflow uses the same `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secret names as tinyauth and dotweave.
