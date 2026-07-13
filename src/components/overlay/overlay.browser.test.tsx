import '../../core/core.css';
import '../button/button.css';
import './overlay.css';
import { useState } from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { Button } from '../button/react.js';
import { createOverlayManager, type OverlayOpenChangeDetail } from './dom.js';
import {
  Layer,
  LayerClose,
  LayerContent,
  LayerTrigger,
  Modal,
  ModalAction,
  ModalBody,
  ModalBox,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from './react.js';

function waitForBrowser() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function waitForMotion() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 220);
  });
}

const rawHosts = new Set<HTMLElement>();
const rawManagers = new Set<ReturnType<typeof createOverlayManager>>();

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('dir');
  document.querySelectorAll('[data-overlay-test-style]').forEach((style) => {
    style.remove();
  });

  for (const manager of rawManagers) {
    manager.destroy();
  }
  rawManagers.clear();

  for (const host of rawHosts) {
    host.remove();
  }
  rawHosts.clear();
});

function trackRaw(host: HTMLElement, manager: ReturnType<typeof createOverlayManager>) {
  rawHosts.add(host);
  rawManagers.add(manager);
}

function createRawModal(id: string) {
  const modal = document.createElement('dialog');
  modal.id = id;
  modal.className = 'tr-modal';
  modal.dataset.trOverlay = 'modal';
  modal.dataset.placement = 'middle';
  modal.dataset.closeOnEscape = 'true';
  modal.dataset.closeOnBackdrop = 'true';
  modal.innerHTML = `
    <div class="tr-modal-box" data-size="md">
      <h2 class="tr-modal-title" tabindex="-1">${id}</h2>
      <button data-tr-overlay-close>Close</button>
    </div>
    <form class="tr-modal-backdrop" method="dialog">
      <button aria-label="Close modal">close</button>
    </form>`;
  return modal;
}

function createRawLayer(id: string, mode: 'auto' | 'manual' | 'hint' = 'manual') {
  const layer = document.createElement('div');
  layer.id = id;
  layer.className = 'tr-layer';
  layer.popover = mode;
  layer.dataset.trOverlay = 'layer';
  layer.dataset.placement = 'bottom-start';
  layer.textContent = `${mode} layer`;
  return layer;
}

test('native command HTML works before a manager is created', async () => {
  const host = document.createElement('div');
  const trigger = document.createElement('button');
  const modal = createRawModal('native-command-modal');
  trigger.setAttribute('commandfor', modal.id);
  trigger.setAttribute('command', 'show-modal');
  trigger.textContent = 'Native open';
  host.append(trigger, modal);
  document.body.append(host);
  rawHosts.add(host);

  trigger.click();
  await waitForBrowser();

  expect(modal.matches(':modal')).toBe(true);
  modal.close();
});

test('manager adopts overlays that entered the native top layer first', async () => {
  const host = document.createElement('div');
  const modal = createRawModal('adopted-modal');
  host.append(modal);
  document.body.append(host);
  modal.showModal();
  const manager = createOverlayManager(document);
  trackRaw(host, manager);

  await waitForBrowser();

  expect(modal.dataset.trManaged).toBe('true');
  expect(modal.dataset.topmost).toBe('true');
  expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');
});

test('DOM manager opens and closes the native HTML Modal contract', async () => {
  document.documentElement.dataset.theme = 'tinyrack-dark';
  const host = document.createElement('div');
  const trigger = document.createElement('button');
  trigger.setAttribute('commandfor', 'raw-modal');
  trigger.setAttribute('command', 'show-modal');
  trigger.textContent = 'Open raw modal';
  const modal = createRawModal('raw-modal');
  host.append(trigger, modal);
  document.body.append(host);
  const manager = createOverlayManager(document);
  trackRaw(host, manager);
  const changes: OverlayOpenChangeDetail[] = [];
  modal.addEventListener('tinyrack:overlay-change', (event) => {
    changes.push((event as CustomEvent<OverlayOpenChangeDetail>).detail);
  });

  trigger.click();
  await waitForBrowser();

  expect(modal.matches(':modal')).toBe(true);
  expect(modal.dataset.topmost).toBe('true');
  expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');
  expect(changes.at(-1)?.reason).toBe('trigger');
  expect(
    getComputedStyle(modal.querySelector('.tr-modal-box') as Element).maxWidth,
  ).toBe('512px');

  modal.querySelector<HTMLButtonElement>('.tr-modal-backdrop button')?.click();
  await waitForBrowser();

  expect(modal.matches(':modal')).toBe(false);
  expect(changes.at(-1)?.reason).toBe('backdrop');
  expect(document.documentElement.dataset.trModalOpen).toBeUndefined();
  expect(document.activeElement).toBe(trigger);
});

test('DOM manager keeps stacked Modals LIFO with one active backdrop', async () => {
  document.documentElement.dataset.theme = 'tinyrack-light';
  const host = document.createElement('div');
  const first = createRawModal('first-modal');
  const second = createRawModal('second-modal');
  const firstTrigger = document.createElement('button');
  firstTrigger.textContent = 'Open first';
  host.append(firstTrigger, first, second);
  document.body.append(host);
  const manager = createOverlayManager(document);
  trackRaw(host, manager);

  firstTrigger.focus();
  manager.open(first, { reason: 'trigger', source: firstTrigger });
  const nestedTrigger = first.querySelector<HTMLButtonElement>('button');
  nestedTrigger?.focus();
  manager.open(second, { reason: 'trigger', source: nestedTrigger });
  await waitForBrowser();
  await waitForMotion();

  expect(first.matches(':modal')).toBe(true);
  expect(second.matches(':modal')).toBe(true);
  expect(first.hasAttribute('data-topmost')).toBe(false);
  expect(second.dataset.topmost).toBe('true');
  expect(
    getComputedStyle(first.querySelector('.tr-modal-backdrop') as Element)
      .backgroundColor,
  ).toBe('rgba(0, 0, 0, 0)');
  expect(
    getComputedStyle(second.querySelector('.tr-modal-backdrop') as Element)
      .backgroundColor,
  ).not.toBe('rgba(0, 0, 0, 0)');

  second.dispatchEvent(new Event('cancel', { cancelable: true }));
  await waitForBrowser();

  expect(second.matches(':modal')).toBe(false);
  expect(first.matches(':modal')).toBe(true);
  expect(first.dataset.topmost).toBe('true');

  manager.close(first);
});

test('opening a Modal dismisses every existing Layer mode', async () => {
  const host = document.createElement('div');
  const anchor = document.createElement('button');
  anchor.textContent = 'Layer anchor';
  const layer = document.createElement('div');
  layer.id = 'raw-layer';
  layer.className = 'tr-layer';
  layer.popover = 'manual';
  layer.dataset.trOverlay = 'layer';
  layer.dataset.placement = 'bottom-start';
  layer.textContent = 'Layer content';
  const modal = createRawModal('layer-modal');
  host.append(anchor, layer, modal);
  document.body.append(host);
  const manager = createOverlayManager(document);
  trackRaw(host, manager);

  manager.open(layer, { reason: 'trigger', source: anchor });
  await waitForBrowser();

  expect(layer.matches(':popover-open')).toBe(true);
  expect(layer.dataset.positioned).toBe('true');

  manager.open(modal, { reason: 'trigger', source: anchor });
  await waitForBrowser();

  expect(layer.matches(':popover-open')).toBe(false);
  expect(modal.matches(':modal')).toBe(true);

  manager.close(modal);
});

test('DOM manager supports auto, manual, and hint Layer modes', async () => {
  const host = document.createElement('div');
  const anchor = document.createElement('button');
  anchor.textContent = 'Anchor';
  const layers = [
    createRawLayer('auto-layer', 'auto'),
    createRawLayer('manual-layer', 'manual'),
    createRawLayer('hint-layer', 'hint'),
  ];
  host.append(anchor, ...layers);
  document.body.append(host);
  const manager = createOverlayManager(document);
  trackRaw(host, manager);

  for (const layer of layers) {
    manager.open(layer, { reason: 'trigger', source: anchor });
    await waitForBrowser();
    expect(layer.matches(':popover-open')).toBe(true);
    expect(layer.dataset.positioned).toBe('true');
    manager.close(layer);
  }
});

test('closing a parent overlay cascades through nested Layers in LIFO order', async () => {
  const host = document.createElement('div');
  const modal = createRawModal('cascade-modal');
  const parentTrigger = document.createElement('button');
  parentTrigger.textContent = 'Parent trigger';
  modal.querySelector('.tr-modal-box')?.append(parentTrigger);
  const parentLayer = createRawLayer('parent-layer');
  const childTrigger = document.createElement('button');
  childTrigger.textContent = 'Child trigger';
  parentLayer.append(childTrigger);
  const childLayer = createRawLayer('child-layer');
  host.append(modal, parentLayer, childLayer);
  document.body.append(host);
  const manager = createOverlayManager(document);
  trackRaw(host, manager);
  const closed: Array<[string, string]> = [];
  const listenerController = new AbortController();
  document.addEventListener(
    'tinyrack:overlay-change',
    (event) => {
      const detail = (event as CustomEvent<OverlayOpenChangeDetail>).detail;
      if (!detail.open) {
        closed.push([detail.overlay.id, detail.reason]);
      }
    },
    { signal: listenerController.signal },
  );

  manager.open(modal);
  manager.open(parentLayer, { source: parentTrigger });
  manager.open(childLayer, { source: childTrigger });
  await waitForBrowser();
  manager.close(modal);
  await waitForBrowser();
  listenerController.abort();

  expect(closed).toEqual([
    ['child-layer', 'ancestor-close'],
    ['parent-layer', 'ancestor-close'],
    ['cascade-modal', 'programmatic'],
  ]);
});

test('Modal placements use viewport edges and logical RTL directions', async () => {
  const host = document.createElement('div');
  const modal = createRawModal('placement-modal');
  const box = modal.querySelector<HTMLElement>('.tr-modal-box');
  if (box === null) {
    throw new Error('Modal box missing.');
  }
  host.append(modal);
  document.body.append(host);
  const manager = createOverlayManager(document);
  trackRaw(host, manager);

  for (const placement of ['middle', 'top', 'bottom', 'start', 'end'] as const) {
    modal.dataset.placement = placement;
    manager.open(modal);
    await waitForBrowser();
    const modalRect = modal.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();

    if (placement === 'middle') {
      expect(
        Math.abs(
          boxRect.left + boxRect.width / 2 - (modalRect.left + modalRect.width / 2),
        ),
      ).toBeLessThan(2);
    } else if (placement === 'top') {
      expect(Math.abs(boxRect.top - modalRect.top)).toBeLessThan(2);
    } else if (placement === 'bottom') {
      expect(Math.abs(boxRect.bottom - modalRect.bottom)).toBeLessThan(2);
    } else if (placement === 'start') {
      expect(Math.abs(boxRect.left - modalRect.left)).toBeLessThan(2);
    } else {
      expect(Math.abs(boxRect.right - modalRect.right)).toBeLessThan(2);
    }
    manager.close(modal);
  }

  document.documentElement.dir = 'rtl';
  modal.dataset.placement = 'start';
  manager.open(modal);
  await waitForBrowser();
  expect(
    Math.abs(box.getBoundingClientRect().right - modal.getBoundingClientRect().right),
  ).toBeLessThan(2);
  manager.close(modal);
  document.documentElement.removeAttribute('dir');
});

test('user sizing can override convenience size while long bodies scroll', async () => {
  const style = document.createElement('style');
  style.dataset.overlayTestStyle = 'true';
  style.textContent = `@layer utilities {
    .overlay-test-width { width: 20rem; max-width: 20rem; }
  }`;
  document.head.append(style);
  const host = document.createElement('div');
  const modal = createRawModal('sizing-modal');
  const box = modal.querySelector<HTMLElement>('.tr-modal-box');
  const body = document.createElement('div');
  body.className = 'tr-modal-body';
  body.textContent = 'Long modal content. '.repeat(500);
  box?.classList.add('overlay-test-width');
  box?.append(body);
  host.append(modal);
  document.body.append(host);
  const manager = createOverlayManager(document);
  trackRaw(host, manager);

  manager.open(modal);
  await waitForBrowser();

  expect(getComputedStyle(box as Element).width).toBe('320px');
  expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
  expect(getComputedStyle(body).overflowY).toBe('auto');
  style.remove();
});

test('React Modal exposes daisyUI-shaped parts and uncontrolled behavior', async () => {
  document.documentElement.dataset.theme = 'tinyrack-dark';
  await render(
    <Modal>
      <ModalTrigger asChild>
        <Button>Open settings</Button>
      </ModalTrigger>
      <ModalContent placement="bottom">
        <ModalBox size="lg">
          <ModalHeader>
            <ModalTitle>Rack settings</ModalTitle>
            <ModalClose>Close</ModalClose>
          </ModalHeader>
          <ModalDescription>Update rack configuration.</ModalDescription>
          <ModalBody>Modal content</ModalBody>
          <ModalAction>Actions</ModalAction>
        </ModalBox>
      </ModalContent>
    </Modal>,
  );

  const trigger = Array.from(document.querySelectorAll('button')).find(
    (button) => button.textContent === 'Open settings',
  );
  trigger?.click();
  await waitForBrowser();

  const modal = document.querySelector<HTMLDialogElement>('.tr-modal');
  if (modal === null) {
    throw new Error('Modal was not rendered.');
  }

  expect(modal.matches(':modal')).toBe(true);
  expect(modal.dataset.placement).toBe('bottom');
  expect(modal.querySelector('.tr-modal-box')?.getAttribute('data-size')).toBe('lg');
  expect(modal.querySelector('.tr-modal-header')).not.toBeNull();
  expect(modal.querySelector('.tr-modal-description')).not.toBeNull();
  expect(modal.querySelector('.tr-modal-body')).not.toBeNull();
  expect(modal.querySelector('.tr-modal-action')).not.toBeNull();
  expect(modal.getAttribute('aria-labelledby')).toBe(
    modal.querySelector('.tr-modal-title')?.id,
  );
  expect(modal.getAttribute('aria-describedby')).toBe(
    modal.querySelector('.tr-modal-description')?.id,
  );
  expect(
    Number.parseFloat(
      getComputedStyle(modal.querySelector('.tr-modal-box') as Element).width,
    ),
  ).toBeGreaterThan(window.innerWidth * 0.9);

  const close = Array.from(modal.querySelectorAll('button')).find(
    (button) => button.textContent === 'Close',
  );
  close?.click();
  await waitForBrowser();

  expect(modal.matches(':modal')).toBe(false);
});

test('React controlled Modal reports dismiss reasons and respects toggles', async () => {
  const reasons: string[] = [];

  function ControlledModal() {
    const [open, setOpen] = useState(false);

    return (
      <Modal
        closeOnBackdrop={false}
        closeOnEscape={false}
        open={open}
        onOpenChange={(nextOpen, detail) => {
          reasons.push(detail.reason);
          setOpen(nextOpen);
        }}
      >
        <ModalTrigger>Open guarded</ModalTrigger>
        <ModalContent>
          <ModalBox>
            <ModalTitle>Guarded modal</ModalTitle>
            <ModalClose>Close guarded</ModalClose>
          </ModalBox>
        </ModalContent>
      </Modal>
    );
  }

  await render(<ControlledModal />);
  Array.from(document.querySelectorAll('button'))
    .find((button) => button.textContent === 'Open guarded')
    ?.click();
  await waitForBrowser();

  const modal = document.querySelector<HTMLDialogElement>('.tr-modal');
  if (modal === null) {
    throw new Error('Controlled Modal was not rendered.');
  }

  modal.dispatchEvent(new Event('cancel', { cancelable: true }));
  modal.querySelector<HTMLButtonElement>('.tr-modal-backdrop button')?.click();
  await waitForBrowser();

  expect(reasons).toEqual(['trigger']);
  expect(modal.matches(':modal')).toBe(true);

  Array.from(modal.querySelectorAll('button'))
    .find((button) => button.textContent === 'Close guarded')
    ?.click();
  await waitForBrowser();

  expect(reasons).toEqual(['trigger', 'close-button']);
  expect(modal.matches(':modal')).toBe(false);
});

test('React manual Layer positions from asChild anchor and closes before Modal', async () => {
  await render(
    <Modal defaultOpen>
      <ModalContent>
        <ModalBox>
          <ModalTitle>Parent modal</ModalTitle>
          <Layer mode="manual">
            <LayerTrigger asChild>
              <Button>Open layer</Button>
            </LayerTrigger>
            <LayerContent role="dialog">
              Layer content
              <LayerClose>Close layer</LayerClose>
            </LayerContent>
          </Layer>
        </ModalBox>
      </ModalContent>
    </Modal>,
  );
  await waitForBrowser();

  Array.from(document.querySelectorAll('button'))
    .find((button) => button.textContent === 'Open layer')
    ?.click();
  await waitForBrowser();

  const modal = document.querySelector<HTMLDialogElement>('.tr-modal');
  const layer = document.querySelector<HTMLElement>('.tr-layer');
  if (modal === null || layer === null) {
    throw new Error('Modal or Layer was not rendered.');
  }

  expect(modal.matches(':modal')).toBe(true);
  expect(layer.matches(':popover-open')).toBe(true);
  expect(layer.dataset.positioned).toBe('true');

  document.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Escape',
    }),
  );
  await waitForBrowser();

  expect(layer.matches(':popover-open')).toBe(false);
  expect(modal.matches(':modal')).toBe(true);
});
