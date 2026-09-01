import { TRRichText, type TRRichTextVariant } from '@tinyrack/ui/components/rich-text';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const variants: TRRichTextVariant[] = ['document', 'notice'];
const copy = {
  en: {
    heading: 'Account policy',
    link: 'current terms',
    prefix: 'Review the ',
    suffix: ' before continuing.',
  },
  ja: {
    heading: 'アカウントポリシー',
    link: '現在の規約',
    prefix: '続行する前に',
    suffix: 'を確認してください。',
  },
  ko: {
    heading: '계정 정책',
    link: '현재 약관',
    prefix: '계속하기 전에 ',
    suffix: '을 확인하세요.',
  },
} as const;

type RichTextStoryArgs = {
  variant: TRRichTextVariant;
};

const meta = {
  title: 'Components/Rich Text',
  component: TRRichText,
  parameters: { layout: 'centered' },
  args: { variant: 'document' },
  argTypes: {
    variant: { control: 'select', options: variants },
  },
  render: ({ variant }) => {
    const locale = useDemoLocale();
    const content = copy[locale];
    return (
      <TRRichText className="max-w-96" variant={variant}>
        <h2>{content.heading}</h2>
        <p>
          {content.prefix}
          <a href="/terms">{content.link}</a>
          {content.suffix}
        </p>
        <ul>
          <li>OAuth 2.0</li>
          <li>OpenID Connect</li>
        </ul>
      </TRRichText>
    );
  },
} satisfies Meta<RichTextStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
