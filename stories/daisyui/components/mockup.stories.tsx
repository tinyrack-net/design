import type { Meta, StoryObj } from '@storybook/react-vite';

const daisyMockupFrameOptions = ['code', 'window', 'browser', 'phone'] as const;

type ComponentStoryProps = {
  frame?: (typeof daisyMockupFrameOptions)[number];
};

function MockupStory(controlValues: ComponentStoryProps) {
  const frame = controlValues.frame ?? 'code';

  if (frame === 'code') {
    return (
      <div className="mockup-code w-[min(100%,24rem)]">
        <pre data-prefix=">">
          <code>tinyrack status</code>
        </pre>
        <pre data-prefix="OK" className="text-success">
          <code>all services healthy</code>
        </pre>
      </div>
    );
  }

  if (frame === 'phone') {
    return (
      <div className="mockup-phone">
        <div className="mockup-phone-camera" />
        <div className="mockup-phone-display grid h-64 place-content-center bg-base-200">
          Status
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        frame === 'browser' ? 'mockup-browser' : 'mockup-window',
        'w-[min(100%,24rem)] border border-base-300 bg-base-300',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {frame === 'browser' ? (
        <div className="mockup-browser-toolbar">
          <div className="input">tinyrack.local</div>
        </div>
      ) : null}
      <div className="grid h-32 place-content-center bg-base-100">Status board</div>
    </div>
  );
}

MockupStory.displayName = 'MockupStory';

const meta = {
  title: 'daisyUI/Mockup',
  component: MockupStory,
  tags: ['autodocs'],
  args: {
    frame: 'code',
  },
  argTypes: {
    frame: {
      control: 'select',
      options: daisyMockupFrameOptions,
      description: 'Mockup frame class.',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'daisyUI mockup themed preview',
      },
    },
  },
} satisfies Meta<typeof MockupStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
