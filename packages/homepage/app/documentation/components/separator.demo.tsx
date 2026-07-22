import { TRSeparator, type TRSeparatorProps } from '@tinyrack/ui/components/separator';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const copy = {
  en: { cpu: 'CPU', decorative: 'Decorative divider', memory: 'Memory', network: 'Network', overview: 'Overview', semantic: 'Semantic separator' },
  ko: { cpu: 'CPU', decorative: '장식용 구분선', memory: '메모리', network: '네트워크', overview: '개요', semantic: '의미 있는 구분선' },
  ja: { cpu: 'CPU', decorative: '装飾用の区切り線', memory: 'メモリ', network: 'ネットワーク', overview: '概要', semantic: '意味のある区切り線' },
} as const;

type SeparatorStoryArgs = {
  decorative: boolean;
  orientation: NonNullable<TRSeparatorProps['orientation']>;
};

const meta = {
  title: 'Components/Separator',
  component: TRSeparator,
  parameters: { layout: 'centered' },
  args: { decorative: false, orientation: 'horizontal' },
  argTypes: {
    decorative: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  render: ({ decorative, orientation }) => {
    const locale = useDemoLocale();
    const text = copy[locale];
    return orientation === 'vertical' ? (
      <div className="grid justify-items-center gap-3">
        <div className="flex h-16 items-center gap-4">
          <span>{text.cpu}</span>
          <TRSeparator
            orientation={orientation}
            role={decorative ? 'presentation' : 'separator'}
          />
          <span>{text.memory}</span>
        </div>
        <span className="text-tinyrack-xs text-tinyrack-text-muted">
          {decorative ? text.decorative : text.semantic}
        </span>
      </div>
    ) : (
      <div className="grid w-full max-w-80 gap-3">
        <span>{text.overview}</span>
        <TRSeparator
          orientation={orientation}
          role={decorative ? 'presentation' : 'separator'}
        />
        <span>{text.network}</span>
        <span className="text-tinyrack-xs text-tinyrack-text-muted">
          {decorative ? text.decorative : text.semantic}
        </span>
      </div>
    );
  },
} satisfies Meta<SeparatorStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
