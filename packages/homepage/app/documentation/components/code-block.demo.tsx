import { TRButton } from '@tinyrack/ui/components/button';
import { TRCodeBlock } from '@tinyrack/ui/components/code-block';
import { useState } from 'react';
import type { BundledLanguage } from 'shiki/bundle/web';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type CodeBlockStoryArgs = {
  code: string;
  language: BundledLanguage | 'plain text';
  wrap: boolean;
};

export const codeBlockBasicSource = `import { TRCodeBlock } from '@tinyrack/ui/components/code-block';
import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/code-block.css';

export function TypeScriptSource() {
  return <TRCodeBlock code={"const status = 'healthy';"} language="ts" />;
}`;

export const codeBlockModesSource = `import { TRCodeBlock } from '@tinyrack/ui/components/code-block';
import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/code-block.css';

export function CodeBlockModes() {
  return (
    <div className="grid min-w-0 gap-4">
      <div><strong>Plain text</strong><TRCodeBlock code="rack-a: healthy" /></div>
      <div><strong>Highlighted JSON</strong><TRCodeBlock code={'{\\n  "status": "healthy"\\n}'} language="json" /></div>
      <div><strong>Theme-aware TypeScript</strong><TRCodeBlock code="const region = 'icn';" language="ts" /></div>
      <div><strong>Wrapped</strong><TRCodeBlock code="const message = 'A deliberately long line that wraps inside narrow layouts';" language="ts" wrap /></div>
    </div>
  );
}`;

export const copyableCodeBlockSource = `import { useState } from 'react';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRCodeBlock } from '@tinyrack/ui/components/code-block';
import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/button.css';
import '@tinyrack/ui/components/code-block.css';

export function CopyableCodeBlock() {
  const [copyResult, setCopyResult] = useState('Code not copied yet.');
  const code = 'pnpm verify';

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyResult('Code copied.');
    } catch {
      setCopyResult('Clipboard permission is unavailable.');
    }
  }

  return (
    <div className="grid gap-2">
      <TRCodeBlock code={code} language="shellscript" />
      <div className="flex items-center justify-between gap-3">
        <output aria-live="polite">{copyResult}</output>
        <TRButton appearance="outline" onClick={copyCode} uiSize="sm">Copy code</TRButton>
      </div>
    </div>
  );
}`;

export function CodeBlockPreview({ language, ...args }: CodeBlockStoryArgs) {
  const locale = useDemoLocale();
  const copy = {
    en: {
      copied: 'Code copied.',
      copy: 'Copy code',
      failed: 'Clipboard permission is unavailable.',
      idle: 'Code not copied yet.',
    },
    ja: {
      copied: 'コードをコピーしました。',
      copy: 'コードをコピー',
      failed: 'クリップボードを使用できません。',
      idle: 'コードはまだコピーされていません。',
    },
    ko: {
      copied: '코드를 복사했어요.',
      copy: '코드 복사',
      failed: '클립보드 권한을 사용할 수 없어요.',
      idle: '아직 코드를 복사하지 않았어요.',
    },
  }[locale];
  const [copyResult, setCopyResult] = useState(copy.idle);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(args.code);
      setCopyResult(copy.copied);
    } catch {
      setCopyResult(copy.failed);
    }
  }

  return (
    <div className="grid max-w-xl gap-2">
      <TRCodeBlock {...args} {...(language === 'plain text' ? {} : { language })} />
      <div className="flex items-center justify-between gap-3">
        <output aria-live="polite">{copyResult}</output>
        <TRButton appearance="outline" onClick={copyCode} uiSize="sm">
          {copy.copy}
        </TRButton>
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/Code Block',
  component: TRCodeBlock,
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered', playgroundLayout: 'fill' },
  args: {
    code: "const status = 'healthy';",
    language: 'ts',
    wrap: false,
  },
  argTypes: {
    code: { control: 'textarea' },
    language: {
      control: 'select',
      options: ['plain text', 'ts', 'tsx', 'js', 'json', 'css', 'html', 'shellscript'],
    },
    wrap: { control: 'boolean' },
  },
  render: ({ language, ...args }) => (
    <div className="grid min-w-0 p-4 sm:p-8">
      <TRCodeBlock {...args} {...(language === 'plain text' ? {} : { language })} />
    </div>
  ),
} satisfies Meta<CodeBlockStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
