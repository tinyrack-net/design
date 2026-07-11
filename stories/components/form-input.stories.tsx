import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  type FormControlSize,
  formControlSizes,
} from '../../src/components/form/contract.js';
import { Field, FormMessage, Input, Label } from '../../src/components/form/react.js';

const inputTypes = [
  'text',
  'email',
  'password',
  'search',
  'url',
  'tel',
  'number',
  'date',
  'time',
] as const;

type NativeInputType = (typeof inputTypes)[number];

type ComponentStoryProps = {
  disabled: boolean;
  invalid: boolean;
  size: FormControlSize;
  type: NativeInputType;
};

function inputExample(type: NativeInputType) {
  switch (type) {
    case 'email':
      return {
        label: 'Owner email',
        placeholder: 'ops@example.com',
        value: 'ops@example.com',
      };
    case 'password':
      return {
        label: 'Access key',
        placeholder: 'Enter access key',
        value: 'rack-secret',
      };
    case 'search':
      return { label: 'Search racks', placeholder: 'rack-a', value: 'rack-a' };
    case 'url':
      return {
        label: 'Endpoint URL',
        placeholder: 'https://rack.example.com',
        value: 'https://rack.example.com',
      };
    case 'tel':
      return { label: 'Owner phone', placeholder: '+82 10 0000 0000', value: '' };
    case 'number':
      return { label: 'Rack units', placeholder: '42', value: '42' };
    case 'date':
      return { label: 'Install date', placeholder: '', value: '2026-07-09' };
    case 'time':
      return { label: 'Maintenance time', placeholder: '', value: '09:30' };
    default:
      return { label: 'Rack name', placeholder: 'rack-a-01', value: 'rack-a-01' };
  }
}

function InputStory({ disabled, invalid, size, type }: ComponentStoryProps) {
  const example = inputExample(type);
  const fieldId = `input-${type}`;

  return (
    <Field size={size}>
      <Label htmlFor={fieldId}>{example.label}</Label>
      <Input
        defaultValue={example.value}
        disabled={disabled}
        id={fieldId}
        invalid={invalid}
        placeholder={example.placeholder}
        size={size}
        type={type}
      />
      <FormMessage variant={invalid ? 'danger' : 'neutral'}>
        Native input type is forwarded without adding a new component.
      </FormMessage>
    </Field>
  );
}

InputStory.displayName = 'InputStory';

const meta = {
  title: 'Components/Form/Input',
  component: InputStory,
  args: {
    disabled: false,
    invalid: false,
    size: 'md',
    type: 'text',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Native disabled state.',
    },
    invalid: {
      control: 'boolean',
      description: 'Invalid state mapped to aria-invalid and data-invalid.',
    },
    size: {
      control: 'select',
      options: formControlSizes,
      description: 'Input size.',
    },
    type: {
      control: 'select',
      options: inputTypes,
      description: 'Native input type.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Native input wrapper with Tinyrack form control styling.',
      },
    },
  },
} satisfies Meta<typeof InputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
