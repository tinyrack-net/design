import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { TRSelect, type TRSelectTriggerUiSize } from '@tinyrack/ui/components/select';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import { definePlayground } from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

type StoryArgs = {
  disabled: boolean;
  disabledItem: boolean;
  readOnly: boolean;
  uiSize: TRSelectTriggerUiSize;
};

type SelectPreviewProps = Omit<StoryArgs, 'disabledItem' | 'uiSize'> & {
  'data-docs-example-item'?: string;
  defaultOpen?: boolean;
  defaultValue?: string;
  disabledItem?: boolean;
  label?: string;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string | null) => void;
  open?: boolean;
  required?: boolean;
  uiSize?: TRSelectTriggerUiSize;
  value?: string | null;
};

const copy = {
  en: {
    alpha: 'Rack Alpha',
    beta: 'Rack Beta',
    gamma: 'Rack Gamma',
    rackPrefix: 'Rack',
    deploy: 'Deploy',
    deploymentRack: 'Deployment rack',
    disabled: 'Disabled',
    editable: 'Editable',
    longCollection: 'Long rack collection',
    nonProduction: 'Non-production',
    offline: 'Offline',
    placeholder: 'Choose a rack',
    production: 'Production',
    readOnly: 'Read only',
    required: 'Choose a deployment rack.',
    scrollDown: 'Scroll down',
    scrollUp: 'Scroll up',
    staging: 'Staging rack',
    ready: (rack: string) => `Ready to deploy to ${rack}.`,
    zone: 'Seoul availability zone',
  },
  ko: {
    alpha: '랙 알파',
    beta: '랙 베타',
    gamma: '랙 감마',
    rackPrefix: '랙',
    deploy: '배포',
    deploymentRack: '배포 랙',
    disabled: '사용 불가',
    editable: '편집 가능',
    longCollection: '긴 랙 목록',
    nonProduction: '비프로덕션',
    offline: '오프라인',
    placeholder: '랙 선택',
    production: '프로덕션',
    readOnly: '읽기 전용',
    required: '배포할 랙을 선택하세요.',
    scrollDown: '아래로 스크롤',
    scrollUp: '위로 스크롤',
    staging: '스테이징 랙',
    ready: (rack: string) => `${rack}에 배포할 준비가 됐어요.`,
    zone: '서울 가용 영역',
  },
  ja: {
    alpha: 'ラックアルファ',
    beta: 'ラックベータ',
    gamma: 'ラックガンマ',
    rackPrefix: 'ラック',
    deploy: 'デプロイ',
    deploymentRack: 'デプロイ先ラック',
    disabled: '無効',
    editable: '変更可能',
    longCollection: '長いラック一覧',
    nonProduction: '非本番',
    offline: 'オフライン',
    placeholder: 'ラックを選択',
    production: '本番',
    readOnly: '読み取り専用',
    required: 'デプロイ先ラックを選択してください。',
    scrollDown: '下にスクロール',
    scrollUp: '上にスクロール',
    staging: 'ステージングラック',
    ready: (rack: string) => `${rack} にデプロイする準備ができました。`,
    zone: 'ソウル可用性ゾーン',
  },
} as const;

const longSelectItems = Object.fromEntries(
  Array.from({ length: 18 }, (_, index) => [
    `rack-${index + 1}`,
    `Rack ${String(index + 1).padStart(2, '0')} · Seoul availability zone`,
  ]),
);

export function SelectLongCollection() {
  const locale = useDemoLocale();
  const text = copy[locale];
  const localizedItems = Object.fromEntries(
    Object.keys(longSelectItems).map((value, index) => [
      value,
      `${text.rackPrefix} ${String(index + 1).padStart(2, '0')} · ${text.zone}`,
    ]),
  );
  return (
    <div data-docs-example-item="" data-docs-example-item-count={1}>
      <TRSelect.Root defaultValue="rack-1" items={localizedItems}>
        <TRSelect.Label>{text.longCollection}</TRSelect.Label>
        <TRSelect.Trigger aria-label={text.longCollection}>
          <TRSelect.Value />
          <TRSelect.Icon aria-hidden="true">
            <ChevronDown />
          </TRSelect.Icon>
        </TRSelect.Trigger>
        <TRSelect.Portal>
          <TRSelect.Positioner sideOffset={8}>
            <TRSelect.Popup>
              <TRSelect.Arrow />
              <TRSelect.ScrollUpArrow aria-label={text.scrollUp}>
                ↑
              </TRSelect.ScrollUpArrow>
              <TRSelect.List>
                {Object.entries(localizedItems).map(([value, label]) => (
                  <TRSelect.Item key={value} value={value}>
                    <TRSelect.ItemText>{label}</TRSelect.ItemText>
                    <TRSelect.ItemIndicator aria-hidden="true">
                      ✓
                    </TRSelect.ItemIndicator>
                  </TRSelect.Item>
                ))}
              </TRSelect.List>
              <TRSelect.ScrollDownArrow aria-label={text.scrollDown}>
                ↓
              </TRSelect.ScrollDownArrow>
            </TRSelect.Popup>
          </TRSelect.Positioner>
        </TRSelect.Portal>
      </TRSelect.Root>
    </div>
  );
}

export function SelectPreview({
  'data-docs-example-item': docsExampleItem,
  defaultOpen,
  defaultValue,
  disabled,
  disabledItem = false,
  label,
  onOpenChange,
  onValueChange,
  open,
  readOnly,
  required,
  uiSize = 'md',
  value,
}: SelectPreviewProps) {
  const locale = useDemoLocale();
  const text = copy[locale];
  const localizedLabel = label ?? text.deploymentRack;
  const localizedItems = {
    alpha: text.alpha,
    beta: text.beta,
    gamma: text.gamma,
    staging: text.staging,
  };
  const openProps = open === undefined ? { defaultOpen } : { open };
  const valueProps = value === undefined ? { defaultValue } : { value };

  return (
    <div data-docs-example-item={docsExampleItem}>
      <TRSelect.Root
        {...openProps}
        {...valueProps}
        disabled={disabled}
        items={localizedItems}
        name="rack"
        onOpenChange={onOpenChange}
        onValueChange={(nextValue) =>
          onValueChange?.((nextValue as string | null) ?? null)
        }
        readOnly={readOnly}
        required={required}
      >
        <TRSelect.Label>{localizedLabel}</TRSelect.Label>
        <TRSelect.Trigger aria-label={localizedLabel} uiSize={uiSize}>
          <TRSelect.Value placeholder={text.placeholder} />
          <TRSelect.Icon aria-hidden="true">
            <ChevronDown />
          </TRSelect.Icon>
        </TRSelect.Trigger>
        <TRSelect.Portal>
          <TRSelect.Positioner sideOffset={8}>
            <TRSelect.Popup>
              <TRSelect.Arrow />
              <TRSelect.ScrollUpArrow aria-label={text.scrollUp}>
                ↑
              </TRSelect.ScrollUpArrow>
              <TRSelect.List>
                <TRSelect.Group>
                  <TRSelect.GroupLabel>{text.production}</TRSelect.GroupLabel>
                  <TRSelect.Item value="alpha">
                    <TRSelect.ItemText>{text.alpha}</TRSelect.ItemText>
                    <TRSelect.ItemIndicator aria-hidden="true">
                      ✓
                    </TRSelect.ItemIndicator>
                  </TRSelect.Item>
                  <TRSelect.Item value="beta">
                    <TRSelect.ItemText>{text.beta}</TRSelect.ItemText>
                    <TRSelect.ItemIndicator aria-hidden="true">
                      ✓
                    </TRSelect.ItemIndicator>
                  </TRSelect.Item>
                  <TRSelect.Item disabled={disabledItem} value="gamma">
                    <TRSelect.ItemText>
                      {text.gamma}
                      {disabledItem ? ` · ${text.offline}` : ''}
                    </TRSelect.ItemText>
                    <TRSelect.ItemIndicator aria-hidden="true">
                      ✓
                    </TRSelect.ItemIndicator>
                  </TRSelect.Item>
                </TRSelect.Group>
                <TRSelect.Separator />
                <TRSelect.Group>
                  <TRSelect.GroupLabel>{text.nonProduction}</TRSelect.GroupLabel>
                  <TRSelect.Item value="staging">
                    <TRSelect.ItemText>{text.staging}</TRSelect.ItemText>
                    <TRSelect.ItemIndicator aria-hidden="true">
                      ✓
                    </TRSelect.ItemIndicator>
                  </TRSelect.Item>
                </TRSelect.Group>
              </TRSelect.List>
              <TRSelect.ScrollDownArrow aria-label={text.scrollDown}>
                ↓
              </TRSelect.ScrollDownArrow>
            </TRSelect.Popup>
          </TRSelect.Positioner>
        </TRSelect.Portal>
      </TRSelect.Root>
    </div>
  );
}

export function SelectStateComparison() {
  const text = copy[useDemoLocale()];
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectPreview
        defaultValue="alpha"
        data-docs-example-item=""
        disabled={false}
        disabledItem
        label={text.editable}
        readOnly={false}
      />
      <SelectPreview
        defaultValue="beta"
        data-docs-example-item=""
        disabled
        disabledItem
        label={text.disabled}
        readOnly={false}
      />
      <SelectPreview
        defaultValue="staging"
        data-docs-example-item=""
        disabled={false}
        disabledItem
        label={text.readOnly}
        readOnly
      />
    </div>
  );
}

export function SelectSizeComparison() {
  return (
    <div className="grid gap-5" data-docs-example-item-count={3}>
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <SelectPreview
          data-docs-example-item=""
          defaultValue="alpha"
          disabled={false}
          key={uiSize}
          readOnly={false}
          uiSize={uiSize}
        />
      ))}
    </div>
  );
}

export const selectStatesSource = `import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/select.css';
import { TRSelect } from '@tinyrack/ui/components/select';
import { ChevronDown } from 'lucide-react';

const racks = {
  alpha: 'Rack Alpha',
  beta: 'Rack Beta',
  gamma: 'Rack Gamma',
  staging: 'Staging rack',
} as const;

function AvailabilitySelect({
  defaultValue,
  disabled = false,
  label,
  readOnly = false,
}: {
  defaultValue: keyof typeof racks;
  disabled?: boolean;
  label: string;
  readOnly?: boolean;
}) {
  return (
    <TRSelect.Root
      defaultValue={defaultValue}
      disabled={disabled}
      items={racks}
      name="rack"
      readOnly={readOnly}
    >
      <TRSelect.Label>{label}</TRSelect.Label>
      <TRSelect.Trigger aria-label={label}>
        <TRSelect.Value placeholder="Choose a rack" />
        <TRSelect.Icon aria-hidden="true">
          <ChevronDown />
        </TRSelect.Icon>
      </TRSelect.Trigger>
      <TRSelect.Portal>
        <TRSelect.Positioner sideOffset={8}>
          <TRSelect.Popup>
            <TRSelect.Arrow />
            <TRSelect.List>
              <TRSelect.Group>
                <TRSelect.GroupLabel>Production</TRSelect.GroupLabel>
                <TRSelect.Item value="alpha">
                  <TRSelect.ItemText>Rack Alpha</TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
                <TRSelect.Item value="beta">
                  <TRSelect.ItemText>Rack Beta</TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
                <TRSelect.Item disabled value="gamma">
                  <TRSelect.ItemText>Rack Gamma · Offline</TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
              </TRSelect.Group>
              <TRSelect.Separator />
              <TRSelect.Group>
                <TRSelect.GroupLabel>Non-production</TRSelect.GroupLabel>
                <TRSelect.Item value="staging">
                  <TRSelect.ItemText>Staging rack</TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
              </TRSelect.Group>
            </TRSelect.List>
          </TRSelect.Popup>
        </TRSelect.Positioner>
      </TRSelect.Portal>
    </TRSelect.Root>
  );
}

export function SelectStates() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <AvailabilitySelect defaultValue="alpha" label="Editable" />
      <AvailabilitySelect defaultValue="beta" disabled label="Disabled" />
      <AvailabilitySelect defaultValue="staging" label="Read only" readOnly />
    </div>
  );
}`;

export const selectStatesSourceKo = selectStatesSource
  .replaceAll('Rack Alpha', '랙 알파')
  .replaceAll('Rack Beta', '랙 베타')
  .replaceAll('Rack Gamma', '랙 감마')
  .replaceAll('Staging rack', '스테이징 랙')
  .replaceAll('Choose a rack', '랙 선택')
  .replaceAll('Production', '프로덕션')
  .replaceAll('Non-production', '비프로덕션')
  .replaceAll('Offline', '오프라인')
  .replaceAll('Editable', '편집 가능')
  .replaceAll('Disabled', '사용 불가')
  .replaceAll('Read only', '읽기 전용');

export const selectStatesSourceJa = selectStatesSource
  .replaceAll('Rack Alpha', 'ラックアルファ')
  .replaceAll('Rack Beta', 'ラックベータ')
  .replaceAll('Rack Gamma', 'ラックガンマ')
  .replaceAll('Staging rack', 'ステージングラック')
  .replaceAll('Choose a rack', 'ラックを選択')
  .replaceAll('Production', '本番')
  .replaceAll('Non-production', '非本番')
  .replaceAll('Offline', 'オフライン')
  .replaceAll('Editable', '変更可能')
  .replaceAll('Disabled', '無効')
  .replaceAll('Read only', '読み取り専用');

export function SelectValidationPreview() {
  const text = copy[useDemoLocale()];
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const invalid = attempted && value === null;

  return (
    <TRForm
      data-docs-example-item=""
      className="grid w-full max-w-80 min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <SelectPreview
          disabled={false}
          label={text.deploymentRack}
          onValueChange={setValue}
          readOnly={false}
          required
          value={value}
        />
        {invalid ? <TRField.Error match>{text.required}</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">{text.deploy}</TRButton>
      <output aria-live="polite">
        {attempted && value
          ? text.ready(
              {
                alpha: text.alpha,
                beta: text.beta,
                gamma: text.gamma,
                staging: text.staging,
              }[value as 'alpha' | 'beta' | 'gamma' | 'staging'],
            )
          : ''}
      </output>
    </TRForm>
  );
}

const meta = {
  title: 'Components/Select',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    disabledItem: false,
    readOnly: false,
    uiSize: 'md',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    disabledItem: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>('alpha');
    return (
      <SelectPreview
        {...args}
        onOpenChange={setOpen}
        onValueChange={setValue}
        open={open}
        value={value}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const playground = definePlayground(meta);
