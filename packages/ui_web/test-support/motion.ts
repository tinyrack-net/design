import { expect } from 'vitest';

/**
 * Motion-aware measurement helpers for the browser component tests.
 *
 * These live outside `src/` deliberately. Coverage includes `src/**` in the
 * default mode, so a helper under `src/` would land in the threshold
 * denominator; it also keeps the module out of the `tsdown` entry map and the
 * published tarball.
 *
 * The problem they solve: `getBoundingClientRect` returns the axis-aligned box
 * of an element as it is drawn *right now*. While a transform is in flight that
 * is not the layout box — a 16px square rotating through 45deg measures
 * 16 * sqrt(2) ~ 22.63px. Asserting geometry in the same tick as a state change
 * therefore measures whatever frame the compositor happens to be on, which is a
 * function of machine load rather than of the component.
 */

type SettleOptions = {
  /** Frames of stability required before the box is considered settled. */
  stableFrames?: number;
  /** Per-axis movement, in pixels, still considered stable. */
  tolerance?: number;
};

/**
 * Wait until every finite animation on the element and its subtree finishes.
 *
 * Indefinite animations are filtered out by their computed end time. Awaiting
 * one would never resolve, and several components run them permanently
 * (spinner rotation, skeleton shimmer).
 *
 * `Animation.finished` rejects with `AbortError` when an animation is
 * cancelled, which Base UI does whenever a popup re-renders or closes while the
 * wait is in progress, so each promise is caught on its own.
 *
 * The collect-and-await pass runs twice: finishing an enter transition often
 * starts a follow-up as the positioner reflows against the settled size.
 */
export async function waitForMotion(element: Element) {
  const finiteAnimations = () =>
    element.getAnimations({ subtree: true }).filter((animation) => {
      const endTime = animation.effect?.getComputedTiming().endTime;
      return Number.isFinite(Number(endTime ?? Number.POSITIVE_INFINITY));
    });

  for (let pass = 0; pass < 2; pass += 1) {
    await Promise.all(
      finiteAnimations().map((animation) => animation.finished.catch(() => undefined)),
    );
  }

  await new Promise<void>((resolveFrame) =>
    requestAnimationFrame(() => resolveFrame()),
  );
}

/**
 * Wait for motion to finish, then for the box to stop moving, and return it.
 *
 * The second stage catches what the Web Animations API does not expose —
 * scrollbar appearance, font swaps, and Base UI repositioning all move a box
 * without registering an animation.
 *
 * Throws rather than returning the last sample when the box never settles.
 * A box that never stops moving is a defect, and quietly returning a value
 * would convert it into the next intermittent failure.
 */
export async function settledRect(
  element: Element,
  { stableFrames = 6, tolerance = 0.25 }: SettleOptions = {},
): Promise<DOMRect> {
  await waitForMotion(element);

  let previous = element.getBoundingClientRect();
  let stable = 0;
  for (let frame = 0; frame < 120; frame += 1) {
    await new Promise<void>((resolveFrame) =>
      requestAnimationFrame(() => resolveFrame()),
    );
    const current = element.getBoundingClientRect();
    const moved = (['x', 'y', 'width', 'height'] as const).some(
      (axis) => Math.abs(current[axis] - previous[axis]) >= tolerance,
    );
    stable = moved ? 0 : stable + 1;
    previous = current;
    if (stable >= stableFrames) return current;
  }

  throw new Error(
    `Element did not settle within 120 frames (tolerance ${tolerance}px)`,
  );
}

/** Wait for the element to report `data-open`, then return its settled box. */
export async function openedRect(
  element: Element,
  options?: SettleOptions,
): Promise<DOMRect> {
  await expect.poll(() => element.hasAttribute('data-open')).toBe(true);
  return settledRect(element, options);
}

/**
 * Assert the element is actually animating.
 *
 * Without this a component that silently loses its transition would still pass
 * every settle-based test, because settling nothing succeeds instantly. This
 * keeps the motion contract itself under test.
 */
export async function assertHasMotion(element: Element) {
  await expect
    .poll(() => element.getAnimations({ subtree: true }).length)
    .toBeGreaterThan(0);
}
