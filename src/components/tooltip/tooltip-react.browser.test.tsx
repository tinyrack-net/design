import '../../core/core.css';
import '../overlay/overlay.css';
import './tooltip.css';
import { Component, createRef, type ErrorInfo, type ReactNode } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { layerPlacements } from '../overlay/contract.js';
import { Tooltip, TooltipContent, TooltipTrigger } from './react.js';

test.each(
  layerPlacements,
)('React Tooltip supports placement %s and compound refs', async (placement) => {
  const ref = createRef<HTMLSpanElement>();
  const screen = await render(
    <Tooltip
      className="consumer"
      closeDelay={0}
      openDelay={0}
      placement={placement}
      ref={ref}
    >
      <TooltipTrigger>
        <button type="button">Details</button>
      </TooltipTrigger>
      <TooltipContent className="content">Rack details</TooltipContent>
    </Tooltip>,
  );
  const trigger = screen.getByRole('button').element();
  const content = screen.container.querySelector<HTMLElement>('[role="tooltip"]')!;
  expect(ref.current).toHaveClass('tr-tooltip', 'consumer');
  expect(trigger).toHaveAttribute('data-tr-tooltip-trigger', 'true');
  expect(content).toHaveAttribute('data-placement', placement);
  trigger.focus();
  await expect.poll(() => content.matches(':popover-open')).toBe(true);
  trigger.dispatchEvent(
    new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
  );
  await expect.poll(() => content.matches(':popover-open')).toBe(false);
});

test('React Tooltip supports non-asChild trigger and native prop composition', async () => {
  const screen = await render(
    <Tooltip>
      <TooltipTrigger asChild={false} className="trigger">
        Text trigger
      </TooltipTrigger>
      <TooltipContent data-owner="app">Tip</TooltipContent>
    </Tooltip>,
  );
  const trigger = screen.getByText('Text trigger').element();
  expect(trigger.tagName).toBe('SPAN');
  expect(trigger).toHaveClass('trigger');
  expect(screen.container.querySelector('[role="tooltip"]')).toHaveAttribute(
    'data-owner',
    'app',
  );
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

test('React Tooltip reports compound component context misuse', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const screen = await render(
    <Boundary>
      <TooltipContent>Invalid</TooltipContent>
    </Boundary>,
  );
  expect(
    screen.getByText('TooltipContent must be used within Tooltip.').element(),
  ).toBeVisible();
  consoleError.mockRestore();
});
