import '../../core/core.css';
import './modal.css';
import { afterEach, expect, test } from 'vitest';
import type { ModalOpenChangeDetail } from './contract.js';
import { createModalManager } from './dom.js';

function waitForBrowser() {
  return new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
}

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-tr-modal-open');
});

test('opens and closes a zero-JavaScript declarative Modal', async () => {
  document.body.innerHTML = `
    <button id="open" commandfor="zero-js-modal" command="show-modal">Open</button>
    <dialog id="zero-js-modal" class="tr-modal" data-prevent-scroll="true">
      <div class="tr-modal-box" data-size="md"><h2>Settings</h2></div>
      <form method="dialog" class="tr-modal-backdrop"><button id="close">Close</button></form>
    </dialog>`;
  const trigger = document.querySelector<HTMLButtonElement>('#open')!;
  const dialog = document.querySelector<HTMLDialogElement>('dialog')!;
  trigger.focus();
  trigger.click();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  expect(dialog.matches(':modal')).toBe(true);
  expect(getComputedStyle(dialog).display).toBe('grid');
  expect(getComputedStyle(document.documentElement).overflow).toBe('hidden');
  document.querySelector<HTMLButtonElement>('#close')!.click();
  expect(dialog.matches(':modal')).toBe(false);
});

test('keeps advanced dismissal and returnValue semantics in the Modal manager', () => {
  const trigger = document.createElement('button');
  const dialog = document.createElement('dialog');
  dialog.className = 'tr-modal';
  document.body.append(trigger, dialog);
  const manager = createModalManager(document);
  expect(manager.open(dialog, { reason: 'trigger', source: trigger })).toBe(true);
  expect(manager.close(dialog, { reason: 'close-button' })).toBe(true);
  expect(dialog.open).toBe(false);
  manager.destroy();
});

test('keeps request-close independent from Escape and clears its pending metadata', async () => {
  const trigger = document.createElement('button');
  trigger.setAttribute('commandfor', 'request-close-modal');
  trigger.setAttribute('command', 'request-close');
  trigger.value = 'accepted';
  const dialog = document.createElement('dialog');
  dialog.className = 'tr-modal';
  dialog.dataset.closeOnEscape = 'false';
  dialog.id = 'request-close-modal';
  document.body.append(trigger, dialog);
  const changes: ModalOpenChangeDetail[] = [];
  dialog.addEventListener('tinyrack:overlay-change', (event) => {
    changes.push((event as CustomEvent<ModalOpenChangeDetail>).detail);
  });
  const manager = createModalManager(document);

  trigger.click();
  await waitForBrowser();
  manager.open(dialog, { reason: 'trigger', source: trigger });
  dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
  await waitForBrowser();
  expect(dialog.matches(':modal')).toBe(true);

  trigger.click();
  await waitForBrowser();
  expect(dialog.matches(':modal')).toBe(false);
  expect(dialog.returnValue).toBe('accepted');
  expect(changes.filter((detail) => !detail.open).at(-1)?.reason).toBe('close-button');

  manager.open(dialog, { reason: 'programmatic' });
  dialog.close();
  await waitForBrowser();
  expect(changes.filter((detail) => !detail.open).at(-1)?.reason).toBe(
    'native-dismiss',
  );
  manager.destroy();
});
