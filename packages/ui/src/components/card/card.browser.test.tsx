import '../../core/core.css';
import './card.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRCard, TRCardRoot } from './index.js';

test('assembles the semantic card parts', async () => {
  expect(TRCard.Root).toBe(TRCardRoot);
  await render(
    <TRCard.Root data-testid="card" padding="lg" variant="elevated">
      <TRCard.Header>
        <TRCard.Title>Server</TRCard.Title>
        <TRCard.Description>Healthy</TRCard.Description>
      </TRCard.Header>
      <TRCard.Content>Details</TRCard.Content>
      <TRCard.Footer>Updated now</TRCard.Footer>
    </TRCard.Root>,
  );
  const root = document.querySelector<HTMLElement>('[data-testid="card"]');
  expect(root?.dataset['padding']).toBe('lg');
  expect(root?.querySelector('header')).not.toBeNull();
  expect(root?.querySelector('footer')).not.toBeNull();
  expect(getComputedStyle(root as HTMLElement).boxShadow).not.toBe('none');
  expect(
    getComputedStyle(root?.querySelector('.tr-card-header') as HTMLElement).display,
  ).toBe('grid');
  expect(
    getComputedStyle(root?.querySelector('.tr-card-footer') as HTMLElement).flexWrap,
  ).toBe('wrap');
});

test('styles every public card variant and padding value', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <div>
      <TRCard.Root data-testid="outlined" padding="none" variant="outlined" />
      <TRCard.Root data-testid="default" variant="default" />
    </div>,
  );
  const outlined = document.querySelector<HTMLElement>('[data-testid="outlined"]');
  const standard = document.querySelector<HTMLElement>('[data-testid="default"]');
  expect(getComputedStyle(outlined as HTMLElement).padding).toBe('0px');
  expect(getComputedStyle(outlined as HTMLElement).backgroundColor).not.toBe(
    getComputedStyle(standard as HTMLElement).backgroundColor,
  );
});

test('uses the semantic border token by default while preserving overrides', async () => {
  document.documentElement.style.setProperty('--tinyrack-border', '#123456');
  document.documentElement.style.setProperty('--tinyrack-control-border', '#abcdef');
  await render(<TRCard.Root data-testid="semantic-border" />);

  expect(
    getComputedStyle(
      document.querySelector('[data-testid="semantic-border"]') as HTMLElement,
    ).borderColor,
  ).toBe('rgb(18, 52, 86)');

  document.documentElement.style.removeProperty('--tinyrack-border');
  document.documentElement.style.removeProperty('--tinyrack-control-border');
});

test('renders semantic root and title elements without wrapper nodes', async () => {
  await render(
    <TRCard.Root data-testid="article" render={<article />}>
      <TRCard.Title render={<h3>Runtime health</h3>} />
    </TRCard.Root>,
  );
  const root = document.querySelector<HTMLElement>('[data-testid="article"]');
  expect(root?.tagName).toBe('ARTICLE');
  expect(root?.classList.contains('tr-card')).toBe(true);
  expect(root?.querySelector('h3.tr-card-title')?.textContent).toBe('Runtime health');
  expect(root?.querySelector('div')).toBeNull();
});

test('08 gives elevated cards a distinct semantic surface in both themes', async () => {
  for (const theme of ['tinyrack-light', 'tinyrack-dark']) {
    document.documentElement.dataset['theme'] = theme;
    const view = await render(
      <div>
        <TRCard.Root data-testid="default-surface" />
        <TRCard.Root data-testid="elevated" variant="elevated" />
      </div>,
    );
    const standard = document.querySelector<HTMLElement>(
      '[data-testid="default-surface"]',
    );
    const elevated = document.querySelector<HTMLElement>('[data-testid="elevated"]');
    expect(getComputedStyle(elevated as HTMLElement).backgroundColor).not.toBe(
      getComputedStyle(standard as HTMLElement).backgroundColor,
    );
    await view.unmount();
  }
  delete document.documentElement.dataset['theme'];
});
