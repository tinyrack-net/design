import '../../core/core.css';
import './form.css';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  formControlSizes,
  formMessageVariants,
  radioGroupAppearances,
  radioGroupOrientations,
} from './contract.js';
import {
  Checkbox,
  Field,
  FieldDescription,
  FormMessage,
  Input,
  InputAdornment,
  InputGroup,
  Label,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Textarea,
} from './react.js';

test.each(
  formControlSizes,
)('React form controls support size %s and invalid state', async (size) => {
  const ref = createRef<HTMLInputElement>();
  const screen = await render(
    <Field className="consumer" size={size}>
      <Label htmlFor="name">Name</Label>
      <Input
        aria-invalid="grammar"
        className="consumer-input"
        id="name"
        invalid
        ref={ref}
        required
        size={size}
      />
      <Textarea
        autosize
        invalid
        maxRows={5}
        minRows={2}
        size={size}
        style={{ minHeight: '2rem' }}
      />
      <Select aria-label="Role" invalid size={size}>
        <option>Admin</option>
      </Select>
      <Checkbox invalid size={size}>
        Enabled
      </Checkbox>
      <Radio invalid name="role" size={size}>
        Owner
      </Radio>
      <Switch invalid size={size}>
        Live
      </Switch>
      <FieldDescription>Description</FieldDescription>
    </Field>,
  );
  expect(ref.current).toHaveAttribute('aria-invalid', 'true');
  expect(ref.current).toHaveAttribute('required');
  expect(screen.container.querySelector('textarea')).toHaveAttribute('rows', '2');
  expect(screen.container.querySelector('textarea')?.style.maxHeight).toBe('5lh');
  expect(screen.getByLabelText('Role').element()).toHaveAttribute('data-size', size);
  expect(screen.getByText('Enabled').element().parentElement).toHaveAttribute(
    'data-invalid',
    'true',
  );
});

test.each(
  radioGroupAppearances.flatMap((appearance) =>
    radioGroupOrientations.map((orientation) => [appearance, orientation] as const),
  ),
)('React RadioGroup supports %s/%s', async (appearance, orientation) => {
  const screen = await render(
    <RadioGroup appearance={appearance} aria-label="Mode" orientation={orientation} />,
  );
  const group = screen.getByRole('group').element();
  expect(group).toHaveAttribute('data-appearance', appearance);
  expect(group).toHaveAttribute('data-orientation', orientation);
});

test.each(formMessageVariants)('React FormMessage supports %s', async (variant) => {
  const screen = await render(<FormMessage variant={variant}>Message</FormMessage>);
  expect(screen.getByText('Message').element()).toHaveAttribute(
    'data-variant',
    variant,
  );
});

test('React form helpers cover optional branches and native changes', async () => {
  const onChange = vi.fn();
  function ControlledSwitch() {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        checked={checked}
        onChange={(event) => {
          onChange(event);
          setChecked(event.currentTarget.checked);
        }}
      >
        Controlled
      </Switch>
    );
  }
  const screen = await render(
    <>
      <Input aria-label="Optional" />
      <Textarea aria-label="Rows" rows={4} style={{ maxHeight: '20rem' }} />
      <Checkbox aria-label="Bare" />
      <Radio aria-label="Bare radio" />
      <Switch aria-label="Default switch" defaultChecked />
      <ControlledSwitch />
      <InputGroup invalid size="lg">
        <InputAdornment>https://</InputAdornment>
        <InputAdornment position="end">.net</InputAdornment>
      </InputGroup>
    </>,
  );
  expect(screen.getByLabelText('Rows').element()).toHaveAttribute('rows', '4');
  expect(screen.getByLabelText('Default switch').element()).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await screen.getByText('Controlled').click();
  expect(onChange).toHaveBeenCalledOnce();
  expect(
    screen.getByText('Controlled').element().parentElement?.querySelector('input'),
  ).toHaveAttribute('aria-checked', 'true');
  expect(screen.getByText('.net').element()).toHaveAttribute('data-position', 'end');
});
