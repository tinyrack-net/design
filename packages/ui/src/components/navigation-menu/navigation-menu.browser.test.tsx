import './navigation-menu.css';
import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { NavigationMenu, NavigationMenuRoot } from './index.js';

test('renders the Tinyrack NavigationMenu wrapper', async () => {
  expect(NavigationMenu.Root).toBe(NavigationMenuRoot);
  await render(
    <NavigationMenu.Root aria-label="Primary navigation">
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#docs">Docs</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>,
  );
  expect(document.querySelector('.tr-navigation-menu')).not.toBeNull();
});

test('opens rich content, reports value changes, and restores trigger focus', async () => {
  const onValueChange = vi.fn();

  await render(
    <NavigationMenu.Root
      aria-label="Primary navigation"
      closeDelay={0}
      delay={0}
      onValueChange={onValueChange}
    >
      <NavigationMenu.List>
        <NavigationMenu.Item value="platform">
          <NavigationMenu.Trigger>Platform</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="#deployments">Deployments</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="resources">
          <NavigationMenu.Trigger disabled>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="#guides">Guides</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner>
          <NavigationMenu.Popup>
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>,
  );

  const root = document.querySelector<HTMLElement>('.tr-navigation-menu');
  const triggers = Array.from(
    document.querySelectorAll<HTMLButtonElement>('.tr-navigation-menu-trigger'),
  );
  const platform = triggers[0];

  expect(root?.tagName).toBe('NAV');
  expect(root?.getAttribute('aria-label')).toBe('Primary navigation');
  platform?.click();
  await expect
    .poll(() =>
      document.querySelector('.tr-navigation-menu-popup')?.hasAttribute('data-open'),
    )
    .toBe(true);
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBe('platform');
  expect(document.body.textContent).toContain('Deployments');

  expect(
    document.querySelector('.tr-navigation-menu-popup .tr-navigation-menu-link'),
  ).not.toBeNull();

  await userEvent.keyboard('{Escape}');
  await expect.poll(() => document.activeElement).toBe(platform);
  await expect
    .poll(
      () =>
        document
          .querySelector('.tr-navigation-menu-popup')
          ?.hasAttribute('data-open') ?? false,
    )
    .toBe(false);
  expect(onValueChange.mock.calls.at(-1)?.[0]).toBeNull();

  const resourceTrigger = triggers[1];
  const callCount = onValueChange.mock.calls.length;
  expect(resourceTrigger?.getAttribute('aria-disabled')).toBe('true');
  resourceTrigger?.click();
  expect(onValueChange).toHaveBeenCalledTimes(callCount);
});

test('switches controlled content between pointer-selected navigation items', async () => {
  function ControlledNavigation() {
    const [value, setValue] = useState<string | null>(null);
    return (
      <>
        <NavigationMenu.Root
          aria-label="Controlled navigation"
          closeDelay={0}
          delay={0}
          onValueChange={(nextValue) =>
            setValue(nextValue === null ? null : String(nextValue))
          }
          value={value}
        >
          <NavigationMenu.List>
            {['Platform', 'Resources'].map((label) => (
              <NavigationMenu.Item key={label} value={label.toLowerCase()}>
                <NavigationMenu.Trigger>{label}</NavigationMenu.Trigger>
                <NavigationMenu.Content>{label} links</NavigationMenu.Content>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
          <NavigationMenu.Portal>
            <NavigationMenu.Positioner>
              <NavigationMenu.Popup>
                <NavigationMenu.Viewport />
              </NavigationMenu.Popup>
            </NavigationMenu.Positioner>
          </NavigationMenu.Portal>
        </NavigationMenu.Root>
        <output>{value ?? 'closed'}</output>
      </>
    );
  }

  await render(<ControlledNavigation />);
  const triggers = document.querySelectorAll<HTMLButtonElement>(
    '.tr-navigation-menu-trigger',
  );
  triggers[0]?.click();
  await expect
    .poll(() => document.querySelector('output')?.textContent)
    .toBe('platform');
  triggers[1]?.click();
  await expect
    .poll(() => document.querySelector('output')?.textContent)
    .toBe('resources');
  expect(document.body.textContent).toContain('Resources links');
});
