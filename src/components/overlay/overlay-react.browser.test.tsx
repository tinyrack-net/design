import '../../core/core.css';
import '../button/button.css';
import './overlay.css';
import {
  createElement,
  type MouseEvent as ReactMouseEvent,
  useRef,
  useState,
} from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { composeRefs, renderSlottable } from '../../internal/react/slot.js';
import { useOpenState } from '../../internal/react/state.js';
import { useManagedSurface } from '../../internal/react/use-managed-surface.js';
import { Button } from '../button/react.js';
import type { PopoverOpenChangeReason } from '../popover/contract.js';
import { createPopoverManager } from '../popover/dom.js';
import {
  Layer,
  LayerAnchor,
  LayerClose,
  LayerContent,
  LayerTrigger,
  Modal,
  ModalBackdrop,
  ModalBox,
  ModalClose,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from './react.js';

function waitForBrowser() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

afterEach(() => {
  cleanup();
  document.querySelectorAll('[data-overlay-react-test]').forEach((element) => {
    element.remove();
  });
});

test('renders explicit Modal accessibility and option contract', async () => {
  await render(
    <Modal
      closeOnBackdrop={false}
      closeOnEscape={false}
      id="explicit-modal"
      preventScroll={false}
    >
      <ModalTrigger>Open</ModalTrigger>
      <ModalContent aria-label="Explicit label">
        <ModalBox>
          <ModalTitle id="explicit-title">Title</ModalTitle>
          <ModalClose>Close</ModalClose>
        </ModalBox>
      </ModalContent>
    </Modal>,
  );

  const modal = document.querySelector<HTMLDialogElement>('#explicit-modal');
  if (modal === null) {
    throw new Error('Modal not rendered.');
  }
  expect(modal.getAttribute('aria-label')).toBe('Explicit label');
  expect(modal.getAttribute('aria-labelledby')).toBeNull();
  expect(modal.getAttribute('aria-describedby')).toBeNull();
  expect(modal.getAttribute('closedby')).toBe('none');
  expect(modal.dataset.preventScroll).toBe('false');

  document.querySelector<HTMLButtonElement>('button')?.click();
  await waitForBrowser();
  expect(modal.matches(':modal')).toBe(true);
  document.querySelector<HTMLButtonElement>('[data-tr-overlay-close]')?.click();
  await waitForBrowser();
  expect(modal.matches(':modal')).toBe(false);
});

test.each([
  'auto',
  'manual',
  'hint',
] as const)('covers LayerAnchor, LayerTrigger, LayerClose, and mode %s', async (mode) => {
  await render(
    <Layer id={`layer-${mode}`} mode={mode}>
      <LayerAnchor>Anchor</LayerAnchor>
      <LayerTrigger asChild>
        <Button>Open {mode}</Button>
      </LayerTrigger>
      <LayerContent role="dialog">
        <span>{mode} content</span>
        <LayerClose asChild>
          <Button>Close {mode}</Button>
        </LayerClose>
      </LayerContent>
    </Layer>,
  );
  const trigger = Array.from(document.querySelectorAll('button')).find((button) =>
    button.textContent?.includes(`Open ${mode}`),
  );
  trigger?.click();
  await waitForBrowser();
  const layer = document.querySelector<HTMLElement>(`#layer-${mode}`);
  if (layer === null) {
    throw new Error(`Layer ${mode} not rendered.`);
  }
  expect(layer.matches(':popover-open')).toBe(true);
  expect(layer.getAttribute('popover')).toBe(mode);
  Array.from(layer.querySelectorAll('button'))
    .find((button) => button.textContent?.includes(`Close ${mode}`))
    ?.click();
  await waitForBrowser();
  expect(layer.matches(':popover-open')).toBe(false);
});

test('keeps React event composition and refs when asChild is used', async () => {
  const childClick = vi.fn((event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  });
  const ref = { current: null as HTMLButtonElement | null };
  await render(
    <Modal>
      <ModalTrigger asChild>
        <button onClick={childClick} ref={ref} type="button">
          Prevent open
        </button>
      </ModalTrigger>
      <ModalContent>
        <ModalBox>
          <ModalTitle>Never opened</ModalTitle>
        </ModalBox>
      </ModalContent>
    </Modal>,
  );

  const trigger = document.querySelector<HTMLButtonElement>('button');
  trigger?.click();
  await waitForBrowser();
  expect(childClick).toHaveBeenCalledTimes(1);
  expect(ref.current).toBe(trigger);
  expect(document.querySelector<HTMLDialogElement>('dialog')?.matches(':modal')).toBe(
    false,
  );
});

test('covers controlled rejection and repeated open requests', async () => {
  const changes: boolean[] = [];
  function Controlled() {
    const [open, setOpen] = useState(false);
    return (
      <Modal
        open={open}
        onOpenChange={(nextOpen) => {
          changes.push(nextOpen);
          if (nextOpen) {
            setOpen(false);
          }
        }}
      >
        <ModalTrigger>Request</ModalTrigger>
        <ModalContent>
          <ModalBox>
            <ModalTitle>Controlled</ModalTitle>
          </ModalBox>
        </ModalContent>
      </Modal>
    );
  }

  await render(<Controlled />);
  const trigger = document.querySelector<HTMLButtonElement>('button');
  trigger?.click();
  await waitForBrowser();
  trigger?.click();
  await waitForBrowser();
  expect(changes).toEqual([true, true]);
  expect(document.querySelector('dialog')?.matches(':modal')).toBe(false);
});

test('ignores a repeated uncontrolled request while already open', async () => {
  await render(
    <Modal>
      <ModalTrigger>Open once</ModalTrigger>
      <ModalContent>
        <ModalBox>
          <ModalTitle>Once</ModalTitle>
        </ModalBox>
      </ModalContent>
    </Modal>,
  );
  const trigger = document.querySelector<HTMLButtonElement>('button');
  trigger?.click();
  await waitForBrowser();
  trigger?.click();
  await waitForBrowser();
  expect(document.querySelector('dialog')?.matches(':modal')).toBe(true);
});

test('covers managed overlay refs that are not attached to an element', async () => {
  function EmptyManaged() {
    const elementRef = useRef<HTMLElement | null>(null);
    const sourceRef = useRef<HTMLElement | null>(null);
    const state = useOpenState<PopoverOpenChangeReason>({ defaultOpen: false });
    useManagedSurface(elementRef, sourceRef, state, createPopoverManager);
    return null;
  }

  await render(<EmptyManaged />);
  await waitForBrowser();
  expect(document.body).toBeTruthy();
});

test('covers slot invalid children and preventDefault branches', () => {
  expect(() =>
    renderSlottable(true, 'invalid', {}, null, (props, ref) =>
      createElement('button', { ...props, ref, type: 'button' }),
    ),
  ).toThrow('React.Children.only expected to receive a single React element child.');

  const slotClick = vi.fn();
  const child = createElement(
    'button',
    {
      onClick: (event: ReactMouseEvent<HTMLButtonElement>) => event.preventDefault(),
      type: 'button',
    },
    'child',
  );
  const rendered = renderSlottable(
    true,
    child,
    { onClick: slotClick },
    null,
    (props, ref) => createElement('button', { ...props, ref, type: 'button' }),
  );
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  (rendered.props as { onClick: (event: MouseEvent) => void }).onClick(event);
  expect(slotClick).not.toHaveBeenCalled();

  const refs = composeRefs<HTMLElement>(undefined, undefined);
  refs(null);
});

test('keeps generated ids and native pass-through attributes stable', async () => {
  await render(
    <Layer placement="top-end" offset={24} collisionPadding={16} matchAnchorWidth>
      <LayerTrigger aria-label="actions">Actions</LayerTrigger>
      <LayerContent data-overlay-react-test="true" aria-label="Actions menu" />
    </Layer>,
  );
  const trigger = document.querySelector<HTMLButtonElement>('button');
  const layer = document.querySelector<HTMLElement>('.tr-layer');
  if (trigger === null || layer === null) {
    throw new Error('Layer not rendered.');
  }
  expect(trigger.getAttribute('aria-controls')).toBe(layer.id);
  expect(layer.dataset.placement).toBe('top-end');
  expect(layer.dataset.offset).toBe('24');
  expect(layer.dataset.collisionPadding).toBe('16');
  expect(layer.dataset.matchAnchorWidth).toBe('true');
});

test('renders the public ModalBackdrop part', async () => {
  await render(
    <Modal>
      <ModalContent>
        <ModalBox>
          <ModalTitle>Backdrop</ModalTitle>
          <ModalBackdrop data-overlay-react-test="true" />
        </ModalBox>
      </ModalContent>
    </Modal>,
  );
  const backdrop = document.querySelector('form[data-overlay-react-test]');
  expect(backdrop?.className).toContain('tr-modal-backdrop');
  expect(backdrop?.getAttribute('method')).toBe('dialog');
});

test('honors a Layer trigger preventDefault before requesting open', async () => {
  await render(
    <Layer>
      <LayerTrigger
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        Blocked layer
      </LayerTrigger>
      <LayerContent>Content</LayerContent>
    </Layer>,
  );
  document.querySelector<HTMLButtonElement>('button')?.click();
  await waitForBrowser();
  expect(document.querySelector('.tr-layer')?.matches(':popover-open')).toBe(false);
});
