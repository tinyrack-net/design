import { TRWindowFrame } from '@tinyrack/ui/components/window-frame';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type WindowFrameStoryArgs = {
  addressUrl: string;
  content: string;
  title: string;
  variant: 'macos' | 'browser';
};

const meta = {
  title: 'Components/Window Frame',
  parameters: { layout: 'centered' },
  args: {
    addressUrl: 'https://dotweave.tinyrack.net/en/',
    content: '❯ npx @tinyrack/cli init',
    title: 'zsh — tinyrack',
    variant: 'macos',
  },
  argTypes: {
    addressUrl: { control: 'text' },
    content: { control: 'text' },
    title: { control: 'text' },
    variant: { control: 'select', options: ['macos', 'browser'] },
  },
  render: ({ addressUrl, content, title, variant }) => (
    <TRWindowFrame.Root className="w-full max-w-[32rem]" variant={variant}>
      <TRWindowFrame.TitleBar>
        <TRWindowFrame.Controls />
        {variant === 'browser' ? (
          <TRWindowFrame.AddressBar>{addressUrl}</TRWindowFrame.AddressBar>
        ) : (
          <TRWindowFrame.Title>{title}</TRWindowFrame.Title>
        )}
      </TRWindowFrame.TitleBar>
      <TRWindowFrame.Body>
        <pre className="m-0" style={{ fontFamily: 'var(--tinyrack-font-mono)' }}>
          {content}
        </pre>
      </TRWindowFrame.Body>
    </TRWindowFrame.Root>
  ),
} satisfies Meta<WindowFrameStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
