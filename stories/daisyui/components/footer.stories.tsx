import type { Meta, StoryObj } from '@storybook/react-vite';

const daisyOrientationOptions = ['horizontal', 'vertical'] as const;

type ComponentStoryProps = {
  orientation?: (typeof daisyOrientationOptions)[number];
};

function FooterStory(controlValues: ComponentStoryProps) {
  const orientation = controlValues.orientation ?? 'horizontal';

  return (
    <footer
      className={[
        'footer w-96 rounded-box bg-base-200 p-6 text-base-content',
        `footer-${orientation}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <aside>
        <span className="footer-title">Tinyrack</span>
        <p>Homelab operations</p>
      </aside>
      <nav>
        <span className="footer-title">Links</span>
        <a className="link link-hover" href="#top">
          Status
        </a>
      </nav>
    </footer>
  );
}

FooterStory.displayName = 'FooterStory';

const meta = {
  title: 'daisyUI/Footer',
  component: FooterStory,
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: daisyOrientationOptions,
      description: 'Footer orientation class.',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'daisyUI footer themed preview',
      },
    },
  },
} satisfies Meta<typeof FooterStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
