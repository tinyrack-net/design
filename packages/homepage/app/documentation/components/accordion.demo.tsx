import { TRAccordion } from '@tinyrack/ui/components/accordion';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

type AccordionStoryArgs = {
  background: 'surface' | 'surface-muted' | 'transparent';
  contentBackground: 'surface' | 'surface-muted' | 'transparent';
  disabledItem: boolean;
  duration: 'fast' | 'normal' | 'slow';
  multiple: boolean;
  radius: 'sm' | 'md' | 'lg';
  rootDisabled: boolean;
  value: string[];
};

type AccordionPreviewProps = AccordionStoryArgs & {
  onValueChange?: (value: string[]) => void;
};

export function AccordionPreview({
  background,
  contentBackground,
  disabledItem,
  duration,
  multiple,
  onValueChange,
  radius,
  rootDisabled,
  value,
}: AccordionPreviewProps) {
  const style = {
    '--tr-accordion-background':
      background === 'transparent' ? 'transparent' : `var(--tinyrack-${background})`,
    '--tr-accordion-content-background':
      contentBackground === 'transparent'
        ? 'transparent'
        : `var(--tinyrack-${contentBackground})`,
    '--tr-accordion-radius': `var(--tinyrack-radius-${radius})`,
    '--tr-collapsible-duration': `var(--tinyrack-duration-${duration})`,
  } as CSSProperties;

  return (
    <div className="grid w-full max-w-96 gap-3">
      <TRAccordion.Root
        className="w-full"
        disabled={rootDisabled}
        multiple={multiple}
        onValueChange={(nextValue) => onValueChange?.(nextValue as string[])}
        style={style}
        value={value}
      >
        <TRAccordion.Item value="overview">
          <TRAccordion.Header>
            <TRAccordion.Trigger>What is Tinyrack?</TRAccordion.Trigger>
          </TRAccordion.Header>
          <TRAccordion.Panel>A React-only UI system.</TRAccordion.Panel>
        </TRAccordion.Item>
        <TRAccordion.Item disabled={disabledItem} value="install">
          <TRAccordion.Header>
            <TRAccordion.Trigger>How do I install it?</TRAccordion.Trigger>
          </TRAccordion.Header>
          <TRAccordion.Panel>Install the package and component CSS.</TRAccordion.Panel>
        </TRAccordion.Item>
      </TRAccordion.Root>
      <output aria-live="polite" className="text-tinyrack-sm text-tinyrack-text-muted">
        Expanded: {value.length === 0 ? 'none' : value.join(', ')}
      </output>
    </div>
  );
}

export function AccordionInteractiveExample() {
  const [value, setValue] = useState<string[]>(['overview']);

  return (
    <div className="grid gap-3">
      <TRAccordion.Root
        multiple
        onValueChange={(nextValue) => setValue(nextValue as string[])}
        value={value}
      >
        <TRAccordion.Item value="overview">
          <TRAccordion.Header>
            <TRAccordion.Trigger>What is Tinyrack?</TRAccordion.Trigger>
          </TRAccordion.Header>
          <TRAccordion.Panel>A React-only UI system.</TRAccordion.Panel>
        </TRAccordion.Item>
        <TRAccordion.Item value="install">
          <TRAccordion.Header>
            <TRAccordion.Trigger>How do I install it?</TRAccordion.Trigger>
          </TRAccordion.Header>
          <TRAccordion.Panel>Install the package and component CSS.</TRAccordion.Panel>
        </TRAccordion.Item>
      </TRAccordion.Root>
      <output aria-live="polite">
        Expanded: {value.length === 0 ? 'none' : value.join(', ')}
      </output>
    </div>
  );
}

const meta = {
  title: 'Components/Accordion',
  excludeStories: /.*(?:Preview|Example)$/,
  parameters: { layout: 'centered' },
  args: {
    background: 'surface',
    contentBackground: 'transparent',
    disabledItem: false,
    duration: 'normal',
    multiple: false,
    radius: 'md',
    rootDisabled: false,
    value: ['overview'],
  },
  argTypes: {
    background: {
      control: 'select',
      options: ['surface', 'surface-muted', 'transparent'],
    },
    contentBackground: {
      control: 'select',
      options: ['surface', 'surface-muted', 'transparent'],
    },
    disabledItem: { control: 'boolean' },
    duration: {
      control: 'select',
      options: ['fast', 'normal', 'slow'],
    },
    multiple: { control: 'boolean' },
    radius: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    rootDisabled: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<AccordionStoryArgs>();

    return (
      <AccordionPreview {...args} onValueChange={(value) => updateArgs({ value })} />
    );
  },
} satisfies Meta<AccordionStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
