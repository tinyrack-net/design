import '../../core/core.css';
import '../popover/popover.css';
import './menu.css';
import { createRef } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from './react.js';

test('React Menu renders all compound parts, refs and asChild items', async () => {
  const ref = createRef<HTMLElement>();
  const screen = await render(
    <Menu className="consumer" defaultOpen mode="manual">
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent className="content">
        <MenuLabel>Rack actions</MenuLabel>
        <MenuItem leadingVisual={<span>+</span>} ref={ref} textValue="Add" value="add">
          Add
        </MenuItem>
        <MenuItem asChild leadingVisual={<span>↗</span>} value="docs">
          <a href="#docs">Docs</a>
        </MenuItem>
        <MenuItem disabled>Disabled</MenuItem>
        <MenuSeparator />
      </MenuContent>
    </Menu>,
  );
  expect(screen.container.querySelector('.tr-menu')).toHaveClass('consumer');
  expect(screen.getByText('Rack actions').element()).toHaveAttribute(
    'role',
    'presentation',
  );
  expect(screen.container.querySelector('a[role="menuitem"]')).toHaveAttribute(
    'data-value',
    'docs',
  );
  expect(screen.getByText('Disabled').element()).toBeDisabled();
  expect(screen.container.querySelector('.tr-menu-separator')?.tagName).toBe('HR');
  expect(ref.current).toHaveAttribute('data-text-value', 'Add');
});

test('React Menu delegates selection and keyboard behavior to the DOM manager', async () => {
  const selected = vi.fn();
  const screen = await render(
    <Menu defaultOpen>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem onClick={selected} value="a">
          Alpha
        </MenuItem>
        <MenuItem value="b">Beta</MenuItem>
      </MenuContent>
    </Menu>,
  );
  const alpha = screen.getByText('Alpha');
  await alpha.click();
  expect(selected).toHaveBeenCalledOnce();
});
