import { TRTableOfContents } from '@tinyrack/ui/components/table-of-contents';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';

const items = [
  { depth: 2 as const, id: 'install', label: 'Install' },
  { depth: 3 as const, id: 'configure', label: 'Configure' },
];
type Args = { currentHeading: string };
type PreviewProps = Args & { onNavigate?: (item: (typeof items)[number]) => void };

export function TableOfContentsPreview({ currentHeading, onNavigate }: PreviewProps) {
  const locale = useDemoLocale();
  const localizedItems = locale === 'ko' ? [{ depth: 2 as const, id: 'install', label: '설치' }, { depth: 3 as const, id: 'configure', label: '설정' }] : locale === 'ja' ? [{ depth: 2 as const, id: 'install', label: 'インストール' }, { depth: 3 as const, id: 'configure', label: '設定' }] : items;
  return (
    <div className="w-full max-w-64 min-w-0" data-docs-example-item="">
      <TRTableOfContents
        currentHeading={currentHeading}
        items={localizedItems}
        label={locale === 'ko' ? '이 페이지' : locale === 'ja' ? 'このページ' : 'On this page'}
        mobileLabel={locale === 'ko' ? '목차' : locale === 'ja' ? '目次' : 'On this page'}
        {...(onNavigate === undefined ? {} : { onNavigate })}
      />
    </div>
  );
}

export function TableOfContentsExample() {
  const [currentHeading, setCurrentHeading] = useState('install');

  return (
    <TableOfContentsPreview
      currentHeading={currentHeading}
      onNavigate={(item) => {
        setCurrentHeading(item.id);
        window.location.hash = item.id;
      }}
    />
  );
}

export function TableOfContentsStatesPreview() {
  return <div className="grid gap-4 sm:grid-cols-3">{['install', 'configure', 'missing'].map((currentHeading) => <TableOfContentsPreview currentHeading={currentHeading} key={currentHeading} />)}</div>;
}

export const tableOfContentsBasicSource = `import '@tinyrack/ui/components/table-of-contents.css';
import { TRTableOfContents } from '@tinyrack/ui/components/table-of-contents';
import { useState } from 'react';

const headings = [
  { depth: 2, id: 'install', label: 'Install' },
  { depth: 3, id: 'configure', label: 'Configure' },
] as const;

export function PageOutline() {
  const [currentHeading, setCurrentHeading] = useState('install');

  return (
    <TRTableOfContents
      currentHeading={currentHeading}
      items={headings}
      onNavigate={(item) => {
        setCurrentHeading(item.id);
        window.location.hash = item.id;
      }}
    />
  );
}`;

export const tableOfContentsStatesSource = `import '@tinyrack/ui/components/table-of-contents.css';
import { TRTableOfContents } from '@tinyrack/ui/components/table-of-contents';

const items = [
  { depth: 2, id: 'install', label: 'Install' },
  { depth: 3, id: 'configure', label: 'Configure' },
] as const;

export function CurrentHeadingStates() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {['install', 'configure', 'missing'].map((currentHeading) => (
        <TRTableOfContents
          currentHeading={currentHeading}
          items={items}
          key={currentHeading}
        />
      ))}
    </div>
  );
}`;

const meta = {
  excludeStories: /.*(?:Preview|Example|Source)$/,
  args: { currentHeading: 'install' },
  argTypes: {
    currentHeading: { control: 'select', options: ['install', 'configure'] },
  },
  parameters: { layout: 'centered' },
  render: function Render(args) {
    const [, updateArgs] = useArgs<Args>();
    return (
      <TableOfContentsPreview
        {...args}
        onNavigate={(item) => updateArgs({ currentHeading: item.id })}
      />
    );
  },
  title: 'Components/TableOfContents',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
