import type { Meta, StoryObj } from '@storybook/react-vite';

function BreadcrumbsStory() {
  return (
    <div className="breadcrumbs text-tinyrack-sm">
      <ul>
        <li>
          <a href="#daisyui-breadcrumbs-home">Rack</a>
        </li>
        <li>Nodes</li>
      </ul>
    </div>
  );
}

BreadcrumbsStory.displayName = 'BreadcrumbsStory';

const meta = {
  title: 'daisyUI/Breadcrumbs',
  component: BreadcrumbsStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI breadcrumbs themed preview',
      },
    },
  },
} satisfies Meta<typeof BreadcrumbsStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
