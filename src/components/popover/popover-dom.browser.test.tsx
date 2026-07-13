import '../../core/core.css';
import './popover.css';
import { afterEach, expect, test } from 'vitest';
import { popoverPlacements } from './contract.js';
import { createPopoverManager } from './dom.js';

const managers = new Set<ReturnType<typeof createPopoverManager>>();
afterEach(() => {
  for (const manager of managers) manager.destroy();
  managers.clear();
  document.body.replaceChildren();
});

test.each(
  popoverPlacements,
)('positions and dismisses Popover placement %s', async (placement) => {
  const anchor = document.createElement('button');
  anchor.style.cssText = 'position:fixed;left:120px;top:120px;width:100px;height:30px';
  const popover = document.createElement('div');
  popover.className = 'tr-layer';
  popover.id = `popover-${placement}`;
  popover.setAttribute('popover', 'manual');
  popover.dataset['placement'] = placement;
  document.body.append(anchor, popover);
  const manager = createPopoverManager(document);
  managers.add(manager);
  expect(manager.open(popover, { reason: 'trigger', source: anchor })).toBe(true);
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
  expect(popover.matches(':popover-open')).toBe(true);
  expect(popover.dataset['positioned']).toBe('true');
  expect(manager.close(popover, { reason: 'programmatic' })).toBe(true);
});
