---
name: tinyrack-package-release
description: Ship and verify @tinyrack/ui and @tinyrack/docs releases through PR, package-specific annotated tags, npm provenance, and registry checks. Use when asked to version, tag, publish, retry, or verify either package release.
---

# Tinyrack Package Release

Complete the real release. Do not stop at a version bump, tag push, or running
workflow.

## Contract

- Read the current package manifests and publish workflows before acting; they
  are the source of truth.
- Version UI and docs independently. Use `ui-vX.Y.Z` and `docs-vX.Y.Z`.
- Publish UI before docs when releasing both because packed docs depends on the
  current UI version through `workspace:^`.
- Keep npm provenance enabled and require repository metadata for
  `tinyrack-net/design` plus the correct package directory.
- Also use `$tinyrack-component-development` for component changes and
  `$fix-bugs` for release defects.

## Flow

1. Fetch and inspect current state:

   ```bash
   git fetch origin main
   git status --short --branch
   git log --oneline HEAD..origin/main
   git tag -l "ui-v*" "docs-v*"
   git ls-remote --tags origin "ui-v*" "docs-v*"
   npm view @tinyrack/ui version --json
   npm view @tinyrack/docs version --json
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
   `test` and `pack:docs` commands. Do not invoke a workspace-wide test
   aggregator.

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

8. Confirm both annotated tags peel to the recorded merge commit. Report the
   PR, tags, workflow URLs, npm versions, and integrities. Delete merged work
   branches and leave the worktree clean on `origin/main`.

## Failure Rules

- Never move or delete a pushed release tag to hide a failed publish.
- Rerun the same tag only for a verified transient infrastructure failure.
- For package, metadata, provenance, or reproducible workflow defects, add a
  regression test, fix the root cause in a new PR, bump the next patch version,
  and create a new tag.
- Never tag docs until its required UI version exists on npm.
- Do not bypass provenance or weaken verification.
