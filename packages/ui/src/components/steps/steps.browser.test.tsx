import '../../core/core.css';
import './steps.css';
import { act, type CSSProperties, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRSteps, TRStepsItem, TRStepsRoot } from './index.js';

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

test('renders a semantic ordered list and preserves rich children', async () => {
  const rootRef = createRef<HTMLOListElement>();
  const itemRef = createRef<HTMLLIElement>();
  await render(
    <TRSteps.Root aria-label="Setup" className="custom" data-owner="docs" ref={rootRef}>
      <TRSteps.Item aria-current="step" data-step-id="install" ref={itemRef}>
        <h3>Install</h3>
        <p>Add the package and stylesheet.</p>
      </TRSteps.Item>
      <TRSteps.Item>Configure</TRSteps.Item>
    </TRSteps.Root>,
  );
  expect(rootRef.current?.tagName).toBe('OL');
  expect(rootRef.current).toHaveAttribute('role', 'list');
  expect(rootRef.current).toHaveAttribute('aria-label', 'Setup');
  expect(rootRef.current).toHaveAttribute('data-owner', 'docs');
  expect(rootRef.current).toHaveClass('tr-steps', 'custom');
  expect(rootRef.current?.children).toHaveLength(2);
  expect(itemRef.current?.tagName).toBe('LI');
  expect(itemRef.current).toHaveClass('tr-steps-item');
  expect(itemRef.current).toHaveAttribute('aria-current', 'step');
  expect(itemRef.current).toHaveAttribute('data-step-id', 'install');
  expect(itemRef.current?.querySelector(':scope > h3')).toHaveTextContent('Install');
  expect(itemRef.current?.querySelector(':scope > p')).toHaveTextContent(
    'Add the package and stylesheet.',
  );
  expect(getComputedStyle(rootRef.current as HTMLElement).display).toBe('grid');
  expect(TRSteps.Root).toBe(TRStepsRoot);
  expect(TRSteps.Item).toBe(TRStepsItem);
});

test('allows consumers to override the default role and visual tokens', async () => {
  await render(
    <TRSteps.Root
      data-testid="customized"
      role="presentation"
      style={
        {
          '--tr-steps-gap': '20px',
          '--tr-steps-item-border': 'rgb(255, 0, 0)',
          '--tr-steps-item-padding-inline-start': '48px',
        } as CSSProperties
      }
    >
      <TRSteps.Item data-testid="customized-item">Customize</TRSteps.Item>
    </TRSteps.Root>,
  );

  const root = page.getByTestId('customized').element();
  const item = page.getByTestId('customized-item').element();
  expect(root).toHaveAttribute('role', 'presentation');
  expect(getComputedStyle(root).rowGap).toBe('20px');
  expect(getComputedStyle(item).borderInlineStartColor).toBe('rgb(255, 0, 0)');
  expect(getComputedStyle(item).paddingInlineStart).toBe('48px');
});

test('contains long procedure content at narrow widths', async () => {
  await render(
    <div data-testid="boundary" style={{ width: 160 }}>
      <TRSteps.Root data-testid="narrow-steps">
        <TRSteps.Item data-testid="long-item">
          deployment-01JYV7ZVN5J5FD4XR3MZXQ8T2A.example.internal
        </TRSteps.Item>
      </TRSteps.Root>
    </div>,
  );

  const boundary = page.getByTestId('boundary').element();
  const item = page.getByTestId('long-item').element();
  expect(getComputedStyle(item).overflowWrap).toBe('anywhere');
  expect(boundary.scrollWidth).toBeLessThanOrEqual(boundary.clientWidth);
});

test('renders and hydrates without changing semantic markup', async () => {
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const fixture = (
    <TRSteps.Root aria-label="Deploy">
      <TRSteps.Item>Build</TRSteps.Item>
      <TRSteps.Item>Release</TRSteps.Item>
    </TRSteps.Root>
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('ol')).toHaveAttribute('role', 'list');
  expect(host.querySelectorAll(':scope > ol > li')).toHaveLength(2);

  await act(async () => root.unmount());
  host.remove();
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
});
