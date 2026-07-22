import '../../core/core.css';
import './icon-button.css';
import { type CSSProperties, createRef, type FormEvent } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRButton } from '../button/index.js';
import { TRIconButton } from './index.js';

test('reuses TRButton variants while exposing an icon-only accessible name', async () => {
  const ref = createRef<HTMLButtonElement>();
  const onClick = vi.fn();
  await render(
    <TRIconButton
      appearance="ghost"
      aria-label="Open navigation"
      onClick={onClick}
      ref={ref}
      uiSize="sm"
      variant="primary"
    >
      <svg aria-hidden="true" />
    </TRIconButton>,
  );

  expect(ref.current?.classList.contains('tr-btn')).toBe(true);
  expect(ref.current?.classList.contains('tr-icon-btn')).toBe(true);
  expect(ref.current?.getAttribute('aria-label')).toBe('Open navigation');
  expect(ref.current?.dataset['appearance']).toBe('ghost');
  expect(ref.current?.getBoundingClientRect().width).toBe(
    ref.current?.getBoundingClientRect().height,
  );
  await userEvent.click(ref.current as HTMLButtonElement);
  expect(onClick).toHaveBeenCalledOnce();
});

test('supports aria-labelledby and TRButton loading behavior', async () => {
  await render(
    <div>
      <span id="save-label">Save rack</span>
      <TRIconButton aria-labelledby="save-label" loading loadingLabel="Saving rack">
        <svg aria-hidden="true" />
      </TRIconButton>
    </div>,
  );
  const button = document.querySelector<HTMLButtonElement>('.tr-icon-btn');
  expect(button?.disabled).toBe(true);
  expect(button?.getAttribute('aria-label')).toBe('Saving rack');
  expect(button?.hasAttribute('aria-labelledby')).toBe(false);
  expect(button?.querySelectorAll('svg')).toHaveLength(0);
  expect(button?.querySelector('.tr-spinner')).not.toBeNull();
});

test('preserves aria-labelledby while explicitly not loading', async () => {
  await render(
    <div>
      <span id="inspect-label">Inspect rack</span>
      <TRIconButton aria-labelledby="inspect-label" loading={false}>
        <svg aria-hidden="true" />
      </TRIconButton>
    </div>,
  );

  const button = document.querySelector<HTMLButtonElement>('.tr-icon-btn');
  expect(button?.getAttribute('aria-labelledby')).toBe('inspect-label');
  expect(button?.disabled).toBe(false);
  expect(button?.querySelectorAll('svg')).toHaveLength(1);
});

test('preserves an aria-labelledby accessible name while loading without a replacement label', async () => {
  await render(
    <div>
      <span id="refresh-label">Refresh rack status</span>
      <TRIconButton aria-labelledby="refresh-label" loading>
        <svg aria-hidden="true" />
      </TRIconButton>
    </div>,
  );

  const button = document.querySelector<HTMLButtonElement>('.tr-icon-btn');
  expect(button).toHaveAccessibleName('Refresh rack status');
  expect(button?.getAttribute('aria-labelledby')).toBe('refresh-label');
  expect(button?.getAttribute('aria-busy')).toBe('true');
});

test('keeps a large icon square without shrinking it inside the touch target', async () => {
  await render(
    <TRIconButton aria-label="Open navigation" uiSize="lg">
      <svg aria-hidden="true" viewBox="0 0 24 24" />
    </TRIconButton>,
  );
  const button = document.querySelector<HTMLButtonElement>('.tr-icon-btn');
  const icon = button?.querySelector('svg');

  expect(button?.getBoundingClientRect().width).toBe(48);
  expect(button?.getBoundingClientRect().height).toBe(48);
  expect(icon?.getBoundingClientRect().width).toBe(24);
  expect(icon?.getBoundingClientRect().height).toBe(24);
  if (icon === null || icon === undefined)
    throw new Error('Missing TRIconButton icon.');
  expect(getComputedStyle(icon).flexShrink).toBe('0');
});

test('stays square when consumers customize the public button height token', async () => {
  await render(
    <TRIconButton
      aria-label="Open navigation"
      style={{ '--tr-btn-height': '52px' } as CSSProperties}
    >
      <svg aria-hidden="true" />
    </TRIconButton>,
  );
  const button = document.querySelector<HTMLButtonElement>('.tr-icon-btn');

  expect(button?.getBoundingClientRect().height).toBe(52);
  expect(button?.getBoundingClientRect().width).toBe(52);
});

test('inherits every Button appearance and variant token combination', async () => {
  const appearances = ['solid', 'outline', 'ghost'] as const;
  const variants = ['secondary', 'primary', 'danger'] as const;
  await render(
    appearances.flatMap((appearance) =>
      variants.flatMap((variant) => {
        const id = `${appearance}-${variant}`;
        return [
          <TRIconButton
            appearance={appearance}
            aria-label={id}
            data-testid={`icon-${id}`}
            key={`icon-${id}`}
            variant={variant}
          >
            <svg aria-hidden="true" />
          </TRIconButton>,
          <TRButton
            appearance={appearance}
            data-testid={`button-${id}`}
            key={`button-${id}`}
            variant={variant}
          >
            Reference
          </TRButton>,
        ];
      }),
    ),
  );

  for (const appearance of appearances) {
    for (const variant of variants) {
      const id = `${appearance}-${variant}`;
      const iconStyle = getComputedStyle(
        document.querySelector(`[data-testid="icon-${id}"]`) as HTMLElement,
      );
      const buttonStyle = getComputedStyle(
        document.querySelector(`[data-testid="button-${id}"]`) as HTMLElement,
      );
      for (const property of [
        'backgroundColor',
        'borderColor',
        'borderRadius',
        'color',
        'opacity',
      ] as const) {
        expect(iconStyle[property], `${id} ${property}`).toBe(buttonStyle[property]);
      }
    }
  }
});

test('preserves render composition and native form behavior', async () => {
  const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
  const onDefaultSubmit = vi.fn((event: FormEvent<HTMLFormElement>) =>
    event.preventDefault(),
  );

  await render(
    <>
      <TRIconButton
        aria-label="Rack details"
        nativeButton={false}
        render={<a href="#rack-details" />}
      >
        <svg aria-hidden="true" />
      </TRIconButton>
      <form onSubmit={onDefaultSubmit}>
        <TRIconButton aria-label="Open options">
          <svg aria-hidden="true" />
        </TRIconButton>
      </form>
      <form onSubmit={onSubmit}>
        <TRIconButton aria-label="Submit search" type="submit">
          <svg aria-hidden="true" />
        </TRIconButton>
      </form>
    </>,
  );

  const link = document.querySelector<HTMLAnchorElement>('a.tr-icon-btn');
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button'));
  expect(link?.href).toContain('#rack-details');
  expect(link).toHaveAccessibleName('Rack details');
  await userEvent.click(buttons[0] as HTMLButtonElement);
  expect(onDefaultSubmit).not.toHaveBeenCalled();
  await userEvent.click(buttons[1] as HTMLButtonElement);
  expect(onSubmit).toHaveBeenCalledOnce();
});
