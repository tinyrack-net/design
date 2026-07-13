import '../../core/core.css';
import './tabs.css';
import { Component, createRef, type ErrorInfo, type ReactNode } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { tabsActivationModes, tabsOrientations, tabsSizes } from './contract.js';
import { Tabs, TabsList, TabsPanel, TabsTrigger } from './react.js';

const cases = tabsSizes.flatMap((size) =>
  tabsOrientations.flatMap((orientation) =>
    tabsActivationModes.map(
      (activationMode) => [size, orientation, activationMode] as const,
    ),
  ),
);

test.each(
  cases,
)('React Tabs supports %s/%s/%s', async (size, orientation, activationMode) => {
  const screen = await render(
    <Tabs
      activationMode={activationMode}
      defaultValue="rack"
      orientation={orientation}
      size={size}
    >
      <TabsList>
        <TabsTrigger value="rack">Rack</TabsTrigger>
        <TabsTrigger aria-disabled="true" value="logs">
          Logs
        </TabsTrigger>
      </TabsList>
      <TabsPanel value="rack">Rack panel</TabsPanel>
      <TabsPanel value="logs">Logs panel</TabsPanel>
    </Tabs>,
  );
  const list = screen.getByRole('tablist').element();
  expect(list.getAttribute('aria-orientation')).toBe(
    orientation === 'vertical' ? 'vertical' : null,
  );
  expect(list).toHaveAttribute('data-size', size);
  expect(screen.getByRole('tab', { name: 'Rack' }).element()).toHaveAttribute(
    'tabindex',
    '0',
  );
  expect(screen.getByText('Rack panel').element()).not.toHaveAttribute('hidden');
});

test('React Tabs covers refs, controlled events, nested event filtering and normalized ids', async () => {
  const outerChange = vi.fn();
  const innerChange = vi.fn();
  const objectRef = createRef<HTMLDivElement>();
  let callbackRef: HTMLDivElement | null = null;
  const screen = await render(
    <Tabs
      onValueChange={outerChange}
      ref={(element) => {
        callbackRef = element;
      }}
      value="outer"
    >
      <TabsList>
        <TabsTrigger value="outer">Outer</TabsTrigger>
      </TabsList>
      <TabsPanel value="outer">
        <Tabs defaultValue="inner one" onValueChange={innerChange} ref={objectRef}>
          <TabsList>
            <TabsTrigger value="inner one">Inner one</TabsTrigger>
            <TabsTrigger value="!!!">Inner two</TabsTrigger>
          </TabsList>
          <TabsPanel value="inner one">First</TabsPanel>
          <TabsPanel value="!!!">Second</TabsPanel>
        </Tabs>
      </TabsPanel>
    </Tabs>,
  );
  await Promise.resolve();
  expect(callbackRef).not.toBeNull();
  expect(objectRef.current).not.toBeNull();
  expect(screen.getByRole('tab', { name: 'Outer' }).element()).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByRole('tab', { name: 'Inner one' }).element()).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByText('First').element()).not.toHaveAttribute('hidden');
  await screen.getByRole('tab', { name: 'Inner two' }).click();
  expect(innerChange).toHaveBeenCalledWith('!!!');
  expect(outerChange).not.toHaveBeenCalled();
  expect(screen.getByText('Second').element().id).toMatch(/-panel-tab$/);
});

class Boundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  override componentDidCatch(_error: Error, _info: ErrorInfo) {}
  override render() {
    return this.state.error === null ? (
      this.props.children
    ) : (
      <p>{this.state.error.message}</p>
    );
  }
}

test('React Tabs reports compound context misuse', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const screen = await render(
    <Boundary>
      <TabsList />
    </Boundary>,
  );
  expect(
    screen.getByText('TabsList must be used within Tabs.').element(),
  ).toBeVisible();
  consoleError.mockRestore();
});
