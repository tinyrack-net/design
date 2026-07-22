import '../../core/core.css';
import './textarea.css';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRTextarea } from './index.js';

test('preserves native refs, events, FormData, validation, and reset', async () => {
  const ref = createRef<HTMLTextAreaElement>();
  const onChange = vi.fn();
  await render(
    <form>
      <label htmlFor="notes">Notes</label>
      <TRTextarea
        defaultValue="Rack"
        id="notes"
        name="notes"
        onChange={onChange}
        ref={ref}
        required
      />
      <TRTextarea aria-label="Readonly" defaultValue="Locked" readOnly />
      <TRTextarea aria-label="Disabled" defaultValue="Hidden" disabled name="hidden" />
      <button type="reset">Reset</button>
    </form>,
  );

  ref.current?.focus();
  ref.current?.setSelectionRange(ref.current.value.length, ref.current.value.length);
  await userEvent.keyboard(' Alpha');
  expect(onChange).toHaveBeenCalled();
  expect(new FormData(ref.current?.form as HTMLFormElement).get('notes')).toBe(
    'Rack Alpha',
  );
  expect(new FormData(ref.current?.form as HTMLFormElement).get('hidden')).toBeNull();
  expect(ref.current?.classList.contains('tr-textarea')).toBe(true);
  expect(getComputedStyle(ref.current as HTMLTextAreaElement).resize).toBe('vertical');

  const readonly = document.querySelector<HTMLTextAreaElement>('textarea[readonly]');
  readonly?.focus();
  await userEvent.keyboard(' change');
  expect(readonly?.value).toBe('Locked');
  ref.current?.form?.reset();
  expect(ref.current?.value).toBe('Rack');
  if (ref.current) ref.current.value = '';
  expect(ref.current?.checkValidity()).toBe(false);
});

test('preserves controlled values, native attributes, classes, styles, and keyboard focus', async () => {
  function ControlledTextarea() {
    const [value, setValue] = useState('Rack');
    return (
      <TRTextarea
        aria-label="Controlled notes"
        className="consumer-textarea"
        maxLength={12}
        onChange={(event) => setValue(event.currentTarget.value)}
        rows={3}
        style={{ inlineSize: '240px' }}
        value={value}
      />
    );
  }

  await render(<ControlledTextarea />);
  const textarea = document.querySelector<HTMLTextAreaElement>('.tr-textarea');
  await userEvent.tab();
  textarea?.setSelectionRange(textarea.value.length, textarea.value.length);
  await userEvent.keyboard(' Alpha');

  expect(document.activeElement).toBe(textarea);
  expect(textarea?.value).toBe('Rack Alpha');
  expect(textarea?.rows).toBe(3);
  expect(textarea?.maxLength).toBe(12);
  expect(textarea).toHaveClass('tr-textarea', 'consumer-textarea');
  expect(textarea?.style.inlineSize).toBe('240px');
});

test('uses vertical resizing, native overflow, and semantic state tokens', async () => {
  await render(
    <div data-theme="tinyrack-light">
      <TRTextarea aria-label="Default" placeholder="Notes" />
      <TRTextarea aria-invalid="true" aria-label="Invalid" />
      <TRTextarea aria-label="Readonly" readOnly />
      <TRTextarea aria-label="Disabled" disabled />
    </div>,
  );
  const textareas = Array.from(
    document.querySelectorAll<HTMLTextAreaElement>('textarea'),
  );
  const [textarea, invalid, readonly, disabled] = textareas;

  expect(getComputedStyle(textarea as HTMLTextAreaElement).resize).toBe('vertical');
  expect(getComputedStyle(textarea as HTMLTextAreaElement).overflowX).toBe('auto');
  expect(getComputedStyle(textarea as HTMLTextAreaElement).overflowY).toBe('auto');
  expect(getComputedStyle(invalid as HTMLTextAreaElement).borderColor).toBe(
    'rgb(220, 38, 38)',
  );
  expect(getComputedStyle(readonly as HTMLTextAreaElement).backgroundColor).toBe(
    'rgb(245, 245, 245)',
  );
  expect(getComputedStyle(disabled as HTMLTextAreaElement).cursor).toBe('not-allowed');
  expect(getComputedStyle(disabled as HTMLTextAreaElement).opacity).toBe('0.5');
});

test.each([
  ['sm', '14px', '20px', '64px', '12px'],
  ['md', '14px', '20px', '80px', '16px'],
  ['lg', '16px', '24px', '96px', '20px'],
] as const)('applies %s control size tokens', async (uiSize, fontSize, lineHeight, minBlockSize, paddingInline) => {
  await render(<TRTextarea aria-label={`${uiSize} notes`} uiSize={uiSize} />);
  const textarea = document.querySelector<HTMLTextAreaElement>('.tr-textarea');
  const style = getComputedStyle(textarea as HTMLTextAreaElement);

  expect(textarea?.dataset['uiSize']).toBe(uiSize);
  expect(style.fontSize).toBe(fontSize);
  expect(style.lineHeight).toBe(lineHeight);
  expect(style.minBlockSize).toBe(minBlockSize);
  expect(style.paddingInlineStart).toBe(paddingInline);
});
