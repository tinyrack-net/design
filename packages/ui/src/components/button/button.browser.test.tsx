import './button.css';
import { createRef, type FormEvent } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRButton } from './index.js';

test('renders Base UI behavior through the Tinyrack button contract', async () => {
  const ref = createRef<HTMLButtonElement>();
  const onClick = vi.fn();
  await render(
    <TRButton
      ref={ref}
      appearance="outline"
      onClick={onClick}
      uiSize="lg"
      variant="primary"
    >
      Save
    </TRButton>,
  );

  ref.current?.click();
  expect(onClick).toHaveBeenCalledOnce();
  expect(ref.current?.classList.contains('tr-btn')).toBe(true);
  expect(ref.current?.dataset['appearance']).toBe('outline');
  expect(ref.current?.type).toBe('button');
});

test('composes loading, accessible naming, and disabled states', async () => {
  const labelledRef = createRef<HTMLButtonElement>();
  const inheritedRef = createRef<HTMLButtonElement>();
  const disabledRef = createRef<HTMLButtonElement>();

  await render(
    <>
      <TRButton ref={labelledRef} loading loadingLabel="Saving changes">
        Save
      </TRButton>
      <TRButton ref={inheritedRef} aria-label="Publishing" loading>
        Publish
      </TRButton>
      <TRButton ref={disabledRef} disabled>
        Delete
      </TRButton>
    </>,
  );

  expect(labelledRef.current?.getAttribute('aria-label')).toBe('Saving changes');
  expect(labelledRef.current?.getAttribute('aria-busy')).toBe('true');
  expect(labelledRef.current?.querySelector('.tr-spinner')).not.toBeNull();
  expect(
    labelledRef.current?.querySelector('.tr-spinner')?.getAttribute('aria-hidden'),
  ).toBe('true');
  expect(labelledRef.current?.querySelectorAll('[role="status"]')).toHaveLength(0);
  expect(inheritedRef.current?.getAttribute('aria-label')).toBe('Publishing');
  expect(disabledRef.current?.disabled).toBe(true);
});

test('uses a readable semantic foreground for secondary outline buttons', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <>
      <TRButton
        appearance="outline"
        data-testid="secondary-outline"
        variant="secondary"
      >
        Cancel
      </TRButton>
      <TRButton data-testid="secondary-solid" variant="secondary">
        Continue
      </TRButton>
    </>,
  );
  const button = document.querySelector<HTMLElement>(
    '[data-testid="secondary-outline"]',
  );
  const solid = document.querySelector<HTMLElement>('[data-testid="secondary-solid"]');
  expect(getComputedStyle(button as HTMLElement).color).toBe(
    getComputedStyle(solid as HTMLElement).color,
  );
});

test('activates from Enter while preserving focus', async () => {
  const onClick = vi.fn();
  const screen = await render(<TRButton onClick={onClick}>Enter save</TRButton>);
  const button = screen.getByRole('button', { name: 'Enter save' });

  await userEvent.type(button, '{Enter}');
  await expect.poll(() => onClick.mock.calls.length).toBe(1);
  await expect.element(button).toHaveFocus();
});

test('activates from Space while preserving focus', async () => {
  const onClick = vi.fn();
  const screen = await render(<TRButton onClick={onClick}>Space save</TRButton>);
  const button = screen.getByRole('button', { name: 'Space save' });

  await userEvent.type(button, '[Space]');
  await expect.poll(() => onClick.mock.calls.length).toBe(1);
  await expect.element(button).toHaveFocus();
});

test('defaults to a non-submit button and supports explicit form submission', async () => {
  const onDefaultSubmit = vi.fn((event: FormEvent<HTMLFormElement>) =>
    event.preventDefault(),
  );
  const onExplicitSubmit = vi.fn((event: FormEvent<HTMLFormElement>) =>
    event.preventDefault(),
  );

  await render(
    <>
      <form onSubmit={onDefaultSubmit}>
        <TRButton>Default action</TRButton>
      </form>
      <form onSubmit={onExplicitSubmit}>
        <TRButton type="submit">Submit form</TRButton>
      </form>
    </>,
  );

  const [defaultButton, submitButton] = Array.from(
    document.querySelectorAll<HTMLButtonElement>('.tr-btn'),
  );
  await userEvent.click(defaultButton as HTMLButtonElement);
  expect(onDefaultSubmit).not.toHaveBeenCalled();
  await userEvent.click(submitButton as HTMLButtonElement);
  expect(onExplicitSubmit).toHaveBeenCalledOnce();
});

test('suppresses pointer and keyboard activation while loading', async () => {
  const onClick = vi.fn();
  await render(
    <TRButton loading loadingLabel="Saving changes" onClick={onClick}>
      Save
    </TRButton>,
  );
  const button = document.querySelector<HTMLButtonElement>('.tr-btn');

  expect(button?.disabled).toBe(true);
  button?.click();
  button?.focus();
  await userEvent.keyboard('{Enter}');
  expect(onClick).not.toHaveBeenCalled();
});
