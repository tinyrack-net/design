import {
  Avatar,
  type AvatarShape,
  type AvatarSize,
} from '@tinyrack/ui/components/avatar';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

const avatarFixture = new URL('../fixtures/tinyrack-avatar.svg', import.meta.url).href;

type AvatarStoryArgs = {
  fallback: string;
  image: boolean;
  shape: AvatarShape;
  size: AvatarSize;
};

const meta = {
  title: 'Components/Avatar',
  parameters: { layout: 'centered' },
  args: { fallback: 'TR', image: true, shape: 'circle', size: 'md' },
  argTypes: {
    fallback: { control: 'text' },
    image: { control: 'boolean' },
    shape: { control: 'select', options: ['circle', 'square'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: ({ fallback, image, ...rootProps }) => (
    <Avatar.Root {...rootProps}>
      {image ? <Avatar.Image alt="Tinyrack server rack" src={avatarFixture} /> : null}
      <Avatar.Fallback>{fallback}</Avatar.Fallback>
    </Avatar.Root>
  ),
} satisfies Meta<AvatarStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
