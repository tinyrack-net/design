import '../../core/core.css';
import './avatar.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRAvatar, TRAvatarRoot } from './index.js';

const loadedAvatar =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16"%3E%3Crect width="16" height="16" fill="black"/%3E%3C/svg%3E';

test('preserves namespace, native props, refs, and Tinyrack variants', async () => {
  expect(TRAvatar.Root).toBe(TRAvatarRoot);
  const rootRef = createRef<HTMLSpanElement>();
  const fallbackRef = createRef<HTMLSpanElement>();

  await render(
    <TRAvatar.Root
      aria-label="Operator avatar"
      className="consumer-avatar"
      data-testid="avatar"
      ref={rootRef}
      shape="square"
      uiSize="lg"
      style={{ '--tr-avatar-size': '52px' } as React.CSSProperties}
    >
      <TRAvatar.Fallback delay={0} ref={fallbackRef}>
        TR
      </TRAvatar.Fallback>
    </TRAvatar.Root>,
  );

  const root = page.getByTestId('avatar').element() as HTMLElement;
  expect(root).toBe(rootRef.current);
  expect(root).toHaveClass('tr-avatar', 'consumer-avatar');
  expect(root.dataset['shape']).toBe('square');
  expect(root.dataset['uiSize']).toBe('lg');
  expect(getComputedStyle(root).width).toBe('52px');
  await expect.poll(() => fallbackRef.current).not.toBeNull();
  expect(fallbackRef.current).toHaveClass('tr-avatar-fallback');
});

test('reports image load success and exposes the alternative text', async () => {
  const onLoadingStatusChange = vi.fn();
  const imageRef = createRef<HTMLImageElement>();

  await render(
    <TRAvatar.Root>
      <TRAvatar.Image
        alt="Tinyrack operator"
        onLoadingStatusChange={onLoadingStatusChange}
        ref={imageRef}
        src={loadedAvatar}
      />
      <TRAvatar.Fallback delay={0}>TR</TRAvatar.Fallback>
    </TRAvatar.Root>,
  );

  await expect.poll(() => onLoadingStatusChange.mock.calls.at(-1)?.[0]).toBe('loaded');
  const image = page.getByRole('img', { name: 'Tinyrack operator' }).element();
  const root = document.querySelector<HTMLElement>('.tr-avatar');
  expect(image).toBe(imageRef.current);
  expect(image).toHaveClass('tr-avatar-image');
  expect(root?.dataset['shape']).toBe('circle');
  expect(root?.dataset['uiSize']).toBe('md');
  expect(getComputedStyle(root as HTMLElement).width).toBe('40px');
  expect(getComputedStyle(image).objectFit).toBe('cover');
  expect(document.querySelector('.tr-avatar-fallback')).toBeNull();
});

test('preserves image styling with the Base UI render contract', async () => {
  await render(
    <TRAvatar.Root>
      <TRAvatar.Image
        aria-label="Rendered operator"
        render={<span role="img" />}
        src={loadedAvatar}
      />
      <TRAvatar.Fallback delay={0}>TR</TRAvatar.Fallback>
    </TRAvatar.Root>,
  );

  const image = page.getByRole('img', { name: 'Rendered operator' }).element();
  const root = document.querySelector<HTMLElement>('.tr-avatar');
  expect(image).toHaveClass('tr-avatar-image');
  expect(getComputedStyle(image).display).toBe('block');
  expect(image.clientWidth).toBe(root?.clientWidth);
  expect(image.clientHeight).toBe(root?.clientHeight);
});

test('honors the fallback delay while an image is unavailable', async () => {
  await render(
    <TRAvatar.Root>
      <TRAvatar.Fallback delay={50}>TR</TRAvatar.Fallback>
    </TRAvatar.Root>,
  );

  expect(document.querySelector('.tr-avatar-fallback')).toBeNull();
  await expect
    .poll(() => document.querySelector('.tr-avatar-fallback')?.textContent)
    .toBe('TR');
});

test('reports image errors and renders the fallback', async () => {
  const onLoadingStatusChange = vi.fn();

  await render(
    <TRAvatar.Root>
      <TRAvatar.Image
        alt="Unavailable operator"
        onLoadingStatusChange={onLoadingStatusChange}
        src="data:image/svg+xml,not-valid-svg"
      />
      <TRAvatar.Fallback delay={0}>TR</TRAvatar.Fallback>
    </TRAvatar.Root>,
  );

  await expect.poll(() => onLoadingStatusChange.mock.calls.at(-1)?.[0]).toBe('error');
  expect(document.querySelector('.tr-avatar-image')).toBeNull();
  expect(document.querySelector('.tr-avatar-fallback')?.textContent).toBe('TR');
});
