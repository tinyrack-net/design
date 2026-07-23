'use client';

import { TRButton } from '@tinyrack/ui/components/button';
import { TRCheckbox } from '@tinyrack/ui/components/checkbox';
import { TRField } from '@tinyrack/ui/components/field';
import { TRInput } from '@tinyrack/ui/components/input';
import { TRRadio } from '@tinyrack/ui/components/radio';
import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';
import { TRScrollArea } from '@tinyrack/ui/components/scroll-area';
import { TRSelect } from '@tinyrack/ui/components/select';
import { TRSlider } from '@tinyrack/ui/components/slider';
import { TRTextarea } from '@tinyrack/ui/components/textarea';
import { ChevronDown } from 'lucide-react';
import {
  type ChangeEvent,
  createElement,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { demoCopy, useDemoLocale } from '../documentation/shared/demo-locale.js';
import {
  type DemoArgs,
  type DemoArgType,
  type DemoControl,
  PlaygroundArgsProvider,
  type PlaygroundDefinition,
} from './demo.js';

type ControlKind =
  | 'boolean'
  | 'checklist'
  | 'json'
  | 'number'
  | 'radio'
  | 'range'
  | 'select'
  | 'textarea'
  | 'text';

function controlKind(control: DemoControl): ControlKind {
  return typeof control === 'string' ? control : control.type;
}

function controlLimits(control: DemoControl) {
  return typeof control === 'string'
    ? {}
    : { max: control.max, min: control.min, step: control.step };
}

function optionLabel(option: unknown) {
  if (option === null) return 'null';
  if (option === undefined) return 'undefined';
  if (typeof option === 'string') return option;
  return JSON.stringify(option);
}

function ChoiceControl({
  kind,
  name,
  onChange,
  options,
  value,
}: {
  kind: 'radio' | 'select';
  name: string;
  onChange: (value: unknown) => void;
  options: readonly unknown[];
  value: unknown;
}) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => Object.is(option, value)),
  );

  if (kind === 'select') {
    const items = Object.fromEntries(
      options.map((option, index) => [String(index), optionLabel(option)]),
    );
    return (
      <TRSelect.Root
        items={items}
        onValueChange={(index) => onChange(options[Number(index)])}
        value={String(selectedIndex)}
      >
        <TRSelect.Trigger aria-label={name} uiSize="sm" id={`playground-${name}`}>
          <TRSelect.Value />
          <TRSelect.Icon aria-hidden="true">
            <ChevronDown />
          </TRSelect.Icon>
        </TRSelect.Trigger>
        <TRSelect.Portal>
          <TRSelect.Positioner sideOffset={8}>
            <TRSelect.Popup>
              <TRSelect.List>
                {options.map((option, index) => (
                  <TRSelect.Item key={optionLabel(option)} value={String(index)}>
                    <TRSelect.ItemText>{optionLabel(option)}</TRSelect.ItemText>
                    <TRSelect.ItemIndicator aria-hidden="true">
                      ✓
                    </TRSelect.ItemIndicator>
                  </TRSelect.Item>
                ))}
              </TRSelect.List>
            </TRSelect.Popup>
          </TRSelect.Positioner>
        </TRSelect.Portal>
      </TRSelect.Root>
    );
  }

  return (
    <TRRadioGroup
      className="flex flex-wrap gap-3"
      id={`playground-${name}`}
      name={`playground-${name}`}
      onValueChange={(index) => onChange(options[Number(index)])}
      value={String(selectedIndex)}
    >
      {options.map((option, index) => {
        const optionId = `playground-${name}-${index}`;
        return (
          <label
            className="inline-flex items-center gap-2"
            htmlFor={optionId}
            key={optionLabel(option)}
          >
            <TRRadio.Root id={optionId} uiSize="sm" value={String(index)}>
              <TRRadio.Indicator aria-hidden="true" />
            </TRRadio.Root>
            <span>{optionLabel(option)}</span>
          </label>
        );
      })}
    </TRRadioGroup>
  );
}

function ChecklistControl({
  name,
  onChange,
  options,
  value,
}: {
  name: string;
  onChange: (value: unknown[]) => void;
  options: readonly unknown[];
  value: unknown;
}) {
  const selected = Array.isArray(value) ? value : [];

  return (
    <div className="grid gap-2" id={`playground-${name}`}>
      {options.map((option, index) => {
        const checked = selected.some((entry) => Object.is(entry, option));
        const optionId = `playground-${name}-${index}`;
        return (
          <label
            className="inline-flex items-center gap-2"
            htmlFor={optionId}
            key={optionLabel(option)}
          >
            <TRCheckbox.Root
              uiSize="sm"
              checked={checked}
              id={optionId}
              onCheckedChange={() =>
                onChange(
                  checked
                    ? selected.filter((entry) => !Object.is(entry, option))
                    : [...selected, option],
                )
              }
            >
              <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
            </TRCheckbox.Root>
            <span>{optionLabel(option)}</span>
          </label>
        );
      })}
    </div>
  );
}

function JsonControl({
  invalidJsonMessage,
  name,
  onChange,
  validate,
  validationMessage,
  value,
}: {
  invalidJsonMessage: string;
  name: string;
  onChange: (value: unknown) => void;
  validate?: (value: unknown) => boolean;
  validationMessage?: string;
  value: unknown;
}) {
  const [draft, setDraft] = useState(() => JSON.stringify(value, null, 2));
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    setDraft(JSON.stringify(value, null, 2));
    setInvalid(false);
  }, [value]);

  function updateDraft(event: ChangeEvent<HTMLTextAreaElement>) {
    const nextDraft = event.currentTarget.value;
    setDraft(nextDraft);
    try {
      const parsed = JSON.parse(nextDraft);
      if (validate && !validate(parsed)) {
        setInvalid(true);
        return;
      }
      onChange(parsed);
      setInvalid(false);
    } catch {
      setInvalid(true);
    }
  }

  return (
    <>
      <TRTextarea
        aria-invalid={invalid}
        className="min-h-24 font-mono"
        id={`playground-${name}`}
        onChange={updateDraft}
        uiSize="sm"
        value={draft}
      />
      {invalid ? (
        <span className="text-tinyrack-xs text-tinyrack-danger" role="status">
          {validationMessage ?? invalidJsonMessage}
        </span>
      ) : null}
    </>
  );
}

function ControlField({
  invalidJsonMessage,
  name,
  onChange,
  spec,
  value,
}: {
  invalidJsonMessage: string;
  name: string;
  onChange: (value: unknown) => void;
  spec: DemoArgType;
  value: unknown;
}) {
  const kind = controlKind(spec.control);
  const options = spec.options ?? [];
  const limits = controlLimits(spec.control);
  let control: ReactNode;

  if (kind === 'boolean') {
    return (
      <TRField.Root
        className="col-span-1"
        data-control-kind={kind}
        data-playground-control={name}
        uiSize="sm"
      >
        <label
          className="flex min-h-8 cursor-pointer items-center gap-2 text-tinyrack-sm font-medium"
          htmlFor={`playground-${name}`}
        >
          <TRCheckbox.Root
            uiSize="sm"
            checked={Boolean(value)}
            id={`playground-${name}`}
            onCheckedChange={(checked) => onChange(checked)}
          >
            <TRCheckbox.Indicator aria-hidden="true">✓</TRCheckbox.Indicator>
          </TRCheckbox.Root>
          <span>{name}</span>
        </label>
      </TRField.Root>
    );
  } else if (kind === 'select' || kind === 'radio') {
    control = (
      <ChoiceControl
        kind={kind}
        name={name}
        onChange={onChange}
        options={options}
        value={value}
      />
    );
  } else if (kind === 'checklist') {
    control = (
      <ChecklistControl
        name={name}
        onChange={onChange}
        options={options}
        value={value}
      />
    );
  } else if (kind === 'json') {
    control = (
      <JsonControl
        invalidJsonMessage={invalidJsonMessage}
        name={name}
        onChange={onChange}
        value={value}
        {...(spec.validate ? { validate: spec.validate } : {})}
        {...(spec.validationMessage
          ? { validationMessage: spec.validationMessage }
          : {})}
      />
    );
  } else if (kind === 'range') {
    const numericValue = typeof value === 'number' ? value : 0;
    control = (
      <TRSlider.Root
        uiSize="sm"
        {...limits}
        onValueChange={(values) =>
          onChange(Array.isArray(values) ? (values[0] ?? numericValue) : values)
        }
        value={[numericValue]}
      >
        <TRSlider.Control>
          <TRSlider.Track>
            <TRSlider.Indicator />
          </TRSlider.Track>
          <TRSlider.Thumb aria-label={name} id={`playground-${name}`} />
        </TRSlider.Control>
      </TRSlider.Root>
    );
  } else if (kind === 'textarea') {
    control = (
      <TRTextarea
        uiSize="sm"
        id={`playground-${name}`}
        onChange={(event) => onChange(event.currentTarget.value)}
        value={typeof value === 'string' ? value : ''}
      />
    );
  } else {
    control = (
      <TRInput
        uiSize="sm"
        {...limits}
        id={`playground-${name}`}
        onChange={(event) => {
          if (kind === 'number') {
            onChange(
              event.currentTarget.value === ''
                ? null
                : event.currentTarget.valueAsNumber,
            );
            return;
          }
          onChange(event.currentTarget.value);
        }}
        type={kind === 'number' ? 'number' : 'text'}
        value={typeof value === 'number' || typeof value === 'string' ? value : ''}
      />
    );
  }

  return (
    <TRField.Root
      className="col-span-2 grid gap-2"
      data-control-kind={kind}
      data-playground-control={name}
      uiSize="sm"
    >
      <TRField.Label
        className="text-tinyrack-sm font-medium"
        htmlFor={`playground-${name}`}
      >
        {name}
      </TRField.Label>
      {control}
    </TRField.Root>
  );
}

export function ComponentPlayground<TArgs extends DemoArgs>({
  definition,
}: {
  definition: PlaygroundDefinition<TArgs>;
}) {
  const locale = useDemoLocale();
  const copy = demoCopy[locale];
  const initialArgs = useMemo(
    () => ({ ...definition.args, ...definition.localizedArgs?.[locale] }) as TArgs,
    [definition, locale],
  );
  const [args, setArgs] = useState<TArgs>(() => initialArgs);
  const [resetKey, setResetKey] = useState(0);
  const Render = definition.render;
  const fillPreview = definition.parameters?.['playgroundLayout'] === 'fill';

  useEffect(() => {
    setArgs(initialArgs);
    setResetKey((current) => current + 1);
  }, [initialArgs]);

  function updateArgs(patch: DemoArgs) {
    setArgs((current) => ({ ...current, ...patch }) as TArgs);
  }

  return (
    <section
      aria-label={copy.playground(definition.title.replace(/^Components\//, ''))}
      className="grid min-w-0 overflow-hidden border border-tinyrack-border bg-tinyrack-surface lg:grid-cols-[minmax(0,1fr)_18rem]"
      data-component-playground=""
      data-pagefind-ignore="all"
    >
      <TRScrollArea.Root
        className="min-h-64 min-w-0 bg-tinyrack-canvas"
        data-playground-preview=""
        variant="plain"
      >
        <TRScrollArea.Viewport>
          <TRScrollArea.Content
            className="min-h-64 min-w-0"
            style={{ minWidth: '100%' }}
          >
            <div
              className={
                fillPreview
                  ? 'grid min-h-64 min-w-0 place-items-stretch'
                  : 'grid min-h-64 min-w-0 place-items-center p-4 sm:p-8'
              }
              data-playground-preview-frame=""
            >
              <PlaygroundArgsProvider
                key={resetKey}
                args={args}
                updateArgs={updateArgs}
              >
                {createElement(Render, args)}
              </PlaygroundArgsProvider>
            </div>
          </TRScrollArea.Content>
        </TRScrollArea.Viewport>
        <TRScrollArea.Scrollbar orientation="vertical">
          <TRScrollArea.Thumb />
        </TRScrollArea.Scrollbar>
        <TRScrollArea.Scrollbar orientation="horizontal">
          <TRScrollArea.Thumb />
        </TRScrollArea.Scrollbar>
        <TRScrollArea.Corner />
      </TRScrollArea.Root>
      <aside
        className="grid grid-cols-2 content-start gap-x-3 gap-y-4 border-t border-tinyrack-border p-4 lg:border-t-0 lg:border-l"
        data-playground-controls=""
      >
        <div className="col-span-2 flex items-center justify-between gap-3">
          <h3 className="m-0 text-tinyrack-md font-semibold">{copy.controls}</h3>
          <TRButton
            appearance="outline"
            onClick={() => {
              setArgs(initialArgs);
              setResetKey((current) => current + 1);
            }}
            uiSize="sm"
          >
            {copy.reset}
          </TRButton>
        </div>
        {Object.entries(definition.argTypes).map(([name, spec]) =>
          spec === undefined || (spec.when && !spec.when(args)) ? null : (
            <ControlField
              invalidJsonMessage={copy.invalidJson}
              key={name}
              name={name}
              onChange={(value) => updateArgs({ [name]: value })}
              spec={spec}
              value={args[name]}
            />
          ),
        )}
      </aside>
    </section>
  );
}
