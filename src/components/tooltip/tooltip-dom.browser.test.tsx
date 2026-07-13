import '../../core/core.css';
import '../popover/popover.css';
import './tooltip.css';
import { expect, test, vi } from 'vitest';
import { popoverChangeEventName } from '../popover/contract.js';
import { tooltipOpenChangeEventName } from './contract.js';
import { createTooltipManager } from './dom.js';

function createTooltip(id: string, openDelay = '0', closeDelay = '0') {
  const root = document.createElement('span');
  root.dataset['trTooltip'] = 'true';
  root.dataset['openDelay'] = openDelay;
  root.dataset['closeDelay'] = closeDelay;
  root.innerHTML = `<button aria-describedby="${id}" data-tr-tooltip-trigger="true">${id}</button><span class="tr-tooltip-content" data-tr-overlay="layer" id="${id}" popover="manual" role="tooltip">Tip ${id}</span>`;
  document.body.append(root);
  return root;
}

test('Tooltip DOM manager covers pointer/focus scheduling and active replacement', async () => {
  vi.useFakeTimers();
  const first = createTooltip('first');
  const second = createTooltip('second');
  const manager = createTooltipManager(document);
  const firstTrigger = first.querySelector<HTMLElement>('button')!;
  const secondTrigger = second.querySelector<HTMLElement>('button')!;
  const changed = vi.fn();
  document.addEventListener(tooltipOpenChangeEventName, changed);
  document.dispatchEvent(new Event('pointerover'));

  firstTrigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
  await vi.runAllTimersAsync();
  expect(first.querySelector('[role="tooltip"]')?.matches(':popover-open')).toBe(true);
  manager.close(secondTrigger);
  manager.open(secondTrigger);
  expect(first.querySelector('[role="tooltip"]')?.matches(':popover-open')).toBe(false);
  expect(second.querySelector('[role="tooltip"]')?.matches(':popover-open')).toBe(true);
  const internalMove = new Event('pointerout', { bubbles: true });
  Object.defineProperty(internalMove, 'relatedTarget', { value: secondTrigger });
  secondTrigger.dispatchEvent(internalMove);
  await vi.runAllTimersAsync();
  manager.open(secondTrigger);
  secondTrigger.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
  await vi.runAllTimersAsync();
  expect(second.querySelector('[role="tooltip"]')?.matches(':popover-open')).toBe(
    false,
  );
  expect(changed).toHaveBeenCalled();
  document.removeEventListener(tooltipOpenChangeEventName, changed);
  manager.destroy();
  vi.useRealTimers();
  first.remove();
  second.remove();
});

test('Tooltip DOM manager covers public methods, disabled/missing content and delay fallbacks', async () => {
  vi.useFakeTimers();
  const root = createTooltip('valid', '-1', 'invalid');
  const trigger = root.querySelector<HTMLElement>('button')!;
  const manager = createTooltipManager(root);
  trigger.setAttribute('aria-disabled', 'true');
  manager.open(trigger);
  expect(root.querySelector('[role="tooltip"]')?.matches(':popover-open')).toBe(false);
  trigger.removeAttribute('aria-disabled');
  manager.open(trigger);
  expect(root.querySelector('[role="tooltip"]')?.matches(':popover-open')).toBe(true);
  manager.close(trigger);
  expect(root.querySelector('[role="tooltip"]')?.matches(':popover-open')).toBe(false);
  const missing = document.createElement('button');
  missing.dataset['trTooltipTrigger'] = 'true';
  root.append(missing);
  manager.open(missing);
  manager.close(missing);
  trigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
  trigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
  manager.destroy();
  await vi.runAllTimersAsync();
  vi.useRealTimers();
  root.remove();
});

test('Tooltip DOM manager reconciles overlay events and ignores unrelated targets', () => {
  const root = createTooltip('state');
  const trigger = root.querySelector<HTMLElement>('button')!;
  const content = root.querySelector<HTMLElement>('[role="tooltip"]')!;
  const manager = createTooltipManager(root);
  trigger.dispatchEvent(
    new CustomEvent(popoverChangeEventName, {
      bubbles: true,
      detail: { open: true, source: trigger },
    }),
  );
  expect(trigger.dataset['state']).toBe('open');
  expect(content.dataset['state']).toBe('open');
  trigger.dispatchEvent(
    new CustomEvent(popoverChangeEventName, {
      bubbles: true,
      detail: { open: false, source: trigger },
    }),
  );
  expect(trigger.dataset['state']).toBe('closed');
  root.dispatchEvent(
    new CustomEvent(popoverChangeEventName, { bubbles: true, detail: {} }),
  );
  root.dispatchEvent(new Event('pointerover', { bubbles: true }));
  root.dispatchEvent(new Event('pointerout', { bubbles: true }));
  root.dispatchEvent(new Event('focusin', { bubbles: true }));
  root.dispatchEvent(new Event('focusout', { bubbles: true }));
  const missing = document.createElement('button');
  missing.dataset['trTooltipTrigger'] = 'true';
  root.append(missing);
  missing.dispatchEvent(
    new CustomEvent(popoverChangeEventName, {
      bubbles: true,
      detail: { open: true, source: missing },
    }),
  );
  manager.close(missing);
  manager.destroy();
  root.remove();

  const host = document.createElement('div');
  document.body.append(host);
  const shadow = host.attachShadow({ mode: 'open' });
  const shadowRoot = createTooltip('shadow-element');
  shadow.append(shadowRoot);
  const scoped = createTooltipManager(shadowRoot);
  scoped.open(shadowRoot.querySelector<HTMLElement>('button')!);
  expect(shadowRoot.querySelector('[role="tooltip"]')?.matches(':popover-open')).toBe(
    true,
  );
  scoped.destroy();
  host.remove();
});
