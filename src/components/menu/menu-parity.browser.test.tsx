import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectElementParity } from '../../../e2e/fixtures/component-browser-harness.js';
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from './react.js';

test('Menu DOM/React compound part parity', async () => {
  const raw = document.createElement('div');
  raw.className = 'tr-menu';
  raw.dataset['trMenu'] = 'true';
  raw.innerHTML =
    '<button aria-haspopup="menu" data-tr-menu-trigger="true" type="button">Actions</button><div class="tr-layer tr-menu-content" data-close-on-escape="true" data-collision-padding="8" data-match-anchor-width="false" data-offset="8" data-placement="bottom-start" role="menu"><div class="tr-menu-label" role="presentation">Label</div><button class="tr-menu-item" data-value="a" role="menuitem" tabindex="-1" type="button">Alpha</button><hr class="tr-menu-separator"></div>';
  document.body.append(raw);
  const rendered = await render(
    <Menu>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuLabel>Label</MenuLabel>
        <MenuItem value="a">Alpha</MenuItem>
        <MenuSeparator />
      </MenuContent>
    </Menu>,
  );
  const react = rendered.container.querySelector('.tr-menu')!;
  expectElementParity(raw, react);
  expectElementParity(
    raw.querySelector('[data-tr-menu-trigger]')!,
    react.querySelector('[data-tr-menu-trigger]')!,
    {
      ignoreAttributes: [
        'aria-controls',
        'aria-expanded',
        'data-state',
        'data-tr-react-trigger',
        'popovertarget',
        'popovertargetaction',
      ],
    },
  );
  expectElementParity(
    raw.querySelector('[role="menu"]')!,
    react.querySelector('[role="menu"]')!,
    { ignoreAttributes: ['data-tr-overlay', 'id', 'popover'] },
  );
  expectElementParity(
    raw.querySelector('[role="menuitem"]')!,
    react.querySelector('[role="menuitem"]')!,
  );
  raw.remove();
});
