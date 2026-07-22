import '../../core/core.css';
import './number-field.css';
import { act, type CSSProperties, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  TRNumberField,
  TRNumberFieldDecrement,
  TRNumberFieldGroup,
  TRNumberFieldIncrement,
  TRNumberFieldInput,
  TRNumberFieldRoot,
  TRNumberFieldScrubArea,
  TRNumberFieldScrubAreaCursor,
} from './index.js';

function NumberFieldParts({ label = 'Count' }: { label?: string }) {
  return (
    <>
      <TRNumberField.ScrubArea>
        {label}
        <TRNumberField.ScrubAreaCursor>↕</TRNumberField.ScrubAreaCursor>
      </TRNumberField.ScrubArea>
      <TRNumberField.Group>
        <TRNumberField.Decrement aria-label={`Decrease ${label}`}>
          −
        </TRNumberField.Decrement>
        <TRNumberField.Input aria-label={label} />
        <TRNumberField.Increment aria-label={`Increase ${label}`}>
          +
        </TRNumberField.Increment>
      </TRNumberField.Group>
    </>
  );
}

test('exports every Base UI anatomy part and preserves refs, props, classes, and styles', async () => {
  expect(TRNumberField).toEqual({
    Root: TRNumberFieldRoot,
    Group: TRNumberFieldGroup,
    Increment: TRNumberFieldIncrement,
    Decrement: TRNumberFieldDecrement,
    Input: TRNumberFieldInput,
    ScrubArea: TRNumberFieldScrubArea,
    ScrubAreaCursor: TRNumberFieldScrubAreaCursor,
  });

  const rootRef = createRef<HTMLDivElement>();
  const groupRef = createRef<HTMLDivElement>();
  const decrementRef = createRef<HTMLButtonElement>();
  const inputRef = createRef<HTMLInputElement>();
  const incrementRef = createRef<HTMLButtonElement>();
  const scrubRef = createRef<HTMLSpanElement>();
  let hiddenInput: HTMLInputElement | null = null;
  await render(
    <TRNumberField.Root
      className="consumer-root"
      data-consumer="root"
      defaultValue={2}
      inputRef={(input) => {
        hiddenInput = input;
      }}
      ref={rootRef}
      style={{ '--tr-number-field-color': 'rgb(1, 2, 3)' } as CSSProperties}
    >
      <TRNumberField.ScrubArea className="consumer-scrub" ref={scrubRef}>
        Count
        <TRNumberField.ScrubAreaCursor className="consumer-cursor" />
      </TRNumberField.ScrubArea>
      <TRNumberField.Group className="consumer-group" ref={groupRef}>
        <TRNumberField.Decrement className="consumer-decrement" ref={decrementRef}>
          −
        </TRNumberField.Decrement>
        <TRNumberField.Input
          aria-label="Count"
          className="consumer-input"
          inputMode="decimal"
          ref={inputRef}
        />
        <TRNumberField.Increment className="consumer-increment" ref={incrementRef}>
          +
        </TRNumberField.Increment>
      </TRNumberField.Group>
    </TRNumberField.Root>,
  );

  expect(rootRef.current).toHaveClass('tr-number-field', 'consumer-root');
  expect(rootRef.current).toHaveAttribute('data-consumer', 'root');
  expect(groupRef.current).toHaveClass('tr-number-field-group', 'consumer-group');
  expect(decrementRef.current).toHaveClass(
    'tr-number-field-decrement',
    'consumer-decrement',
  );
  expect(inputRef.current).toHaveClass('tr-number-field-input', 'consumer-input');
  expect(inputRef.current?.inputMode).toBe('decimal');
  expect(incrementRef.current).toHaveClass(
    'tr-number-field-increment',
    'consumer-increment',
  );
  expect(scrubRef.current).toHaveClass('tr-number-field-scrub-area', 'consumer-scrub');
  expect(hiddenInput).toHaveAttribute('type', 'number');
  expect(getComputedStyle(rootRef.current as HTMLElement).color).toBe('rgb(1, 2, 3)');
});

test('keeps controlled and uncontrolled numeric values aligned with event reasons', async () => {
  const uncontrolledChange = vi.fn();
  const controlledChange = vi.fn();

  function ControlledField() {
    const [value, setValue] = useState<number | null>(5);
    return (
      <>
        <TRNumberField.Root
          max={10}
          min={0}
          onValueChange={(nextValue, details) => {
            controlledChange(nextValue, details.reason);
            setValue(nextValue);
          }}
          value={value}
        >
          <NumberFieldParts label="Controlled" />
        </TRNumberField.Root>
        <output data-testid="controlled-value">{String(value)}</output>
      </>
    );
  }

  await render(
    <>
      <TRNumberField.Root defaultValue={2} onValueChange={uncontrolledChange}>
        <NumberFieldParts label="Uncontrolled" />
      </TRNumberField.Root>
      <ControlledField />
    </>,
  );

  const uncontrolled = document.querySelector<HTMLInputElement>(
    '[aria-label="Uncontrolled"]',
  );
  const controlled = document.querySelector<HTMLInputElement>(
    '[aria-label="Controlled"]',
  );
  uncontrolled?.focus();
  await userEvent.keyboard('{ArrowUp}');
  expect(uncontrolled?.value).toBe('3');
  expect(uncontrolledChange.mock.calls.at(-1)?.[0]).toBe(3);
  expect(uncontrolledChange.mock.calls.at(-1)?.[1].reason).toBe('keyboard');

  controlled?.focus();
  await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
  await expect.poll(() => controlled?.value).toBe('');
  expect(controlledChange).toHaveBeenLastCalledWith(null, 'input-clear');
  expect(document.querySelector('[data-testid="controlled-value"]')?.textContent).toBe(
    'null',
  );
});

test('formats and parses locale-aware decimal values', async () => {
  const onValueChange = vi.fn();
  await render(
    <TRNumberField.Root
      defaultValue={1234.5}
      format={{ minimumFractionDigits: 2 }}
      locale="de-DE"
      onValueChange={onValueChange}
    >
      <TRNumberField.Input aria-label="Localized amount" />
    </TRNumberField.Root>,
  );

  const input = document.querySelector<HTMLInputElement>(
    '[aria-label="Localized amount"]',
  );
  expect(input?.value).toBe('1.234,50');
  input?.focus();
  await userEvent.keyboard('{Control>}a{/Control}19,75');
  await expect.poll(() => onValueChange.mock.calls.at(-1)?.[0]).toBe(19.75);
  input?.blur();
  await expect.poll(() => input?.value).toBe('19,75');
});

test('honors bounds, normal, small, and large steps for buttons and keyboard', async () => {
  const onValueCommitted = vi.fn();
  await render(
    <TRNumberField.Root
      defaultValue={5}
      largeStep={3}
      max={8}
      min={1}
      onValueCommitted={onValueCommitted}
      smallStep={0.25}
      step={2}
    >
      <NumberFieldParts />
    </TRNumberField.Root>,
  );

  const input = document.querySelector<HTMLInputElement>('[aria-label="Count"]');
  const increment = document.querySelector<HTMLButtonElement>(
    '[aria-label="Increase Count"]',
  );
  increment?.click();
  await expect.poll(() => input?.value).toBe('7');
  input?.focus();
  await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}');
  await expect.poll(() => input?.value).toBe('7.25');
  await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}');
  await expect.poll(() => input?.value).toBe('4.25');
  await userEvent.keyboard('{End}{ArrowUp}');
  expect(input?.value).toBe('8');
  await userEvent.keyboard('{Home}{ArrowDown}');
  expect(input?.value).toBe('1');
  expect(onValueCommitted.mock.calls.at(-1)?.[1].reason).toBe('keyboard');
});

test('supports native paste and scrub interactions with public event reasons', async () => {
  const onValueChange = vi.fn();
  const onValueCommitted = vi.fn();
  await render(
    <TRNumberField.Root
      defaultValue={10}
      onValueChange={onValueChange}
      onValueCommitted={onValueCommitted}
    >
      <NumberFieldParts label="Scrubbable" />
    </TRNumberField.Root>,
  );

  const input = document.querySelector<HTMLInputElement>('[aria-label="Scrubbable"]');
  input?.focus();
  input?.setSelectionRange(0, input.value.length);
  const pasteEvent = new ClipboardEvent('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(pasteEvent, 'clipboardData', {
    value: { getData: () => '25' },
  });
  input?.dispatchEvent(pasteEvent);
  await expect.poll(() => input?.value).toBe('25');
  expect(onValueChange.mock.calls.at(-1)?.[1].reason).toBe('input-paste');

  const scrub = document.querySelector<HTMLElement>('.tr-number-field-scrub-area');
  scrub?.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      button: 0,
      clientX: 10,
      clientY: 10,
      pointerType: 'touch',
    }),
  );
  await expect.poll(() => scrub?.hasAttribute('data-scrubbing')).toBe(true);
  const move = new PointerEvent('pointermove', { bubbles: true, pointerType: 'touch' });
  Object.defineProperties(move, {
    movementX: { value: 4 },
    movementY: { value: 0 },
  });
  window.dispatchEvent(move);
  await expect.poll(() => input?.value).toBe('29');
  expect(onValueChange.mock.calls.at(-1)?.[1].reason).toBe('scrub');
  window.dispatchEvent(
    new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch' }),
  );
  await expect.poll(() => scrub?.hasAttribute('data-scrubbing')).toBe(false);
  expect(onValueCommitted.mock.calls.at(-1)?.[1].reason).toBe('scrub');
});

test('blocks all value changes and exposes native state in disabled and read-only fields', async () => {
  const onDisabledChange = vi.fn();
  const onReadOnlyChange = vi.fn();
  await render(
    <>
      <TRNumberField.Root defaultValue={2} disabled onValueChange={onDisabledChange}>
        <NumberFieldParts label="Disabled" />
      </TRNumberField.Root>
      <TRNumberField.Root defaultValue={3} onValueChange={onReadOnlyChange} readOnly>
        <NumberFieldParts label="Read only" />
      </TRNumberField.Root>
    </>,
  );

  const disabledInput = document.querySelector<HTMLInputElement>(
    '[aria-label="Disabled"]',
  );
  const readOnlyInput = document.querySelector<HTMLInputElement>(
    '[aria-label="Read only"]',
  );
  const disabledIncrement = document.querySelector<HTMLButtonElement>(
    '[aria-label="Increase Disabled"]',
  );
  const readOnlyIncrement = document.querySelector<HTMLButtonElement>(
    '[aria-label="Increase Read only"]',
  );
  expect(disabledInput?.disabled).toBe(true);
  expect(readOnlyInput?.readOnly).toBe(true);
  expect(disabledIncrement?.disabled).toBe(true);
  expect(readOnlyIncrement).toHaveAttribute('aria-disabled', 'true');
  readOnlyInput?.focus();
  await userEvent.keyboard('{ArrowUp}4');
  disabledIncrement?.click();
  readOnlyIncrement?.click();
  expect(disabledInput?.value).toBe('2');
  expect(readOnlyInput?.value).toBe('3');
  expect(onDisabledChange).not.toHaveBeenCalled();
  expect(onReadOnlyChange).not.toHaveBeenCalled();
});

test('integrates required validity, hidden input refs, external forms, submission, and reset', async () => {
  const hiddenInputRef = createRef<HTMLInputElement>();
  await render(
    <>
      <form id="number-owner" />
      <TRNumberField.Root
        defaultValue={4}
        form="number-owner"
        inputRef={hiddenInputRef}
        max={10}
        min={0}
        name="replicas"
        required
        step={2}
      >
        <TRNumberField.Input aria-label="External replicas" />
      </TRNumberField.Root>
      <TRNumberField.Root form="number-owner" name="controlled" value={7}>
        <TRNumberField.Input aria-label="Controlled external replicas" />
      </TRNumberField.Root>
      <TRNumberField.Root form="number-owner" name="optional">
        <TRNumberField.Input aria-label="Optional external replicas" />
      </TRNumberField.Root>
    </>,
  );

  const form = document.querySelector<HTMLFormElement>('#number-owner');
  const input = document.querySelector<HTMLInputElement>(
    '[aria-label="External replicas"]',
  );
  expect(hiddenInputRef.current?.type).toBe('number');
  expect(hiddenInputRef.current?.form).toBe(form);
  expect(new FormData(form as HTMLFormElement).get('replicas')).toBe('4');
  expect(hiddenInputRef.current?.validity.valid).toBe(true);
  const initialHiddenInput = hiddenInputRef.current;
  const optionalInput = document.querySelector<HTMLInputElement>(
    '[aria-label="Optional external replicas"]',
  );

  optionalInput?.focus();
  await userEvent.keyboard('2');
  expect(optionalInput?.value).toBe('2');

  input?.focus();
  await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
  expect(hiddenInputRef.current?.validity.valueMissing).toBe(true);
  document.body.dispatchEvent(new Event('reset', { bubbles: true }));
  expect(input?.value).toBe('');
  form?.reset();
  await expect
    .poll(
      () =>
        document.querySelector<HTMLInputElement>('[aria-label="External replicas"]')
          ?.value,
    )
    .toBe('4');
  expect(hiddenInputRef.current).not.toBe(initialHiddenInput);
  expect(hiddenInputRef.current?.form).toBe(form);
  expect(new FormData(form as HTMLFormElement).get('replicas')).toBe('4');
  expect(
    document.querySelector<HTMLInputElement>(
      '[aria-label="Controlled external replicas"]',
    )?.value,
  ).toBe('7');
  expect(
    document.querySelector<HTMLInputElement>(
      '[aria-label="Optional external replicas"]',
    )?.value,
  ).toBe('');
});

test('does not advertise scrubbing when the field is disabled or read-only', async () => {
  await render(
    <>
      <TRNumberField.Root disabled>
        <TRNumberField.ScrubArea data-testid="disabled-scrub">
          Disabled
          <TRNumberField.ScrubAreaCursor />
        </TRNumberField.ScrubArea>
        <TRNumberField.Input aria-label="Disabled value" />
      </TRNumberField.Root>
      <TRNumberField.Root readOnly>
        <TRNumberField.ScrubArea data-testid="readonly-scrub">
          Read only
          <TRNumberField.ScrubAreaCursor />
        </TRNumberField.ScrubArea>
        <TRNumberField.Input aria-label="Read-only value" />
      </TRNumberField.Root>
    </>,
  );

  const disabledScrub = document.querySelector<HTMLElement>(
    '[data-testid="disabled-scrub"]',
  );
  const readOnlyScrub = document.querySelector<HTMLElement>(
    '[data-testid="readonly-scrub"]',
  );
  expect(disabledScrub).toHaveAttribute('data-disabled', '');
  expect(readOnlyScrub).toHaveAttribute('data-readonly', '');
  expect(getComputedStyle(disabledScrub as HTMLElement).cursor).toBe('not-allowed');
  expect(getComputedStyle(readOnlyScrub as HTMLElement).cursor).toBe('default');
});

test('server-renders and hydrates a localized field without recovery', async () => {
  function HydratedNumberField() {
    return (
      <TRNumberField.Root defaultValue={1234.5} locale="de-DE">
        <NumberFieldParts label="Hydrated amount" />
      </TRNumberField.Root>
    );
  }

  const host = document.createElement('div');
  host.innerHTML = renderToString(<HydratedNumberField />);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, <HydratedNumberField />, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(
    host.querySelector<HTMLInputElement>('[aria-label="Hydrated amount"]')?.value,
  ).toBe('1.234,5');

  await act(async () => root.unmount());
  host.remove();
});

test('forwards uiSize to the root and matches Input height across sm/md/lg', async () => {
  const rootRef = createRef<HTMLDivElement>();
  await render(
    <TRNumberField.Root ref={rootRef} uiSize="sm">
      <TRNumberField.Input aria-label="Sized count" />
    </TRNumberField.Root>,
  );

  expect(rootRef.current?.getAttribute('data-ui-size')).toBe('sm');
  const smInput = document.querySelector<HTMLInputElement>(
    '[aria-label="Sized count"]',
  );
  const smHeight = smInput?.getBoundingClientRect().height;
  expect(smHeight).toBe(32);
});
