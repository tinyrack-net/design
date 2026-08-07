import { beforeEach, expect, test } from 'vitest';
import {
  getTinyrackFocusModality,
  setupTinyrackFocusModality,
  TINYRACK_FOCUS_MODALITY_ATTRIBUTE,
} from './focus-modality-provider.js';

type Listener = (event: unknown) => void;

function createDocument() {
  const documentListeners = new Map<string, Set<Listener>>();
  const viewListeners = new Map<string, Set<Listener>>();
  const attributes = new Map<string, string>();

  const add =
    (map: Map<string, Set<Listener>>) => (type: string, listener: Listener) => {
      const set = map.get(type) ?? new Set<Listener>();
      set.add(listener);
      map.set(type, set);
    };
  const remove =
    (map: Map<string, Set<Listener>>) => (type: string, listener: Listener) => {
      map.get(type)?.delete(listener);
    };

  const documentObject = {
    addEventListener: add(documentListeners),
    removeEventListener: remove(documentListeners),
    documentElement: {
      setAttribute: (name: string, value: string) => attributes.set(name, value),
      removeAttribute: (name: string) => attributes.delete(name),
      getAttribute: (name: string) => attributes.get(name) ?? null,
    },
    defaultView: {
      addEventListener: add(viewListeners),
      removeEventListener: remove(viewListeners),
    },
  } as unknown as Document;

  const dispatch = (
    map: Map<string, Set<Listener>>,
    type: string,
    event: unknown = {},
  ) => {
    for (const listener of map.get(type) ?? []) listener(event);
  };

  return {
    documentObject,
    attributes,
    listenerCount: () =>
      [...documentListeners.values()].reduce((total, set) => total + set.size, 0) +
      [...viewListeners.values()].reduce((total, set) => total + set.size, 0),
    fire: (type: string, event: unknown = {}) =>
      dispatch(documentListeners, type, event),
    fireOnView: (type: string) => dispatch(viewListeners, type),
  };
}

let harness: ReturnType<typeof createDocument>;

beforeEach(() => {
  harness = createDocument();
});

const modality = () =>
  harness.documentObject.documentElement.getAttribute(
    TINYRACK_FOCUS_MODALITY_ATTRIBUTE,
  );

test('publishes keyboard modality until a pointer gesture proves otherwise', () => {
  setupTinyrackFocusModality(harness.documentObject);

  harness.fire('focusin');
  expect(modality()).toBe('keyboard');
});

test('samples the modality when focus moves, not when keys are pressed', () => {
  setupTinyrackFocusModality(harness.documentObject);

  harness.fire('pointerdown');
  harness.fire('focusin');
  expect(modality()).toBe('pointer');

  // Typing into a field that was clicked must not pop the ring mid-sentence.
  harness.fire('keydown', { key: 'a' });
  expect(modality()).toBe('pointer');

  // The next focus move picks the keyboard up.
  harness.fire('focusin');
  expect(modality()).toBe('keyboard');
});

test('ignores modifier combos, which are shortcuts rather than navigation', () => {
  setupTinyrackFocusModality(harness.documentObject);

  harness.fire('pointerdown');
  harness.fire('keydown', { key: 'l', metaKey: true });
  harness.fire('focusin');
  expect(modality()).toBe('pointer');
});

test.each(['mousedown', 'touchstart'])('treats %s as a pointer gesture', (type) => {
  setupTinyrackFocusModality(harness.documentObject);

  harness.fire(type);
  harness.fire('focusin');
  expect(modality()).toBe('pointer');
});

test('resets to keyboard when the window loses focus', () => {
  setupTinyrackFocusModality(harness.documentObject);

  harness.fire('pointerdown');
  harness.fireOnView('blur');
  harness.fire('focusin');
  expect(modality()).toBe('keyboard');
});

test('installs one set of listeners per document and tears down on the last release', () => {
  const releaseFirst = setupTinyrackFocusModality(harness.documentObject);
  const installed = harness.listenerCount();
  expect(installed).toBeGreaterThan(0);

  const releaseSecond = setupTinyrackFocusModality(harness.documentObject);
  expect(harness.listenerCount()).toBe(installed);

  harness.fire('focusin');
  releaseFirst();
  expect(harness.listenerCount()).toBe(installed);
  expect(modality()).toBe('keyboard');

  releaseSecond();
  expect(harness.listenerCount()).toBe(0);
  expect(modality()).toBeNull();
});

test('releasing more times than it was set up is a no-op', () => {
  const release = setupTinyrackFocusModality(harness.documentObject);
  release();
  expect(() => release()).not.toThrow();
  expect(harness.listenerCount()).toBe(0);
});

test('reads back only the two known modality values', () => {
  setupTinyrackFocusModality(harness.documentObject);
  expect(getTinyrackFocusModality(harness.documentObject)).toBeUndefined();

  harness.fire('focusin');
  expect(getTinyrackFocusModality(harness.documentObject)).toBe('keyboard');

  harness.documentObject.documentElement.setAttribute(
    TINYRACK_FOCUS_MODALITY_ATTRIBUTE,
    'nonsense',
  );
  expect(getTinyrackFocusModality(harness.documentObject)).toBeUndefined();
});
