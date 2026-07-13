import '../../core/core.css';
import '../form/form.css';
import '../popover/popover.css';
import './combobox.css';
import { Component, type ErrorInfo, type ReactNode, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  type ComboboxProps,
} from './react.js';

function Options() {
  return (
    <ComboboxContent>
      <ComboboxList>
        <ComboboxOption textValue="Alpha" value="a">
          Alpha
        </ComboboxOption>
        <ComboboxOption disabled value="b">
          Beta
        </ComboboxOption>
      </ComboboxList>
      <ComboboxEmpty hidden={false}>Empty</ComboboxEmpty>
    </ComboboxContent>
  );
}

test('React Combobox covers uncontrolled select state and compound markup', async () => {
  const onInputValueChange = vi.fn();
  const onValueChange = vi.fn();
  const screen = await render(
    <Combobox
      autoSelectOnBlur
      defaultInputValue=""
      defaultValue=""
      invalid
      name="fruit"
      onInputValueChange={onInputValueChange}
      onValueChange={onValueChange}
    >
      <ComboboxInput aria-label="Fruit" className="consumer" />
      <Options />
    </Combobox>,
  );
  const input = screen.getByLabelText('Fruit');
  expect(input.element()).toHaveAttribute('aria-autocomplete', 'list');
  expect(input.element()).toHaveAttribute('aria-invalid', 'true');
  expect(screen.container.querySelector('[role="listbox"]')).not.toBeNull();
  expect(screen.container.querySelector('[aria-disabled="true"]')).not.toBeNull();
  await input.fill('alp');
  input
    .element()
    .dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' }),
    );
  await expect
    .poll(
      () =>
        screen.container.querySelector<HTMLInputElement>('input[type="hidden"]')?.value,
    )
    .toBe('a');
  expect(onInputValueChange).toHaveBeenCalled();
  expect(onValueChange).toHaveBeenCalledWith(
    'a',
    expect.objectContaining({ reason: 'option' }),
  );
});

test('React Combobox commits pointer selection through the DOM manager', async () => {
  const onValueChange = vi.fn();
  const screen = await render(
    <Combobox name="fruit" onValueChange={onValueChange}>
      <ComboboxInput aria-label="Fruit" />
      <Options />
    </Combobox>,
  );
  const input = screen.getByLabelText('Fruit');
  const option = screen.getByRole('option', { name: 'Alpha' });

  await input.click();
  await expect.element(option).toBeVisible();
  const optionElement = option.element();
  await option.click();

  await expect.element(input).toHaveValue('Alpha');
  await expect
    .poll(
      () =>
        screen.container.querySelector<HTMLInputElement>('input[name="fruit"]')?.value,
    )
    .toBe('a');
  expect(optionElement).toHaveAttribute('aria-selected', 'true');
  expect(onValueChange).toHaveBeenCalledWith(
    'a',
    expect.objectContaining({ reason: 'option' }),
  );
});

test('React Combobox covers controlled freeform, disabled input and explicit open props', async () => {
  const changed = vi.fn();
  function Controlled() {
    const [inputValue, setInputValue] = useState('Initial');
    const [value, setValue] = useState('Initial');
    return (
      <Combobox
        inputValue={inputValue}
        mode="freeform"
        name="query"
        onInputValueChange={setInputValue}
        onOpenChange={() => undefined}
        onValueChange={(next) => {
          changed(next);
          setValue(next);
        }}
        open
        value={value}
      >
        <ComboboxInput aria-invalid="grammar" aria-label="Query" />
        <Options />
      </Combobox>
    );
  }
  const screen = await render(
    <>
      <Controlled />
      <Combobox disabled>
        <ComboboxInput aria-label="Disabled" />
        <Options />
      </Combobox>
    </>,
  );
  const query = screen.getByLabelText('Query');
  expect(query.element()).toHaveAttribute('aria-autocomplete', 'both');
  await query.fill('Klingon');
  await expect
    .poll(
      () =>
        screen.container.querySelector<HTMLInputElement>('input[name="query"]')?.value,
    )
    .toBe('Klingon');
  expect(changed).toHaveBeenLastCalledWith('Klingon');
  expect(screen.getByLabelText('Disabled').element()).toBeDisabled();
});

test('React Combobox covers default-open and controlled-open fallback callbacks', async () => {
  const opened = vi.fn();
  const controlledWithoutCallback = { open: true } as unknown as ComboboxProps;
  const screen = await render(
    <>
      <Combobox defaultOpen onOpenChange={opened}>
        <ComboboxInput aria-label="Default open" />
        <Options />
      </Combobox>
      <Combobox {...controlledWithoutCallback}>
        <ComboboxInput aria-label="Controlled open" />
        <Options />
      </Combobox>
    </>,
  );
  const contents = screen.container.querySelectorAll('[data-tr-combobox-content]');
  expect(contents).toHaveLength(2);
  expect(screen.getByLabelText('Default open').element()).toHaveAttribute(
    'role',
    'combobox',
  );
  expect(screen.getByLabelText('Controlled open').element()).toHaveAttribute(
    'role',
    'combobox',
  );
});

class Boundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  override componentDidCatch(_error: Error, _info: ErrorInfo) {}
  override render() {
    return this.state.error === null ? (
      this.props.children
    ) : (
      <p>{this.state.error.message}</p>
    );
  }
}

test('React Combobox reports compound context misuse', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const screen = await render(
    <Boundary>
      <ComboboxInput />
    </Boundary>,
  );
  expect(
    screen.getByText('ComboboxInput must be used within Combobox.').element(),
  ).toBeVisible();
  consoleError.mockRestore();
});
