import { TRIconButton } from '@tinyrack/ui/components/icon-button';
import { SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type StoryArgs = {
  appearance: 'solid' | 'outline' | 'ghost';
  disabled: boolean;
  label: string;
  loading: boolean;
  size: 'sm' | 'md' | 'lg';
  variant: 'secondary' | 'primary' | 'danger';
};

export function IconButtonPreview({ label, ...args }: StoryArgs) {
  const [activations, setActivations] = useState(0);
  return (
    <div className="grid justify-items-center gap-2">
      <TRIconButton
        {...args}
        aria-label={label}
        loadingLabel={`${label} in progress`}
        onClick={() => setActivations((value) => value + 1)}
      >
        <SettingsIcon aria-hidden="true" />
      </TRIconButton>
      <output aria-live="polite">Activations: {activations}</output>
    </div>
  );
}

export function IconButtonMatrix() {
  const appearances = ['solid', 'outline', 'ghost'] as const;
  const variants = ['secondary', 'primary', 'danger'] as const;
  const sizes = ['sm', 'md', 'lg'] as const;
  return (
    <div className="grid gap-4">
      {appearances.map((appearance) => (
        <section className="grid gap-2" key={appearance}>
          <strong>{appearance}</strong>
          <div className="flex flex-wrap items-center gap-2">
            {variants.flatMap((variant) =>
              sizes.map((size) => (
                <TRIconButton
                  appearance={appearance}
                  aria-label={`${appearance} ${variant} ${size}`}
                  key={`${variant}-${size}`}
                  uiSize={size}
                  variant={variant}
                >
                  <SettingsIcon aria-hidden="true" />
                </TRIconButton>
              )),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

const meta = {
  title: 'Components/IconButton',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    appearance: 'outline',
    disabled: false,
    label: 'Settings',
    loading: false,
    size: 'md',
    variant: 'secondary',
  },
  argTypes: {
    appearance: { options: ['solid', 'outline', 'ghost'], control: 'radio' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    loading: { control: 'boolean' },
    size: { options: ['sm', 'md', 'lg'], control: 'radio' },
    variant: { options: ['secondary', 'primary', 'danger'], control: 'radio' },
  },
  render: (args) => <IconButtonPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
