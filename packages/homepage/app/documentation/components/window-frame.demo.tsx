import { TRWindowFrame } from '@tinyrack/ui/components/window-frame';
import type { CSSProperties } from 'react';
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

const terminalBodyStyle: CSSProperties = {
  '--tr-window-frame-body-background': '#0a0a0a',
  '--tr-window-frame-body-color': '#e5e5e5',
  '--tr-window-frame-body-font': 'var(--tinyrack-font-mono)',
} as CSSProperties;

const meta = {
  title: 'Components/Window Frame',
  parameters: { layout: 'centered' },
  args: {
    addressUrl: 'https://dotweave.tinyrack.net/en/',
    content:
      '❯ npx @tinyrack/cli init\n✓ Created tinyrack.config.ts\n✓ Linked 3 dotfiles',
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
      {variant === 'browser' ? (
        <TRWindowFrame.Body>
          <div className="grid gap-2">
            <h3 className="m-0 text-xl font-semibold">Your dotfiles, versioned</h3>
            <p className="m-0 text-tinyrack-sm text-tinyrack-text-muted">
              Track, sync, and roll back your shell config across every machine.
            </p>
          </div>
        </TRWindowFrame.Body>
      ) : (
        <TRWindowFrame.Body style={terminalBodyStyle}>
          <pre>{content}</pre>
        </TRWindowFrame.Body>
      )}
    </TRWindowFrame.Root>
  ),
} satisfies Meta<WindowFrameStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
