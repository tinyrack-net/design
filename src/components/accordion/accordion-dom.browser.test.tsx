import { afterEach, expect, test } from 'vitest';
import { accordionChangeEventName } from './contract.js';
import { createAccordionManager } from './dom.js';

afterEach(() => document.body.replaceChildren());

function markup({
  collapsible = true,
  type = 'single',
}: {
  collapsible?: boolean;
  type?: 'single' | 'multiple';
} = {}) {
  return `
    <div class="tr-accordion" data-tr-accordion data-type="${type}" data-collapsible="${collapsible}">
      <details class="tr-disclosure tr-accordion-item" data-tr-accordion-item data-value="network" open>
        <summary class="tr-disclosure-summary tr-accordion-summary" data-tr-accordion-summary>Network</summary>
        <div class="tr-disclosure-content tr-accordion-content">Online</div>
      </details>
      <details class="tr-disclosure tr-accordion-item" data-tr-accordion-item data-value="storage">
        <summary class="tr-disclosure-summary tr-accordion-summary" data-tr-accordion-summary>Storage</summary>
        <div class="tr-disclosure-content tr-accordion-content">Healthy</div>
      </details>
      <details class="tr-disclosure tr-accordion-item" data-tr-accordion-item data-value="backup">
        <summary class="tr-disclosure-summary tr-accordion-summary" data-tr-accordion-summary>Backup</summary>
        <div class="tr-disclosure-content tr-accordion-content">Ready</div>
      </details>
    </div>`;
}

function waitForAccordion() {
  return new Promise((resolve) =>
    setTimeout(() => requestAnimationFrame(() => resolve(undefined)), 0),
  );
}

function item(root: ParentNode, value: string) {
  const result = root.querySelector<HTMLDetailsElement>(
    `[data-tr-accordion-item][data-value="${value}"]`,
  );
  if (result === null) {
    throw new Error(`Unable to find Accordion item: ${value}`);
  }
  return result;
}

function summary(root: ParentNode, value: string) {
  const result = item(root, value).querySelector<HTMLElement>('summary');
  if (result === null) {
    throw new Error(`Unable to find Accordion summary: ${value}`);
  }
  return result;
}

function accordionRootIn(root: ParentNode) {
  const result = root.querySelector<HTMLElement>('[data-tr-accordion]');
  if (result === null) {
    throw new Error('Unable to find Accordion root.');
  }
  return result;
}

function content(root: ParentNode, value: string) {
  const result = item(root, value).querySelector<HTMLElement>('.tr-accordion-content');
  if (result === null) {
    throw new Error(`Unable to find Accordion content: ${value}`);
  }
  return result;
}

function pressKey(element: Element, key: string) {
  element.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key }),
  );
}

test('single Accordion keeps one item open and can collapse completely', async () => {
  const scope = document.createElement('section');
  scope.innerHTML = markup();
  document.body.append(scope);
  const manager = createAccordionManager(scope);
  const root = accordionRootIn(scope);
  const changes: Array<string | null> = [];
  let nativeToggles = 0;
  root.addEventListener(
    'toggle',
    () => {
      nativeToggles += 1;
    },
    true,
  );
  root.addEventListener(accordionChangeEventName, (event) => {
    const value = (event as CustomEvent<{ value: string | null }>).detail.value;
    changes.push(value);
  });

  summary(root, 'storage').click();
  await waitForAccordion();
  expect(nativeToggles).toBeGreaterThan(0);
  expect(item(root, 'network').open).toBe(false);
  expect(item(root, 'storage').open).toBe(true);
  expect(changes).toEqual(['storage']);

  summary(root, 'storage').click();
  await waitForAccordion();
  expect(item(root, 'storage').open).toBe(false);
  expect(changes).toEqual(['storage', null]);
  manager.destroy();
});

test('non-collapsible single Accordion prevents its active item from closing', async () => {
  const scope = document.createElement('section');
  scope.innerHTML = markup({ collapsible: false });
  document.body.append(scope);
  const manager = createAccordionManager(scope);
  const root = accordionRootIn(scope);
  let changes = 0;
  let nativeToggles = 0;
  root.addEventListener(
    'toggle',
    () => {
      nativeToggles += 1;
    },
    true,
  );
  root.addEventListener(accordionChangeEventName, () => {
    changes += 1;
  });

  await waitForAccordion();
  nativeToggles = 0;
  summary(root, 'network').click();
  await waitForAccordion();
  expect(item(root, 'network').open).toBe(true);
  expect(nativeToggles).toBe(0);
  expect(changes).toBe(0);

  expect(manager.setValue(null, root)).toBe(true);
  await waitForAccordion();
  expect(item(root, 'network').open).toBe(true);
  expect(nativeToggles).toBe(0);
  expect(changes).toBe(0);
  manager.destroy();
});

test('multiple Accordion preserves independent open items', async () => {
  const scope = document.createElement('section');
  scope.innerHTML = markup({ type: 'multiple' });
  document.body.append(scope);
  const manager = createAccordionManager(scope);
  const root = accordionRootIn(scope);
  const changes: string[][] = [];
  root.addEventListener(accordionChangeEventName, (event) => {
    changes.push((event as CustomEvent<{ value: string[] }>).detail.value);
  });

  summary(root, 'storage').click();
  await waitForAccordion();
  expect(item(root, 'network').open).toBe(true);
  expect(item(root, 'storage').open).toBe(true);
  expect(changes).toEqual([['network', 'storage']]);

  summary(root, 'network').click();
  await waitForAccordion();
  expect(item(root, 'network').open).toBe(false);
  expect(item(root, 'storage').open).toBe(true);
  expect(changes.at(-1)).toEqual(['storage']);
  manager.destroy();
});

test('Accordion keyboard navigation wraps and supports Home and End', () => {
  const scope = document.createElement('section');
  scope.innerHTML = markup();
  document.body.append(scope);
  const manager = createAccordionManager(scope);
  const root = accordionRootIn(scope);
  const network = summary(root, 'network');
  const storage = summary(root, 'storage');
  const backup = summary(root, 'backup');

  network.focus();
  pressKey(network, 'ArrowDown');
  expect(document.activeElement).toBe(storage);
  pressKey(storage, 'End');
  expect(document.activeElement).toBe(backup);
  pressKey(backup, 'ArrowDown');
  expect(document.activeElement).toBe(network);
  pressKey(network, 'ArrowUp');
  expect(document.activeElement).toBe(backup);
  pressKey(backup, 'Home');
  expect(document.activeElement).toBe(network);
  manager.destroy();
});

test('Accordion isolates nested groups and survives DOM replacement', async () => {
  const scope = document.createElement('section');
  scope.innerHTML = markup();
  document.body.append(scope);
  const manager = createAccordionManager(scope);
  const outer = accordionRootIn(scope);
  const nestedHost = content(outer, 'network');
  nestedHost.innerHTML = markup({ type: 'multiple' });
  await waitForAccordion();
  const nested = accordionRootIn(nestedHost);
  const nestedNetwork = summary(nested, 'network');
  nestedNetwork.focus();
  pressKey(nestedNetwork, 'ArrowDown');
  expect(document.activeElement).toBe(summary(nested, 'storage'));

  scope.innerHTML = markup().replaceAll('network', 'compute');
  await waitForAccordion();
  const replacement = accordionRootIn(scope);
  summary(replacement, 'storage').click();
  await waitForAccordion();
  expect(item(replacement, 'storage').open).toBe(true);
  expect(item(replacement, 'compute').open).toBe(false);
  manager.destroy();
});

test('Accordion manager exposes programmatic state and deterministic destroy', async () => {
  const scope = document.createElement('section');
  scope.innerHTML = markup();
  document.body.append(scope);
  const manager = createAccordionManager(scope);
  const root = accordionRootIn(scope);
  let changes = 0;
  root.addEventListener(accordionChangeEventName, () => {
    changes += 1;
  });

  expect(manager.setValue('backup', root)).toBe(true);
  expect(item(root, 'backup').open).toBe(true);
  expect(item(root, 'network').open).toBe(false);
  expect(changes).toBe(1);

  manager.destroy();
  const backup = summary(root, 'backup');
  const storage = summary(root, 'storage');
  backup.focus();
  pressKey(backup, 'ArrowUp');
  expect(document.activeElement).toBe(backup);
  storage.click();
  await waitForAccordion();
  expect(changes).toBe(1);
});

test('document manager synchronizes Accordion roots added by body replacement', async () => {
  const manager = createAccordionManager(document);
  const nextBody = document.createElement('body');
  nextBody.innerHTML = markup({ collapsible: false }).replace(' open', '');
  document.body.replaceWith(nextBody);
  await waitForAccordion();

  const root = accordionRootIn(document);
  expect(item(root, 'network').open).toBe(true);
  summary(root, 'storage').click();
  await waitForAccordion();
  expect(item(root, 'network').open).toBe(false);
  expect(item(root, 'storage').open).toBe(true);
  manager.destroy();
});

test('Accordion manager normalizes root-scoped and invalid programmatic values', () => {
  const scope = document.createElement('section');
  scope.innerHTML = markup();
  document.body.append(scope);
  const root = accordionRootIn(scope);
  const manager = createAccordionManager(root);

  manager.sync();
  expect(manager.setValue([], root)).toBe(true);
  expect(item(root, 'network').open).toBe(false);
  expect(manager.setValue('network')).toBe(true);
  expect(manager.setValue('network')).toBe(true);
  expect(manager.setValue('network', document.createElement('div'))).toBe(false);
  manager.sync(document.createElement('div'));
  manager.destroy();

  const scopedManager = createAccordionManager(scope);
  expect(scopedManager.setValue('storage')).toBe(true);
  expect(item(root, 'storage').open).toBe(true);
  scopedManager.destroy();

  const multipleScope = document.createElement('section');
  multipleScope.innerHTML = markup({ type: 'multiple' });
  document.body.append(multipleScope);
  const multipleRoot = accordionRootIn(multipleScope);
  const multipleManager = createAccordionManager(multipleRoot);
  expect(multipleManager.setValue(null)).toBe(true);
  expect(multipleRoot.dataset['values']).toBe('[]');
  expect(multipleManager.setValue(['network', 'storage'])).toBe(true);
  expect(item(multipleRoot, 'network').open).toBe(true);
  expect(item(multipleRoot, 'storage').open).toBe(true);
  multipleManager.destroy();

  const emptyRequiredRoot = document.createElement('div');
  emptyRequiredRoot.dataset['collapsible'] = 'false';
  emptyRequiredRoot.dataset['trAccordion'] = 'true';
  emptyRequiredRoot.dataset['type'] = 'single';
  document.body.append(emptyRequiredRoot);
  const emptyRequiredManager = createAccordionManager(emptyRequiredRoot);
  expect(emptyRequiredManager.setValue(null)).toBe(true);
  emptyRequiredManager.destroy();
});

test('Accordion manager resolves competing open items and required fallbacks', async () => {
  const scope = document.createElement('section');
  scope.innerHTML = markup();
  document.body.append(scope);
  const root = accordionRootIn(scope);
  const manager = createAccordionManager(root);

  item(root, 'storage').open = true;
  manager.sync(root);
  expect(item(root, 'network').open).toBe(false);
  expect(item(root, 'storage').open).toBe(true);

  manager.setValue(null, root);
  item(root, 'network').open = true;
  item(root, 'storage').open = true;
  item(root, 'storage').dispatchEvent(new Event('toggle'));
  await waitForAccordion();
  expect(item(root, 'network').open).toBe(false);
  expect(item(root, 'storage').open).toBe(true);
  manager.destroy();

  const fallbackScope = document.createElement('section');
  fallbackScope.innerHTML = markup().replace(' open', '');
  document.body.append(fallbackScope);
  const fallbackRoot = accordionRootIn(fallbackScope);
  const fallbackManager = createAccordionManager(fallbackRoot);
  item(fallbackRoot, 'network').open = true;
  item(fallbackRoot, 'storage').open = true;
  fallbackManager.sync(fallbackRoot);
  expect(
    Array.from(fallbackRoot.querySelectorAll<HTMLDetailsElement>('details')).filter(
      (candidate) => candidate.open,
    ),
  ).toHaveLength(1);
  fallbackManager.destroy();

  const requiredScope = document.createElement('section');
  requiredScope.innerHTML = markup({ collapsible: false });
  document.body.append(requiredScope);
  const requiredRoot = accordionRootIn(requiredScope);
  const requiredManager = createAccordionManager(requiredRoot);
  item(requiredRoot, 'network').remove();
  item(requiredRoot, 'storage').open = false;
  item(requiredRoot, 'backup').open = false;
  requiredManager.sync(requiredRoot);
  expect(item(requiredRoot, 'storage').open).toBe(true);

  item(requiredRoot, 'storage').open = false;
  expect(requiredManager.setValue(null, requiredRoot)).toBe(true);
  expect(item(requiredRoot, 'storage').open).toBe(true);
  requiredManager.destroy();
});

test('Accordion manager guards unrelated events and pending work', async () => {
  const scope = document.createElement('section');
  scope.innerHTML = markup();
  document.body.append(scope);
  const root = accordionRootIn(scope);
  const manager = createAccordionManager(root);

  root.dispatchEvent(new Event('toggle'));
  const unmarkedDetails = document.createElement('details');
  root.append(unmarkedDetails);
  unmarkedDetails.dispatchEvent(new Event('toggle'));
  root.dispatchEvent(new Event('click', { bubbles: true }));
  root.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
  root.dispatchEvent(new Event('keydown', { bubbles: true }));
  root.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
  root.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'ArrowDown' }),
  );

  const malformed = document.createElement('div');
  malformed.innerHTML = '<summary data-tr-accordion-summary>Malformed</summary>';
  root.append(malformed);
  const malformedSummary = malformed.querySelector('summary')!;
  malformedSummary.click();
  pressKey(malformedSummary, 'ArrowDown');

  item(root, 'network').dispatchEvent(new Event('toggle'));
  item(root, 'storage').dispatchEvent(new Event('toggle'));
  manager.destroy();
  await waitForAccordion();

  const documentManager = createAccordionManager(document);
  const outsideItem = document.createElement('details');
  outsideItem.dataset['trAccordionItem'] = 'true';
  document.body.append(outsideItem);
  outsideItem.dispatchEvent(new Event('toggle'));
  document.dispatchEvent(new Event('click'));
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  document.body.append(document.createTextNode('mutation'));
  await waitForAccordion();
  documentManager.destroy();
});

test('controlled multiple Accordion recovers malformed serialized values', async () => {
  const scope = document.createElement('section');
  scope.innerHTML = markup({ type: 'multiple' });
  document.body.append(scope);
  const root = accordionRootIn(scope);
  root.dataset['controlled'] = 'true';
  const manager = createAccordionManager(root);

  root.dataset['values'] = '{';
  item(root, 'storage').open = true;
  item(root, 'storage').dispatchEvent(new Event('toggle'));
  await waitForAccordion();
  expect(item(root, 'network').open).toBe(false);
  expect(item(root, 'storage').open).toBe(false);

  delete root.dataset['values'];
  item(root, 'network').open = true;
  item(root, 'network').dispatchEvent(new Event('toggle'));
  await waitForAccordion();
  expect(item(root, 'network').open).toBe(false);

  root.dataset['values'] = '"network"';
  item(root, 'network').open = true;
  item(root, 'network').dispatchEvent(new Event('toggle'));
  await waitForAccordion();
  expect(item(root, 'network').open).toBe(false);

  root.dataset['values'] = '["network",1]';
  item(root, 'network').open = true;
  item(root, 'network').dispatchEvent(new Event('toggle'));
  await waitForAccordion();
  expect(item(root, 'network').open).toBe(true);
  manager.destroy();
});
