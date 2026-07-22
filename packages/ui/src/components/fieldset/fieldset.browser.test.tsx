import '../../core/core.css';
import './fieldset.css';
import { type CSSProperties, createRef } from 'react';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRFieldset, TRFieldsetLegend, TRFieldsetRoot } from './index.js';

test('renders the Tinyrack TRFieldset wrapper', async () => {
  expect(TRFieldset.Root).toBe(TRFieldsetRoot);
  expect(TRFieldset.Legend).toBe(TRFieldsetLegend);
  await render(
    <TRFieldset.Root>
      <TRFieldset.Legend>Settings</TRFieldset.Legend>
    </TRFieldset.Root>,
  );
  expect(document.querySelector('.tr-fieldset')).not.toBeNull();
});

test('renders native fieldset anatomy and preserves props, refs, and events', async () => {
  const rootRef = createRef<HTMLFieldSetElement>();
  const legendRef = createRef<HTMLLegendElement>();
  let clickCount = 0;

  await render(
    <TRFieldset.Root
      className="consumer-fieldset"
      data-consumer="fieldset"
      onClick={() => {
        clickCount += 1;
      }}
      ref={rootRef}
    >
      <TRFieldset.Legend className="consumer-legend" ref={legendRef}>
        Rack settings
      </TRFieldset.Legend>
      <button type="button">Apply</button>
    </TRFieldset.Root>,
  );

  const group = page.getByRole('group', { name: 'Rack settings' });
  expect(group.element().tagName).toBe('FIELDSET');
  expect(rootRef.current).toBe(group.element());
  expect(rootRef.current).toHaveClass('tr-fieldset', 'consumer-fieldset');
  expect(rootRef.current?.dataset['consumer']).toBe('fieldset');
  expect(legendRef.current?.tagName).toBe('LEGEND');
  expect(legendRef.current).toHaveClass('tr-fieldset-legend', 'consumer-legend');

  await page.getByRole('button', { name: 'Apply' }).click();
  expect(clickCount).toBe(1);
});

test('preserves fieldset semantics, disabled omission, and native reset', async () => {
  await render(
    <form>
      <TRFieldset.Root>
        <TRFieldset.Legend>Editable rack</TRFieldset.Legend>
        <label>
          Name
          <input defaultValue="Rack Alpha" name="rack" />
        </label>
      </TRFieldset.Root>
      <TRFieldset.Root disabled>
        <TRFieldset.Legend>Locked rack</TRFieldset.Legend>
        <input defaultValue="secret" name="locked" />
      </TRFieldset.Root>
      <button type="reset">Reset</button>
    </form>,
  );

  const fieldsets = document.querySelectorAll<HTMLFieldSetElement>('fieldset');
  const form = document.querySelector('form') as HTMLFormElement;
  const input = document.querySelector<HTMLInputElement>('input[name="rack"]');
  expect(fieldsets[0]?.textContent).toContain('Editable rack');
  expect(fieldsets[1]?.disabled).toBe(true);
  expect(new FormData(form).get('locked')).toBeNull();

  if (input) input.value = 'Rack Beta';
  form.reset();
  expect(input?.value).toBe('Rack Alpha');
  expect(new FormData(form).get('rack')).toBe('Rack Alpha');
});

test('propagates native disabled behavior without compounding descendant opacity', async () => {
  await render(
    <TRFieldset.Root disabled>
      <TRFieldset.Legend>Locked settings</TRFieldset.Legend>
      <button type="button">Unavailable action</button>
    </TRFieldset.Root>,
  );

  const group = page.getByRole('group', { name: 'Locked settings' }).element();
  const button = page.getByRole('button', { name: 'Unavailable action' }).element();
  expect((button as HTMLButtonElement).matches(':disabled')).toBe(true);
  expect(getComputedStyle(group as HTMLElement).opacity).toBe('0.5');
  expect(getComputedStyle(button as HTMLElement).opacity).toBe('1');
});

test('applies the public fieldset color token to its legend', async () => {
  await render(
    <TRFieldset.Root
      data-theme="tinyrack-light"
      style={{ '--tr-fieldset-color': 'rgb(12, 34, 56)' } as CSSProperties}
    >
      <TRFieldset.Legend>Custom color</TRFieldset.Legend>
    </TRFieldset.Root>,
  );

  const legend = document.querySelector<HTMLElement>('.tr-fieldset-legend');
  expect(getComputedStyle(legend as HTMLElement).color).toBe('rgb(12, 34, 56)');
});
