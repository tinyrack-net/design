import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Button,
  type ButtonAppearance,
  type ButtonSize,
  type ButtonVariant,
} from '../../src/components/button/index.js';

type ButtonStoryArgs = {
  appearance: ButtonAppearance;
  children: string;
  disabled: boolean;
  loading: boolean;
  loadingLabel: string;
  size: ButtonSize;
  variant: ButtonVariant;
};

function ButtonPreview(args: ButtonStoryArgs) {
  const [activationCount, setActivationCount] = useState(0);

  return (
    <div className="grid justify-items-start gap-3">
      <Button {...args} onClick={() => setActivationCount((count) => count + 1)} />
      <output aria-live="polite">
        {activationCount === 0
          ? 'Not activated yet.'
          : `Activated ${activationCount} ${activationCount === 1 ? 'time' : 'times'}.`}
      </output>
    </div>
  );
}

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: {
    appearance: 'solid',
    children: 'Deploy',
    disabled: false,
    loading: false,
    loadingLabel: 'Deploying changes',
    size: 'md',
    variant: 'primary',
  },
  argTypes: {
    appearance: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    loadingLabel: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['secondary', 'primary', 'danger'] },
  },
  render: (args) => <ButtonPreview {...args} />,
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
