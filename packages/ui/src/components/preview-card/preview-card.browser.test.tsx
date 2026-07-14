import './preview-card.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { PreviewCard, PreviewCardRoot } from './index.js';

test('renders the Tinyrack PreviewCard wrapper', async () => {
  expect(PreviewCard.Root).toBe(PreviewCardRoot);
  await render(
    <PreviewCard.Root>
      <PreviewCard.Trigger href="#preview">Preview</PreviewCard.Trigger>
    </PreviewCard.Root>,
  );
  expect(document.querySelector('.tr-preview-card-trigger')).not.toBeNull();
});

test('opens from keyboard focus and dismisses without moving focus', async () => {
  const onOpenChange = vi.fn();

  await render(
    <PreviewCard.Root onOpenChange={onOpenChange}>
      <PreviewCard.Trigger delay={0} href="#rack-alpha">
        Rack Alpha
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner>
          <PreviewCard.Popup>
            <strong>Rack Alpha</strong>
            <p>Healthy · 12 services</p>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>,
  );

  const trigger = document.querySelector<HTMLAnchorElement>('.tr-preview-card-trigger');
  trigger?.focus();
  await expect
    .poll(
      () => document.querySelector('.tr-preview-card-popup')?.hasAttribute('data-open'),
      { timeout: 2_000 },
    )
    .toBe(true);

  const popup = document.querySelector<HTMLElement>('.tr-preview-card-popup');
  expect(popup?.textContent).toContain('Healthy · 12 services');
  expect(document.activeElement).toBe(trigger);
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);

  history.replaceState(null, '', location.pathname);
  await userEvent.click(trigger as HTMLAnchorElement);
  expect(location.hash).toBe('#rack-alpha');

  await userEvent.keyboard('{Escape}');
  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(false);
  expect(document.activeElement).toBe(trigger);
  expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
});

test('opens and closes from pointer hover with the configured delays', async () => {
  await render(
    <PreviewCard.Root>
      <PreviewCard.Trigger closeDelay={0} delay={0} href="#rack-beta">
        Rack Beta
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner>
          <PreviewCard.Popup>Rack Beta health</PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>,
  );

  const trigger = document.querySelector<HTMLAnchorElement>('.tr-preview-card-trigger');
  await userEvent.hover(trigger as HTMLAnchorElement);
  await expect
    .poll(
      () => document.querySelector('.tr-preview-card-popup')?.hasAttribute('data-open'),
      { timeout: 2_000 },
    )
    .toBe(true);

  await userEvent.unhover(trigger as HTMLAnchorElement);
  await expect
    .poll(
      () => document.querySelector('.tr-preview-card-popup')?.hasAttribute('data-open'),
      { timeout: 2_000 },
    )
    .not.toBe(true);
});
