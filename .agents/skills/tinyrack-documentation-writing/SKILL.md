---
name: tinyrack-documentation-writing
description: Write, rewrite, translate, and review Tinyrack UI public documentation in natural English, Korean, and Japanese. Use for prose, examples, and documentation-facing copy under packages/homepage/app/content or packages/homepage/app/documentation, including component, foundation, installation, and integration pages. Do not use for release notes, changelogs, contributor README files, source-code comments, or documentation infrastructure changes without public copy.
---

# Tinyrack Documentation Writing

Keep public documentation accurate, useful, locally natural, and aligned across
English, Korean, and Japanese. Preserve the repository's existing content
contracts instead of introducing a second documentation system.

## Establish the Facts

- Inspect the relevant public exports, types, implementation, tests, demos, and
  neighboring pages before writing. Do not use existing prose as the sole
  source of truth.
- Identify the reader's goal and the facts needed to complete it: purpose,
  prerequisites, imports, defaults, choices, states, accessibility behavior,
  limitations, and expected result.
- State conditions and guarantees precisely. Do not guess behavior or use
  absolute claims such as "always," "fully," or "automatically" unless the
  implementation guarantees them.
- Preserve valid frontmatter, public paths, code identifiers, example IDs, and
  structural contracts unless the task explicitly changes them.

## Write for the Reader

- Lead with what the reader can accomplish, then explain when to choose an
  option and why.
- Keep one main idea per paragraph. Prefer short, direct sentences and concrete
  nouns over vague references such as "this," "the above," or "the relevant
  item."
- Explain decisions, outcomes, and caveats instead of narrating code line by
  line.
- Avoid hype, filler, unsupported judgments, emoticons, and decorative emoji.
- Avoid first person when the sentence works without it. In Korean, use `저`
  only when first person is unavoidable; do not use `나` or `필자`. Avoid
  `우리` and `저희` unless an explicit organizational voice requires them.

## Use Natural Korean Haeyoche

Apply these rules to Korean explanatory prose, including frontmatter
descriptions and documentation-facing descriptions. Headings, labels, code,
identifiers, quotations, and intentionally reproduced UI text do not need an
artificial sentence ending.

- Use neutral conversational haeyoche such as `~이에요`, `~예요`, `~해요`,
  `~할 수 있어요`, `~하세요`, and `~해 보세요`.
- Do not use formal hasipsioche endings such as `~입니다`, `~합니다`, or
  `~하십시오`.
- Do not use note-style endings such as `~함` or `~했음`.
- Avoid author-intention endings such as `~할게요` and `~해볼게요` in
  instructional prose. Direct the reader with `~하세요` or state the behavior
  with `~해요` instead.
- Keep the tone calm and professional. Avoid overly casual expressions such as
  `쉽죠`, `간단하거든요`, or `엄청`.
- Omit repeated subjects naturally. Do not repeatedly address the reader as
  `여러분` or refer to them abstractly as `사용자` when a direct instruction is
  clearer.

Examples:

- `이 컴포넌트는 상태를 표시합니다.` -> `이 컴포넌트는 상태를 표시해요.`
- `이제 테마를 설정해볼게요.` -> `이제 테마를 설정해 보세요.`
- `아래와 같이 진행합니다.` -> `` `core.css`를 먼저 불러오세요. ``

## Localize Meaning, Not Sentence Shape

- Keep behavior, constraints, code, and user outcomes equivalent across
  locales. Do not force translations to have the same sentence count or word
  order.
- Write English with concise active voice and direct instructions. Prefer
  `Use ...` over `It is recommended that you use ...`.
- Write Japanese explanatory prose in consistent `です・ます調`. Use natural
  instructions such as `〜してください`, and prefer concise forms such as
  `〜できます` over unnecessary `〜することができます`.
- Preserve component names, props, types, package paths, commands, ARIA
  attributes, code identifiers, and example IDs. Localize headings,
  frontmatter copy, prose, accessibility labels, and user-visible example text
  when appropriate.
- Trace shared demos, playground definitions, and data sources that render copy
  into localized pages. Do not assume that editing the MDX file covers every
  user-visible string.
- Use one term consistently for one concept within and across pages. Prefer a
  locally established technical term over a literal translation; preserve the
  English identifier in code formatting when ambiguity remains.
- After translating, reread each localized page independently without matching
  it sentence by sentence against the source. Remove unnatural source-language
  order, repeated pronouns, and mixed-language phrasing.

## Match the Document Type

Read `packages/homepage/tests/structure.test.ts`, the relevant manifest, and a
neighboring page before changing document structure.

For component pages:

- Preserve the locale-aligned `Contract`, `Install`, optional `Playground`,
  `Usage`, `Examples`, and `API` flow enforced by the repository.
- Keep section order, example IDs, imports, public subpaths, and documented API
  facts aligned across locales while localizing prose and headings.
- Present the most common working usage first. Add examples only when they
  clarify a meaningful choice, state, composition, or accessibility behavior.

For foundation pages:

- Explain the decision the foundation supports and when it matters.
- Present the available rules or tokens, selection guidance, implementation
  examples, and important misuses or limitations.
- Add related links only when they provide a useful next step.

For installation and integration pages:

- State the expected outcome and prerequisites first.
- Use an ordered setup path with a minimal working example.
- Explain how to verify success, then document realistic limitations or
  troubleshooting when they exist.

Do not add empty sections merely to satisfy a generic template.

## Keep Examples Trustworthy

- Use current public APIs and package subpaths. Include every import and style
  import required to run the example.
- Keep examples minimal but complete and copy-ready. Avoid combining unrelated
  concepts in one example.
- Keep prose and rendered examples consistent. Localize user-visible strings
  when doing so does not alter the behavior under demonstration.
- Use deprecated APIs only in explicit migration or compatibility guidance.
- Explain keyboard, focus, naming, state, and semantic behavior when those
  details affect correct use. Do not append generic accessibility boilerplate
  to unrelated pages.

## Verify Proportionately

- Review the diff for factual accuracy, natural language, terminology, and
  locale parity.
- For localized component pages, confirm matching sections, example IDs, code
  contracts, and public imports across English, Korean, and Japanese.
- Run the homepage unit checks that cover content structure:

```bash
pnpm --filter @tinyrack/homepage test:unit
```

- Build or inspect the affected route when MDX, imports, frontmatter, links, or
  layout could change rendering. Use browser checks for interactive or visual
  documentation changes; do not require them for a prose-only correction with
  no rendering risk.
- Run `git diff --check` before handoff. Report the checks selected and any
  remaining language-review uncertainty.
