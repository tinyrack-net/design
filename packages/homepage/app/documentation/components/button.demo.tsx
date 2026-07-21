import {
  TRButton,
  type TRButtonAppearance,
  type TRButtonUiSize,
  type TRButtonVariant,
} from '@tinyrack/ui/components/button';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type ButtonStoryArgs = {
  appearance: TRButtonAppearance;
  children: string;
  disabled: boolean;
  loading: boolean;
  loadingLabel: string;
  size: TRButtonUiSize;
  variant: TRButtonVariant;
};

function ButtonPreview(args: ButtonStoryArgs) {
  const [activationCount, setActivationCount] = useState(0);

  return (
    <div className="grid justify-items-start gap-3">
      <TRButton {...args} onClick={() => setActivationCount((count) => count + 1)} />
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
  component: TRButton,
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

export const playground = definePlayground(meta);
