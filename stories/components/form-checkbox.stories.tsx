import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  type FormControlSize,
  formControlSizes,
} from '../../src/components/form/contract.js';
import { Checkbox } from '../../src/components/form/react.js';

type ComponentStoryProps = {
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  label: string;
  size: FormControlSize;
};

function CheckboxStory({
  checked,
  disabled,
  invalid,
  label,
  size,
}: ComponentStoryProps) {
  return (
    <Checkbox
      defaultChecked={checked}
      disabled={disabled}
      invalid={invalid}
      key={String(checked)}
      size={size}
    >
      {label}
    </Checkbox>
  );
}

CheckboxStory.displayName = 'CheckboxStory';

const meta = {
  title: 'Components/Form/Checkbox',
  component: CheckboxStory,
  args: {
    checked: true,
    disabled: false,
    invalid: false,
    label: 'Monitoring enabled',
    size: 'md',
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Native checked state.',
    },
    disabled: {
      control: 'boolean',
      description: 'Native disabled state.',
    },
    invalid: {
      control: 'boolean',
      description: 'Invalid state mapped to aria-invalid and data-invalid.',
    },
    label: {
      control: 'text',
      description: 'Visible checkbox label.',
    },
    size: {
      control: 'select',
      options: formControlSizes,
      description: 'Checkbox size.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Native checkbox with Tinyrack choice control styling.',
      },
    },
  },
} satisfies Meta<typeof CheckboxStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
