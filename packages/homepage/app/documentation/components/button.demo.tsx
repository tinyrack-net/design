import {
  TRButton,
  type TRButtonAppearance,
  type TRButtonIntent,
  type TRButtonUiSize,
} from '@tinyrack/ui/components/button';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';

type ButtonStoryArgs = {
  appearance: TRButtonAppearance;
  children: string;
  disabled: boolean;
  intent: TRButtonIntent;
  loading: boolean;
  uiSize: TRButtonUiSize;
};

function ButtonPreview(args: ButtonStoryArgs) {
  return <TRButton {...args} />;
}

const meta = {
  title: 'Components/Button',
  component: TRButton,
  parameters: { layout: 'centered' },
  args: {
    appearance: 'solid',
    children: 'Deploy',
    disabled: false,
    loading: false,
    uiSize: 'md',
    intent: 'primary',
  },
  argTypes: {
    appearance: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    intent: {
      control: 'select',
      options: ['neutral', 'primary', 'info', 'success', 'warning', 'danger'],
    },
  },
  localizedArgs: {
    ja: { children: 'デプロイ' },
    ko: { children: '배포' },
  },
  render: (args) => <ButtonPreview {...args} />,
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const playground = definePlayground(meta);
