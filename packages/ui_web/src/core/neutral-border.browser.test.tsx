import '../components/accordion/accordion.css';
import '../components/card/card.css';
import '../components/checkbox/checkbox.css';
import '../components/field/field.css';
import '../components/input/input.css';
import '../components/meter/meter.css';
import '../components/pagination/pagination.css';
import '../components/radio/radio.css';
import '../components/select/select.css';
import '../components/separator/separator.css';
import '../components/table/table.css';
import '../components/tabs/tabs.css';
import '../components/textarea/textarea.css';
import './core.css';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
});

function borderColor(testId: string, side: 'top' | 'bottom' = 'top') {
  const styles = getComputedStyle(
    document.querySelector(`[data-testid="${testId}"]`) as Element,
  );
  return side === 'top' ? styles.borderTopColor : styles.borderBottomColor;
}

function expectBorderColor(
  testId: string,
  expected = 'rgb(38, 38, 38)',
  side: 'top' | 'bottom' = 'top',
) {
  expect(borderColor(testId, side)).toBe(expected);
}

test('dark resting boundaries stay subtle and interaction borders strengthen', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-dark';
  const screen = await render(
    <div>
      <article className="tr-card" data-testid="card" />
      <div className="tr-table-container" data-testid="table" />
      <div className="tr-tabs-list" data-testid="tabs" />
      <input className="tr-input" data-testid="input" />
      <div className="tr-input-group" data-testid="input-group">
        <input className="tr-input-group-input" />
      </div>
      <input className="tr-field-control" data-testid="field" />
      <textarea className="tr-textarea" data-testid="textarea" />
      <button className="tr-select-trigger" data-testid="select" type="button" />
      <button className="tr-checkbox" data-testid="checkbox" type="button" />
      <button className="tr-radio" data-testid="radio" type="button" />
      <div className="tr-accordion" data-testid="accordion" />
      <button className="tr-pagination-page" data-testid="pagination" type="button" />
      <div
        className="tr-separator"
        data-orientation="horizontal"
        data-testid="separator"
      />
      <div className="tr-meter-track" data-testid="track" />
    </div>,
  );

  for (const testId of [
    'card',
    'table',
    'input',
    'input-group',
    'field',
    'textarea',
    'select',
    'checkbox',
    'radio',
    'accordion',
    'pagination',
  ]) {
    expectBorderColor(testId);
  }
  expectBorderColor('tabs', 'rgb(38, 38, 38)', 'bottom');
  expect(
    getComputedStyle(document.querySelector('[data-testid="separator"]') as Element)
      .backgroundColor,
  ).toBe('rgb(38, 38, 38)');
  expect(
    getComputedStyle(document.querySelector('[data-testid="track"]') as Element)
      .backgroundColor,
  ).toBe('rgb(38, 38, 38)');

  for (const testId of ['input', 'input-group', 'field', 'textarea', 'pagination']) {
    await screen.getByTestId(testId).hover();
    await expect.poll(() => borderColor(testId)).toBe('rgb(64, 64, 64)');
  }
});

test('light neutral boundaries and dark semantic indicators stay unchanged', () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  let styles = getComputedStyle(document.documentElement);
  expect(styles.getPropertyValue('--tinyrack-border').trim()).toBe('#737373');
  expect(styles.getPropertyValue('--tinyrack-border-strong').trim()).toBe('#525252');
  expect(styles.getPropertyValue('--tinyrack-control-border').trim()).toBe('#737373');
  expect(styles.getPropertyValue('--tinyrack-control-track').trim()).toBe('#737373');

  document.documentElement.dataset['theme'] = 'tinyrack-dark';
  styles = getComputedStyle(document.documentElement);
  expect(styles.getPropertyValue('--tinyrack-border-strong').trim()).toBe('#404040');
  expect(styles.getPropertyValue('--tinyrack-border-inverse').trim()).toBe('#737373');
  expect(styles.getPropertyValue('--tinyrack-focus').trim()).toBe('#60a5fa');
  expect(styles.getPropertyValue('--tinyrack-info-border').trim()).toBe('#60a5fa');
  expect(styles.getPropertyValue('--tinyrack-success-border').trim()).toBe('#4ade80');
  expect(styles.getPropertyValue('--tinyrack-warning-border').trim()).toBe('#fbbf24');
  expect(styles.getPropertyValue('--tinyrack-danger-border').trim()).toBe('#f87171');
});
