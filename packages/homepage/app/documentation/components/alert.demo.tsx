import { TRAlert } from '@tinyrack/ui/components/alert';
import { TRButton } from '@tinyrack/ui/components/button';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const copy = {
  en: {
    description: 'The rollout will start shortly.',
    details: 'View details',
    title: 'Deployment queued',
  },
  ko: {
    description: '곧 배포를 시작해요.',
    details: '세부 정보 보기',
    title: '배포 대기 중',
  },
  ja: {
    description: 'まもなくデプロイを開始します。',
    details: '詳細を見る',
    title: 'デプロイ待機中',
  },
} as const;

type AlertVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type AlertRole = 'none' | 'status' | 'alert';
type AlertStoryArgs = {
  description: string;
  role: AlertRole;
  showActions: boolean;
  title: string;
  variant: AlertVariant;
};

const meta = {
  title: 'Components/Alert',
  parameters: { layout: 'centered' },
  args: {
    description: 'The rollout will start shortly.',
    role: 'status',
    showActions: true,
    title: 'Deployment queued',
    variant: 'info',
  },
  argTypes: {
    description: { control: 'text' },
    role: { control: 'select', options: ['none', 'status', 'alert'] },
    showActions: { control: 'boolean' },
    title: { control: 'text' },
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'success', 'warning', 'danger'],
    },
  },
  render: ({ description, role, showActions, title, variant }) => {
    const locale = useDemoLocale();
    const text = copy[locale];
    const localizedDescription =
      description === meta.args.description ? text.description : description;
    const localizedTitle = title === meta.args.title ? text.title : title;
    return (
      <TRAlert.Root
        className="max-w-md"
        role={role === 'none' ? undefined : role}
        variant={variant}
      >
        <TRAlert.Title render={<h3>{localizedTitle}</h3>} />
        <TRAlert.Description>{localizedDescription}</TRAlert.Description>
        {showActions ? (
          <TRAlert.Actions>
            <TRButton appearance="outline" intent={variant} type="button">
              {text.details}
            </TRButton>
          </TRAlert.Actions>
        ) : null}
      </TRAlert.Root>
    );
  },
} satisfies Meta<AlertStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
