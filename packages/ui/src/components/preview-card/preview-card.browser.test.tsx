import '../../core/core.css';
import './preview-card.css';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRPreviewCard, TRPreviewCardRoot } from './index.js';

test('renders the Tinyrack TRPreviewCard wrapper', async () => {
  expect(TRPreviewCard.Root).toBe(TRPreviewCardRoot);
  await render(
    <TRPreviewCard.Root>
      <TRPreviewCard.Trigger href="#preview">Preview</TRPreviewCard.Trigger>
    </TRPreviewCard.Root>,
  );
  expect(document.querySelector('.tr-preview-card-trigger')).not.toBeNull();
  expect(document.querySelector('.tr-preview-card')).toBeNull();
});

test('applies the visual contract to rendered trigger and popup parts', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <TRPreviewCard.Root defaultOpen>
      <TRPreviewCard.Trigger href="#parts">Rendered trigger</TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner>
          <TRPreviewCard.Popup>Rendered popup</TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>,
  );
  const trigger = document.querySelector<HTMLElement>('.tr-preview-card-trigger');
  const popup = document.querySelector<HTMLElement>('.tr-preview-card-popup');
  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(true);
  expect(getComputedStyle(trigger as HTMLElement).fontFamily).not.toBe('');
  expect(getComputedStyle(popup as HTMLElement).maxWidth).not.toBe('none');
  delete document.documentElement.dataset['theme'];
});

test('opens from keyboard focus and dismisses without moving focus', async () => {
  const onOpenChange = vi.fn();

  await render(
    <TRPreviewCard.Root onOpenChange={onOpenChange}>
      <TRPreviewCard.Trigger delay={0} href="#rack-alpha">
        Rack Alpha
      </TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner>
          <TRPreviewCard.Popup>
            <strong>Rack Alpha</strong>
            <p>Healthy · 12 services</p>
          </TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>,
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
    <TRPreviewCard.Root>
      <TRPreviewCard.Trigger closeDelay={0} delay={0} href="#rack-beta">
        Rack Beta
      </TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner>
          <TRPreviewCard.Popup>Rack Beta health</TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>,
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
