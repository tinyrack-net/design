import { TRCard } from '@tinyrack/ui/components/card';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type CardStoryArgs = {
  content: string;
  description: string;
  footer: boolean;
  padding: 'none' | 'sm' | 'md' | 'lg';
  title: string;
  variant: 'default' | 'outlined' | 'elevated';
};

const meta = {
  title: 'Components/Card',
  parameters: { layout: 'centered' },
  args: {
    content: 'All systems operational.',
    description: '12 nodes',
    footer: true,
    padding: 'md',
    title: 'Rack A',
    variant: 'elevated',
  },
  argTypes: {
    content: { control: 'text' },
    description: { control: 'text' },
    footer: { control: 'boolean' },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    title: { control: 'text' },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
    },
  },
  render: ({ content, description, footer, title, ...rootProps }) => {
    const locale = useDemoLocale();
    const copy = {
      en: {
        content: 'All systems operational.',
        description: '12 nodes',
        title: 'Rack A',
        updated: 'Updated now',
      },
      ja: {
        content: 'すべてのシステムは正常です。',
        description: '12 ノード',
        title: 'ラック A',
        updated: 'たった今更新',
      },
      ko: {
        content: '모든 시스템이 정상이에요.',
        description: '노드 12개',
        title: '랙 A',
        updated: '방금 업데이트됨',
      },
    }[locale];
    const localizedContent =
      content === 'All systems operational.' ? copy.content : content;
    const localizedDescription =
      description === '12 nodes' ? copy.description : description;
    const localizedTitle = title === 'Rack A' ? copy.title : title;
    return (
      <TRCard.Root
        aria-labelledby="card-playground-title"
        className="w-full max-w-80"
        render={<article />}
        {...rootProps}
      >
        <TRCard.Header>
          <TRCard.Title
            render={<h3 id="card-playground-title">{localizedTitle}</h3>}
          />
          <TRCard.Description>{localizedDescription}</TRCard.Description>
        </TRCard.Header>
        <TRCard.Content>{localizedContent}</TRCard.Content>
        {footer ? <TRCard.Footer>{copy.updated}</TRCard.Footer> : null}
      </TRCard.Root>
    );
  },
} satisfies Meta<CardStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
