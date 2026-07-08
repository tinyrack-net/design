import type { Meta, StoryObj } from '@storybook/react-vite';

const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type ComponentStoryProps = {
  size?: (typeof daisySizeOptions)[number];
  bordered?: boolean;
  imageSide?: boolean;
};

function CardStory(controlValues: ComponentStoryProps) {
  const size = controlValues.size ?? 'md';
  const imageSide = controlValues.imageSide ?? false;

  return (
    <article
      className={[
        'card w-80 bg-base-200 shadow-sm',
        `card-${size}`,
        (controlValues.bordered ?? true) ? 'card-border' : undefined,
        imageSide ? 'card-side' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {imageSide ? <div className="w-20 bg-primary" /> : null}
      <div className="card-body">
        <h2 className="card-title">nas-01</h2>
        <p>Backup window is healthy.</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary btn-sm" type="button">
            Open
          </button>
        </div>
      </div>
    </article>
  );
}

CardStory.displayName = 'CardStory';

const meta = {
  title: 'daisyUI/Card',
  component: CardStory,
  tags: ['autodocs'],
  args: {
    size: 'md',
    bordered: true,
    imageSide: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: daisySizeOptions,
      description: 'Size modifier class.',
    },
    bordered: {
      control: 'boolean',
      description: 'Applies card-border.',
    },
    imageSide: {
      control: 'boolean',
      description: 'Applies card-side layout.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI card themed preview',
      },
    },
  },
} satisfies Meta<typeof CardStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
