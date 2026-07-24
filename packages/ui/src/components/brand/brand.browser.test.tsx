import '../../core/core.css';
import './brand.css';
import { createElement } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { TRBrand } from './index.js';

test('renders a linked logo with an optional title and trailing content', async () => {
  const view = await render(
    <TRBrand
      href="/home"
      linkClassName="custom-link"
      logo={<svg aria-hidden="true" data-testid="logo" viewBox="0 0 24 24" />}
      title="Acme"
      titleClassName="custom-title"
    >
      <span data-testid="badge">v1</span>
    </TRBrand>,
  );
  expect(document.querySelector('.tr-brand')).not.toBeNull();
  const link = document.querySelector<HTMLAnchorElement>('a.tr-brand-link.custom-link');
  expect(link).toHaveAttribute('href', '/home');
  expect(link?.querySelector('[data-testid="logo"]')).not.toBeNull();
  expect(document.querySelector('.tr-brand-title.custom-title')).toHaveTextContent(
    'Acme',
  );
  expect(document.querySelector('[data-testid="badge"]')).toHaveTextContent('v1');
  await view.unmount();
});

test('omits the title and accepts a custom link element', async () => {
  const view = await render(
    <TRBrand
      logo={<svg aria-hidden="true" viewBox="0 0 24 24" />}
      render={createElement('a', { 'data-router': '', href: '/root' })}
    />,
  );
  expect(document.querySelector('.tr-brand-title')).toBeNull();
  const link = document.querySelector('a.tr-brand-link');
  expect(link).toHaveAttribute('data-router', '');
  expect(link).toHaveAttribute('href', '/root');
  await view.unmount();
});
