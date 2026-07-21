import { TRButton } from '@tinyrack/ui/components/button';
import { TRCodeBlock } from '@tinyrack/ui/components/code-block';
import { useState } from 'react';
import type { BundledLanguage } from 'shiki/bundle/web';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type CodeBlockStoryArgs = {
  code: string;
  language: BundledLanguage;
  wrap: boolean;
};

export function CodeBlockPreview(args: CodeBlockStoryArgs) {
  const [copyResult, setCopyResult] = useState('TRCode not copied yet.');

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(args.code);
      setCopyResult('TRCode copied.');
    } catch {
      setCopyResult('Clipboard permission is unavailable.');
    }
  }

  return (
    <div className="grid max-w-xl gap-2">
      <TRCodeBlock {...args} />
      <div className="flex items-center justify-between gap-3">
        <output aria-live="polite">{copyResult}</output>
        <TRButton appearance="outline" onClick={copyCode} uiSize="sm">
          Copy code
        </TRButton>
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/Code Block',
  component: TRCodeBlock,
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    code: "const status = 'healthy';",
    language: 'ts',
    wrap: false,
  },
  argTypes: {
    code: { control: 'text' },
    language: {
      control: 'select',
      options: ['ts', 'tsx', 'js', 'json', 'css', 'html', 'shellscript'],
    },
    wrap: { control: 'boolean' },
  },
  render: (args) => <TRCodeBlock {...args} />,
} satisfies Meta<CodeBlockStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
