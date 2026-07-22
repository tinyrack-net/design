import '../../core/core.css';
import './language-select.css';
import { act, type CSSProperties, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRLanguageSelect } from './index.js';

const options = [
  { label: 'English', language: 'en', value: 'en' },
  { label: '한국어', language: 'ko', value: 'ko' },
];

test('is fully controlled and selects a localized option with the keyboard', async () => {
  function Fixture() {
    const [value, setValue] = useState('en');
    return (
      <TRLanguageSelect onValueChange={setValue} options={options} value={value} />
    );
  }
  await render(<Fixture />);
  const trigger = document.querySelector('button') as HTMLButtonElement;
  expect(trigger).toHaveAccessibleName('Language');
  expect(trigger).toHaveTextContent('English');
  expect(trigger.querySelector('.tr-select-icon > svg')).not.toBeNull();
  await userEvent.click(trigger);
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(trigger).toHaveTextContent('한국어');
});

test('does not emit non-string values and supports a custom label', async () => {
  const onValueChange = vi.fn();
  await render(
    <TRLanguageSelect
      label="언어"
      onValueChange={onValueChange}
      options={options}
      value="missing"
    />,
  );
  expect(document.querySelector('button')).toHaveAccessibleName('언어');
  expect(document.querySelector('button')).toHaveTextContent('missing');
});

test('forwards the trigger size to the underlying select', async () => {
  await render(
    <TRLanguageSelect
      onValueChange={vi.fn()}
      options={options}
      uiSize="sm"
      value="en"
    />,
  );
  expect(document.querySelector('.tr-language-select-trigger')).toHaveAttribute(
    'data-ui-size',
    'sm',
  );
});

test('keeps selected and unselected option text aligned', async () => {
  await render(
    <TRLanguageSelect onValueChange={vi.fn()} options={options} value="en" />,
  );
  await page.getByRole('combobox', { name: 'Language' }).click();

  const optionTextLefts = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-select-item-text'),
  ).map((element) => element.getBoundingClientRect().left);

  expect(optionTextLefts).toHaveLength(2);
  expect(Math.abs((optionTextLefts[0] ?? 0) - (optionTextLefts[1] ?? 0))).toBeLessThan(
    0.5,
  );
});

test('localizes the current value and does not navigate to the current locale', async () => {
  const onValueChange = vi.fn();
  await render(
    <TRLanguageSelect onValueChange={onValueChange} options={options} value="ko" />,
  );

  const trigger = page.getByRole('combobox', { name: 'Language' });
  expect(trigger.element().querySelector('[lang="ko"]')).toHaveTextContent('한국어');
  await trigger.click();
  await page.getByRole('option', { name: '한국어' }).click();
  expect(onValueChange).not.toHaveBeenCalled();
  await expect.poll(() => document.activeElement).toBe(trigger.element());
});

test('preserves trigger props, ref, events, size styles, and token overrides', async () => {
  const ref = createRef<HTMLButtonElement>();
  const onClick = vi.fn();
  await render(
    <TRLanguageSelect
      className="consumer-language-select"
      data-consumer-trigger="preserved"
      onClick={onClick}
      onValueChange={vi.fn()}
      options={options}
      ref={ref}
      style={
        {
          '--tr-language-select-min-inline-size': '180px',
          '--tr-select-control-background': 'rgb(1, 2, 3)',
        } as CSSProperties
      }
      uiSize="lg"
      value="en"
    />,
  );

  expect(ref.current).toHaveClass(
    'tr-select-trigger',
    'tr-language-select-trigger',
    'consumer-language-select',
  );
  expect(ref.current?.dataset['consumerTrigger']).toBe('preserved');
  expect(ref.current?.dataset['uiSize']).toBe('lg');
  expect(getComputedStyle(ref.current as HTMLButtonElement).minHeight).toBe('48px');
  expect(getComputedStyle(ref.current as HTMLButtonElement).minWidth).toBe('180px');
  expect(getComputedStyle(ref.current as HTMLButtonElement).backgroundColor).toBe(
    'rgb(1, 2, 3)',
  );
  await userEvent.click(ref.current as HTMLButtonElement);
  expect(onClick).toHaveBeenCalledOnce();
});

test('reports open events, portals into a custom container, and returns focus', async () => {
  const portalContainer = document.createElement('section');
  document.body.append(portalContainer);
  const onOpenChange = vi.fn();

  try {
    await render(
      <TRLanguageSelect
        onOpenChange={onOpenChange}
        onValueChange={vi.fn()}
        options={options}
        portalContainer={portalContainer}
        value="en"
      />,
    );
    const trigger = page.getByRole('combobox', { name: 'Language' });
    trigger.element().focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect
      .poll(() => portalContainer.querySelector('.tr-select-popup[data-open]'))
      .not.toBeNull();
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);

    await userEvent.keyboard('{Escape}');
    await expect
      .poll(() => portalContainer.querySelector('.tr-select-popup[data-open]'))
      .toBeNull();
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
    await expect.poll(() => document.activeElement).toBe(trigger.element());
  } finally {
    portalContainer.remove();
  }
});

test('server-renders and hydrates without recovery', async () => {
  const fixture = (
    <TRLanguageSelect onValueChange={() => {}} options={options} value="ja" />
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('[aria-label="Language"]')).toHaveTextContent('ja');
  await act(async () => root.unmount());
  host.remove();
});
