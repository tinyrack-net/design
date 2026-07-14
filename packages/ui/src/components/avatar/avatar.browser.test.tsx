import '../../core/core.css';
import './avatar.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Avatar, AvatarRoot } from './index.js';

const loadedAvatar =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16"%3E%3Crect width="16" height="16" fill="black"/%3E%3C/svg%3E';

test('preserves namespace, native props, refs, and Tinyrack variants', async () => {
  expect(Avatar.Root).toBe(AvatarRoot);
  const rootRef = createRef<HTMLSpanElement>();
  const fallbackRef = createRef<HTMLSpanElement>();

  await render(
    <Avatar.Root
      aria-label="Operator avatar"
      className="consumer-avatar"
      data-testid="avatar"
      ref={rootRef}
      shape="square"
      size="lg"
      style={{ '--tr-avatar-size': '52px' } as React.CSSProperties}
    >
      <Avatar.Fallback delay={0} ref={fallbackRef}>
        TR
      </Avatar.Fallback>
    </Avatar.Root>,
  );

  const root = page.getByTestId('avatar').element() as HTMLElement;
  expect(root).toBe(rootRef.current);
  expect(root).toHaveClass('tr-avatar', 'consumer-avatar');
  expect(root.dataset['shape']).toBe('square');
  expect(root.dataset['size']).toBe('lg');
  expect(getComputedStyle(root).width).toBe('52px');
  expect(fallbackRef.current).toHaveClass('tr-avatar-fallback');
});

test('reports image load success and exposes the alternative text', async () => {
  const onLoadingStatusChange = vi.fn();
  const imageRef = createRef<HTMLImageElement>();

  await render(
    <Avatar.Root>
      <Avatar.Image
        alt="Tinyrack operator"
        onLoadingStatusChange={onLoadingStatusChange}
        ref={imageRef}
        src={loadedAvatar}
      />
      <Avatar.Fallback delay={0}>TR</Avatar.Fallback>
    </Avatar.Root>,
  );

  await expect.poll(() => onLoadingStatusChange.mock.calls.at(-1)?.[0]).toBe('loaded');
  const image = page.getByRole('img', { name: 'Tinyrack operator' }).element();
  expect(image).toBe(imageRef.current);
  expect(image).toHaveClass('tr-avatar-image');
  expect(document.querySelector('.tr-avatar-fallback')).toBeNull();
});

test('reports image errors and renders the fallback', async () => {
  const onLoadingStatusChange = vi.fn();

  await render(
    <Avatar.Root>
      <Avatar.Image
        alt="Unavailable operator"
        onLoadingStatusChange={onLoadingStatusChange}
        src="data:image/svg+xml,not-valid-svg"
      />
      <Avatar.Fallback delay={0}>TR</Avatar.Fallback>
    </Avatar.Root>,
  );

  await expect.poll(() => onLoadingStatusChange.mock.calls.at(-1)?.[0]).toBe('error');
  expect(document.querySelector('.tr-avatar-image')).toBeNull();
  expect(document.querySelector('.tr-avatar-fallback')?.textContent).toBe('TR');
});
