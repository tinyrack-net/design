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
  render: ({ content, description, footer, title, ...rootProps }) => (
    <TRCard.Root
      aria-labelledby="card-playground-title"
      className="w-full max-w-80"
      render={<article />}
      {...rootProps}
    >
      <TRCard.Header>
        <TRCard.Title render={<h3 id="card-playground-title">{title}</h3>} />
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
