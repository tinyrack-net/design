import '../../core/core.css';
import './language-select.css';
import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { LanguageSelect } from './index.js';

const options = [
  { label: 'English', language: 'en', value: 'en' },
  { label: '한국어', language: 'ko', value: 'ko' },
];

test('is fully controlled and selects a localized option with the keyboard', async () => {
  function Fixture() {
    const [value, setValue] = useState('en');
    return <LanguageSelect onValueChange={setValue} options={options} value={value} />;
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
    <LanguageSelect
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
    <LanguageSelect onValueChange={vi.fn()} options={options} uiSize="sm" value="en" />,
  );
  expect(document.querySelector('.tr-language-select-trigger')).toHaveAttribute(
    'data-ui-size',
    'sm',
  );
});

test('keeps selected and unselected option text aligned', async () => {
  await render(<LanguageSelect onValueChange={vi.fn()} options={options} value="en" />);
  await page.getByRole('combobox', { name: 'Language' }).click();

  const optionTextLefts = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-select-item-text'),
  ).map((element) => element.getBoundingClientRect().left);

  expect(optionTextLefts).toHaveLength(2);
  expect(Math.abs((optionTextLefts[0] ?? 0) - (optionTextLefts[1] ?? 0))).toBeLessThan(
    0.5,
  );
});
