import { TRCard } from '@tinyrack/ui/components/card';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type CardStoryArgs = {
  content: string;
  description: string;
  footer: boolean;
  padding: 'none' | 'sm' | 'md' | 'lg';
  semanticElement: 'article' | 'div' | 'section';
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
    semanticElement: 'article',
    title: 'Rack A',
    variant: 'elevated',
  },
  argTypes: {
    content: { control: 'text' },
    description: { control: 'text' },
    footer: { control: 'boolean' },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    semanticElement: {
      control: 'select',
      options: ['article', 'div', 'section'],
    },
    title: { control: 'text' },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
    },
  },
  render: ({ content, description, footer, semanticElement, title, ...rootProps }) => (
    <TRCard.Root
      className="w-full max-w-80"
      render={
        semanticElement === 'article' ? (
          <article />
        ) : semanticElement === 'section' ? (
          <section />
        ) : (
          <div />
        )
      }
      {...rootProps}
    >
      <TRCard.Header>
        <TRCard.Title render={<h3>{title}</h3>} />
        <TRCard.Description>{description}</TRCard.Description>
      </TRCard.Header>
      <TRCard.Content>{content}</TRCard.Content>
      {footer ? <TRCard.Footer>Updated now</TRCard.Footer> : null}
    </TRCard.Root>
  ),
} satisfies Meta<CardStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
