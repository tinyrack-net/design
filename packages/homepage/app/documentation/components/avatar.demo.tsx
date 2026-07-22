import {
  TRAvatar,
  type TRAvatarShape,
  type TRAvatarUiSize,
} from '@tinyrack/ui/components/avatar';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const imageAlt = {
  en: 'Tinyrack server rack',
  ko: 'Tinyrack 서버 랙',
  ja: 'Tinyrack のサーバーラック',
} as const;

const avatarFixture = new URL(
  '../../content/fixtures/tinyrack-avatar.svg',
  import.meta.url,
).href;
const unavailableAvatar = 'data:image/png;base64,aW52YWxpZA==';

type AvatarStoryArgs = {
  fallback: string;
  imageState: 'loaded' | 'missing' | 'error';
  shape: TRAvatarShape;
  uiSize: TRAvatarUiSize;
};

const meta = {
  title: 'Components/Avatar',
  parameters: { layout: 'centered' },
  args: { fallback: 'TR', imageState: 'loaded', shape: 'circle', uiSize: 'md' },
  argTypes: {
    fallback: { control: 'text', when: (args) => args['imageState'] !== 'loaded' },
    imageState: { control: 'select', options: ['loaded', 'missing', 'error'] },
    shape: { control: 'select', options: ['circle', 'square'] },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: ({ fallback, imageState, shape, uiSize }) => {
    const locale = useDemoLocale();
    return (
      <TRAvatar.Root shape={shape} uiSize={uiSize}>
        {imageState === 'missing' ? null : (
          <TRAvatar.Image
            alt={imageAlt[locale]}
            src={imageState === 'loaded' ? avatarFixture : unavailableAvatar}
          />
        )}
        <TRAvatar.Fallback>{fallback}</TRAvatar.Fallback>
      </TRAvatar.Root>
    );
  },
} satisfies Meta<AvatarStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
