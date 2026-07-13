import '../../core/core.css';
import './card.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Card, CardRoot } from './index.js';

test('assembles the semantic card parts', async () => {
  expect(Card.Root).toBe(CardRoot);
  await render(
    <Card.Root data-testid="card" padding="lg" variant="elevated">
      <Card.Header>
        <Card.Title>Server</Card.Title>
        <Card.Description>Healthy</Card.Description>
      </Card.Header>
      <Card.Content>Details</Card.Content>
      <Card.Footer>Updated now</Card.Footer>
    </Card.Root>,
  );
  const root = document.querySelector<HTMLElement>('[data-testid="card"]');
  expect(root?.dataset['padding']).toBe('lg');
  expect(root?.querySelector('header')).not.toBeNull();
  expect(root?.querySelector('footer')).not.toBeNull();
  expect(getComputedStyle(root as HTMLElement).boxShadow).not.toBe('none');
});

test('styles every public card variant and padding value', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <div>
      <Card.Root data-testid="outlined" padding="none" variant="outlined" />
      <Card.Root data-testid="default" variant="default" />
    </div>,
  );
  const outlined = document.querySelector<HTMLElement>('[data-testid="outlined"]');
  const standard = document.querySelector<HTMLElement>('[data-testid="default"]');
  expect(getComputedStyle(outlined as HTMLElement).padding).toBe('0px');
  expect(getComputedStyle(outlined as HTMLElement).backgroundColor).not.toBe(
    getComputedStyle(standard as HTMLElement).backgroundColor,
  );
});

test('renders semantic root and title elements without wrapper nodes', async () => {
  await render(
    <Card.Root data-testid="article" render={<article />}>
      <Card.Title render={<h3>Runtime health</h3>} />
    </Card.Root>,
  );
  const root = document.querySelector<HTMLElement>('[data-testid="article"]');
  expect(root?.tagName).toBe('ARTICLE');
  expect(root?.classList.contains('tr-card')).toBe(true);
  expect(root?.querySelector('h3.tr-card-title')?.textContent).toBe('Runtime health');
  expect(root?.querySelector('div')).toBeNull();
});
