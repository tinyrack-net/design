import '../../core/core.css';
import './field.css';
import '../input/input.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRField, TRFieldRoot } from './index.js';

test('assembles an accessible Base UI field', async () => {
  expect(TRField.Root).toBe(TRFieldRoot);
  await render(
    <TRField.Root invalid>
      <TRField.Label>Email</TRField.Label>
      <TRField.Control required type="email" />
      <TRField.Description>Work address</TRField.Description>
      <TRField.Error match>Please enter an email.</TRField.Error>
    </TRField.Root>,
  );
  const input = document.querySelector<HTMLInputElement>('.tr-field-control');
  expect(input?.getAttribute('aria-invalid')).toBe('true');
  expect(document.querySelector('.tr-field-error')?.textContent).toContain('email');
});

test('owns TRField.Control styling independently from the standalone TRInput class', async () => {
  await render(
    <TRField.Root>
      <TRField.Label>Rack name</TRField.Label>
      <TRField.Control defaultValue="Rack Alpha" />
    </TRField.Root>,
  );
  const control = document.querySelector<HTMLInputElement>('.tr-field-control');
  expect(control).not.toBeNull();
  expect(control?.classList.contains('tr-input')).toBe(false);
  expect(control?.getBoundingClientRect().height).toBe(40);
});

test('applies the public size recipe to TRField.Control', async () => {
  await render(
    <>
      <TRField.Root uiSize="sm">
        <TRField.Control aria-label="Small rack" />
      </TRField.Root>
      <TRField.Root uiSize="lg">
        <TRField.Control aria-label="Large rack" />
      </TRField.Root>
    </>,
  );
  const [small, large] = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-field-control'),
  );
  expect(small?.getBoundingClientRect().height).toBe(32);
  expect(large?.getBoundingClientRect().height).toBe(48);
});
