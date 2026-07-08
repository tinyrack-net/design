import type { Meta, StoryObj } from '@storybook/react-vite';

type ComponentStoryProps = {
  style?: 'default' | 'border' | 'dash';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'default' | 'side';
  actions?: boolean;
};

function CardStory(controlValues: ComponentStoryProps) {
  const style = controlValues.style ?? 'default';
  const size = controlValues.size ?? 'md';
  const layout = controlValues.layout ?? 'default';
  const actions = controlValues.actions ?? true;

  return (
    <div
      className={[
        'card bg-base-100 border border-base-300 shadow-md w-80 max-w-full',
        style === 'default' ? undefined : `card-${style}`,
        `card-${size}`,
        layout === 'default' ? undefined : `card-${layout}`,
        layout === 'side' && 'max-w-md',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {layout === 'side' ? (
        <figure className="bg-base-200 min-w-24">
          <div className="text-primary text-tinyrack-2xl font-bold">TR</div>
        </figure>
      ) : null}
      <div className="card-body">
        <h3 className="card-title">node-01</h3>
        <p>CPU 34%, memory 61%, last backup 18 minutes ago.</p>
        {actions ? (
          <div className="card-actions justify-end">
            <button className="btn btn-primary btn-sm" type="button">
              Open node
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

CardStory.displayName = 'CardStory';

const meta = {
  title: 'daisyUI/Card',
  component: CardStory,
  tags: ['autodocs'],
  args: {
    style: 'default',
    size: 'md',
    layout: 'default',
    actions: true,
  },
  argTypes: {
    style: {
      control: 'select',
      options: ['default', 'border', 'dash'],
      description: 'Card border treatment class.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size modifier class from xs through xl.',
    },
    layout: {
      control: 'select',
      options: ['default', 'side'],
      description: 'Card layout class.',
    },
    actions: { control: 'boolean', description: 'Shows a card-actions footer.' },
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
