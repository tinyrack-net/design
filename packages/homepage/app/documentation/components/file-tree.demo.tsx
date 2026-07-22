import { TRCode } from '@tinyrack/ui/components/code';
import { TRFileTree } from '@tinyrack/ui/components/file-tree';
import { TRLink } from '@tinyrack/ui/components/link';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';

type Args = Record<string, never>;

export function FileTreePreview() {
  return (
    <TRFileTree aria-label="Project files">
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
  return (
    <TRFileTree aria-label="Application routes">
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
