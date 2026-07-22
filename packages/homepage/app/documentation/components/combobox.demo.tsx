import { TRButton } from '@tinyrack/ui/components/button';
import { TRCombobox } from '@tinyrack/ui/components/combobox';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { ChevronDown, Search, X } from 'lucide-react';
import { useId, useState } from 'react';
import type {
  DemoMeta as Meta,
  DemoVariant as StoryObj,
} from '../../playground/demo.js';
import {
  definePlayground,
  usePlaygroundArgs as useArgs,
} from '../../playground/demo.js';
import { useDemoLocale } from '../shared/demo-locale.js';

const comboboxCopy = {
  en: {
    clear: 'Clear',
    deploy: 'Deploy',
    empty: 'No matching racks',
    label: 'Deployment rack',
    maintenance: 'Maintenance',
    multiple: 'Deployment racks',
    open: 'Show racks',
    placeholder: 'Choose a rack',
    remove: 'Remove',
    required: 'Choose a rack from the list.',
    selected: 'Selected',
  },
  ja: {
    clear: 'クリア',
    deploy: 'デプロイ',
    empty: '一致するラックはありません',
    label: 'デプロイ先ラック',
    maintenance: 'メンテナンス中',
    multiple: 'デプロイ先ラック',
    open: 'ラックを表示',
    placeholder: 'ラックを選択',
    remove: '削除',
    required: 'リストからラックを選択してください。',
    selected: '選択済み',
  },
  ko: {
    clear: '지우기',
    deploy: '배포',
    empty: '일치하는 랙이 없어요',
    label: '배포 랙',
    maintenance: '점검 중',
    multiple: '배포 랙',
    open: '랙 보기',
    placeholder: '랙 선택',
    remove: '제거',
    required: '목록에서 랙을 선택하세요.',
    selected: '선택됨',
  },
} as const;

type ComboboxStoryArgs = {
  autoHighlight: boolean;
  disabled: boolean;
  disabledOption: boolean;
  filterMode: 'contains' | 'startsWith' | 'none';
  open: boolean;
  placeholder: string;
  query: string;
  readOnly: boolean;
  selected: 'none' | 'Rack A' | 'Rack B' | 'Rack C';
};

type ComboboxExampleProps = ComboboxStoryArgs & {
  onOpenChange?: (open: boolean) => void;
  onQueryChange?: (query: string) => void;
  onSelectedChange?: (selected: ComboboxStoryArgs['selected']) => void;
  required?: boolean;
};

const comboboxItems = ['Rack A', 'Rack B', 'Rack C'];

export function ComboboxExample({
  disabled,
  disabledOption,
  autoHighlight,
  filterMode,
  onOpenChange,
  onQueryChange,
  onSelectedChange,
  open,
  placeholder,
  query,
  readOnly,
  required,
  selected,
}: ComboboxExampleProps) {
  const inputId = useId();
  const copy = comboboxCopy[useDemoLocale()];
  const filter = TRCombobox.useFilter({ sensitivity: 'base' });
  const openProps = onOpenChange ? { open, onOpenChange } : { defaultOpen: open };
  const queryProps = onQueryChange
    ? { inputValue: query, onInputValueChange: onQueryChange }
    : { defaultInputValue: query };
  const selectionProps = onSelectedChange
    ? {
        value: selected === 'none' ? null : selected,
        onValueChange: (value: unknown) =>
          onSelectedChange((value as ComboboxStoryArgs['selected'] | null) ?? 'none'),
      }
    : { defaultValue: selected === 'none' ? null : selected };

  return (
    <div className="contents" data-docs-example-item="">
      <TRCombobox.Root
        {...openProps}
        {...queryProps}
        {...selectionProps}
        autoHighlight={autoHighlight}
        disabled={disabled}
        filter={filterMode === 'none' ? null : filter[filterMode]}
        items={comboboxItems}
        name="rack"
        readOnly={readOnly}
        required={required}
      >
        <label className="tr-label" htmlFor={inputId}>
          {copy.label}
        </label>
        <TRCombobox.InputGroup className="tinyrack-combobox-story-layout w-full max-w-md">
          <TRCombobox.InputAdornment aria-hidden="true">
            <Search />
          </TRCombobox.InputAdornment>
          <TRCombobox.Input
            id={inputId}
            placeholder={
              placeholder === 'Choose a rack' ? copy.placeholder : placeholder
            }
          />
          <TRCombobox.Clear aria-label={copy.clear}>
            <X aria-hidden="true" />
          </TRCombobox.Clear>
          <TRCombobox.Trigger aria-label={copy.open}>
            <TRCombobox.Icon aria-hidden="true">
              <ChevronDown />
            </TRCombobox.Icon>
          </TRCombobox.Trigger>
        </TRCombobox.InputGroup>
        <TRCombobox.Portal>
          <TRCombobox.Positioner sideOffset={8}>
            <TRCombobox.Popup>
              <TRCombobox.Arrow />
              <TRCombobox.Status />
              <TRCombobox.List>
                <TRCombobox.Group>
                  <TRCombobox.GroupLabel>Production</TRCombobox.GroupLabel>
                  <TRCombobox.Item value="Rack A">
                    Rack A
                    <TRCombobox.ItemIndicator aria-hidden="true">
                      ✓
                    </TRCombobox.ItemIndicator>
                  </TRCombobox.Item>
                  <TRCombobox.Item disabled={disabledOption} value="Rack B">
                    Rack B {disabledOption ? `· ${copy.maintenance}` : ''}
                    <TRCombobox.ItemIndicator aria-hidden="true">
                      ✓
                    </TRCombobox.ItemIndicator>
                  </TRCombobox.Item>
                </TRCombobox.Group>
                <TRCombobox.Separator />
                <TRCombobox.Group>
                  <TRCombobox.GroupLabel>Non-production</TRCombobox.GroupLabel>
                  <TRCombobox.Item value="Rack C">
                    Rack C
                    <TRCombobox.ItemIndicator aria-hidden="true">
                      ✓
                    </TRCombobox.ItemIndicator>
                  </TRCombobox.Item>
                </TRCombobox.Group>
                <TRCombobox.Empty>{copy.empty}</TRCombobox.Empty>
              </TRCombobox.List>
            </TRCombobox.Popup>
          </TRCombobox.Positioner>
        </TRCombobox.Portal>
      </TRCombobox.Root>
    </div>
  );
}

export function ComboboxOptionStates() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <ComboboxExample
        disabled={false}
        disabledOption={false}
        autoHighlight={false}
        filterMode="contains"
        open={false}
        placeholder="Choose a rack"
        query="Rack A"
        readOnly={false}
        selected="Rack A"
      />
      <ComboboxExample
        disabled={false}
        disabledOption
        autoHighlight={false}
        filterMode="contains"
        open
        placeholder="Choose a rack"
        query=""
        readOnly={false}
        selected="none"
      />
      <ComboboxExample
        disabled={false}
        disabledOption={false}
        autoHighlight={false}
        filterMode="contains"
        open={false}
        placeholder="Choose a rack"
        query="Rack C"
        readOnly
        selected="Rack C"
      />
    </div>
  );
}

export function ComboboxFilterModes() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {(['contains', 'startsWith', 'none'] as const).map((filterMode) => (
        <ComboboxExample
          key={filterMode}
          disabled={false}
          disabledOption={false}
          autoHighlight={false}
          filterMode={filterMode}
          open
          placeholder="Choose a rack"
          query="Rack"
          readOnly={false}
          selected="none"
        />
      ))}
    </div>
  );
}

export function ComboboxOverlayPreview() {
  return (
    <ComboboxExample
      disabled={false}
      disabledOption={false}
      autoHighlight={false}
      filterMode="contains"
      open
      placeholder="Choose a rack"
      query=""
      readOnly={false}
      selected="none"
    />
  );
}

export function ComboboxKeyboardPreview() {
  return (
    <ComboboxExample
      disabled={false}
      disabledOption={false}
      autoHighlight
      filterMode="contains"
      open={false}
      placeholder="Choose a rack"
      query=""
      readOnly={false}
      selected="none"
    />
  );
}

export function ComboboxValidationPreview() {
  const copy = comboboxCopy[useDemoLocale()];
  const [attempted, setAttempted] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ComboboxStoryArgs['selected']>('none');
  const invalid = attempted && selected === 'none';

  return (
    <TRForm
      className="grid w-full max-w-md gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <ComboboxExample
          disabled={false}
          disabledOption={false}
          autoHighlight={false}
          filterMode="contains"
          onQueryChange={setQuery}
          onSelectedChange={setSelected}
          open={false}
          placeholder="Choose a rack"
          query={query}
          readOnly={false}
          required
          selected={selected}
        />
        {invalid ? <TRField.Error match>{copy.required}</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">{copy.deploy}</TRButton>
      <output aria-live="polite">
        {attempted && selected !== 'none' ? `Deploying to ${selected}.` : ''}
      </output>
    </TRForm>
  );
}

export function ComboboxMultipleAnatomy() {
  const [value, setValue] = useState<string[]>(['Rack A']);
  const inputId = useId();
  const copy = comboboxCopy[useDemoLocale()];

  return (
    <div className="contents" data-docs-example-item="">
      <TRCombobox.Root
        grid
        items={comboboxItems}
        multiple
        onValueChange={setValue}
        value={value}
      >
        <label className="tr-label" htmlFor={inputId}>
          {copy.multiple}
        </label>
        <TRCombobox.InputGroup>
          <TRCombobox.Chips>
            <TRCombobox.Value>
              {(selectedValue: string[]) =>
                selectedValue.map((item) => (
                  <TRCombobox.Chip key={item}>
                    {item}
                    <TRCombobox.ChipRemove aria-label={`${copy.remove} ${item}`}>
                      ×
                    </TRCombobox.ChipRemove>
                  </TRCombobox.Chip>
                ))
              }
            </TRCombobox.Value>
            <TRCombobox.Input id={inputId} placeholder="Add a rack" />
          </TRCombobox.Chips>
          <TRCombobox.Trigger aria-label={copy.open}>
            <ChevronDown aria-hidden="true" />
          </TRCombobox.Trigger>
        </TRCombobox.InputGroup>
        <TRCombobox.Portal>
          <TRCombobox.Positioner>
            <TRCombobox.Popup>
              <TRCombobox.List>
                <TRCombobox.Collection>
                  {(item: string) => (
                    <TRCombobox.Row key={item}>
                      <TRCombobox.Item value={item}>
                        {item}
                        <TRCombobox.ItemIndicator aria-hidden="true">
                          ✓
                        </TRCombobox.ItemIndicator>
                      </TRCombobox.Item>
                    </TRCombobox.Row>
                  )}
                </TRCombobox.Collection>
              </TRCombobox.List>
            </TRCombobox.Popup>
          </TRCombobox.Positioner>
        </TRCombobox.Portal>
        <output aria-live="polite">
          {copy.selected}: {value.join(', ') || '—'}
        </output>
      </TRCombobox.Root>
    </div>
  );
}

function FilteredRackSummary() {
  const filteredItems = TRCombobox.useFilteredItems<string>();
  return (
    <output aria-live="polite" className="text-sm text-muted">
      {filteredItems.length} matching rack{filteredItems.length === 1 ? '' : 's'}
    </output>
  );
}

export function ComboboxControlledFilterHooks() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [value, setValue] = useState<string | null>(null);
  const inputId = useId();
  const filter = TRCombobox.useFilter({ locale: 'en', sensitivity: 'base' });

  return (
    <div className="grid w-full max-w-md gap-2" data-docs-example-item="">
      <TRCombobox.Root
        filter={filter.startsWith}
        inputValue={query}
        items={comboboxItems}
        onInputValueChange={setQuery}
        onOpenChange={setOpen}
        onValueChange={setValue}
        open={open}
        value={value}
      >
        <label className="tr-label" htmlFor={inputId}>
          Filter deployment racks
        </label>
        <TRCombobox.InputGroup>
          <TRCombobox.Input id={inputId} placeholder="Type Rack B" />
          <TRCombobox.Clear aria-label="Clear filter">
            <X aria-hidden="true" />
          </TRCombobox.Clear>
          <TRCombobox.Trigger aria-label="Show filtered racks">
            <ChevronDown aria-hidden="true" />
          </TRCombobox.Trigger>
        </TRCombobox.InputGroup>
        <FilteredRackSummary />
        <TRCombobox.Portal>
          <TRCombobox.Positioner>
            <TRCombobox.Popup>
              <TRCombobox.List>
                <TRCombobox.Collection>
                  {(item: string) => (
                    <TRCombobox.Item key={item} value={item}>
                      {item}
                    </TRCombobox.Item>
                  )}
                </TRCombobox.Collection>
                <TRCombobox.Empty>No rack starts with that text.</TRCombobox.Empty>
              </TRCombobox.List>
            </TRCombobox.Popup>
          </TRCombobox.Positioner>
        </TRCombobox.Portal>
      </TRCombobox.Root>
      <output>
        Open: {String(open)}; query: {query || 'empty'}; value: {value ?? 'none'}
      </output>
    </div>
  );
}

const meta = {
  title: 'Components/Combobox',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    autoHighlight: false,
    disabled: false,
    disabledOption: false,
    filterMode: 'contains',
    open: false,
    placeholder: 'Choose a rack',
    query: '',
    readOnly: false,
    selected: 'none',
  },
  localizedArgs: {
    ja: { placeholder: 'ラックを選択' },
    ko: { placeholder: '랙 선택' },
  },
  argTypes: {
    autoHighlight: { control: 'boolean' },
    disabled: { control: 'boolean' },
    disabledOption: { control: 'boolean' },
    filterMode: { control: 'select', options: ['contains', 'startsWith', 'none'] },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ComboboxStoryArgs>();
    return (
      <ComboboxExample
        {...args}
        onOpenChange={(open) => updateArgs({ open })}
        onQueryChange={(query) => updateArgs({ query })}
        onSelectedChange={(selected) => updateArgs({ selected })}
      />
    );
  },
} satisfies Meta<ComboboxStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
