import { TRCheckbox } from '@tinyrack/ui/components/checkbox';
import { TRField } from '@tinyrack/ui/components/field';
import { TRFieldset } from '@tinyrack/ui/components/fieldset';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const copy = {
  en: {
    notifications: 'Notifications',
    email: 'Email alerts',
    incidents: 'Incident summaries',
    editable: 'Editable settings',
    managed: 'Managed settings',
    incidentNotifications: 'Incident notifications',
    enable: 'Enable incident notifications',
    delivery: 'Delivery channels',
    emailChannel: 'Email',
    sms: 'SMS',
  },
  ko: {
    notifications: '알림',
    email: '이메일 알림 받기',
    incidents: '인시던트 요약 받기',
    editable: '직접 변경하는 설정',
    managed: '관리되는 설정',
    incidentNotifications: '인시던트 알림',
    enable: '인시던트 알림 사용',
    delivery: '전송 채널',
    emailChannel: '이메일',
    sms: '문자 메시지',
  },
  ja: {
    notifications: '通知',
    email: 'メールアラート',
    incidents: 'インシデントの概要',
    editable: '編集可能な設定',
    managed: '管理された設定',
    incidentNotifications: 'インシデント通知',
    enable: 'インシデント通知を有効にする',
    delivery: '配信チャネル',
    emailChannel: 'メール',
    sms: 'SMS',
  },
} as const;

type StoryArgs = {
  disabled: boolean;
  emailAlerts: boolean;
  legend: string;
};

type FieldsetPreviewProps = Omit<StoryArgs, 'emailAlerts'> & {
  'data-docs-example-item'?: string;
  defaultEmailAlerts?: boolean;
  emailAlerts?: boolean;
  onEmailAlertsChange?: (checked: boolean) => void;
};

export function FieldsetPreview({
  'data-docs-example-item': docsExampleItem,
  defaultEmailAlerts,
  disabled,
  emailAlerts,
  legend,
  onEmailAlertsChange,
}: FieldsetPreviewProps) {
  const locale = useDemoLocale();
  const text = copy[locale];

  return (
    <TRFieldset.Root
      className="w-full max-w-80 min-w-0"
      data-docs-example-item={docsExampleItem}
      disabled={disabled}
    >
      <TRFieldset.Legend>{legend}</TRFieldset.Legend>
      <TRField.Root className="gap-3">
        <TRField.Item className="items-center gap-2">
          <TRCheckbox.Root
            checked={emailAlerts}
            defaultChecked={emailAlerts === undefined ? defaultEmailAlerts : undefined}
            onCheckedChange={(checked) => onEmailAlertsChange?.(checked)}
          >
            <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
          </TRCheckbox.Root>
          <TRField.Label className="normal-case tracking-normal font-normal">
            {text.email}
          </TRField.Label>
        </TRField.Item>
        <TRField.Item className="items-center gap-2">
          <TRCheckbox.Root defaultChecked>
            <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
          </TRCheckbox.Root>
          <TRField.Label className="normal-case tracking-normal font-normal">
            {text.incidents}
          </TRField.Label>
        </TRField.Item>
      </TRField.Root>
    </TRFieldset.Root>
  );
}

export function FieldsetStateComparison() {
  const locale = useDemoLocale();
  const text = copy[locale];
  return (
    <div className="grid min-w-0 gap-5 sm:grid-cols-2">
      <FieldsetPreview defaultEmailAlerts disabled={false} legend={text.editable} />
      <FieldsetPreview defaultEmailAlerts disabled legend={text.managed} />
    </div>
  );
}

export function FieldsetCompositionExample() {
  const locale = useDemoLocale();
  const text = copy[locale];

  return (
    <TRFieldset.Root className="w-full max-w-md min-w-0">
      <TRFieldset.Legend>{text.incidentNotifications}</TRFieldset.Legend>
      <TRField.Root>
        <TRField.Item className="items-center gap-2">
          <TRCheckbox.Root defaultChecked>
            <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
          </TRCheckbox.Root>
          <TRField.Label className="normal-case tracking-normal font-normal">
            {text.enable}
          </TRField.Label>
        </TRField.Item>
      </TRField.Root>
      <TRFieldset.Root>
        <TRFieldset.Legend>{text.delivery}</TRFieldset.Legend>
        <TRField.Root className="gap-3">
          <TRField.Item className="items-center gap-2">
            <TRCheckbox.Root defaultChecked>
              <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
            </TRCheckbox.Root>
            <TRField.Label className="normal-case tracking-normal font-normal">
              {text.emailChannel}
            </TRField.Label>
          </TRField.Item>
          <TRField.Item className="items-center gap-2">
            <TRCheckbox.Root>
              <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
            </TRCheckbox.Root>
            <TRField.Label className="normal-case tracking-normal font-normal">
              {text.sms}
            </TRField.Label>
          </TRField.Item>
        </TRField.Root>
      </TRFieldset.Root>
    </TRFieldset.Root>
  );
}

const meta = {
  title: 'Components/Fieldset',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    emailAlerts: true,
    legend: 'Notifications',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    legend: { control: 'text' },
  },
  render: function Render(args) {
    const locale = useDemoLocale();
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <FieldsetPreview
        {...args}
        legend={
          args.legend === 'Notifications' ? copy[locale].notifications : args.legend
        }
        onEmailAlertsChange={(emailAlerts) => updateArgs({ emailAlerts })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
