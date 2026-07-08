import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  status?: 'none' | 'online' | 'offline';
  placeholder?: boolean;
  grouped?: boolean;
};

function AvatarStory(controlValues: ComponentStoryProps) {
  const status = controlValues.status ?? 'online';
  const avatarClass = [
    'avatar',
    status === 'none' ? undefined : `avatar-${status}`,
    (controlValues.placeholder ?? false) ? 'avatar-placeholder' : undefined,
  ]
    .filter(Boolean)
    .join(' ');
  const avatar = (
    <div className={avatarClass}>
      <div
        className="h-16 w-16 rounded-full bg-neutral text-neutral-content"
        style={{ display: 'grid', placeItems: 'center' }}
      >
        <span className="text-xl leading-none">TR</span>
      </div>
    </div>
  );

  if (!(controlValues.grouped ?? false)) {
    return avatar;
  }

  return (
    <div className="avatar-group -space-x-4">
      {avatar}
      <div className="avatar avatar-placeholder">
        <div className="w-16 rounded-full bg-base-300 text-base-content">
          <span>+2</span>
        </div>
      </div>
    </div>
  );
}

AvatarStory.displayName = 'AvatarStory';

const meta = {
  title: 'daisyUI/Avatar',
  component: AvatarStory,
  tags: ['autodocs'],
  args: {
    status: 'online',
    placeholder: true,
    grouped: false,
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['none', 'online', 'offline'],
      description: 'Avatar presence state.',
    },
    placeholder: {
      control: 'boolean',
      description: 'Uses avatar-placeholder styling.',
    },
    grouped: {
      control: 'boolean',
      description: 'Shows avatar-group composition.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI avatar themed preview',
      },
    },
  },
} satisfies Meta<typeof AvatarStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
