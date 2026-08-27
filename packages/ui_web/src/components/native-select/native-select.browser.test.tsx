import '../../core/core.css';
import '../field/field.css';
import '../select/select.css';
import './native-select.css';
import { act, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRField } from '../field/index.js';
import { TRSelect } from '../select/index.js';
import { TRNativeSelect } from './index.js';

const rackOptions = (
  <>
    <option value="">Choose a rack</option>
    <optgroup label="Production">
      <option value="alpha">Rack Alpha</option>
      <option disabled value="beta">
        Rack Beta
      </option>
    </optgroup>
    <option value="staging">Staging rack</option>
  </>
);

test('renders a native select and preserves refs, attributes, options, and events', async () => {
  const ref = createRef<HTMLSelectElement>();
  const onChange = vi.fn();
  await render(
    <TRNativeSelect
      aria-label="Deployment rack"
      autoComplete="organization"
      className="consumer-select"
      defaultValue="alpha"
      name="rack"
      onChange={onChange}
      ref={ref}
      style={{ inlineSize: '240px' }}
    >
      {rackOptions}
    </TRNativeSelect>,
  );

  expect(ref.current?.tagName).toBe('SELECT');
  expect(ref.current).toHaveClass('tr-native-select', 'consumer-select');
  expect(ref.current?.style.inlineSize).toBe('240px');
  expect(ref.current).toHaveAttribute('autocomplete', 'organization');
  expect(ref.current?.querySelector('optgroup')?.label).toBe('Production');
  expect(ref.current?.options[2]?.disabled).toBe(true);

  await userEvent.selectOptions(ref.current as HTMLSelectElement, 'staging');
  expect(ref.current?.value).toBe('staging');
  expect(onChange).toHaveBeenCalledOnce();
});

test('supports controlled values through the native change event', async () => {
  function ControlledNativeSelect() {
    const [value, setValue] = useState('alpha');
    return (
      <TRNativeSelect
        aria-label="Controlled rack"
        onChange={(event) => setValue(event.currentTarget.value)}
        value={value}
      >
        <option value="alpha">Rack Alpha</option>
        <option value="staging">Staging rack</option>
      </TRNativeSelect>
    );
  }

  await render(<ControlledNativeSelect />);
  const select = page
    .getByRole('combobox', { name: 'Controlled rack' })
    .element() as HTMLSelectElement;
  await userEvent.selectOptions(select, 'staging');
  expect(select.value).toBe('staging');
});

test('preserves native FormData, required validation, disabled state, and reset', async () => {
  await render(
    <form>
      <TRNativeSelect aria-label="Required rack" defaultValue="" name="rack" required>
        {rackOptions}
      </TRNativeSelect>
      <TRNativeSelect
        aria-label="Disabled rack"
        defaultValue="alpha"
        disabled
        name="disabled-rack"
      >
        {rackOptions}
      </TRNativeSelect>
      <button type="reset">Reset</button>
    </form>,
  );

  const select = page
    .getByRole('combobox', { name: 'Required rack' })
    .element() as HTMLSelectElement;
  const form = select.form as HTMLFormElement;
  expect(select.checkValidity()).toBe(false);
  await userEvent.selectOptions(select, 'staging');
  expect(select.checkValidity()).toBe(true);
  expect(new FormData(form).get('rack')).toBe('staging');
  expect(new FormData(form).get('disabled-rack')).toBeNull();
  form.reset();
  expect(select.value).toBe('');
});

test('associates with TRField and inherits its invalid and disabled state', async () => {
  await render(
    <div data-theme="tinyrack-light">
      <TRField.Root invalid>
        <TRField.Label>Invalid rack</TRField.Label>
        <TRNativeSelect defaultValue="alpha">{rackOptions}</TRNativeSelect>
        <TRField.Error match>Choose another rack.</TRField.Error>
      </TRField.Root>
      <TRField.Root disabled>
        <TRField.Label>Unavailable rack</TRField.Label>
        <TRNativeSelect defaultValue="alpha">{rackOptions}</TRNativeSelect>
      </TRField.Root>
    </div>,
  );

  const invalid = page
    .getByRole('combobox', { name: 'Invalid rack' })
    .element() as HTMLSelectElement;
  const disabled = page
    .getByRole('combobox', { name: 'Unavailable rack' })
    .element() as HTMLSelectElement;
  const label = document.querySelector<HTMLLabelElement>('.tr-label');

  expect(label?.htmlFor).toBe(invalid.id);
  expect(invalid).toHaveAttribute('data-invalid');
  expect(disabled.disabled).toBe(true);
  await expect
    .poll(() => getComputedStyle(invalid).borderColor)
    .toBe('rgb(220, 38, 38)');
  expect(getComputedStyle(disabled).cursor).toBe('not-allowed');
  expect(getComputedStyle(disabled).opacity).toBe('0.5');
});

test.each(['sm', 'md', 'lg'] as const)(
  'matches the %s TRSelect trigger metrics and keyboard focus treatment',
  async (uiSize) => {
    await render(
      <div data-theme="tinyrack-light">
        <TRNativeSelect aria-label="Native rack" defaultValue="alpha" uiSize={uiSize}>
          <option value="alpha">Rack Alpha</option>
        </TRNativeSelect>
        <TRSelect.Root defaultValue="alpha" items={{ alpha: 'Rack Alpha' }}>
          <TRSelect.Trigger aria-label="Custom rack" uiSize={uiSize}>
            <TRSelect.Value />
          </TRSelect.Trigger>
        </TRSelect.Root>
      </div>,
    );

    const native = page
      .getByRole('combobox', { name: 'Native rack' })
      .element() as HTMLSelectElement;
    const custom = page.getByRole('combobox', { name: 'Custom rack' }).element();
    const nativeStyle = getComputedStyle(native);
    const customStyle = getComputedStyle(custom);

    expect(native.dataset['presentation']).toBe('trigger');
    expect(nativeStyle.minHeight).toBe(customStyle.minHeight);
    expect(nativeStyle.fontSize).toBe(customStyle.fontSize);
    expect(nativeStyle.borderRadius).toBe(customStyle.borderRadius);
    expect(nativeStyle.backgroundImage).not.toBe('none');

    await userEvent.tab();
    expect(native).toHaveFocus();
    expect(getComputedStyle(native).outlineWidth).toBe('2px');
    expect(getComputedStyle(native).outlineOffset).toBe('-2px');
    expect(getComputedStyle(native).outlineColor).toBe('rgb(37, 99, 235)');
  },
);

test('keeps multiple and sized selects as native listboxes without a chevron', async () => {
  await render(
    <>
      <TRNativeSelect aria-label="Multiple racks" multiple>
        <option value="alpha">Rack Alpha</option>
        <option value="staging">Staging rack</option>
      </TRNativeSelect>
      <TRNativeSelect aria-label="Visible racks" size={3}>
        <option value="alpha">Rack Alpha</option>
        <option value="staging">Staging rack</option>
        <option value="preview">Preview rack</option>
      </TRNativeSelect>
    </>,
  );

  const listboxes = Array.from(
    document.querySelectorAll<HTMLSelectElement>('[data-presentation="listbox"]'),
  );
  expect(listboxes).toHaveLength(2);
  expect(listboxes[0]?.multiple).toBe(true);
  expect(listboxes[1]?.size).toBe(3);
  for (const listbox of listboxes) {
    expect(getComputedStyle(listbox).backgroundImage).toBe('none');
  }
});

test('supports ghost and dark appearances with the same stable border box', async () => {
  await render(
    <>
      <div data-theme="tinyrack-light">
        <TRNativeSelect aria-label="Solid rack" defaultValue="alpha">
          <option value="alpha">Rack Alpha</option>
        </TRNativeSelect>
        <TRNativeSelect appearance="ghost" aria-label="Ghost rack" defaultValue="alpha">
          <option value="alpha">Rack Alpha</option>
        </TRNativeSelect>
      </div>
      <div data-theme="tinyrack-dark">
        <TRNativeSelect aria-label="Dark rack" defaultValue="alpha">
          <option value="alpha">Rack Alpha</option>
        </TRNativeSelect>
      </div>
    </>,
  );

  const solid = page.getByRole('combobox', { name: 'Solid rack' }).element();
  const ghost = page.getByRole('combobox', { name: 'Ghost rack' }).element();
  const dark = page.getByRole('combobox', { name: 'Dark rack' }).element();
  expect(getComputedStyle(solid).backgroundColor).toBe('rgb(255, 255, 255)');
  expect(getComputedStyle(ghost).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(getComputedStyle(ghost).borderTopWidth).toBe(
    getComputedStyle(solid).borderTopWidth,
  );
  expect(getComputedStyle(dark).backgroundColor).not.toBe(
    getComputedStyle(solid).backgroundColor,
  );
});

test('renders and hydrates without changing the native form contract', async () => {
  const fixture = (
    <form>
      <label htmlFor="hydrated-rack">Rack</label>
      <TRNativeSelect defaultValue="alpha" id="hydrated-rack" name="rack" required>
        <option value="alpha">Rack Alpha</option>
      </TRNativeSelect>
    </form>
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  const select = host.querySelector<HTMLSelectElement>('#hydrated-rack');
  expect(hydrationErrors).toEqual([]);
  expect(select?.tagName).toBe('SELECT');
  expect(new FormData(select?.form as HTMLFormElement).get('rack')).toBe('alpha');

  await act(async () => root.unmount());
  host.remove();
});
