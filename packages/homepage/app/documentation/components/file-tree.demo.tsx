import { TRCode } from '@tinyrack/ui/components/code';
import { TRFileTree } from '@tinyrack/ui/components/file-tree';
import { TRLink } from '@tinyrack/ui/components/link';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type Args = Record<string, never>;

export function FileTreePreview() {
  const locale = useDemoLocale();
  return (
    <TRFileTree aria-label={locale === 'ko' ? '프로젝트 파일' : locale === 'ja' ? 'プロジェクトファイル' : 'Project files'} data-docs-example-item="">
      <ul>
        <li>astro.config.mjs</li>
        <li>package.json</li>
        <li>
          src
          <ul>
            <li>
              components
              <ul>
                <li>Header.astro</li>
                <li>Title.astro</li>
              </ul>
            </li>
            <li>pages/</li>
          </ul>
        </li>
      </ul>
    </TRFileTree>
  );
}

export function FileTreeAuthoredContentPreview() {
  const locale = useDemoLocale();
  return (
    <TRFileTree aria-label={locale === 'ko' ? '애플리케이션 라우트' : locale === 'ja' ? 'アプリケーションルート' : 'Application routes'} data-docs-example-item="">
      <ul>
        <li>
          <TRLink href="#src">
            <strong>src</strong>
          </TRLink>
          <ul>
            <li>
              <TRCode>routes/$locale.components.tsx</TRCode>
            </li>
            <li>generated/</li>
            <li>...</li>
          </ul>
        </li>
        <li>README.md</li>
      </ul>
    </TRFileTree>
  );
}

export const fileTreeBasicSource = `import '@tinyrack/ui/components/file-tree.css';
import { TRFileTree } from '@tinyrack/ui/components/file-tree';

<TRFileTree aria-label="Project files">

- astro.config.mjs
- package.json
- src
  - components
    - Header.tsx
    - Title.tsx
  - pages/

</TRFileTree>`;

export const fileTreeAuthoredContentSource = `import '@tinyrack/ui/components/file-tree.css';
import '@tinyrack/ui/components/code.css';
import '@tinyrack/ui/components/link.css';
import { TRCode } from '@tinyrack/ui/components/code';
import { TRFileTree } from '@tinyrack/ui/components/file-tree';
import { TRLink } from '@tinyrack/ui/components/link';

<TRFileTree aria-label="Application routes">

- <TRLink href="#src">**src**</TRLink>
  - <TRCode>routes/$locale.components.tsx</TRCode>
  - generated/
  - ...
- README.md

</TRFileTree>`;

const meta = {
  args: {},
  argTypes: {},
  parameters: { layout: 'centered' },
  render: FileTreePreview,
  title: 'Components/FileTree',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
