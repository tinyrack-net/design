import {
  TRText,
  type TRTextColor,
  type TRTextVariant,
} from '@tinyrack/ui/components/text';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const textVariants: TRTextVariant[] = [
  'caption',
  'label',
  'body',
  'bodySm',
  'code',
  'headingSm',
  'headingMd',
  'headingLg',
  'display',
  'displayLg',
];
const textColors: TRTextColor[] = [
  'default',
  'muted',
  'placeholder',
  'inverse',
  'primary',
  'info',
  'success',
  'warning',
  'danger',
];
const textAligns = ['start', 'center', 'end'] as const;

const sampleText = {
  en: 'Cluster health',
  ja: 'クラスターの状態',
  ko: '클러스터 상태',
} as const;

type TextStoryArgs = {
  children: string;
  variant: TRTextVariant;
  color: TRTextColor;
  align: (typeof textAligns)[number];
  truncate: boolean;
};

const meta = {
  title: 'Components/Text',
  component: TRText,
  parameters: { layout: 'centered' },
  args: {
    align: 'start',
    children: 'Cluster health',
    color: 'default',
    truncate: false,
    variant: 'headingMd',
  },
  argTypes: {
    align: { control: 'select', options: textAligns },
    children: { control: 'text' },
    color: { control: 'select', options: textColors },
    truncate: { control: 'boolean' },
    variant: { control: 'select', options: textVariants },
  },
  render: ({ children, ...args }) => {
    const locale = useDemoLocale();
    const label = children === meta.args.children ? sampleText[locale] : children;
    return (
      <div className="max-w-80">
        <TRText {...args}>{label}</TRText>
      </div>
    );
  },
} satisfies Meta<TextStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
