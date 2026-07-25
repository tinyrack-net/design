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
  loadingLabel: string;
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
    loadingLabel: 'Deploying changes',
    uiSize: 'md',
    intent: 'primary',
  },
  argTypes: {
    appearance: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    loadingLabel: {
      control: 'text',
      when: (args) => args['loading'] === true,
    },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    intent: {
      control: 'select',
      options: ['neutral', 'primary', 'info', 'success', 'warning', 'danger'],
    },
  },
  localizedArgs: {
    ja: { children: 'デプロイ', loadingLabel: '変更をデプロイ中' },
    ko: { children: '배포', loadingLabel: '변경 사항 배포 중' },
  },
  render: (args) => <ButtonPreview {...args} />,
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const playground = definePlayground(meta);
