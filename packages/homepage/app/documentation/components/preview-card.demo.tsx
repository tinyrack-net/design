import { TRPreviewCard } from '@tinyrack/ui/components/preview-card';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const previewCardCopy = {
  en: {
    description: 'Healthy · 12 services',
    edge: 'Collision-aware preview content remains inside the viewport.',
    label: 'Rack Alpha',
  },
  ja: {
    description: '正常 · 12 サービス',
    edge: '衝突を回避し、プレビュー内容をビューポート内に収めます。',
    label: 'ラック Alpha',
  },
  ko: {
    description: '정상 · 서비스 12개',
    edge: '충돌을 피하고 미리보기 내용을 뷰포트 안에 유지해요.',
    label: '랙 알파',
  },
} as const;

type StoryArgs = {
  align: 'start' | 'center' | 'end';
  description: string;
  label: string;
  side: 'top' | 'right' | 'bottom' | 'left';
  title: string;
};

type PreviewCardPreviewProps = Partial<StoryArgs> & {
  defaultOpen?: boolean;
};

export function PreviewCardPreview({
  align = 'center',
  defaultOpen = false,
  description = 'Healthy · 12 services',
  label = 'Rack Alpha',
  side = 'bottom',
  title = 'Rack Alpha',
}: PreviewCardPreviewProps) {
  const [open, setOpen] = useState(defaultOpen);
  const copy = previewCardCopy[useDemoLocale()];
  const visibleLabel = label === 'Rack Alpha' ? copy.label : label;
  const visibleTitle = title === 'Rack Alpha' ? copy.label : title;
  const visibleDescription =
    description === 'Healthy · 12 services' ? copy.description : description;

  return (
    <div data-docs-example-item="">
      <TRPreviewCard.Root onOpenChange={setOpen} open={open}>
        <TRPreviewCard.Trigger href="#rack-alpha">{visibleLabel}</TRPreviewCard.Trigger>
        <TRPreviewCard.Portal>
          <TRPreviewCard.Positioner align={align} side={side}>
            <TRPreviewCard.Popup>
              <TRPreviewCard.Arrow />
              <strong>{visibleTitle}</strong>
              <p>{visibleDescription}</p>
            </TRPreviewCard.Popup>
          </TRPreviewCard.Positioner>
        </TRPreviewCard.Portal>
      </TRPreviewCard.Root>
    </div>
  );
}

const rackBetaPreview = TRPreviewCard.createHandle();

export function PreviewCardHandlePreview() {
  const locale = useDemoLocale();
  return (
    <div data-docs-example-item="">
      <TRPreviewCard.Trigger
        handle={rackBetaPreview}
        href="#rack-beta"
        id="rack-beta-trigger"
      >
        {locale === 'ko' ? '랙 베타' : locale === 'ja' ? 'ラック Beta' : 'Rack Beta'}
      </TRPreviewCard.Trigger>
      <TRPreviewCard.Root handle={rackBetaPreview}>
        <TRPreviewCard.Portal>
          <TRPreviewCard.Positioner sideOffset={8}>
            <TRPreviewCard.Popup>
              <strong>Rack Beta</strong>
              <p>Degraded · 8 of 10 services healthy</p>
              <TRPreviewCard.Arrow />
            </TRPreviewCard.Popup>
          </TRPreviewCard.Positioner>
        </TRPreviewCard.Portal>
      </TRPreviewCard.Root>
    </div>
  );
}

export const previewCardBasicSource = `import { TRPreviewCard } from '@tinyrack/ui/components/preview-card';

export function RackPreview() {
  return (
    <TRPreviewCard.Root>
      <TRPreviewCard.Trigger href="#rack-alpha">Rack Alpha</TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner>
          <TRPreviewCard.Popup>
            <strong>Rack Alpha</strong>
            <p>Healthy · 12 services</p>
          </TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>
  );
}`;

export const previewCardHandleSource = `import { TRPreviewCard } from '@tinyrack/ui/components/preview-card';

const rackBetaPreview = TRPreviewCard.createHandle();

export function DetachedRackPreview() {
  return (
    <>
      <TRPreviewCard.Trigger handle={rackBetaPreview} href="#rack-beta">
        Rack Beta
      </TRPreviewCard.Trigger>
      <TRPreviewCard.Root handle={rackBetaPreview}>
        <TRPreviewCard.Portal>
          <TRPreviewCard.Positioner sideOffset={8}>
            <TRPreviewCard.Popup>
              <strong>Rack Beta</strong>
              <p>Degraded · 8 of 10 services healthy</p>
              <TRPreviewCard.Arrow />
            </TRPreviewCard.Popup>
          </TRPreviewCard.Positioner>
        </TRPreviewCard.Portal>
      </TRPreviewCard.Root>
    </>
  );
}`;

export const previewCardPositioningSource = `import { TRPreviewCard } from '@tinyrack/ui/components/preview-card';

export function EdgeRackPreview() {
  return (
    <TRPreviewCard.Root defaultOpen>
      <TRPreviewCard.Trigger href="#edge-rack">Edge rack</TRPreviewCard.Trigger>
      <TRPreviewCard.Portal>
        <TRPreviewCard.Positioner align="end" side="top">
          <TRPreviewCard.Popup>
            <TRPreviewCard.Arrow />
            <strong>Edge rack</strong>
            <p>Collision-aware preview content remains inside the viewport.</p>
          </TRPreviewCard.Popup>
        </TRPreviewCard.Positioner>
      </TRPreviewCard.Portal>
    </TRPreviewCard.Root>
  );
}`;

export function PreviewCardSideComparison() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <PreviewCardPreview
          defaultOpen
          key={side}
          label={side}
          side={side}
          title={side}
        />
      ))}
    </div>
  );
}

export function PreviewCardAlignComparison() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(['start', 'center', 'end'] as const).map((align) => (
        <PreviewCardPreview
          align={align}
          defaultOpen
          key={align}
          label={align}
          title={align}
        />
      ))}
    </div>
  );
}

export function PreviewCardLongContent() {
  const copy = previewCardCopy[useDemoLocale()];
  return (
    <PreviewCardPreview
      align="end"
      defaultOpen
      description={copy.edge}
      label="Edge rack"
      side="right"
      title="Edge rack"
    />
  );
}

const meta = {
  title: 'Components/Preview Card',
  excludeStories: /.*(Preview|Source)$/,
  parameters: { layout: 'centered' },
  args: {
    align: 'center',
    description: 'Healthy · 12 services',
    label: 'Rack Alpha',
    side: 'bottom',
    title: 'Rack Alpha',
  },
  localizedArgs: {
    ja: {
      description: '正常 · 12 サービス',
      label: 'ラック Alpha',
      title: 'ラック Alpha',
    },
    ko: { description: '정상 · 서비스 12개', label: '랙 알파', title: '랙 알파' },
  },
  argTypes: {
    align: { control: 'select', options: ['start', 'center', 'end'] },
    description: { control: 'text' },
    label: { control: 'text' },
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    title: { control: 'text' },
  },
  render: (args) => <PreviewCardPreview {...args} />,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
