import { Button } from '@tinyrack/ui/components/button';
import { CodeBlock } from '@tinyrack/ui/components/code-block';
import { useState } from 'react';
import type { BundledLanguage } from 'shiki/bundle/web';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type CodeBlockStoryArgs = {
  code: string;
  copyable: boolean;
  language: BundledLanguage;
  wrap: boolean;
};

export function CodeBlockPreview({ copyable, ...args }: CodeBlockStoryArgs) {
  const [copyResult, setCopyResult] = useState('Code not copied yet.');

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(args.code);
      setCopyResult('Code copied.');
    } catch {
      setCopyResult('Clipboard permission is unavailable.');
    }
  }

  return (
    <div className="grid max-w-xl gap-2">
      <CodeBlock {...args} />
      {copyable ? (
        <div className="flex items-center justify-between gap-3">
          <output aria-live="polite">{copyResult}</output>
          <Button appearance="outline" onClick={copyCode} size="sm">
            Copy code
          </Button>
        </div>
      ) : null}
    </div>
  );
}

const meta = {
  title: 'Components/Code Block',
  component: CodeBlock,
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    code: "const status = 'healthy';",
    copyable: true,
    language: 'ts',
    wrap: false,
  },
  argTypes: {
    code: { control: 'text' },
    copyable: { control: 'boolean' },
    language: {
      control: 'select',
      options: ['ts', 'tsx', 'js', 'json', 'css', 'html', 'shellscript'],
    },
    wrap: { control: 'boolean' },
  },
  render: (args) => <CodeBlockPreview {...args} />,
} satisfies Meta<CodeBlockStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
