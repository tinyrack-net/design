import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  type FormControlSize,
  formControlSizes,
} from '../../src/components/form/contract.js';
import { Switch } from '../../src/components/form/react.js';

type ComponentStoryProps = {
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  label: string;
  size: FormControlSize;
};

function SwitchStory({ checked, disabled, invalid, label, size }: ComponentStoryProps) {
  return (
    <Switch
      defaultChecked={checked}
      disabled={disabled}
      invalid={invalid}
      key={String(checked)}
      size={size}
    >
      {label}
    </Switch>
  );
}

SwitchStory.displayName = 'SwitchStory';

const meta = {
  title: 'Components/Form/Switch',
  component: SwitchStory,
  args: {
    checked: true,
    disabled: false,
    invalid: false,
    label: 'Auto deploy',
    size: 'md',
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Switch checked state.',
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
      description: 'Visible switch label.',
    },
    size: {
      control: 'select',
      options: formControlSizes,
      description: 'Switch size.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Native checkbox rendered as an ARIA switch.',
      },
    },
  },
} satisfies Meta<typeof SwitchStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
