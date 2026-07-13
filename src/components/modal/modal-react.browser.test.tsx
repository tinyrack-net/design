import '../../core/core.css';
import './modal.css';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import {
  Modal,
  ModalBox,
  ModalClose,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from './react.js';

afterEach(() => cleanup());

function waitForBrowser() {
  return new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
}

test('renders the canonical React Modal contract and synchronizes native state', async () => {
  await render(
    <Modal>
      <ModalTrigger>Open</ModalTrigger>
      <ModalContent placement="end">
        <ModalBox size="lg">
          <ModalTitle>Settings</ModalTitle>
          <ModalClose>Close</ModalClose>
        </ModalBox>
      </ModalContent>
    </Modal>,
  );
  document.querySelector<HTMLButtonElement>('button')!.click();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  const dialog = document.querySelector<HTMLDialogElement>('dialog')!;
  expect(dialog.matches(':modal')).toBe(true);
  expect(dialog.dataset['placement']).toBe('end');
  expect(dialog.querySelector('.tr-modal-box')?.getAttribute('data-size')).toBe('lg');
  dialog.querySelector<HTMLButtonElement>('[data-tr-overlay-close]')!.click();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  expect(dialog.matches(':modal')).toBe(false);
});

test('preserves prevented trigger and close handlers with closerequest dismissal', async () => {
  await render(
    <Modal defaultOpen closeOnBackdrop={false} closeOnEscape>
      <ModalTrigger onClick={(event) => event.preventDefault()}>
        Blocked open
      </ModalTrigger>
      <ModalContent>
        <ModalBox>
          <ModalTitle>Protected</ModalTitle>
          <ModalClose onClick={(event) => event.preventDefault()}>
            Blocked close
          </ModalClose>
        </ModalBox>
      </ModalContent>
    </Modal>,
  );
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  const dialog = document.querySelector<HTMLDialogElement>('dialog');
  expect(dialog?.getAttribute('closedby')).toBe('closerequest');
  document.querySelector<HTMLButtonElement>('button')?.click();
  dialog?.querySelector<HTMLButtonElement>('[data-tr-overlay-close]')?.click();
  expect(dialog?.matches(':modal')).toBe(true);
});

test('restores a controlled Modal when native dismissal is rejected', async () => {
  const onOpenChange = vi.fn();
  await render(
    <Modal open onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalBox>
          <ModalTitle>Controlled</ModalTitle>
        </ModalBox>
      </ModalContent>
    </Modal>,
  );
  await waitForBrowser();
  const dialog = document.querySelector<HTMLDialogElement>('dialog')!;
  dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
  await waitForBrowser();

  expect(onOpenChange).toHaveBeenCalledWith(
    false,
    expect.objectContaining({ reason: 'escape' }),
  );
  expect(dialog.matches(':modal')).toBe(true);
});
