import type { CDPSession, Page } from 'playwright';
import type { ForcedPseudo } from './visual-parity-conditions.ts';

/**
 * Forces CSS pseudo classes on the React page so a scenario can declare a
 * visual state instead of driving real input to reach it.
 *
 * Deliberately does NOT share the screenshot CDP session map. That map has an
 * entry deleted on any screenshot failure so the caller can fall back to a
 * Playwright screenshot; sharing it would mean one screenshot timeout silently
 * disables state forcing for the rest of that page's life, and every later
 * state scenario would compare a rest render against a rest render and pass.
 * Forcing failures throw; they never degrade.
 */
const forceSessions = new WeakMap<Page, CDPSession>();
const forcedNodeIds = new WeakMap<Page, number[]>();

const MARK = 'data-parity-force';

async function forceSession(page: Page): Promise<CDPSession> {
  const existing = forceSessions.get(page);
  if (existing !== undefined) return existing;
  const session = await page.context().newCDPSession(page);
  await session.send('DOM.enable');
  await session.send('CSS.enable');
  forceSessions.set(page, session);
  return session;
}

/**
 * Tags the target and its ancestors so each can be addressed by selector.
 *
 * `CSS.forcePseudoState` takes one node, but real hover and real focus
 * propagate: `.tr-input-group:hover` styles the group when the inner input is
 * hovered, and `.tr-input-group:focus-within` carries the group's focus border.
 * Forcing only the target would leave those rules dead and compare an unstyled
 * group against a styled Flutter one.
 */
async function markForceChain(page: Page, selector: string): Promise<number> {
  return page.evaluate(
    ({ mark, targetSelector }) => {
      for (const stale of document.querySelectorAll(`[${mark}]`)) {
        stale.removeAttribute(mark);
      }
      const target = document.querySelector(targetSelector);
      if (target === null) {
        throw new Error(`Forced-state target ${targetSelector} is missing.`);
      }
      target.setAttribute(mark, 'target');
      let depth = 0;
      for (
        let node = target.parentElement;
        node !== null && node !== document.body;
        node = node.parentElement
      ) {
        node.setAttribute(mark, `ancestor-${depth}`);
        depth += 1;
      }
      return depth;
    },
    { mark: MARK, targetSelector: selector },
  );
}

export async function applyForcedStates(
  page: Page,
  targetSelector: string,
  forced: readonly ForcedPseudo[],
): Promise<void> {
  if (forced.length === 0) return;
  const session = await forceSession(page);
  const depth = await markForceChain(page, targetSelector);
  // Node ids do not survive a re-render, so the document is re-fetched per
  // scenario rather than cached across them.
  const { root } = (await session.send('DOM.getDocument', { depth: 0 })) as {
    root: { nodeId: number };
  };

  const force = async (selector: string, pseudo: readonly string[]) => {
    const { nodeId } = (await session.send('DOM.querySelector', {
      nodeId: root.nodeId,
      selector,
    })) as { nodeId: number };
    if (nodeId === 0) {
      throw new Error(`Forced-state node ${selector} is missing.`);
    }
    await session.send('CSS.forcePseudoState', {
      forcedPseudoClasses: [...pseudo],
      nodeId,
    });
    return nodeId;
  };

  const applied = [await force(`[${MARK}="target"]`, forced)];
  const inherited: string[] = [
    ...forced.filter((pseudo) => pseudo === 'hover' || pseudo === 'active'),
    // `:focus` does not chain up, but its chaining form does.
    ...(forced.includes('focus') || forced.includes('focus-visible')
      ? ['focus-within']
      : []),
  ];
  if (inherited.length > 0) {
    for (let index = 0; index < depth; index += 1) {
      applied.push(await force(`[${MARK}="ancestor-${index}"]`, inherited));
    }
  }
  forcedNodeIds.set(page, applied);
}

/** Clears the forcing applied to this render, before the next one invalidates it. */
export async function clearForcedStates(page: Page): Promise<void> {
  const session = forceSessions.get(page);
  const nodeIds = forcedNodeIds.get(page);
  forcedNodeIds.delete(page);
  if (session === undefined || nodeIds === undefined) return;
  await Promise.all(
    nodeIds.map((nodeId) =>
      session
        .send('CSS.forcePseudoState', { forcedPseudoClasses: [], nodeId })
        // A node the last re-render replaced took its forced state with it.
        .catch(() => undefined),
    ),
  );
  await page.evaluate((mark) => {
    for (const stale of document.querySelectorAll(`[${mark}]`)) {
      stale.removeAttribute(mark);
    }
  }, MARK);
}

/**
 * Discards every forced state this page ever had, including any whose node
 * survived a re-render under an id no longer held. This is what replaces the
 * held-button and held-key cleanup the pooled pages used to need.
 */
export async function resetForcedStates(page: Page): Promise<void> {
  const session = forceSessions.get(page);
  forceSessions.delete(page);
  forcedNodeIds.delete(page);
  await session?.detach().catch(() => undefined);
}

/**
 * Publishes the input modality the scenario declares.
 *
 * Written after the state render, never before: the provider rewrites this on
 * every `focusin`, and forcing a pseudo class does not fire one, so a
 * post-render write is stable.
 */
export async function setFocusModality(
  page: Page,
  modality: 'keyboard' | 'pointer' | undefined,
): Promise<void> {
  await page.evaluate((value) => {
    if (value === undefined) {
      document.documentElement.removeAttribute('data-tr-focus-modality');
    } else {
      document.documentElement.setAttribute('data-tr-focus-modality', value);
    }
  }, modality);
}

/**
 * Applies a whole render condition to the React page.
 *
 * Order matters: the modality attribute is written after the forcing, because
 * the provider rewrites it on `focusin` and forcing a pseudo class does not
 * fire one.
 */
export async function applyWebCondition(
  page: Page,
  targetSelector: string,
  condition: {
    forced: readonly ForcedPseudo[];
    modality: 'keyboard' | 'pointer' | undefined;
  },
): Promise<void> {
  await applyForcedStates(page, targetSelector, condition.forced);
  await setFocusModality(page, condition.modality);
}
