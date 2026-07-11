import '../../core/core.css';
import './toast.css';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { toastPositions } from './contract.js';
import { ToastProvider, ToastViewport, useToast } from './react.js';

function Controls() {
  const toast = useToast();
  return (
    <>
      <button
        onClick={() => toast.show({ duration: 0, id: 'react', title: 'Created' })}
        type="button"
      >
        Show
      </button>
      <button
        onClick={() => toast.update('react', { description: 'Updated' })}
        type="button"
      >
        Update
      </button>
      <button onClick={() => toast.dismiss('react')} type="button">
        Dismiss
      </button>
    </>
  );
}

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

function InvalidConsumer() {
  useToast();
  return null;
}

test('React ToastProvider exposes lazy show, update and dismiss APIs', async () => {
  const screen = await render(
    <ToastProvider>
      <ToastViewport className="consumer" label="App notices" />
      <Controls />
    </ToastProvider>,
  );
  expect(screen.getByLabelText('App notices').element()).toHaveClass(
    'tr-toast-viewport',
    'consumer',
  );
  await screen.getByText('Show').click();
  expect(screen.getByText('Created').element()).toHaveClass('tr-toast-title');
  await screen.getByText('Update').click();
  expect(screen.getByText('Updated').element()).toHaveClass('tr-toast-description');
  await screen.getByText('Dismiss').click();
  expect(screen.container.querySelector('[data-toast-id="react"]')).toBeNull();
});

test.each(
  toastPositions,
)('React ToastViewport supports position %s', async (position) => {
  const screen = await render(<ToastViewport label={position} position={position} />);
  expect(screen.getByLabelText(position).element()).toHaveAttribute(
    'data-position',
    position,
  );
  expect(screen.getByLabelText(position).element()).toHaveAttribute(
    'popover',
    'manual',
  );
});

test('useToast reports context misuse through a React error boundary', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const screen = await render(
    <Boundary>
      <InvalidConsumer />
    </Boundary>,
  );
  expect(
    screen.getByText('useToast must be used within ToastProvider.').element(),
  ).toBeVisible();
  consoleError.mockRestore();
});
