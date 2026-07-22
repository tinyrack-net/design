import {
  TRLanguageSelect,
  type TRLanguageSelectProps,
} from '@tinyrack/ui/components/language-select';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const options = [
  { label: 'English', language: 'en', value: 'en' },
  { label: '한국어', language: 'ko', value: 'ko' },
  { label: '日本語', language: 'ja', value: 'ja' },
];

export const languageSelectRouterSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/language-select.css';
import { TRLanguageSelect } from '@tinyrack/ui/components/language-select';
import { useLocation, useNavigate, useParams } from 'react-router';

const locales = [
  { label: 'English', language: 'en', value: 'en' },
  { label: '한국어', language: 'ko', value: 'ko' },
  { label: '日本語', language: 'ja', value: 'ja' },
] as const;

export function DocumentationLanguageSelect() {
  const navigate = useNavigate();
  const { hash, pathname, search } = useLocation();
  const { locale = 'en' } = useParams();

  function navigateToLocale(nextLocale: string) {
    if (nextLocale === locale) return;
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    const nextPathname = segments.join('/');
    navigate({ hash, pathname: nextPathname, search });
  }

  return (
    <TRLanguageSelect
      label="Documentation language"
      onValueChange={navigateToLocale}
      options={locales}
      value={locale}
    />
  );
}`;

export const languageSelectSizesSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/language-select.css';
import { TRLanguageSelect } from '@tinyrack/ui/components/language-select';

const options = [
  { label: 'English', language: 'en', value: 'en' },
  { label: '한국어', language: 'ko', value: 'ko' },
  { label: '日本語', language: 'ja', value: 'ja' },
];

export function LanguageSelectSizes() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <TRLanguageSelect
          key={uiSize}
          defaultValue="en"
          label="Documentation language"
          options={options}
          uiSize={uiSize}
        />
      ))}
    </div>
  );
}`;

type Args = { uiSize: NonNullable<TRLanguageSelectProps['uiSize']> };
export function LanguageSelectPreview({ uiSize }: Args) {
  const [value, setValue] = useState('en');
  const locale = useDemoLocale();
  return (
    <div data-docs-example-item="">
      <TRLanguageSelect
        label={
          locale === 'ko'
            ? '문서 언어'
            : locale === 'ja'
              ? 'ドキュメント言語'
              : 'Documentation language'
        }
        onValueChange={setValue}
        options={options}
        uiSize={uiSize}
        value={value}
      />
    </div>
  );
}
export function LanguageSelectSizesPreview() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <LanguageSelectPreview key={uiSize} uiSize={uiSize} />
      ))}
    </div>
  );
}
const meta = {
  args: { uiSize: 'md' },
  argTypes: {
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  excludeStories: /.*Source$/,
  parameters: { layout: 'centered' },
  render: LanguageSelectPreview,
  title: 'Components/LanguageSelect',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
