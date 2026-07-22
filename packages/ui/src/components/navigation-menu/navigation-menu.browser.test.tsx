import '../../core/core.css';
import './navigation-menu.css';
import { act, useRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRNavigationMenu, TRNavigationMenuRoot } from './index.js';

function NavigationMenuFixture({
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  value,
}: {
  defaultValue?: string;
  onValueChange?: (value: unknown) => void;
  orientation?: 'horizontal' | 'vertical';
  value?: string | null;
}) {
  return (
    <TRNavigationMenu.Root
      aria-label="Fixture navigation"
      closeDelay={0}
      defaultValue={defaultValue}
      delay={0}
      onValueChange={onValueChange}
      orientation={orientation}
      value={value}
    >
      <TRNavigationMenu.List>
        <TRNavigationMenu.Item value="platform">
          <TRNavigationMenu.Trigger>Platform</TRNavigationMenu.Trigger>
          <TRNavigationMenu.Content>
            <TRNavigationMenu.Link closeOnClick href="#deployments">
              Deployments
            </TRNavigationMenu.Link>
          </TRNavigationMenu.Content>
        </TRNavigationMenu.Item>
        <TRNavigationMenu.Item>
          <TRNavigationMenu.Link active href="#pricing">
            Pricing
          </TRNavigationMenu.Link>
        </TRNavigationMenu.Item>
      </TRNavigationMenu.List>
      <TRNavigationMenu.Portal>
        <TRNavigationMenu.Backdrop />
        <TRNavigationMenu.Positioner>
          <TRNavigationMenu.Popup>
            <TRNavigationMenu.Arrow />
            <TRNavigationMenu.Viewport />
          </TRNavigationMenu.Popup>
        </TRNavigationMenu.Positioner>
      </TRNavigationMenu.Portal>
    </TRNavigationMenu.Root>
  );
}

test('renders the Tinyrack TRNavigationMenu wrapper', async () => {
  expect(TRNavigationMenu.Root).toBe(TRNavigationMenuRoot);
  await render(
    <TRNavigationMenu.Root aria-label="Primary navigation">
      <TRNavigationMenu.List>
        <TRNavigationMenu.Item>
          <TRNavigationMenu.Link href="#docs">Docs</TRNavigationMenu.Link>
        </TRNavigationMenu.Item>
      </TRNavigationMenu.List>
    </TRNavigationMenu.Root>,
  );
  expect(document.querySelector('.tr-navigation-menu')).not.toBeNull();
});

test('preserves refs, native props, styles, and consumer classes', async () => {
  function RefFixture() {
    const ref = useRef<HTMLElement>(null);
    return (
      <TRNavigationMenu.Root
        className="consumer-root"
        data-navigation="primary"
        ref={ref}
        style={{ marginTop: 7 }}
      >
        <TRNavigationMenu.List>
          <TRNavigationMenu.Item>
            <TRNavigationMenu.Link href="#docs">Docs</TRNavigationMenu.Link>
          </TRNavigationMenu.Item>
        </TRNavigationMenu.List>
        <output>{ref.current?.tagName ?? 'pending'}</output>
      </TRNavigationMenu.Root>
    );
  }

  const rendered = await render(<RefFixture />);
  await rendered.rerender(<RefFixture />);
  const root = document.querySelector<HTMLElement>('.tr-navigation-menu');
  expect(root?.classList.contains('consumer-root')).toBe(true);
  expect(root?.dataset['navigation']).toBe('primary');
  expect(root?.style.marginTop).toBe('7px');
  expect(document.querySelector('output')?.textContent).toBe('NAV');
});

test('matches visual layout and roving focus to vertical orientation', async () => {
  const onValueChange = vi.fn();
  await render(
    <NavigationMenuFixture
      onValueChange={onValueChange}
      orientation="vertical"
      value={null}
    />,
  );
  const list = document.querySelector<HTMLElement>('.tr-navigation-menu-list');
  const platform = document.querySelector<HTMLButtonElement>(
    '.tr-navigation-menu-trigger',
  );
  const pricing = document.querySelector<HTMLAnchorElement>('a[href="#pricing"]');

  expect(getComputedStyle(list as HTMLElement).flexDirection).toBe('column');
  document.body.tabIndex = -1;
  document.body.focus();
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).toBe(platform);
  expect(document.querySelector('.tr-navigation-menu-popup[data-open]')).toBeNull();
  const valueChangeCount = onValueChange.mock.calls.length;
  await userEvent.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(pricing);
  expect(document.querySelector('.tr-navigation-menu-popup[data-open]')).toBeNull();
  expect(onValueChange).toHaveBeenCalledTimes(valueChangeCount);
  document.body.removeAttribute('tabindex');
});

test('renders one popup surface, complete portal anatomy, and contained content', async () => {
  await render(
    <div style={{ position: 'fixed', right: 0, top: 20 }}>
      <NavigationMenuFixture defaultValue="platform" />
    </div>,
  );
  const popup = document.querySelector<HTMLElement>('.tr-navigation-menu-popup');
  const content = document.querySelector<HTMLElement>('.tr-navigation-menu-content');
  const viewport = document.querySelector<HTMLElement>('.tr-navigation-menu-viewport');

  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(true);
  expect(document.querySelector('.tr-navigation-menu-backdrop')).not.toBeNull();
  expect(document.querySelector('.tr-navigation-menu-positioner')).not.toBeNull();
  expect(document.querySelector('.tr-navigation-menu-arrow')).not.toBeNull();
  expect(getComputedStyle(content as HTMLElement).boxShadow).toBe('none');
  expect(getComputedStyle(viewport as HTMLElement).overflow).toBe('hidden');

  const link = content?.querySelector<HTMLAnchorElement>('.tr-navigation-menu-link');
  if (link) {
    link.textContent =
      'MaintenanceWindowRequiresOperatorConfirmationBeforeRestartingServices';
  }
  expect((content as HTMLElement).scrollWidth).toBeLessThanOrEqual(
    (content as HTMLElement).clientWidth,
  );
  await expect
    .poll(() => (popup as HTMLElement).getBoundingClientRect().right)
    .toBeLessThanOrEqual(window.innerWidth);
});

test('marks the active direct link and closes popup content on link press', async () => {
  const onValueChange = vi.fn();
  await render(
    <TRNavigationMenu.Root
      closeDelay={0}
      defaultValue="platform"
      delay={0}
      onValueChange={onValueChange}
    >
      <TRNavigationMenu.List>
        <TRNavigationMenu.Item value="platform">
          <TRNavigationMenu.Trigger>Platform</TRNavigationMenu.Trigger>
          <TRNavigationMenu.Content>
            <TRNavigationMenu.Link closeOnClick href="#deployments">
              Deployments
            </TRNavigationMenu.Link>
          </TRNavigationMenu.Content>
        </TRNavigationMenu.Item>
        <TRNavigationMenu.Item>
          <TRNavigationMenu.Link active href="#pricing">
            Pricing
          </TRNavigationMenu.Link>
        </TRNavigationMenu.Item>
      </TRNavigationMenu.List>
      <TRNavigationMenu.Portal>
        <TRNavigationMenu.Positioner>
          <TRNavigationMenu.Popup>
            <TRNavigationMenu.Viewport />
          </TRNavigationMenu.Popup>
        </TRNavigationMenu.Positioner>
      </TRNavigationMenu.Portal>
    </TRNavigationMenu.Root>,
  );

  const activeLink = document.querySelector<HTMLAnchorElement>('a[href="#pricing"]');
  const popupLink = document.querySelector<HTMLAnchorElement>('a[href="#deployments"]');
  expect(activeLink?.getAttribute('aria-current')).toBe('page');
  popupLink?.click();
  await expect.poll(() => onValueChange.mock.calls.at(-1)?.[0]).toBeNull();
});

test('keeps an SVG icon centered beside its label while opening content', async () => {
  await render(
    <TRNavigationMenu.Root
      aria-label="Icon alignment navigation"
      closeDelay={0}
      delay={0}
    >
      <TRNavigationMenu.List>
        <TRNavigationMenu.Item value="platform">
          <TRNavigationMenu.Trigger>
            <span data-testid="navigation-label">Platform</span>
            <TRNavigationMenu.Icon aria-hidden="true">
              <svg viewBox="0 0 16 16" />
            </TRNavigationMenu.Icon>
          </TRNavigationMenu.Trigger>
          <TRNavigationMenu.Content>Platform links</TRNavigationMenu.Content>
        </TRNavigationMenu.Item>
      </TRNavigationMenu.List>
      <TRNavigationMenu.Portal>
        <TRNavigationMenu.Positioner>
          <TRNavigationMenu.Popup>
            <TRNavigationMenu.Viewport />
          </TRNavigationMenu.Popup>
        </TRNavigationMenu.Positioner>
      </TRNavigationMenu.Portal>
    </TRNavigationMenu.Root>,
  );

  const trigger = document.querySelector<HTMLElement>('.tr-navigation-menu-trigger');
  const label = document.querySelector<HTMLElement>('[data-testid="navigation-label"]');
  const icon = document.querySelector<HTMLElement>('.tr-navigation-menu-icon');
  const svg = icon?.querySelector<SVGElement>('svg');

  expect(trigger).not.toBeNull();
  expect(label).not.toBeNull();
  expect(icon).not.toBeNull();
  expect(svg).not.toBeNull();

  const expectAligned = () => {
    const triggerRect = (trigger as HTMLElement).getBoundingClientRect();
    const labelRect = (label as HTMLElement).getBoundingClientRect();
    const iconRect = (icon as HTMLElement).getBoundingClientRect();
    const svgRect = (svg as SVGElement).getBoundingClientRect();
    const triggerStyle = getComputedStyle(trigger as HTMLElement);
    const iconStyle = getComputedStyle(icon as HTMLElement);

    expect(iconStyle.alignItems).toBe('center');
    expect(iconStyle.flexShrink).toBe('0');
    expect(iconStyle.justifyContent).toBe('center');
    expect(svgRect.width).toBe(16);
    expect(svgRect.height).toBe(16);
    expect(
      Math.abs(
        iconRect.top + iconRect.height / 2 - (triggerRect.top + triggerRect.height / 2),
      ),
    ).toBeLessThan(0.5);
    expect(
      Math.abs(iconRect.left - labelRect.right - Number.parseFloat(triggerStyle.gap)),
    ).toBeLessThan(0.5);
  };

  expectAligned();
  (trigger as HTMLElement).click();
  await expect
    .poll(() =>
      document.querySelector('.tr-navigation-menu-popup')?.hasAttribute('data-open'),
    )
    .toBe(true);
  expectAligned();
});

test('opens rich content, reports value changes, and restores trigger focus', async () => {
  const onValueChange = vi.fn();

  await render(
    <TRNavigationMenu.Root
      aria-label="Primary navigation"
      closeDelay={0}
      delay={0}
      onValueChange={onValueChange}
    >
      <TRNavigationMenu.List>
        <TRNavigationMenu.Item value="platform">
          <TRNavigationMenu.Trigger>Platform</TRNavigationMenu.Trigger>
          <TRNavigationMenu.Content>
            <TRNavigationMenu.Link href="#deployments">
              Deployments
            </TRNavigationMenu.Link>
          </TRNavigationMenu.Content>
        </TRNavigationMenu.Item>
        <TRNavigationMenu.Item value="resources">
          <TRNavigationMenu.Trigger disabled>Resources</TRNavigationMenu.Trigger>
          <TRNavigationMenu.Content>
            <TRNavigationMenu.Link href="#guides">Guides</TRNavigationMenu.Link>
          </TRNavigationMenu.Content>
        </TRNavigationMenu.Item>
      </TRNavigationMenu.List>
      <TRNavigationMenu.Portal>
        <TRNavigationMenu.Positioner>
          <TRNavigationMenu.Popup>
            <TRNavigationMenu.Viewport />
          </TRNavigationMenu.Popup>
        </TRNavigationMenu.Positioner>
      </TRNavigationMenu.Portal>
    </TRNavigationMenu.Root>,
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
        <TRNavigationMenu.Root
          aria-label="Controlled navigation"
          closeDelay={0}
          delay={0}
          onValueChange={(nextValue) =>
            setValue(nextValue === null ? null : String(nextValue))
          }
          value={value}
        >
          <TRNavigationMenu.List>
            {['Platform', 'Resources'].map((label) => (
              <TRNavigationMenu.Item key={label} value={label.toLowerCase()}>
                <TRNavigationMenu.Trigger>{label}</TRNavigationMenu.Trigger>
                <TRNavigationMenu.Content>{label} links</TRNavigationMenu.Content>
              </TRNavigationMenu.Item>
            ))}
          </TRNavigationMenu.List>
          <TRNavigationMenu.Portal>
            <TRNavigationMenu.Positioner>
              <TRNavigationMenu.Popup>
                <TRNavigationMenu.Viewport />
              </TRNavigationMenu.Popup>
            </TRNavigationMenu.Positioner>
          </TRNavigationMenu.Portal>
        </TRNavigationMenu.Root>
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

test('shifts an edge-anchored popup inside the viewport', async () => {
  await render(
    <div style={{ position: 'fixed', right: 0, top: 20 }}>
      <TRNavigationMenu.Root
        aria-label="Edge navigation"
        closeDelay={0}
        defaultValue="resources"
        delay={0}
      >
        <TRNavigationMenu.List>
          <TRNavigationMenu.Item value="resources">
            <TRNavigationMenu.Trigger>Resources</TRNavigationMenu.Trigger>
            <TRNavigationMenu.Content>
              <TRNavigationMenu.Link href="#guides">Guides</TRNavigationMenu.Link>
              <TRNavigationMenu.Link href="#api">API reference</TRNavigationMenu.Link>
            </TRNavigationMenu.Content>
          </TRNavigationMenu.Item>
        </TRNavigationMenu.List>
        <TRNavigationMenu.Portal>
          <TRNavigationMenu.Positioner>
            <TRNavigationMenu.Popup>
              <TRNavigationMenu.Viewport />
            </TRNavigationMenu.Popup>
          </TRNavigationMenu.Positioner>
        </TRNavigationMenu.Portal>
      </TRNavigationMenu.Root>
    </div>,
  );

  const popup = document.querySelector<HTMLElement>('.tr-navigation-menu-popup');
  await expect.poll(() => popup?.hasAttribute('data-open')).toBe(true);
  const bounds = popup?.getBoundingClientRect();
  expect(bounds?.left).toBeGreaterThanOrEqual(0);
  expect(bounds?.right).toBeLessThanOrEqual(window.innerWidth);
});

test('server-renders and hydrates a default-open navigation menu', async () => {
  const actEnvironment = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };
  const previousActEnvironment = actEnvironment.IS_REACT_ACT_ENVIRONMENT;
  actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  const host = document.createElement('div');
  const fixture = <NavigationMenuFixture defaultValue="platform" />;
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  try {
    await act(async () => {});
    expect(hydrationErrors).toEqual([]);
    await expect
      .poll(() =>
        Array.from(document.querySelectorAll('.tr-navigation-menu-popup')).some(
          (popup) => popup.hasAttribute('data-open'),
        ),
      )
      .toBe(true);
  } finally {
    await act(async () => root.unmount());
    host.remove();
    if (previousActEnvironment === undefined) {
      delete actEnvironment.IS_REACT_ACT_ENVIRONMENT;
    } else {
      actEnvironment.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
    }
  }
});
