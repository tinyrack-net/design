import { TRCode } from '@tinyrack/ui/components/code';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type CodeStoryArgs = { children: string };

const meta = {
  title: 'Components/Code',
  component: TRCode,
  parameters: { layout: 'centered' },
  args: { children: 'pnpm verify' },
  argTypes: {
    children: { control: 'textarea' },
  },
  render: ({ children }) => {
    const locale = useDemoLocale();
    const copy = {
      en: (
        <>
          Run <TRCode>{children}</TRCode> before publishing.
        </>
      ),
      ja: (
        <>
          公開前に <TRCode>{children}</TRCode> を実行します。
        </>
      ),
      ko: (
        <>
          게시하기 전에 <TRCode>{children}</TRCode>를 실행하세요.
        </>
      ),
    };
    return <p className="m-0 max-w-80">{copy[locale]}</p>;
  },
} satisfies Meta<CodeStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
