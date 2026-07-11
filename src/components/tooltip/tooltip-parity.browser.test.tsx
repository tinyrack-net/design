import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectElementParity } from '../../../e2e/fixtures/component-browser-harness.js';
import { layerPlacements } from '../overlay/contract.js';
import { Tooltip, TooltipContent, TooltipTrigger } from './react.js';

test.each(
  layerPlacements,
)('Tooltip DOM/React parity for placement %s', async (placement) => {
  const raw = document.createElement('span');
  raw.className = 'tr-tooltip';
  Object.assign(raw.dataset, {
    closeDelay: '100',
    openDelay: '500',
    trTooltip: 'true',
  });
  raw.innerHTML = `<button data-state="closed" data-tr-tooltip-trigger="true" type="button">Details</button><span class="tr-layer tr-tooltip-content" data-close-on-escape="true" data-offset="6" data-placement="${placement}" data-state="closed" data-tr-overlay="layer" popover="manual" role="tooltip">Tip</span>`;
  document.body.append(raw);
  const rendered = await render(
    <Tooltip placement={placement}>
      <TooltipTrigger>
        <button type="button">Details</button>
      </TooltipTrigger>
      <TooltipContent>Tip</TooltipContent>
    </Tooltip>,
  );
  const react = rendered.container.querySelector('.tr-tooltip')!;
  expectElementParity(raw, react);
  expectElementParity(raw.querySelector('button')!, react.querySelector('button')!, {
    ignoreAttributes: ['aria-describedby'],
  });
  expectElementParity(
    raw.querySelector('[role="tooltip"]')!,
    react.querySelector('[role="tooltip"]')!,
    { ignoreAttributes: ['id'] },
  );
  raw.remove();
});
