import { TRAccordion } from '@tinyrack/ui/components/accordion';
import { useEffect, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type AccordionStoryArgs = {
  disabledItem: boolean;
  lifecycle: 'unmount' | 'keepMounted' | 'hiddenUntilFound';
  multiple: boolean;
  rootDisabled: boolean;
  value: string[];
};

type AccordionPreviewProps = AccordionStoryArgs & {
  onValueChange?: (value: string[]) => void;
};

export function AccordionPreview({
  disabledItem,
  lifecycle,
  multiple,
  onValueChange,
  rootDisabled,
  value,
}: AccordionPreviewProps) {
  const availableValue = disabledItem
    ? value.filter((itemValue) => itemValue !== 'install')
    : value;
  const normalizedValue = multiple ? availableValue : availableValue.slice(0, 1);
  const valueChanged =
    normalizedValue.length !== value.length ||
    normalizedValue.some((itemValue, index) => itemValue !== value[index]);

  useEffect(() => {
    if (valueChanged) onValueChange?.(normalizedValue);
  }, [normalizedValue, onValueChange, valueChanged]);

  return (
    <div className="grid w-full min-w-0 max-w-96 gap-3">
      <TRAccordion.Root
        className="w-full"
        disabled={rootDisabled}
        hiddenUntilFound={lifecycle === 'hiddenUntilFound'}
        keepMounted={lifecycle === 'keepMounted'}
        multiple={multiple}
        onValueChange={(nextValue) => onValueChange?.(nextValue as string[])}
        value={normalizedValue}
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
        Expanded: {normalizedValue.length === 0 ? 'none' : normalizedValue.join(', ')}
        {' · '}Lifecycle: {lifecycle}
      </output>
    </div>
  );
}

export function AccordionInteractiveExample() {
  const [value, setValue] = useState<string[]>(['overview']);
  const locale = useDemoLocale();
  const copy =
    locale === 'ko'
      ? [
          'Tinyrack은 무엇인가요?',
          'React 전용 UI 시스템이에요.',
          '어떻게 설치하나요?',
          '패키지와 컴포넌트 CSS를 설치하세요.',
          '펼침',
        ]
      : locale === 'ja'
        ? [
            'Tinyrack とは何ですか？',
            'React 専用の UI システムです。',
            'インストール方法は？',
            'パッケージとコンポーネント CSS をインストールしてください。',
            '展開中',
          ]
        : [
            'What is Tinyrack?',
            'A React-only UI system.',
            'How do I install it?',
            'Install the package and component CSS.',
            'Expanded',
          ];

  return (
    <div className="grid gap-3" data-docs-example-item="">
      <TRAccordion.Root
        multiple
        onValueChange={(nextValue) => setValue(nextValue as string[])}
        value={value}
      >
        <TRAccordion.Item value="overview">
          <TRAccordion.Header>
            <TRAccordion.Trigger>{copy[0]}</TRAccordion.Trigger>
          </TRAccordion.Header>
          <TRAccordion.Panel>{copy[1]}</TRAccordion.Panel>
        </TRAccordion.Item>
        <TRAccordion.Item value="install">
          <TRAccordion.Header>
            <TRAccordion.Trigger>{copy[2]}</TRAccordion.Trigger>
          </TRAccordion.Header>
          <TRAccordion.Panel>{copy[3]}</TRAccordion.Panel>
        </TRAccordion.Item>
      </TRAccordion.Root>
      <output aria-live="polite">
        {copy[4]}: {value.length === 0 ? '—' : value.join(', ')}
      </output>
    </div>
  );
}

const meta = {
  title: 'Components/Accordion',
  excludeStories: /.*(?:Preview|Example)$/,
  parameters: { layout: 'centered' },
  args: {
    disabledItem: false,
    lifecycle: 'unmount',
    multiple: false,
    rootDisabled: false,
    value: ['overview'],
  },
  argTypes: {
    disabledItem: { control: 'boolean' },
    lifecycle: {
      control: 'select',
      options: ['unmount', 'keepMounted', 'hiddenUntilFound'],
    },
    multiple: { control: 'boolean' },
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
