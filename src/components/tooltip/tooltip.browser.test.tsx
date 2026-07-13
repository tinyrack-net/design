import '../../core/core.css';
import '../popover/popover.css';
import './tooltip.css';
import { afterEach, expect, test } from 'vitest';
import { createTooltipManager } from './dom.js';

const cleanups: Array<() => void> = [];

afterEach(() => {
  for (const cleanup of cleanups.splice(0)) {
    cleanup();
  }
  document.body.replaceChildren();
});

function tooltipMarkup(document: Document, suffix: string) {
  const root = document.createElement('span');
  root.dataset['trTooltip'] = 'true';
  root.dataset['openDelay'] = '0';
  root.dataset['closeDelay'] = '0';
  const trigger = document.createElement('button');
  trigger.dataset['trTooltipTrigger'] = 'true';
  trigger.setAttribute('aria-describedby', `tip-${suffix}`);
  trigger.textContent = 'Details';
  const content = document.createElement('span');
  content.id = `tip-${suffix}`;
  content.className = 'tr-layer tr-tooltip-content';
  content.dataset['trOverlay'] = 'layer';
  content.dataset['placement'] = 'top';
  content.setAttribute('popover', 'manual');
  content.setAttribute('role', 'tooltip');
  content.textContent = 'Rack details';
  root.append(trigger, content);
  return { content, root, trigger };
}

test('Tooltip opens on focus, closes on Escape and updates shared state', async () => {
  const { content, root, trigger } = tooltipMarkup(document, 'document');
  document.body.append(root);
  const manager = createTooltipManager(root);
  cleanups.push(() => manager.destroy());

  trigger.focus();
  await new Promise((resolve) => setTimeout(resolve, 10));

  expect(content.matches(':popover-open')).toBe(true);
  expect(trigger.dataset['state']).toBe('open');
  expect(content.getAttribute('role')).toBe('tooltip');

  document.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }),
  );
  expect(content.matches(':popover-open')).toBe(false);
  expect(trigger.dataset['state']).toBe('closed');
});

test('Tooltip keeps discovery and popover content inside a ShadowRoot', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const shadow = host.attachShadow({ mode: 'open' });
  const { content, root, trigger } = tooltipMarkup(document, 'shadow');
  shadow.append(root);
  const manager = createTooltipManager(shadow);
  cleanups.push(() => manager.destroy());

  trigger.focus();
  await new Promise((resolve) => setTimeout(resolve, 10));

  expect(content.matches(':popover-open')).toBe(true);
  expect(content.getRootNode()).toBe(shadow);
});

test.each([
  {
    background: 'rgb(23, 23, 23)',
    color: 'rgb(255, 255, 255)',
    theme: 'tinyrack-light',
  },
  {
    background: 'rgb(250, 250, 250)',
    color: 'rgb(10, 10, 10)',
    theme: 'tinyrack-dark',
  },
])('Tooltip resolves its inverse component colors in $theme', ({
  background,
  color,
  theme,
}) => {
  document.documentElement.dataset.theme = theme;
  const { content, root } = tooltipMarkup(document, theme);
  document.body.append(root);

  const styles = getComputedStyle(content);
  expect(styles.backgroundColor).toBe(background);
  expect(styles.borderColor).toBe(background);
  expect(styles.color).toBe(color);
});
