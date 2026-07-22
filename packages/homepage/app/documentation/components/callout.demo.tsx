import { TRCallout, type TRCalloutVariant } from '@tinyrack/ui/components/callout';
import { TRCode } from '@tinyrack/ui/components/code';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const copy = {
  en: { caution: 'Caution', cautionBody: 'A condition that may cause an unexpected result.', danger: 'Danger', dangerBody: 'An action that can cause data loss or an outage.', note: 'Note', noteBody: 'Background information that helps explain the task.', tip: 'Tip', tipBody: 'An optional technique that can make the task easier.' },
  ko: { caution: '주의', cautionBody: '예상하지 못한 결과를 일으킬 수 있는 조건이에요.', danger: '위험', dangerBody: '데이터 손실이나 중단을 일으킬 수 있는 동작이에요.', note: '참고', noteBody: '작업을 이해하는 데 도움이 되는 배경 정보예요.', tip: '팁', tipBody: '작업을 더 쉽게 만들 수 있는 선택적 방법이에요.' },
  ja: { caution: '注意', cautionBody: '予期しない結果を招く可能性がある条件です。', danger: '危険', dangerBody: 'データ損失や停止につながる操作です。', note: '注記', noteBody: '作業の理解に役立つ背景情報です。', tip: 'ヒント', tipBody: '作業を進めやすくする任意の方法です。' },
} as const;

type Args = {
  children: string;
  title: string;
  variant: TRCalloutVariant;
};
export function CalloutPreview({
  children = 'Keep credentials out of source control.',
  title = '',
  variant,
}: Args) {
  const locale = useDemoLocale();
  const text = copy[locale];
  const localizedChildren = children === 'Keep credentials out of source control.'
    ? { en: 'Keep credentials out of source control.', ko: '인증 정보는 소스 제어에 저장하지 마세요.', ja: '認証情報をソース管理に保存しないでください。' }[locale]
    : children;
  return (
    <TRCallout data-docs-example-item="" title={title || text[variant]} variant={variant}>
      {localizedChildren}
    </TRCallout>
  );
}

const variants = ['note', 'tip', 'caution', 'danger'] as const;

export function CalloutVariantMatrix() {
  const locale = useDemoLocale();
  const text = copy[locale];
  const messages = {
    note: text.noteBody,
    tip: text.tipBody,
    caution: text.cautionBody,
    danger: text.dangerBody,
  } as const;
  return (
    <div className="grid w-full gap-4">
      {variants.map((variant) => (
        <TRCallout data-docs-example-item="" key={variant} title={text[variant]} variant={variant}>
          {messages[variant]}
        </TRCallout>
      ))}
    </div>
  );
}

export function CalloutRichContentPreview() {
  const locale = useDemoLocale();
  const content = {
    en: { title: 'Before you deploy', lead: 'Confirm the production environment is selected, then:', first: 'review the pending migrations;', second: 'create a database backup.', tail: 'only after both checks pass.' },
    ko: { title: '배포 전 확인', lead: '프로덕션 환경을 선택했는지 확인한 다음:', first: '대기 중인 마이그레이션을 검토하고', second: '데이터베이스 백업을 만드세요.', tail: '두 확인을 모두 마친 후에만 실행하세요.' },
    ja: { title: 'デプロイ前の確認', lead: '本番環境が選択されていることを確認してから、次を行います。', first: '保留中のマイグレーションを確認する', second: 'データベースのバックアップを作成する', tail: '両方の確認が完了してから実行してください。' },
  } as const;
  const text = content[locale];
  return (
    <TRCallout data-docs-example-item="" title={text.title} variant="caution">
      <p>{text.lead}</p>
      <ul>
        <li>{text.first}</li>
        <li>{text.second}</li>
      </ul>
      <p>
        <TRCode>pnpm deploy</TRCode> {text.tail}
      </p>
    </TRCallout>
  );
}

const meta = {
  args: {
    children: 'Keep credentials out of source control.',
    title: '',
    variant: 'note',
  },
  argTypes: {
    children: { control: 'text' },
    title: { control: 'text' },
    variant: { control: 'select', options: ['note', 'tip', 'caution', 'danger'] },
  },
  parameters: { layout: 'centered' },
  render: CalloutPreview,
  title: 'Components/Callout',
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const playground = definePlayground(meta);
