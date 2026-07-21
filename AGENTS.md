# Tinyrack UI Repository Guidance

For an established user-visible product defect or regression, use `$fix-bugs`
and follow `.agents/skills/fix-bugs/SKILL.md`. Do not trigger it for routine
documentation corrections, dependency maintenance, unrelated flaky CI, or an
external-service incident unless a product-code defect is established.

When adding a public Tinyrack UI component or changing its public API, behavior,
styling contract, architecture, or package subpath, use
`$tinyrack-component-development` and follow
`.agents/skills/tinyrack-component-development/SKILL.md`. Do not trigger it for
standalone documentation copy edits, generic test review, dependency
maintenance, or release-only work.

For any task that versions, tags, publishes, retries, or verifies an
`@tinyrack/ui` or `@tinyrack/docs` package release, use
`$tinyrack-package-release` and follow
`.agents/skills/tinyrack-package-release/SKILL.md`.

For an established public component behavior bug, use both skills and apply
each skill's scope-based verification guidance.

For package releases that contain UI component changes, use both the package
release and component-development skills.
