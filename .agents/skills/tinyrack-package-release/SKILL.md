---
name: tinyrack-package-release
description: Ship and verify @tinyrack/ui, @tinyrack/docs, and tinyrack_ui releases through PR, package-specific annotated tags, npm provenance or pub.dev OIDC, and registry checks. Use when asked to version, tag, publish, retry, or verify any of these package releases.
---

# Tinyrack Package Release

Complete the real release. Do not stop at a version bump, tag push, or running
workflow.

## Contract

- Read the current package manifests and publish workflows before acting; they
  are the source of truth.
- Version every package independently. Use `ui-vX.Y.Z` (`packages/ui_web`),
  `docs-vX.Y.Z` (`packages/docs`), and `tinyrack_ui-vX.Y.Z`
  (`packages/ui_flutter`, published to pub.dev).
- Publish UI before docs when releasing both because packed docs depends on the
  current UI version through `workspace:^`. `tinyrack_ui` has no ordering
  dependency on the npm packages.
- Keep npm provenance enabled and require repository metadata for
  `tinyrack-net/design` plus the correct package directory.
- `tinyrack_ui` publishes through pub.dev automated publishing (OIDC). There is
  no credential secret. `.github/workflows/publish-flutter.yml` must keep
  `permissions: id-token: write` and `environment: pub.dev`, and pub.dev's
  package admin must stay configured with repository `tinyrack-net/design`,
  tag-pattern `tinyrack_ui-v{{version}}`, and the required `pub.dev`
  environment. Changing any one of those four values breaks publishing.
- `packages/ui_flutter/CHANGELOG.md` is separate from the root `CHANGELOG.md`.
  Rename its `## Unreleased` heading to the version being released, because
  pub.dev scores the changelog entry that matches the published version.
- Also use `$tinyrack-component-development` for component changes and
  `$fix-bugs` for release defects.

## Flow

1. Fetch and inspect current state:

   ```bash
   git fetch origin main
   git status --short --branch
   git log --oneline HEAD..origin/main
   git tag -l "ui-v*" "docs-v*" "tinyrack_ui-v*"
   git ls-remote --tags origin "ui-v*" "docs-v*" "tinyrack_ui-v*"
   npm view @tinyrack/ui version --json
   npm view @tinyrack/docs version --json
   curl -s https://pub.dev/api/packages/tinyrack_ui | jq -r '.latest.version'
   ```

2. Branch or rebase onto current `origin/main`. Choose each next version from
   its manifest, tags, and npm state. Never reuse a pushed tag or published
   version.
3. Bump only the requested manifests, build required dependencies, and run only
   the package being released:

   ```bash
   pnpm --filter @tinyrack/ui test
   pnpm pack:ui
   ```

   For docs, prepare the UI dist/tarball first, then run the equivalent docs
   `test` and `pack:docs` commands. For `tinyrack_ui`, bump
   `packages/ui_flutter/pubspec.yaml`, rename its `## Unreleased` changelog
   heading, and run:

   ```bash
   pnpm flutter:verify
   ```

   Do not invoke a workspace-wide test aggregator.

4. Commit the intended files, open a ready PR, wait for all required checks,
   merge, and record the merge commit SHA.
5. Create an annotated tag on that merge commit. Push UI first and watch the
   exact `.github/workflows/publish-npm.yml` run to completion.
6. Confirm UI is live before tagging docs:

   ```bash
   npm view @tinyrack/ui@latest version dist.tarball dist.integrity repository --json
   ```

7. Push the annotated docs tag, watch the exact
   `.github/workflows/publish-docs-npm.yml` run, then verify:

   ```bash
   npm view @tinyrack/docs@latest version dist.tarball dist.integrity dependencies.@tinyrack/ui repository --json
   ```

8. For `tinyrack_ui`, push the annotated `tinyrack_ui-vX.Y.Z` tag, watch the
   exact `.github/workflows/publish-flutter.yml` run, then verify:

   ```bash
   curl -s https://pub.dev/api/packages/tinyrack_ui | jq -r '.latest.version, .latest.pubspec.version'
   ```

9. Confirm every annotated tag peels to the recorded merge commit. Report the
   PR, tags, workflow URLs, published versions, and integrities. Delete merged
   work branches and leave the worktree clean on `origin/main`.

## Failure Rules

- Never move or delete a pushed release tag to hide a failed publish.
- Rerun the same tag only for a verified transient infrastructure failure.
- For package, metadata, provenance, or reproducible workflow defects, add a
  regression test, fix the root cause in a new PR, bump the next patch version,
  and create a new tag.
- Never tag docs until its required UI version exists on npm.
- Do not bypass provenance or weaken verification.
- pub.dev versions cannot be republished, overwritten, or retracted back to an
  unpublished state. A bad `tinyrack_ui` release is fixed only by publishing the
  next version; never attempt to reuse the version or move its tag.
