import { dataBoolean } from './options.js';
import type { SurfaceEntry } from './types.js';

export function updateDocumentState(
  document: Document,
  entries: readonly SurfaceEntry[],
) {
  const modals = entries.filter((entry) => entry.kind === 'modal');
  for (const entry of modals) entry.element.removeAttribute('data-topmost');
  modals.at(-1)?.element.setAttribute('data-topmost', 'true');

  const shouldLock = modals.some((entry) =>
    dataBoolean(entry.element, 'preventScroll', true),
  );
  if (shouldLock) {
    document.documentElement.setAttribute('data-tr-modal-open', 'true');
  } else {
    document.documentElement.removeAttribute('data-tr-modal-open');
  }
}
