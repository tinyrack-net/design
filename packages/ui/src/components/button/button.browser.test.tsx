import '../../core/core.css';
import './button.css';
import { type CSSProperties, createRef, type FormEvent } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRButton } from './index.js';

afterEach(() => {
  delete document.documentElement.dataset['theme'];
});

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

test('preserves an explicit aria-busy state when not loading', async () => {
  const screen = await render(<TRButton aria-busy="true">Refresh status</TRButton>);

  await expect
    .element(screen.getByRole('button', { name: 'Refresh status' }))
    .toHaveAttribute('aria-busy', 'true');
});

test('uses loadingLabel as the accessible name when aria-labelledby named the action', async () => {
  const screen = await render(
    <div>
      <span id="deploy-label">Deploy changes</span>
      <TRButton aria-labelledby="deploy-label" loading loadingLabel="Deploying changes">
        Deploy
      </TRButton>
    </div>,
  );

  const button = screen.getByRole('button', { name: 'Deploying changes' });
  await expect.element(button).toHaveAttribute('aria-label', 'Deploying changes');
  await expect.element(button).not.toHaveAttribute('aria-labelledby');
});

test('supports Base UI polymorphism without adding native button attributes', async () => {
  const onClick = vi.fn();
  const screen = await render(
    <TRButton
      className={(state) => (state.disabled ? 'is-disabled' : 'is-enabled')}
      nativeButton={false}
      onClick={onClick}
      render={<a href="#deploy" />}
      style={{ width: '12rem' }}
    >
      Deploy link
    </TRButton>,
  );
  const link = screen.getByRole('button', { name: 'Deploy link' });

  await expect.element(link).toHaveClass('tr-btn', 'is-enabled');
  await expect.element(link).toHaveAttribute('href', '#deploy');
  await expect.element(link).not.toHaveAttribute('type');
  expect(getComputedStyle(link.element()).width).toBe('192px');
  await userEvent.click(link);
  expect(onClick).toHaveBeenCalledOnce();
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

test('supports reset buttons and native form values', async () => {
  const screen = await render(
    <form>
      <label>
        Rack name
        <input defaultValue="rack-alpha" name="rack" />
      </label>
      <TRButton name="action" type="submit" value="deploy">
        Deploy
      </TRButton>
      <TRButton type="reset">Reset form</TRButton>
    </form>,
  );
  const input = screen.getByRole('textbox', { name: 'Rack name' });

  await userEvent.clear(input);
  await userEvent.type(input, 'rack-beta');
  await userEvent.click(screen.getByRole('button', { name: 'Reset form' }));

  await expect.element(input).toHaveValue('rack-alpha');
  const submit = screen.getByRole('button', { name: 'Deploy' }).element();
  expect(submit).toHaveAttribute('name', 'action');
  expect(submit).toHaveAttribute('value', 'deploy');
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

test.each([
  ['sm', '32px', '12px', '14px'],
  ['md', '40px', '16px', '14px'],
  ['lg', '48px', '20px', '16px'],
] as const)('computes the %s control recipe', async (uiSize, height, padding, fontSize) => {
  const screen = await render(<TRButton uiSize={uiSize}>{uiSize}</TRButton>);
  const styles = getComputedStyle(screen.getByRole('button').element());

  expect(styles.height).toBe(height);
  expect(styles.paddingLeft).toBe(padding);
  expect(styles.paddingRight).toBe(padding);
  expect(styles.fontSize).toBe(fontSize);
});

test.each([
  'tinyrack-light',
  'tinyrack-dark',
] as const)('computes variant and appearance colors in %s', async (theme) => {
  document.documentElement.dataset['theme'] = theme;
  const screen = await render(
    <div>
      <TRButton data-testid="solid" variant="primary">
        Solid
      </TRButton>
      <TRButton appearance="outline" data-testid="outline" variant="danger">
        Outline
      </TRButton>
      <TRButton appearance="ghost" data-testid="ghost" variant="secondary">
        Ghost
      </TRButton>
    </div>,
  );
  const solid = getComputedStyle(screen.getByTestId('solid').element());
  const outline = getComputedStyle(screen.getByTestId('outline').element());
  const ghost = getComputedStyle(screen.getByTestId('ghost').element());
  const expected =
    theme === 'tinyrack-light'
      ? {
          danger: 'rgb(185, 28, 28)',
          onPrimary: 'rgb(250, 250, 250)',
          primary: 'rgb(23, 23, 23)',
          text: 'rgb(23, 23, 23)',
        }
      : {
          danger: 'rgb(248, 113, 113)',
          onPrimary: 'rgb(10, 10, 10)',
          primary: 'rgb(250, 250, 250)',
          text: 'rgb(250, 250, 250)',
        };

  expect(solid.backgroundColor).toBe(expected.primary);
  expect(solid.borderColor).toBe(expected.primary);
  expect(solid.color).toBe(expected.onPrimary);
  expect(outline.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(outline.borderColor).toBe(expected.danger);
  expect(outline.color).toBe(expected.danger);
  expect(ghost.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(ghost.borderColor).toBe('rgba(0, 0, 0, 0)');
  expect(ghost.color).toBe(expected.text);
});

test('computes hover, keyboard focus, disabled, and consumer override states', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  const screen = await render(
    <div>
      <TRButton appearance="outline">Hover target</TRButton>
      <TRButton disabled>Disabled target</TRButton>
      <TRButton
        style={
          {
            '--tr-btn-height': '3.5rem',
            '--tr-btn-radius': '1rem',
            '--tr-btn-variant-fill': 'var(--tinyrack-danger)',
          } as CSSProperties
        }
      >
        Customized
      </TRButton>
    </div>,
  );
  const hoverTarget = screen.getByRole('button', { name: 'Hover target' });
  const disabled = screen.getByRole('button', { name: 'Disabled target' });
  const customized = screen.getByRole('button', { name: 'Customized' });

  await hoverTarget.hover();
  await expect
    .poll(() => getComputedStyle(hoverTarget.element()).backgroundColor)
    .toBe('rgb(229, 229, 229)');
  await userEvent.tab();
  await expect.element(hoverTarget).toHaveFocus();
  expect(getComputedStyle(hoverTarget.element()).outlineStyle).toBe('solid');
  expect(getComputedStyle(hoverTarget.element()).outlineWidth).toBe('2px');
  expect(getComputedStyle(disabled.element()).cursor).toBe('not-allowed');
  expect(getComputedStyle(disabled.element()).opacity).toBe('0.5');
  expect(getComputedStyle(disabled.element()).pointerEvents).toBe('none');
  expect(getComputedStyle(customized.element()).height).toBe('56px');
  expect(getComputedStyle(customized.element()).borderRadius).toBe('16px');
  expect(getComputedStyle(customized.element()).backgroundColor).toBe(
    'rgb(185, 28, 28)',
  );
});
