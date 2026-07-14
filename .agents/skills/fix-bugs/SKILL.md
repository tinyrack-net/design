---
name: fix-bugs
description: Diagnose and fix software defects and regressions with strict test-driven development. Use for any bug fix, regression, broken behavior, or defect correction in this repository that must be reproduced by a permanent automated test before production code changes, fixed at the root cause, and protected from recurrence.
---

# TDD Bug Fix Workflow

Follow the sequence `reproduce -> red -> fix -> green -> verify` for every bug
fix. Do not change production code before the regression test demonstrates the
reported defect.

## 1. Reproduce the Defect

- Inspect the exact reported surface and current behavior before generalizing.
- Select the narrowest existing test layer that exercises the broken public
  behavior rather than an implementation detail.
- Add or strengthen a permanent automated regression test. Every bug-fix diff
  must include a test-code change that would prevent the same defect from
  returning.
- Exercise the real failure path. Avoid mocks that bypass it and synthetic
  interactions that cannot reproduce relevant browser, focus, timing, network,
  persistence, or integration behavior.
- For browser interaction bugs, use real pointer, keyboard, and focus behavior
  as applicable. For documentation-example bugs, test the rendered documentation
  or example harness where the defect occurs.
- Run the targeted test against the unfixed production code and confirm that it
  fails because of the reported defect. A test that already passes, fails for an
  unrelated reason, or only checks implementation details is not a valid
  regression test.
- If the defect cannot be reproduced in a reliable automated test, stop. Do not
  patch the code or claim the bug is fixed; report the evidence gathered and the
  remaining blocker.

## 2. Establish the Root Cause

- Trace the failing behavior through the smallest relevant code path.
- Explain the concrete cause before editing production code.
- Distinguish product defects from flaky tests, stale environments, and external
  infrastructure failures. Do not change product code merely to make an
  unrelated failure green.

## 3. Implement the Minimal Fix

- Change only the code needed to resolve the demonstrated root cause.
- Keep the regression test as permanent coverage.
- Never delete, skip, weaken, or rewrite the test to accept broken behavior.
- Do not replace the automated regression with manual verification. Manual
  checks may supplement the test but never substitute for it.

## 4. Prove the Fix

- Run the targeted regression test and confirm that the same test now passes.
- Run the relevant surrounding test suite and every repository-specific check
  required by the applicable instructions.
- For Tinyrack UI component bugs, also use
  `$tinyrack-component-development` and satisfy its browser, SSR, hydration,
  accessibility, coverage, documentation, packaging, and release checks as
  applicable.
- Treat unrelated or flaky failures as separate evidence: investigate and
  report them without weakening the regression test or broadening the fix.

## Handoff

Report all of the following:

- the user-visible or public-contract symptom;
- the concrete root cause;
- the regression test added or strengthened and how it failed before the fix;
- the minimal production change;
- the targeted and broader verification commands with their outcomes.

Do not report the bug as fixed unless the regression test is green and the
applicable validation has completed successfully.
