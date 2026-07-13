import './menu.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Menu, MenuRoot } from './index.js';

test('assembles an accessible Base UI menu', async () => {
  expect(Menu.Root).toBe(MenuRoot);
  await render(
    <Menu.Root defaultOpen>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item>Restart</Menu.Item>
            <Menu.Separator />
            <Menu.SubmenuRoot>
              <span>Nested menu context</span>
            </Menu.SubmenuRoot>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>,
  );
  expect(document.querySelector('.tr-menu-content')?.getAttribute('role')).toBe('menu');
  expect(document.querySelector('.tr-menu-item')?.getAttribute('role')).toBe(
    'menuitem',
  );
});

test('applies shared semantic item and label classes to rich menu anatomy', async () => {
  await render(
    <Menu.Root defaultOpen>
      <Menu.Trigger>Display</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Group>
              <Menu.GroupLabel>Preferences</Menu.GroupLabel>
              <Menu.CheckboxItem checked>
                <Menu.CheckboxItemIndicator aria-hidden="true">
                  ✓
                </Menu.CheckboxItemIndicator>
                Compact
              </Menu.CheckboxItem>
              <Menu.RadioGroup value="light">
                <Menu.RadioItem value="light">
                  <Menu.RadioItemIndicator aria-hidden="true">
                    ●
                  </Menu.RadioItemIndicator>
                  Light
                </Menu.RadioItem>
              </Menu.RadioGroup>
              <Menu.LinkItem href="#help">Help</Menu.LinkItem>
              <Menu.SubmenuRoot>
                <Menu.SubmenuTrigger>More</Menu.SubmenuTrigger>
              </Menu.SubmenuRoot>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>,
  );

  expect(document.querySelector('.tr-menu-group-label')).toHaveClass('tr-menu-label');
  for (const selector of [
    '.tr-menu-checkbox-item',
    '.tr-menu-radio-item',
    '.tr-menu-link-item',
    '.tr-menu-submenu-trigger',
  ]) {
    expect(document.querySelector(selector)).toHaveClass('tr-menu-item');
  }
  expect(document.querySelector('.tr-menu-checkbox-item-indicator')).toHaveClass(
    'tr-menu-item-indicator',
  );
});
