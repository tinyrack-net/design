import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';
import { TRButton } from '@tinyrack/ui/components/button';
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

const autocompleteCopy = {
  en: {
    clear: 'Clear',
    continue: 'Continue',
    disabled: 'Disabled',
    empty: 'No matching racks',
    freeform: 'Free-form value',
    keyboard: 'Keyboard selection',
    label: 'Rack',
    noMatch: 'No matching region',
    open: 'Show suggestions',
    placeholder: 'Search racks',
    production: 'Production',
    readOnly: 'Read only',
    reset: 'Reset',
    required: 'Enter a rack name.',
    staging: 'Non-production',
    submit: 'Submit',
  },
  ja: {
    clear: 'クリア',
    continue: '続行',
    disabled: '無効',
    empty: '一致するラックはありません',
    freeform: '自由入力値',
    keyboard: 'キーボード選択',
    label: 'ラック',
    noMatch: '一致しないリージョン',
    open: '候補を表示',
    placeholder: 'ラックを検索',
    production: '本番',
    readOnly: '読み取り専用',
    reset: 'リセット',
    required: 'ラック名を入力してください。',
    staging: '非本番',
    submit: '送信',
  },
  ko: {
    clear: '지우기',
    continue: '계속',
    disabled: '비활성',
    empty: '일치하는 랙이 없어요',
    freeform: '자유 입력값',
    keyboard: '키보드 선택',
    label: '랙',
    noMatch: '일치하지 않는 리전',
    open: '제안 보기',
    placeholder: '랙 검색',
    production: '프로덕션',
    readOnly: '읽기 전용',
    reset: '초기화',
    required: '랙 이름을 입력하세요.',
    staging: '비프로덕션',
    submit: '제출',
  },
} as const;

type StoryArgs = {
  autoHighlight: boolean | 'always';
  disabled: boolean;
  limit: number;
  mode: 'list' | 'both' | 'inline' | 'none';
  open: boolean;
  openOnInputClick: boolean;
  placeholder: string;
  readOnly: boolean;
  uiSize?: 'sm' | 'md' | 'lg';
  value: string;
};

type AutocompletePreviewProps = Omit<StoryArgs, 'limit' | 'open' | 'value'> & {
  defaultOpen?: boolean;
  defaultValue?: string;
  disabledItem?: boolean;
  label?: string;
  limit?: number;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
  open?: boolean;
  required?: boolean;
  submitOnItemClick?: boolean;
  uiSize?: 'sm' | 'md' | 'lg';
  value?: string;
};

const autocompleteGroups = [
  { value: 'Production', items: ['Rack Alpha', 'Rack Beta', 'Rack Gamma'] },
  { value: 'Non-production', items: ['Staging rack'] },
] as const;

type AutocompleteGroup = (typeof autocompleteGroups)[number];

function AutocompleteOptions({
  disabledItem = false,
}: {
  disabledItem?: boolean | undefined;
}) {
  const copy = autocompleteCopy[useDemoLocale()];
  return (
    <>
      <TRAutocomplete.Empty>{copy.empty}</TRAutocomplete.Empty>
      <TRAutocomplete.List>
        {(group: AutocompleteGroup) => (
          <TRAutocomplete.Group key={group.value} items={group.items}>
            <TRAutocomplete.GroupLabel>
              {group.value === 'Production' ? copy.production : copy.staging}
            </TRAutocomplete.GroupLabel>
            <TRAutocomplete.Collection>
              {(item: string) => (
                <TRAutocomplete.Item
                  disabled={disabledItem && item === 'Rack Gamma'}
                  key={item}
                  value={item}
                >
                  {item}
                </TRAutocomplete.Item>
              )}
            </TRAutocomplete.Collection>
          </TRAutocomplete.Group>
        )}
      </TRAutocomplete.List>
    </>
  );
}

export function AutocompletePreview({
  defaultOpen,
  defaultValue,
  autoHighlight,
  disabled,
  disabledItem,
  label = 'Rack',
  limit = -1,
  mode,
  onOpenChange,
  onValueChange,
  open,
  openOnInputClick,
  placeholder,
  readOnly,
  required,
  submitOnItemClick,
  uiSize = 'md',
  value,
}: AutocompletePreviewProps) {
  const inputId = useId();
  const copy = autocompleteCopy[useDemoLocale()];
  const openProps = open === undefined ? { defaultOpen } : { open };
  const valueProps = value === undefined ? { defaultValue } : { value };

  return (
    <div className="contents" data-docs-example-item="">
      <TRAutocomplete.Root
        {...openProps}
        {...valueProps}
        autoHighlight={autoHighlight}
        disabled={disabled}
        items={autocompleteGroups}
        limit={limit}
        mode={mode}
        name="rack-search"
        onOpenChange={onOpenChange}
        openOnInputClick={openOnInputClick}
        onValueChange={onValueChange}
        readOnly={readOnly}
        required={required}
        submitOnItemClick={submitOnItemClick}
      >
        <label className="grid w-full max-w-md gap-2" htmlFor={inputId}>
          {label === 'Rack' ? copy.label : label}
          <TRAutocomplete.InputGroup uiSize={uiSize}>
            <TRAutocomplete.InputAdornment aria-hidden="true">
              <Search />
            </TRAutocomplete.InputAdornment>
            <TRAutocomplete.Input
              id={inputId}
              placeholder={
                placeholder === 'Search racks' ? copy.placeholder : placeholder
              }
            />
            <TRAutocomplete.Clear aria-label={copy.clear}>
              <X aria-hidden="true" />
            </TRAutocomplete.Clear>
            <TRAutocomplete.Trigger aria-label={copy.open}>
              <TRAutocomplete.Icon aria-hidden="true">
                <ChevronDown />
              </TRAutocomplete.Icon>
            </TRAutocomplete.Trigger>
          </TRAutocomplete.InputGroup>
        </label>
        <TRAutocomplete.Portal>
          <TRAutocomplete.Positioner sideOffset={8}>
            <TRAutocomplete.Popup>
              <TRAutocomplete.Arrow />
              <TRAutocomplete.Status />
              <AutocompleteOptions disabledItem={disabledItem} />
            </TRAutocomplete.Popup>
          </TRAutocomplete.Positioner>
        </TRAutocomplete.Portal>
      </TRAutocomplete.Root>
    </div>
  );
}

export function AutocompleteStateComparison() {
  const copy = autocompleteCopy[useDemoLocale()];
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <AutocompletePreview
        defaultValue="Rack Alpha"
        autoHighlight={false}
        disabled={false}
        disabledItem={false}
        mode="list"
        openOnInputClick={false}
        placeholder="Search racks"
        readOnly={false}
        required={false}
        submitOnItemClick={false}
      />
      <AutocompletePreview
        defaultValue="Rack Beta"
        autoHighlight={false}
        disabled
        disabledItem={false}
        label={copy.disabled}
        mode="list"
        openOnInputClick={false}
        placeholder="Search racks"
        readOnly={false}
        required={false}
        submitOnItemClick={false}
      />
      <AutocompletePreview
        defaultValue="Rack Gamma"
        autoHighlight={false}
        disabled={false}
        disabledItem={false}
        label={copy.readOnly}
        mode="list"
        openOnInputClick={false}
        placeholder="Search racks"
        readOnly
        required={false}
        submitOnItemClick={false}
      />
    </div>
  );
}

export function AutocompleteSizeComparison() {
  const locale = useDemoLocale();
  const sizeLabel = {
    en: (size: string) => `${size} rack`,
    ja: (size: string) => `${size} ック`,
    ko: (size: string) => `${size} 랙`,
  }[locale];
  return (
    <div className="grid w-full max-w-md gap-5">
      {(['sm', 'md', 'lg'] as const).map((uiSize) => (
        <AutocompletePreview
          autoHighlight={false}
          defaultValue=""
          disabled={false}
          disabledItem={false}
          key={uiSize}
          label={sizeLabel(uiSize.toUpperCase())}
          mode="list"
          openOnInputClick={false}
          placeholder="Search racks"
          readOnly={false}
          required={false}
          submitOnItemClick={false}
          uiSize={uiSize}
        />
      ))}
    </div>
  );
}

export function AutocompleteBehaviorComparison() {
  const copy = autocompleteCopy[useDemoLocale()];
  return (
    <div className="grid min-w-0 gap-5 sm:grid-cols-2">
      <AutocompletePreview
        autoHighlight={false}
        defaultValue="Edge rack"
        disabled={false}
        disabledItem={false}
        label={copy.freeform}
        mode="both"
        openOnInputClick
        placeholder="Known or custom rack"
        readOnly={false}
        required={false}
        submitOnItemClick={false}
      />
      <AutocompletePreview
        autoHighlight={false}
        defaultValue="Rack Beta"
        disabled={false}
        disabledItem={false}
        label={copy.label}
        mode="both"
        openOnInputClick
        placeholder="Search racks"
        readOnly={false}
        required={false}
        submitOnItemClick
      />
    </div>
  );
}

export function AutocompleteModeComparison() {
  const copy = autocompleteCopy[useDemoLocale()];
  return (
    <div className="grid min-w-0 gap-5 sm:grid-cols-2">
      {(['list', 'both', 'inline', 'none'] as const).map((mode) => (
        <AutocompletePreview
          key={mode}
          autoHighlight={false}
          disabled={false}
          disabledItem={false}
          label={`${copy.label} · ${mode}`}
          mode={mode}
          openOnInputClick
          placeholder="Search racks"
          readOnly={false}
          required={false}
          submitOnItemClick={false}
        />
      ))}
    </div>
  );
}

export function AutocompleteOptionStates() {
  const copy = autocompleteCopy[useDemoLocale()];
  return (
    <div className="grid min-w-0 gap-5 sm:grid-cols-2">
      <AutocompletePreview
        autoHighlight={false}
        defaultOpen
        disabled={false}
        disabledItem={false}
        label={copy.label}
        mode="list"
        openOnInputClick
        placeholder="Search racks"
        readOnly={false}
        required={false}
        submitOnItemClick={false}
      />
      <AutocompletePreview
        autoHighlight="always"
        defaultOpen
        disabled={false}
        disabledItem
        label={copy.disabled}
        mode="list"
        openOnInputClick
        placeholder="Search racks"
        readOnly={false}
        required={false}
        submitOnItemClick={false}
      />
      <AutocompletePreview
        autoHighlight={false}
        defaultOpen
        defaultValue={copy.noMatch}
        disabled={false}
        disabledItem={false}
        label={copy.empty}
        mode="list"
        openOnInputClick
        placeholder="Search racks"
        readOnly={false}
        required={false}
        submitOnItemClick={false}
      />
    </div>
  );
}

export function AutocompleteOverlayPreview() {
  return (
    <AutocompletePreview
      autoHighlight={false}
      defaultOpen
      disabled={false}
      disabledItem={false}
      mode="list"
      openOnInputClick
      placeholder="Search racks"
      readOnly={false}
      required={false}
      submitOnItemClick={false}
    />
  );
}

export function AutocompleteKeyboardPreview() {
  const copy = autocompleteCopy[useDemoLocale()];
  return (
    <AutocompletePreview
      autoHighlight="always"
      disabled={false}
      disabledItem={false}
      label={copy.keyboard}
      mode="list"
      openOnInputClick
      placeholder="Search racks"
      readOnly={false}
      required={false}
      submitOnItemClick={false}
    />
  );
}

export function AutocompleteValidationPreview() {
  const copy = autocompleteCopy[useDemoLocale()];
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.trim().length === 0;

  return (
    <TRForm
      className="grid w-full max-w-80 min-w-0 gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        event.currentTarget.checkValidity();
      }}
    >
      <TRField.Root invalid={invalid}>
        <AutocompletePreview
          disabled={false}
          autoHighlight={false}
          disabledItem={false}
          label={copy.label}
          mode="list"
          onValueChange={setValue}
          openOnInputClick={false}
          placeholder="Type a rack name"
          readOnly={false}
          required
          submitOnItemClick={false}
          value={value}
        />
        {invalid ? <TRField.Error match>{copy.required}</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">{copy.continue}</TRButton>
      <output aria-live="polite">
        {attempted && value ? `Searching for ${value}.` : ''}
      </output>
    </TRForm>
  );
}

export function AutocompleteResetPreview() {
  const copy = autocompleteCopy[useDemoLocale()];
  const [result, setResult] = useState('');

  return (
    <TRForm
      className="grid w-full max-w-80 min-w-0 gap-3"
      onReset={() => setResult('')}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(`Submitted ${new FormData(event.currentTarget).get('rack-search')}.`);
      }}
    >
      <AutocompletePreview
        autoHighlight={false}
        defaultValue="Rack Alpha"
        disabled={false}
        disabledItem={false}
        mode="list"
        openOnInputClick={false}
        placeholder="Search racks"
        readOnly={false}
        required={false}
        submitOnItemClick={false}
      />
      <div className="flex flex-wrap gap-2">
        <TRButton type="submit">{copy.submit}</TRButton>
        <TRButton type="reset" variant="secondary">
          {copy.reset}
        </TRButton>
      </div>
      <output aria-live="polite">{result}</output>
    </TRForm>
  );
}

export const autocompleteBasicSource = `import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';
import { ChevronDown, Search, X } from 'lucide-react';

const rackGroups = [
  { value: 'Production', items: ['Rack Alpha', 'Rack Beta', 'Rack Gamma'] },
  { value: 'Non-production', items: ['Staging rack'] },
];

export function RackSearch() {
  return (
    <TRAutocomplete.Root items={rackGroups} name="rack-search">
      <label className="grid w-full max-w-md gap-2" htmlFor="rack-search">
        Rack
        <TRAutocomplete.InputGroup>
          <TRAutocomplete.InputAdornment aria-hidden="true"><Search /></TRAutocomplete.InputAdornment>
          <TRAutocomplete.Input id="rack-search" placeholder="Search racks" />
          <TRAutocomplete.Clear aria-label="Clear"><X aria-hidden="true" /></TRAutocomplete.Clear>
          <TRAutocomplete.Trigger aria-label="Show suggestions"><TRAutocomplete.Icon aria-hidden="true"><ChevronDown /></TRAutocomplete.Icon></TRAutocomplete.Trigger>
        </TRAutocomplete.InputGroup>
      </label>
      <TRAutocomplete.Portal>
        <TRAutocomplete.Positioner sideOffset={8}>
          <TRAutocomplete.Popup>
            <TRAutocomplete.Arrow />
            <TRAutocomplete.Status />
            <TRAutocomplete.Empty>No matching racks</TRAutocomplete.Empty>
            <TRAutocomplete.List>
              {(group) => (
                <TRAutocomplete.Group key={group.value} items={group.items}>
                  <TRAutocomplete.GroupLabel>{group.value}</TRAutocomplete.GroupLabel>
                  <TRAutocomplete.Collection>
                    {(rack) => <TRAutocomplete.Item key={rack} value={rack}>{rack}</TRAutocomplete.Item>}
                  </TRAutocomplete.Collection>
                </TRAutocomplete.Group>
              )}
            </TRAutocomplete.List>
          </TRAutocomplete.Popup>
        </TRAutocomplete.Positioner>
      </TRAutocomplete.Portal>
    </TRAutocomplete.Root>
  );
}`;

export const autocompleteStatesSource = `import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';
import { useId } from 'react';

function RackState({ disabled = false, label, readOnly = false, value }: { disabled?: boolean; label: string; readOnly?: boolean; value: string }) {
  const id = useId();
  const items = ['Rack Alpha', 'Rack Beta', 'Rack Gamma', 'Staging rack'];
  return (
    <TRAutocomplete.Root defaultValue={value} disabled={disabled} items={items} readOnly={readOnly}>
      <label htmlFor={id}>{label}</label>
      <TRAutocomplete.InputGroup>
        <TRAutocomplete.Input id={id} />
        <TRAutocomplete.Clear aria-label={\`Clear \${label}\`}>Clear</TRAutocomplete.Clear>
        <TRAutocomplete.Trigger aria-label={\`Show \${label} suggestions\`}>Open</TRAutocomplete.Trigger>
      </TRAutocomplete.InputGroup>
      <TRAutocomplete.Portal><TRAutocomplete.Positioner><TRAutocomplete.Popup><TRAutocomplete.List>
        <TRAutocomplete.Collection>
          {(item) => <TRAutocomplete.Item key={item} value={item}>{item}</TRAutocomplete.Item>}
        </TRAutocomplete.Collection>
      </TRAutocomplete.List></TRAutocomplete.Popup></TRAutocomplete.Positioner></TRAutocomplete.Portal>
    </TRAutocomplete.Root>
  );
}

export function AutocompleteStates() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <RackState label="Rack" value="Rack Alpha" />
      <RackState disabled label="Disabled" value="Rack Beta" />
      <RackState label="Read only" readOnly value="Rack Gamma" />
    </div>
  );
}`;

export const autocompleteValidationSource = `import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRField } from '@tinyrack/ui/components/field';
import { TRForm } from '@tinyrack/ui/components/form';
import { useState } from 'react';

export function RackAutocompleteForm() {
  const [attempted, setAttempted] = useState(false);
  const [value, setValue] = useState('');
  const invalid = attempted && value.trim().length === 0;
  return (
    <TRForm noValidate onSubmit={(event) => { event.preventDefault(); setAttempted(true); event.currentTarget.checkValidity(); }}>
      <TRField.Root invalid={invalid}>
        <TRAutocomplete.Root items={['Rack Alpha', 'Rack Beta']} name="rack-search" onValueChange={setValue} required value={value}>
          <label htmlFor="required-rack-search">Rack search</label>
          <TRAutocomplete.InputGroup>
            <TRAutocomplete.Input id="required-rack-search" placeholder="Type a rack name" />
            <TRAutocomplete.Clear aria-label="Clear">Clear</TRAutocomplete.Clear>
            <TRAutocomplete.Trigger aria-label="Show suggestions">Open</TRAutocomplete.Trigger>
          </TRAutocomplete.InputGroup>
          <TRAutocomplete.Portal><TRAutocomplete.Positioner><TRAutocomplete.Popup><TRAutocomplete.Status /><TRAutocomplete.List>
            <TRAutocomplete.Collection>
              {(item) => <TRAutocomplete.Item key={item} value={item}>{item}</TRAutocomplete.Item>}
            </TRAutocomplete.Collection>
            <TRAutocomplete.Empty>No matching racks</TRAutocomplete.Empty>
          </TRAutocomplete.List></TRAutocomplete.Popup></TRAutocomplete.Positioner></TRAutocomplete.Portal>
        </TRAutocomplete.Root>
        {invalid ? <TRField.Error match>Enter a rack name.</TRField.Error> : null}
      </TRField.Root>
      <TRButton type="submit">Continue</TRButton>
      <output aria-live="polite">{attempted && value ? \`Searching for \${value}.\` : ''}</output>
    </TRForm>
  );
}`;

export const autocompleteBehaviorsSource = `import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';

const items = ['Rack Alpha', 'Rack Beta', 'Rack Gamma', 'Staging rack'];

function BehaviorSample({ label, submitOnItemClick = false }: { label: string; submitOnItemClick?: boolean }) {
  return (
    <TRAutocomplete.Root defaultValue={submitOnItemClick ? 'Rack Beta' : 'Edge rack'} items={items} mode="both" openOnInputClick submitOnItemClick={submitOnItemClick}>
      <TRAutocomplete.Input aria-label={label} />
      <TRAutocomplete.Portal><TRAutocomplete.Positioner><TRAutocomplete.Popup><TRAutocomplete.Status /><TRAutocomplete.List>
        <TRAutocomplete.Collection>
          {(item) => <TRAutocomplete.Item key={item} value={item}>{item}</TRAutocomplete.Item>}
        </TRAutocomplete.Collection>
        <TRAutocomplete.Empty>No matching racks</TRAutocomplete.Empty>
      </TRAutocomplete.List></TRAutocomplete.Popup></TRAutocomplete.Positioner></TRAutocomplete.Portal>
    </TRAutocomplete.Root>
  );
}

export function AutocompleteBehaviors() {
  return <div className="grid gap-5 sm:grid-cols-2"><BehaviorSample label="Free-form value" /><BehaviorSample label="Suggestion selection" submitOnItemClick /></div>;
}`;

export const autocompleteSizesSource = `import '@tinyrack/ui/components/autocomplete.css';
import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';
import { ChevronDown, Search, X } from 'lucide-react';

const racks = ['Rack Alpha', 'Rack Beta', 'Rack Gamma'];

export function AutocompleteSizes() {
  return (
    <div className="grid gap-5">
      <TRAutocomplete.Root items={racks} name="rack-sm">
        <label className="grid gap-2" htmlFor="rack-sm">SM rack</label>
        <TRAutocomplete.InputGroup uiSize="sm">
          <TRAutocomplete.InputAdornment aria-hidden="true"><Search /></TRAutocomplete.InputAdornment>
          <TRAutocomplete.Input id="rack-sm" placeholder="Search racks" />
          <TRAutocomplete.Clear aria-label="Clear"><X aria-hidden="true" /></TRAutocomplete.Clear>
          <TRAutocomplete.Trigger aria-label="Show suggestions"><TRAutocomplete.Icon><ChevronDown /></TRAutocomplete.Icon></TRAutocomplete.Trigger>
        </TRAutocomplete.InputGroup>
      </TRAutocomplete.Root>
      <TRAutocomplete.Root items={racks} name="rack-md">
        <label className="grid gap-2" htmlFor="rack-md">MD rack</label>
        <TRAutocomplete.InputGroup uiSize="md">
          <TRAutocomplete.InputAdornment aria-hidden="true"><Search /></TRAutocomplete.InputAdornment>
          <TRAutocomplete.Input id="rack-md" placeholder="Search racks" />
          <TRAutocomplete.Clear aria-label="Clear"><X aria-hidden="true" /></TRAutocomplete.Clear>
          <TRAutocomplete.Trigger aria-label="Show suggestions"><TRAutocomplete.Icon><ChevronDown /></TRAutocomplete.Icon></TRAutocomplete.Trigger>
        </TRAutocomplete.InputGroup>
      </TRAutocomplete.Root>
      <TRAutocomplete.Root items={racks} name="rack-lg">
        <label className="grid gap-2" htmlFor="rack-lg">LG rack</label>
        <TRAutocomplete.InputGroup uiSize="lg">
          <TRAutocomplete.InputAdornment aria-hidden="true"><Search /></TRAutocomplete.InputAdornment>
          <TRAutocomplete.Input id="rack-lg" placeholder="Search racks" />
          <TRAutocomplete.Clear aria-label="Clear"><X aria-hidden="true" /></TRAutocomplete.Clear>
          <TRAutocomplete.Trigger aria-label="Show suggestions"><TRAutocomplete.Icon><ChevronDown /></TRAutocomplete.Icon></TRAutocomplete.Trigger>
        </TRAutocomplete.InputGroup>
      </TRAutocomplete.Root>
    </div>
  );
}`;

export const autocompleteResetSource = `import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRForm } from '@tinyrack/ui/components/form';
import { useState } from 'react';

export function ResettableRackSearch() {
  const [result, setResult] = useState('');
  return (
    <TRForm
      onReset={() => setResult('')}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(\`Submitted \${new FormData(event.currentTarget).get('rack-search')}.\`);
      }}
    >
      <TRAutocomplete.Root defaultValue="Rack Alpha" items={['Rack Alpha', 'Rack Beta']} name="rack-search">
        <TRAutocomplete.Input aria-label="Rack" />
        <TRAutocomplete.Portal><TRAutocomplete.Positioner><TRAutocomplete.Popup><TRAutocomplete.List>
          <TRAutocomplete.Collection>
            {(item) => <TRAutocomplete.Item key={item} value={item}>{item}</TRAutocomplete.Item>}
          </TRAutocomplete.Collection>
        </TRAutocomplete.List></TRAutocomplete.Popup></TRAutocomplete.Positioner></TRAutocomplete.Portal>
      </TRAutocomplete.Root>
      <TRButton type="submit">Submit</TRButton>
      <TRButton type="reset" variant="secondary">Reset</TRButton>
      <output aria-live="polite">{result}</output>
    </TRForm>
  );
}`;

const meta = {
  title: 'Components/Autocomplete',
  excludeStories: /.*Preview$/,
  parameters: { layout: 'centered' },
  args: {
    autoHighlight: false,
    disabled: false,
    limit: -1,
    mode: 'list',
    open: false,
    openOnInputClick: false,
    placeholder: 'Search racks',
    readOnly: false,
    uiSize: 'md',
    value: '',
  },
  localizedArgs: {
    ja: { placeholder: 'ラックを検索' },
    ko: { placeholder: '랙 검색' },
  },
  argTypes: {
    autoHighlight: { control: 'select', options: [false, true, 'always'] },
    disabled: { control: 'boolean' },
    limit: { control: 'select', options: [-1, 1, 2, 4] },
    mode: { control: 'select', options: ['list', 'both', 'inline', 'none'] },
    openOnInputClick: { control: 'boolean' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    uiSize: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<StoryArgs>();
    return (
      <AutocompletePreview
        {...args}
        onOpenChange={(open) => updateArgs({ open })}
        onValueChange={(value) => updateArgs({ value })}
      />
    );
  },
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };

export const playground = definePlayground(meta);
