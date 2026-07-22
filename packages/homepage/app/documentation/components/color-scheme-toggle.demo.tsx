import {
  type TRColorScheme,
  TRColorSchemeToggle,
} from '@tinyrack/ui/components/color-scheme-toggle';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground, usePlaygroundArgs } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const copy = {
  en: { dark: 'Use dark color scheme', light: 'Use light color scheme' },
  ko: { dark: '어두운 색상 모드 사용', light: '밝은 색상 모드 사용' },
  ja: { dark: 'ダークカラースキームを使用', light: 'ライトカラースキームを使用' },
} as const;

type Args = {
  disabled: boolean;
  uiSize: 'sm' | 'md' | 'lg';
  value: TRColorScheme;
};
type PreviewProps = Omit<Args, 'disabled' | 'uiSize'> &
  Partial<Pick<Args, 'disabled' | 'uiSize'>>;
export function ColorSchemeTogglePreview({
  disabled = false,
  uiSize = 'md',
  value: initialValue,
}: PreviewProps) {
  const locale = useDemoLocale();
  const labels = copy[locale];
  const [value, setValue] = useState(initialValue);
  return (
    <TRColorSchemeToggle
      data-docs-example-item=""
      disabled={disabled}
      darkLabel={labels.dark}
      lightLabel={labels.light}
      onValueChange={setValue}
      uiSize={uiSize}
      value={value}
    />
  );
}

export function ColorSchemeToggleStatesPreview() {
  const locale = useDemoLocale();
  const labels = copy[locale];
  return (
    <div className="flex flex-wrap items-center gap-3">
      <TRColorSchemeToggle
        data-docs-example-item=""
        darkLabel={labels.dark}
        onValueChange={() => {}}
        uiSize="sm"
        value="light"
      />
      <TRColorSchemeToggle
        data-docs-example-item=""
        lightLabel={labels.light}
        onValueChange={() => {}}
        value="dark"
      />
      <TRColorSchemeToggle
        data-docs-example-item=""
        disabled
        onValueChange={() => {}}
        uiSize="lg"
        value="light"
      />
    </div>
  );
}

function ColorSchemeTogglePlayground(args: Args) {
  const [, updateArgs] = usePlaygroundArgs<Args>();
  return (
    <TRColorSchemeToggle
      disabled={args.disabled}
      onValueChange={(value) => updateArgs({ value })}
      uiSize={args.uiSize}
      value={args.value}
    />
  );
}

export const colorSchemeToggleBasicSource = `import { useState } from 'react';
import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/color-scheme-toggle.css';
import {
  TRColorSchemeToggle,
  type TRColorScheme,
} from '@tinyrack/ui/components/color-scheme-toggle';

export function ColorSchemeControl() {
  const [scheme, setScheme] = useState<TRColorScheme>('light');

  return (
    <TRColorSchemeToggle value={scheme} onValueChange={setScheme} />
  );
}`;

export const colorSchemeToggleAdapterSource = `import { useEffect, useState } from 'react';
import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/color-scheme-toggle.css';
import {
  TRColorSchemeToggle,
  type TRColorScheme,
} from '@tinyrack/ui/components/color-scheme-toggle';

type ColorSchemePreference = TRColorScheme | 'system';
const storageKey = 'color-scheme';

function resolveScheme(
  preference: ColorSchemePreference,
  systemDark: boolean,
): TRColorScheme {
  if (preference !== 'system') return preference;
  return systemDark ? 'dark' : 'light';
}

export function PersistentColorSchemeControl() {
  // A deterministic initial value keeps server and first-client markup identical.
  const [scheme, setScheme] = useState<TRColorScheme>('light');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const stored = localStorage.getItem(storageKey);
    const preference: ColorSchemePreference =
      stored === 'dark' || stored === 'light' ? stored : 'system';
    function applyPreference() {
      const resolved = resolveScheme(preference, media.matches);
      setScheme(resolved);
      document.documentElement.dataset.theme = resolved;
    }

    applyPreference();
    if (preference !== 'system') return;
    media.addEventListener('change', applyPreference);
    return () => media.removeEventListener('change', applyPreference);
  }, []);

  function selectScheme(nextScheme: TRColorScheme) {
    setScheme(nextScheme);
    localStorage.setItem(storageKey, nextScheme);
    document.documentElement.dataset.theme = nextScheme;
  }

  return (
    <TRColorSchemeToggle value={scheme} onValueChange={selectScheme} />
  );
}`;

export const colorSchemeToggleStatesSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/color-scheme-toggle.css';
import { TRColorSchemeToggle } from '@tinyrack/ui/components/color-scheme-toggle';

export function ColorSchemeToggleStates() {
  return (
    <div className="flex items-center gap-3">
      <TRColorSchemeToggle uiSize="sm" value="light" onValueChange={() => {}} />
      <TRColorSchemeToggle value="dark" onValueChange={() => {}} />
      <TRColorSchemeToggle disabled uiSize="lg" value="light" onValueChange={() => {}} />
    </div>
  );
}`;

const meta = {
  args: { disabled: false, uiSize: 'md', value: 'light' },
  argTypes: {
    disabled: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  excludeStories: /.*(?:Preview|Source)$/,
  parameters: { layout: 'centered' },
  render: ColorSchemeTogglePlayground,
  title: 'Components/ColorSchemeToggle',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
