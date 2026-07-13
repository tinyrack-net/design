import '../../core/core.css';
import './overlay.css';
import { afterEach, expect, test, vi } from 'vitest';
import {
  createSurfaceChangeEvent,
  createSurfaceDetail,
} from '../../internal/overlay/events.js';
import { createFocusController } from '../../internal/overlay/focus.js';
import {
  closeNativeSurface,
  isHTMLElement,
  isModal,
  isModalOpen,
  isPopover,
  isPopoverOpen,
  isSurfaceOpen,
  openNativeSurface,
} from '../../internal/overlay/native.js';
import { createPopoverPositioner } from '../../internal/overlay/positioning.js';
import type { SurfaceEntry } from '../../internal/overlay/types.js';
import { layerPlacements, modalPlacements, modalSizes } from './contract.js';
import { createOverlayManager, type OverlayOpenChangeDetail } from './dom.js';

function waitForBrowser() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

const hosts = new Set<HTMLElement>();
const managers = new Set<ReturnType<typeof createOverlayManager>>();

afterEach(() => {
  for (const manager of managers) {
    manager.destroy();
  }
  managers.clear();
  for (const host of hosts) {
    host.remove();
  }
  hosts.clear();
  document.documentElement.removeAttribute('dir');
});

function mount(...elements: HTMLElement[]) {
  const host = document.createElement('div');
  host.append(...elements);
  document.body.append(host);
  hosts.add(host);
  return host;
}

function manager() {
  const value = createOverlayManager(document);
  managers.add(value);
  return value;
}

function rawModal(id: string) {
  const element = document.createElement('dialog');
  element.id = id;
  element.className = 'tr-modal';
  element.dataset.trOverlay = 'modal';
  element.dataset.placement = 'middle';
  element.innerHTML = `
    <div class="tr-modal-box" data-size="md">
      <h2 class="tr-modal-title" tabindex="-1">${id}</h2>
      <button data-tr-overlay-close>Close</button>
    </div>
    <form class="tr-modal-backdrop" method="dialog">
      <button aria-label="Close modal">backdrop</button>
    </form>`;
  return element;
}

function rawLayer(id: string, mode: 'auto' | 'manual' | 'hint' = 'manual') {
  const element = document.createElement('div');
  element.id = id;
  element.className = 'tr-layer';
  element.popover = mode;
  element.dataset.trOverlay = 'layer';
  element.dataset.placement = 'bottom-start';
  element.textContent = id;
  return element;
}

test.each(
  modalPlacements,
)('opens and positions Modal placement %s', async (placement) => {
  const trigger = document.createElement('button');
  const modal = rawModal(`modal-${placement}`);
  modal.dataset.placement = placement;
  mount(trigger, modal);
  const value = manager();

  trigger.focus();
  expect(value.open(modal, { reason: 'trigger', source: trigger })).toBe(true);
  await waitForBrowser();

  expect(isModal(modal)).toBe(true);
  expect(isModalOpen(modal)).toBe(true);
  expect(isSurfaceOpen(modal)).toBe(true);
  expect(modal.dataset.topmost).toBe('true');
  expect(
    getComputedStyle(modal.querySelector('.tr-modal-box') as Element).display,
  ).toBe('grid');

  value.close(modal);
  await waitForBrowser();
  expect(isModalOpen(modal)).toBe(false);
});

test.each(modalSizes)('renders Modal size contract %s', async (size) => {
  const modal = rawModal(`size-${size}`);
  modal.querySelector('.tr-modal-box')?.setAttribute('data-size', size);
  mount(modal);
  const value = manager();

  value.open(modal);
  await waitForBrowser();
  expect(modal.querySelector('.tr-modal-box')?.getAttribute('data-size')).toBe(size);
  value.close(modal);
});

test.each([
  [false, false, false],
  [false, false, true],
  [false, true, false],
  [false, true, true],
  [true, false, false],
  [true, false, true],
  [true, true, false],
  [true, true, true],
] as const)('covers Modal dismissal flags backdrop=%s escape=%s scroll=%s', async (closeOnBackdrop, closeOnEscape, preventScroll) => {
  const trigger = document.createElement('button');
  const modal = rawModal(`flags-${closeOnBackdrop}-${closeOnEscape}-${preventScroll}`);
  modal.dataset.closeOnBackdrop = String(closeOnBackdrop);
  modal.dataset.closeOnEscape = String(closeOnEscape);
  modal.dataset.preventScroll = String(preventScroll);
  mount(trigger, modal);
  const value = manager();

  value.open(modal, { source: trigger, reason: 'trigger' });
  await waitForBrowser();
  expect(document.documentElement.dataset.trModalOpen).toBe(
    preventScroll ? 'true' : undefined,
  );

  modal.querySelector<HTMLButtonElement>('.tr-modal-backdrop button')?.click();
  await waitForBrowser();
  expect(isModalOpen(modal)).toBe(!closeOnBackdrop);

  if (isModalOpen(modal)) {
    modal.dispatchEvent(new Event('cancel', { cancelable: true }));
    await waitForBrowser();
    expect(isModalOpen(modal)).toBe(!closeOnEscape);
  }

  value.close(modal);
});

test('covers command and popover actions, invalid targets, and non-overlay elements', async () => {
  const modal = rawModal('command-modal');
  const layer = rawLayer('command-layer');
  const trigger = document.createElement('button');
  trigger.setAttribute('commandfor', modal.id);
  trigger.setAttribute('command', 'show-modal');
  const close = document.createElement('button');
  close.setAttribute('commandfor', modal.id);
  close.setAttribute('command', 'close');
  const requestClose = document.createElement('button');
  requestClose.setAttribute('commandfor', modal.id);
  requestClose.setAttribute('command', 'request-close');
  const unknown = document.createElement('button');
  unknown.setAttribute('commandfor', modal.id);
  unknown.setAttribute('command', 'unknown');
  const layerTrigger = document.createElement('button');
  layerTrigger.setAttribute('popovertarget', layer.id);
  mount(trigger, close, requestClose, unknown, layerTrigger, modal, layer);
  const value = manager();

  expect(value.open('missing')).toBe(false);
  expect(value.close('missing')).toBe(false);
  expect(value.toggle('missing')).toBe(false);
  const plain = document.createElement('div');
  expect(value.open(plain)).toBe(false);
  expect(value.close(plain)).toBe(true);
  expect(value.toggle(plain)).toBe(false);

  trigger.click();
  await waitForBrowser();
  expect(isModalOpen(modal)).toBe(true);
  close.click();
  await waitForBrowser();
  expect(isModalOpen(modal)).toBe(false);
  trigger.click();
  await waitForBrowser();
  requestClose.click();
  await waitForBrowser();
  expect(isModalOpen(modal)).toBe(false);
  trigger.click();
  await waitForBrowser();
  unknown.click();
  await waitForBrowser();
  expect(isModalOpen(modal)).toBe(true);
  value.close(modal);

  layerTrigger.setAttribute('popovertargetaction', 'show');
  layerTrigger.click();
  await waitForBrowser();
  expect(isPopoverOpen(layer)).toBe(true);
  layerTrigger.setAttribute('popovertargetaction', 'hide');
  layerTrigger.click();
  await waitForBrowser();
  expect(isPopoverOpen(layer)).toBe(false);
  layerTrigger.removeAttribute('popovertargetaction');
  layerTrigger.click();
  await waitForBrowser();
  expect(isPopoverOpen(layer)).toBe(true);
  layerTrigger.click();
  await waitForBrowser();
  expect(isPopoverOpen(layer)).toBe(false);
});

test('handles blocked changes, forced cascade changes, and all event details', async () => {
  const modal = rawModal('blocked-modal');
  const layer = rawLayer('blocked-layer');
  const anchor = document.createElement('button');
  const childAnchor = document.createElement('button');
  const modalBox = modal.querySelector('.tr-modal-box');
  modalBox?.append(anchor, layer);
  layer.append(childAnchor);
  mount(modal, childLayerPlaceholder());
  const value = manager();
  const before: OverlayOpenChangeDetail[] = [];
  const changes: OverlayOpenChangeDetail[] = [];
  let blockOpen = true;
  modal.addEventListener('tinyrack:overlay-beforechange', (event) => {
    const detail = (event as CustomEvent<OverlayOpenChangeDetail>).detail;
    before.push(detail);
    if (blockOpen || detail.reason === 'programmatic') {
      event.preventDefault();
    }
  });
  modal.addEventListener('tinyrack:overlay-change', (event) => {
    changes.push((event as CustomEvent<OverlayOpenChangeDetail>).detail);
  });

  expect(value.open(modal)).toBe(false);
  expect(before.at(-1)?.open).toBe(true);
  blockOpen = false;
  modal.addEventListener('tinyrack:overlay-beforechange', (event) => {
    const detail = (event as CustomEvent<OverlayOpenChangeDetail>).detail;
    if (detail.reason === 'programmatic' && !detail.open) {
      event.preventDefault();
    }
  });
  modal.dataset.closeOnBackdrop = 'true';
  modal.dataset.closeOnEscape = 'true';
  const blocker = modal.querySelector('.tr-modal-backdrop') as HTMLElement;
  blocker.remove();
  value.open(modal, { source: anchor, reason: 'trigger' });
  await waitForBrowser();
  const childLayer = rawLayer('blocked-child');
  modalBox?.append(childLayer);
  value.open(layer, { source: anchor, reason: 'trigger' });
  await waitForBrowser();
  value.open(childLayer, { source: childAnchor, reason: 'trigger' });
  await waitForBrowser();
  value.close(modal, { reason: 'programmatic' });
  await waitForBrowser();

  expect(changes.some((detail) => detail.reason === 'ancestor-close')).toBe(true);
  expect(changes.every((detail) => detail.overlay instanceof HTMLElement)).toBe(true);
});

function childLayerPlaceholder() {
  return document.createElement('span');
}

test('adopts native state and reports native dismissals', async () => {
  const modal = rawModal('native-adopt-modal');
  const layer = rawLayer('native-adopt-layer');
  const anchor = document.createElement('button');
  mount(anchor, modal, layer);
  modal.showModal();
  layer.showPopover({ source: anchor });
  const changes: string[] = [];
  modal.addEventListener('tinyrack:overlay-change', (event) => {
    changes.push((event as CustomEvent<OverlayOpenChangeDetail>).detail.reason);
  });
  const value = manager();
  await waitForBrowser();
  expect(modal.dataset.trManaged).toBe('true');
  expect(layer.dataset.trManaged).toBe('true');

  modal.close();
  layer.hidePopover();
  await waitForBrowser();
  expect(changes).toContain('native-dismiss');
  value.destroy();
});

test('keeps shared manager references alive until the final destroy', async () => {
  const modal = rawModal('shared-modal');
  mount(modal);
  const first = manager();
  const second = manager();

  first.destroy();
  expect(second.open(modal)).toBe(true);
  await waitForBrowser();
  expect(isModalOpen(modal)).toBe(true);
  second.destroy();
  await waitForBrowser();
  expect(isModalOpen(modal)).toBe(false);
  expect(document.documentElement.dataset.trModalOpen).toBeUndefined();
});

test('closes detached overlays and detached layer anchors through MutationObserver', async () => {
  const modal = rawModal('detached-modal');
  const layer = rawLayer('detached-layer');
  const anchor = document.createElement('button');
  mount(anchor, modal, layer);
  const value = manager();

  value.open(modal);
  value.open(layer, { source: anchor });
  await waitForBrowser();
  anchor.remove();
  await waitForBrowser();
  expect(isPopoverOpen(layer)).toBe(false);
  modal.remove();
  await waitForBrowser();
  expect(modal.dataset.trManaged).toBeUndefined();
});

test.each(
  layerPlacements,
)('positions Layer placement %s with actual geometry', async (placement) => {
  const anchor = document.createElement('button');
  anchor.textContent = 'anchor';
  anchor.style.cssText =
    'position: fixed; left: 100px; top: 100px; width: 140px; height: 32px;';
  const layer = rawLayer(`layer-${placement}`);
  layer.dataset.placement = placement;
  layer.dataset.matchAnchorWidth = 'true';
  mount(anchor, layer);
  const value = manager();

  value.open(layer, { source: anchor, reason: 'trigger' });
  await waitForBrowser();
  expect(layer.dataset.positioned).toBe('true');
  expect(layer.matches(':popover-open')).toBe(true);
  expect(Number.parseFloat(layer.style.minWidth)).toBeGreaterThan(0);
  expect(Number.isFinite(layer.getBoundingClientRect().left)).toBe(true);
  value.close(layer);
});

test('covers native adapter and focus candidate branches with real elements', async () => {
  const modal = rawModal('adapter-modal');
  const layer = rawLayer('adapter-layer');
  const host = mount(modal, layer);
  const anchor = document.createElement('button');
  host.append(anchor);

  expect(isHTMLElement(modal)).toBe(true);
  expect(isHTMLElement(null)).toBe(false);
  expect(isModal(modal)).toBe(true);
  expect(isPopover(layer)).toBe(true);
  expect(isModal(layer)).toBe(false);
  expect(isPopover(modal)).toBe(false);
  expect(isSurfaceOpen(modal)).toBe(false);
  expect(isSurfaceOpen(layer)).toBe(false);
  expect(openNativeSurface(host, null)).toBe(false);
  expect(closeNativeSurface(host)).toBe(false);
  expect(openNativeSurface(modal, null)).toBe(true);
  expect(closeNativeSurface(modal)).toBe(true);
  expect(openNativeSurface(layer, anchor)).toBe(true);
  expect(closeNativeSurface(layer)).toBe(true);

  const controller = createFocusController(
    document,
    (element) => element?.closest('[data-tr-overlay]') as HTMLElement | null,
  );
  const visible = document.createElement('button');
  visible.textContent = 'visible';
  host.append(visible);
  expect(controller.isFocusCandidate(visible)).toBe(true);
  visible.hidden = true;
  expect(controller.isFocusCandidate(visible)).toBe(false);
  visible.hidden = false;
  visible.setAttribute('aria-hidden', 'true');
  expect(controller.isFocusCandidate(visible)).toBe(false);
  visible.removeAttribute('aria-hidden');
  visible.setAttribute('inert', '');
  expect(controller.isFocusCandidate(visible)).toBe(false);
  visible.removeAttribute('inert');
  (visible as HTMLButtonElement).disabled = true;
  expect(controller.isFocusCandidate(visible)).toBe(false);
});

test('returns false when native APIs throw and ignores unrelated delegated events', async () => {
  const modal = rawModal('throwing-modal');
  mount(modal);
  const value = manager();
  const show = vi
    .spyOn(HTMLDialogElement.prototype, 'showModal')
    .mockImplementationOnce(() => {
      throw new Error('show failed');
    });
  expect(value.open(modal)).toBe(false);
  show.mockRestore();

  const close = vi
    .spyOn(HTMLDialogElement.prototype, 'close')
    .mockImplementationOnce(() => {
      throw new Error('close failed');
    });
  value.open(modal);
  expect(value.close(modal)).toBe(false);
  close.mockRestore();

  document.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  document.dispatchEvent(new Event('toggle'));
  await waitForBrowser();
});

test('covers delegated event guards, cancel ordering, and native toggle reconciliation', async () => {
  const plain = document.createElement('button');
  const outsideClose = document.createElement('button');
  outsideClose.dataset.trOverlayClose = 'true';
  const missingCommand = document.createElement('button');
  missingCommand.setAttribute('commandfor', 'missing-command-target');
  const missingPopover = document.createElement('button');
  missingPopover.setAttribute('popovertarget', 'missing-popover-target');
  const orphanBackdrop = document.createElement('div');
  orphanBackdrop.className = 'tr-modal-backdrop';
  const modal = rawModal('guard-modal');
  const secondModal = rawModal('guard-second-modal');
  const layer = rawLayer('guard-layer');
  const anchor = document.createElement('button');
  mount(
    plain,
    outsideClose,
    missingCommand,
    missingPopover,
    orphanBackdrop,
    modal,
    secondModal,
    anchor,
    layer,
  );
  const value = manager();

  const preventedClick = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  });
  preventedClick.preventDefault();
  plain.dispatchEvent(preventedClick);
  outsideClose.dispatchEvent(
    new MouseEvent('click', { bubbles: true, cancelable: true }),
  );
  orphanBackdrop.click();
  missingCommand.click();
  missingPopover.click();

  value.open(modal);
  await waitForBrowser();
  modal.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true }));
  await waitForBrowser();
  modal.show();
  value.open(modal);
  await waitForBrowser();
  document.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }),
  );
  plain.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true }));
  plain.dispatchEvent(new Event('close', { bubbles: true }));
  plain.dispatchEvent(new Event('toggle', { bubbles: true }));
  modal.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true }));
  await waitForBrowser();

  value.open(modal);
  value.open(secondModal);
  await waitForBrowser();
  modal.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true }));
  await waitForBrowser();
  value.close(secondModal);

  layer.showPopover();
  await waitForBrowser();
  expect(layer.dataset.trManaged).toBe('true');
  layer.dispatchEvent(new Event('toggle', { bubbles: true }));
  layer.hidePopover();
  await waitForBrowser();
  layer.showPopover({ source: anchor });
  await waitForBrowser();
  expect(layer.matches(':popover-open')).toBe(true);
  layer.hidePopover();
  await waitForBrowser();
  layer.dataset.closeOnEscape = 'false';
  layer.showPopover({ source: anchor });
  await waitForBrowser();
  document.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }),
  );
  await waitForBrowser();
  expect(layer.matches(':popover-open')).toBe(true);
  layer.hidePopover();
  await waitForBrowser();

  const nativeModal = rawModal('toggle-modal');
  mount(nativeModal);
  nativeModal.showModal();
  nativeModal.dispatchEvent(
    new ToggleEvent('toggle', {
      oldState: 'closed',
      newState: 'open',
      source: anchor,
    }),
  );
  await waitForBrowser();
  expect(nativeModal.dataset.trManaged).toBe('true');
  nativeModal.close();
  await waitForBrowser();
});

test('covers nested modal parent resolution through a Layer', async () => {
  const outerModal = rawModal('outer-modal');
  const anchor = document.createElement('button');
  const layer = rawLayer('parent-layer');
  const nestedModal = rawModal('nested-modal');
  const layerBox = outerModal.querySelector('.tr-modal-box');
  layerBox?.append(anchor, layer);
  layer.append(nestedModal);
  mount(outerModal);
  const value = manager();

  value.open(outerModal);
  value.open(layer, { source: anchor });
  await waitForBrowser();
  value.open(nestedModal, { source: layer });
  await waitForBrowser();
  expect(nestedModal.matches(':modal')).toBe(true);
  value.close(nestedModal);
  value.close(layer);
  value.close(outerModal);

  const topLayer = rawLayer('top-layer-parent');
  const topNestedModal = rawModal('top-nested-modal');
  mount(topLayer);
  value.open(topLayer, { source: anchor });
  await waitForBrowser();
  topLayer.append(topNestedModal);
  value.open(topNestedModal, { source: topLayer });
  await waitForBrowser();
  expect(topNestedModal.matches(':modal')).toBe(true);
  value.close(topNestedModal);
  value.close(topLayer);
});

test('covers runtime event fallback, lifecycle without MutationObserver, and focus guards', async () => {
  const overlay = document.createElement('div');
  const detail = createSurfaceDetail(overlay, true, 'programmatic', null);
  const fallbackDocument = {
    defaultView: null,
  } as unknown as Document;
  expect(
    createSurfaceChangeEvent(fallbackDocument, 'test:event', detail, false),
  ).toBeInstanceOf(CustomEvent);

  const controller = createFocusController(
    document,
    (element) => element?.closest('[data-tr-overlay]') as HTMLElement | null,
  );
  controller.track(new FocusEvent('focusin'), []);
  const entry = {
    cleanupPositioning: null,
    close: () => true,
    element: document.createElement('div'),
    kind: 'modal' as const,
    lastFocused: null,
    parent: null,
    restoreCandidates: [],
    source: null,
  } satisfies SurfaceEntry;
  controller.restore(entry, []);

  const closedOverlay = rawLayer('closed-focus-overlay');
  const closedChild = document.createElement('button');
  closedOverlay.append(closedChild);
  mount(closedOverlay);
  expect(controller.isFocusCandidate(closedChild)).toBe(false);
  closedOverlay.showPopover();
  await waitForBrowser();
  expect(controller.isFocusCandidate(closedChild)).toBe(true);
  closedOverlay.hidePopover();
});

test('covers native adapter open normalization and positioning cleanup branches', async () => {
  const modal = rawModal('non-modal-dialog');
  const anchor = document.createElement('button');
  const layer = rawLayer('invalid-placement-layer');
  layer.dataset.placement = 'invalid';
  layer.dataset.matchAnchorWidth = 'false';
  mount(anchor, modal, layer);
  expect(closeNativeSurface(layer)).toBe(true);
  modal.show();
  expect(isModalOpen(modal)).toBe(false);
  expect(openNativeSurface(modal, null)).toBe(true);
  await waitForBrowser();
  expect(isModalOpen(modal)).toBe(true);
  expect(closeNativeSurface(modal)).toBe(true);
  expect(closeNativeSurface(modal)).toBe(true);
  expect(openNativeSurface(layer, null)).toBe(true);
  expect(closeNativeSurface(layer)).toBe(true);
  expect(openNativeSurface(layer, anchor)).toBe(true);

  const detachedLayer = rawLayer('detached-position-layer');
  const detachedAnchor = document.createElement('button');
  const detachedEntry = {
    cleanupPositioning: null,
    close: () => true,
    element: detachedLayer,
    kind: 'popover' as const,
    lastFocused: null,
    parent: null,
    restoreCandidates: [],
    source: detachedAnchor,
  } satisfies SurfaceEntry;
  expect(createPopoverPositioner(detachedEntry, () => detachedAnchor)).toBeNull();

  const positionEntry = {
    cleanupPositioning: null,
    close: () => true,
    element: layer,
    kind: 'popover' as const,
    lastFocused: null,
    parent: null,
    restoreCandidates: [],
    source: anchor,
  } satisfies SurfaceEntry;
  const cleanupPositioning = createPopoverPositioner(positionEntry, () => anchor);
  expect(cleanupPositioning).not.toBeNull();
  delete layer.dataset.placement;
  layer.showPopover({ source: anchor });
  await waitForBrowser();
  layer.hidePopover();
  await waitForBrowser();
  anchor.remove();
  window.dispatchEvent(new Event('resize'));
  await waitForBrowser();
  cleanupPositioning?.();
  expect(layer.style.getPropertyValue('--tr-layer-available-height')).toBe('');
});

test('reconciles a stale closed entry during cancel handling', async () => {
  const modal = rawModal('stale-modal');
  mount(modal);
  const value = manager();
  value.open(modal);
  await waitForBrowser();
  Object.defineProperty(modal, 'open', {
    configurable: true,
    value: false,
  });
  modal.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true }));
  await waitForBrowser();
  expect(modal.dataset.trManaged).toBeUndefined();
});
