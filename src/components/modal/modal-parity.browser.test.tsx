import '../../core/core.css';
import './modal.css';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import { Modal, ModalBox, ModalContent, ModalTitle } from './react.js';

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
});

test('keeps raw HTML and React Modal part order and attributes aligned', async () => {
  const raw = document.createElement('dialog');
  raw.className = 'tr-modal';
  raw.dataset['placement'] = 'middle';
  raw.innerHTML =
    '<div class="tr-modal-box" data-size="md"><h2 class="tr-modal-title">Title</h2></div>';
  document.body.append(raw);
  await render(
    <Modal>
      <ModalContent>
        <ModalBox>
          <ModalTitle>Title</ModalTitle>
        </ModalBox>
      </ModalContent>
    </Modal>,
  );
  const react = document.querySelectorAll<HTMLDialogElement>('dialog')[1]!;
  expect(react.className).toBe(raw.className);
  expect(react.dataset['placement']).toBe(raw.dataset['placement']);
  expect(react.querySelector('.tr-modal-box')?.getAttribute('data-size')).toBe('md');
  expect(react.querySelector('.tr-modal-title')?.textContent).toBe('Title');
});
