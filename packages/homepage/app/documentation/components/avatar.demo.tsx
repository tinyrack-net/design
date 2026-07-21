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

const avatarFixture = new URL(
  '../../content/fixtures/tinyrack-avatar.svg',
  import.meta.url,
).href;

type AvatarStoryArgs = {
  fallback: string;
  imageState: 'loaded' | 'missing' | 'error';
  shape: TRAvatarShape;
  size: TRAvatarUiSize;
};

const meta = {
  title: 'Components/Avatar',
  parameters: { layout: 'centered' },
  args: { fallback: 'TR', imageState: 'loaded', shape: 'circle', size: 'md' },
  argTypes: {
    fallback: { control: 'text' },
    imageState: { control: 'select', options: ['loaded', 'missing', 'error'] },
    shape: { control: 'select', options: ['circle', 'square'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: ({ fallback, imageState, ...rootProps }) => (
    <TRAvatar.Root {...rootProps}>
      {imageState === 'missing' ? null : (
        <TRAvatar.Image
          alt="Tinyrack server rack"
          src={imageState === 'loaded' ? avatarFixture : '/missing-avatar.svg'}
        />
      )}
      <TRAvatar.Fallback>{fallback}</TRAvatar.Fallback>
    </TRAvatar.Root>
  ),
} satisfies Meta<AvatarStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
