import '../../core/core.css';
import '../spinner/spinner.css';
import './button.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { buttonAppearances, buttonSizes, buttonVariants } from './contract.js';
import { Button, ButtonGroup, IconButton } from './react.js';

const buttonCases = buttonSizes.flatMap((size) =>
  buttonVariants.flatMap((variant) =>
    buttonAppearances.map((appearance) => [size, variant, appearance] as const),
  ),
);

test.each(
  buttonCases,
)('React Button supports %s/%s/%s', async (size, variant, appearance) => {
  const onClick = vi.fn();
  const screen = await render(
    <Button appearance={appearance} onClick={onClick} size={size} variant={variant}>
      Save
    </Button>,
  );
  const button = screen.getByRole('button').element();
  expect(button).toHaveAttribute('data-appearance', appearance);
  expect(button).toHaveAttribute('data-size', size);
  expect(button).toHaveAttribute('data-variant', variant);
  await screen.getByRole('button').click();
  expect(onClick).toHaveBeenCalledOnce();
});

test('React Button covers loading, groups, icon accessibility and refs', async () => {
  const ref = createRef<HTMLButtonElement>();
  const screen = await render(
    <>
      <Button aria-label="Original" loading loadingLabel="Saving" ref={ref}>
        Save
      </Button>
      <ButtonGroup attached className="consumer" orientation="vertical">
        <Button>One</Button>
      </ButtonGroup>
      <IconButton label="Settings" ref={ref}>
        ⚙
      </IconButton>
    </>,
  );
  const loading = screen.getByLabelText('Saving').element();
  expect(loading).toBeDisabled();
  expect(loading).toHaveAttribute('aria-busy', 'true');
  expect(loading.querySelector('.tr-spinner')).not.toBeNull();
  expect(screen.getByRole('group').element()).toHaveAttribute('data-attached', 'true');
  expect(screen.getByLabelText('Settings').element()).toHaveClass('tr-icon-btn');
  expect(ref.current).toBe(screen.getByLabelText('Settings').element());
});

test('React Button preserves an aria label while loading and default group state', async () => {
  const screen = await render(
    <>
      <Button aria-label="Save" loading>
        Save
      </Button>
      <ButtonGroup>Group</ButtonGroup>
    </>,
  );
  expect(screen.getByLabelText('Save').element()).toBeDisabled();
  expect(screen.getByRole('group').element()).not.toHaveAttribute('data-attached');
});
