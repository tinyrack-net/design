import '../../core/core.css';
import './textarea.css';
import { createRef } from 'react';
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

test('supports compact ui size', async () => {
  await render(<TRTextarea aria-label="Compact notes" uiSize="sm" />);
  const textarea = document.querySelector<HTMLTextAreaElement>('.tr-textarea');
  expect(textarea?.dataset['uiSize']).toBe('sm');
  expect(getComputedStyle(textarea as HTMLTextAreaElement).minBlockSize).toBe('64px');
});
