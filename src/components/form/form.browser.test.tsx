import '../../core/core.css';
import './form.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  Checkbox,
  Field,
  FormMessage,
  Input,
  Label,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Textarea,
} from './react.js';

const themeDatasetKey = 'theme';

test('Form primitives render native fields with size and invalid state', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(
    <Field size="lg">
      <Label htmlFor="rack-name">Rack</Label>
      <Input id="rack-name" invalid placeholder="rack-a-01" />
      <Textarea aria-label="Notes" size="sm" />
      <Select aria-label="Region" size="sm" defaultValue="seoul">
        <option value="seoul">Seoul</option>
      </Select>
      <FormMessage variant="error">Required</FormMessage>
    </Field>,
  );

  const input = document.querySelector<HTMLInputElement>('.tr-input');
  const textarea = document.querySelector<HTMLTextAreaElement>('.tr-textarea');
  const select = document.querySelector<HTMLSelectElement>('.tr-select');
  const message = document.querySelector<HTMLParagraphElement>('.tr-form-message');

  if (!input || !textarea || !select || !message) {
    throw new Error('Unable to find form primitives.');
  }

  await expect.element(input).toHaveAttribute('aria-invalid', 'true');
  await expect.element(input).toHaveAttribute('data-size', 'md');
  await expect.element(textarea).toHaveAttribute('data-size', 'sm');
  await expect.element(select).toHaveAttribute('data-size', 'sm');
  await expect.element(message).toHaveAttribute('data-variant', 'error');

  expect(getComputedStyle(input).height).toBe('40px');
  expect(getComputedStyle(textarea).fontSize).toBe('14px');
});

test('Choice primitives keep native input semantics', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-light';
  await render(
    <div>
      <Checkbox defaultChecked name="monitoring">
        Monitoring
      </Checkbox>
      <RadioGroup aria-label="Region" orientation="horizontal">
        <Radio defaultChecked name="region" value="seoul">
          Seoul
        </Radio>
      </RadioGroup>
      <Switch defaultChecked name="enabled">
        Enabled
      </Switch>
    </div>,
  );

  const checkbox = document.querySelector<HTMLInputElement>('.tr-checkbox-input');
  const radioGroup = document.querySelector<HTMLFieldSetElement>('.tr-radio-group');
  const radio = document.querySelector<HTMLInputElement>('.tr-radio-input');
  const switchInput = document.querySelector<HTMLInputElement>('.tr-switch-input');

  if (!checkbox || !radioGroup || !radio || !switchInput) {
    throw new Error('Unable to find choice primitives.');
  }

  expect(checkbox.checked).toBe(true);
  expect(radio.checked).toBe(true);
  expect(switchInput.checked).toBe(true);
  await expect.element(switchInput).toHaveAttribute('role', 'switch');
  await expect.element(radioGroup).toHaveAttribute('data-orientation', 'horizontal');

  const switchTrack = document.querySelector<HTMLElement>('.tr-switch-track');

  if (!switchTrack) {
    throw new Error('Unable to find switch track.');
  }

  expect(getComputedStyle(switchTrack).width).toBe('36px');
});
