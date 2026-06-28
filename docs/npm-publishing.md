# npm publishing

`@tinyrack/themes` is published to npm from GitHub Actions when a version tag is pushed.

This follows the release workflow shape used by sibling Tinyrack packages:

- `tinyrack/tinyauth`: publishes from `refs/tags/v*` with npm registry setup.
- `tinyrack/dotweave` and `tinyrack/proxer`: publish with npm provenance from release tags.

## Workflow

The workflow is `.github/workflows/publish-npm.yml`.

It runs only for semantic version tags:

```txt
v*.*.*
```

Example:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Required npm setup

The workflow uses npm trusted publishing with provenance, not a checked-in token.

Configure the package on npm with this trusted publisher:

| Field | Value |
| --- | --- |
| Package | `@tinyrack/themes` |
| Repository owner | `tinyrack-net` |
| Repository name | `themes` |
| Workflow file | `.github/workflows/publish-npm.yml` |
| Environment | leave empty unless npm requires one later |

Because the workflow uses OIDC trusted publishing, do not add or commit an npm token. The workflow intentionally does not reference `NPM_TOKEN`.

The package metadata must also keep `repository.url` set to `https://github.com/tinyrack-net/themes`; npm validates this against the GitHub provenance bundle during publish.

## What the workflow checks

Before publishing, CI does the following:

1. Check out the repository.
2. Install pnpm `11.3.0` and Node.js `24`.
3. Configure npm registry access with `registry-url: https://registry.npmjs.org`.
4. Install dependencies with `pnpm install --frozen-lockfile`.
5. Install browser test runtime with `pnpm exec playwright install --with-deps chromium`.
6. Verify the pushed tag matches `package.json` version.
7. Run `pnpm run test`.
8. Run `pnpm run biome`.
9. Run `pnpm run build`.
10. Publish with `pnpm publish --provenance --access public --no-git-checks`.

## Local validation

Before pushing a release tag, validate locally:

```bash
pnpm run test
pnpm run biome
pnpm run build
pnpm pack --dry-run
```

The package includes only:

- `dist`
- `README.md`
- `docs`

This is controlled by `package.json` `files`.

## Version/tag contract

The pushed tag must equal the package version prefixed with `v`.

For example, if `package.json` contains:

```json
{
  "version": "0.1.0"
}
```

then the publish tag must be:

```txt
v0.1.0
```

If the tag and package version do not match, the workflow fails before publishing.
