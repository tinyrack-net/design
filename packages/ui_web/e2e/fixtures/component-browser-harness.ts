import { expect } from 'vitest';

type RawElementOptions = {
  attributes?: Record<string, string | undefined>;
  className: string;
  data?: Record<string, string | undefined>;
  text?: string;
};

type ContractOptions = {
  ignoreAttributes?: string[];
  includeText?: boolean;
};

export function createRawElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  { attributes = {}, className, data = {}, text }: RawElementOptions,
) {
  const element = document.createElement(tagName);
  element.className = className;

  for (const [name, value] of Object.entries(attributes)) {
    if (value !== undefined) {
      element.setAttribute(name, value);
    }
  }
  for (const [name, value] of Object.entries(data)) {
    if (value !== undefined) {
      element.dataset[name] = value;
    }
  }
  if (text !== undefined) {
    element.textContent = text;
  }

  document.body.append(element);
  return element;
}

export function normalizedElementContract(
  element: Element,
  { ignoreAttributes = [], includeText = true }: ContractOptions = {},
) {
  const ignored = new Set(ignoreAttributes);
  const attributes = Object.fromEntries(
    Array.from(element.attributes)
      .filter(({ name }) => name !== 'class' && !ignored.has(name))
      .sort((left, right) => left.name.localeCompare(right.name))
      .map(({ name, value }) => [name, value]),
  );

  return {
    attributes,
    classes: Array.from(element.classList).sort(),
    role: element.getAttribute('role'),
    tagName: element.tagName.toLowerCase(),
    text: includeText ? element.textContent : undefined,
  };
}

export function expectElementParity(
  rawElement: Element,
  reactElement: Element,
  options?: ContractOptions,
) {
  expect(normalizedElementContract(reactElement, options)).toEqual(
    normalizedElementContract(rawElement, options),
  );
}

export function computedStyleValues(element: Element, properties: string[]) {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element);
  return Object.fromEntries(
    properties.map((property) => [property, style?.getPropertyValue(property) ?? '']),
  );
}

export function cleanupBrowserFixture() {
  document.body.replaceChildren();
}
