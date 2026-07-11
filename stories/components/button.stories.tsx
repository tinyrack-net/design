import type { Meta, StoryObj } from '@storybook/react-vite';
import { RefreshCw } from 'lucide-react';
import {
  buttonAppearances,
  buttonSizes,
  buttonVariants,
} from '../../src/components/button/contract.js';
import {
  Button,
  type ButtonProps,
  IconButton,
} from '../../src/components/button/react.js';

type ComponentStoryProps = Pick<
  ButtonProps,
  'appearance' | 'children' | 'disabled' | 'size' | 'variant'
>;

function ButtonStory(controlValues: ComponentStoryProps) {
  return <Button {...controlValues} />;
}

ButtonStory.displayName = 'ButtonStory';

const meta = {
  title: 'Components/Button',
  component: ButtonStory,
  args: {
    appearance: 'solid',
    children: 'Deploy',
    disabled: false,
    size: 'md',
    variant: 'primary',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button label.',
    },
    disabled: {
      control: 'boolean',
      description: 'Native disabled state.',
    },
    size: {
      control: 'select',
      options: buttonSizes,
      description: 'Tailwind scale-backed button size.',
    },
    variant: {
      control: 'select',
      options: buttonVariants,
      description: 'Semantic action variant.',
    },
    appearance: {
      control: 'select',
      options: buttonAppearances,
      description: 'Visual treatment.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'CSS-first Tinyrack Button rendered through the React wrapper.',
      },
    },
  },
} satisfies Meta<typeof ButtonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IconOnly: Story = {
  render: () => (
    <IconButton label="Refresh rack" size="md" variant="secondary">
      <RefreshCw aria-hidden="true" size={18} />
    </IconButton>
  ),
};
