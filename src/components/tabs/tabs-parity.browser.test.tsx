import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectElementParity } from '../../../e2e/fixtures/component-browser-harness.js';
import { tabsActivationModes, tabsOrientations, tabsSizes } from './contract.js';
import { Tabs, TabsList, TabsPanel, TabsTrigger } from './react.js';

const cases = tabsSizes.flatMap((size) =>
  tabsOrientations.flatMap((orientation) =>
    tabsActivationModes.map(
      (activationMode) => [size, orientation, activationMode] as const,
    ),
  ),
);

test.each(
  cases,
)('Tabs DOM/React parity for %s/%s/%s', async (size, orientation, activationMode) => {
  const raw = document.createElement('div');
  raw.className = 'tr-tabs';
  Object.assign(raw.dataset, {
    activationMode,
    orientation,
    size,
    trTabs: 'true',
    value: 'rack',
  });
  raw.innerHTML = `<div ${orientation === 'vertical' ? 'aria-orientation="vertical" ' : ''}class="tr-tabs-list" data-orientation="${orientation}" data-size="${size}" role="tablist"><button aria-selected="true" class="tr-tabs-trigger" data-active="true" data-value="rack" role="tab" tabindex="0" type="button">Rack</button></div><div class="tr-tabs-panel" data-active="true" data-value="rack" role="tabpanel" tabindex="0">Panel</div>`;
  document.body.append(raw);
  const rendered = await render(
    <Tabs
      activationMode={activationMode}
      defaultValue="rack"
      orientation={orientation}
      size={size}
    >
      <TabsList>
        <TabsTrigger value="rack">Rack</TabsTrigger>
      </TabsList>
      <TabsPanel value="rack">Panel</TabsPanel>
    </Tabs>,
  );
  const react = rendered.container.querySelector('.tr-tabs')!;
  expectElementParity(raw, react);
  expectElementParity(
    raw.querySelector('[role="tablist"]')!,
    react.querySelector('[role="tablist"]')!,
  );
  expectElementParity(
    raw.querySelector('[role="tab"]')!,
    react.querySelector('[role="tab"]')!,
    { ignoreAttributes: ['aria-controls', 'id'] },
  );
  expectElementParity(
    raw.querySelector('[role="tabpanel"]')!,
    react.querySelector('[role="tabpanel"]')!,
    { ignoreAttributes: ['aria-labelledby', 'id'] },
  );
  raw.remove();
});
