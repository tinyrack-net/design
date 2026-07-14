'use client';

import { Button } from '@tinyrack/ui/components/button';
import { Checkbox } from '@tinyrack/ui/components/checkbox';
import { Field } from '@tinyrack/ui/components/field';
import { Input } from '@tinyrack/ui/components/input';
import { Radio } from '@tinyrack/ui/components/radio';
import { RadioGroup } from '@tinyrack/ui/components/radio-group';
import { ScrollArea } from '@tinyrack/ui/components/scroll-area';
import { Select } from '@tinyrack/ui/components/select';
import { Slider } from '@tinyrack/ui/components/slider';
import { Textarea } from '@tinyrack/ui/components/textarea';
import { ChevronDown } from 'lucide-react';
import {
  type ChangeEvent,
  createElement,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
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
      <Select.Root
        items={items}
        onValueChange={(index) => onChange(options[Number(index)])}
        value={String(selectedIndex)}
      >
        <Select.Trigger aria-label={name} id={`playground-${name}`}>
          <Select.Value />
          <Select.Icon aria-hidden="true">
            <ChevronDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={8}>
            <Select.Popup>
              <Select.List>
                {options.map((option, index) => (
                  <Select.Item key={optionLabel(option)} value={String(index)}>
                    <Select.ItemText>{optionLabel(option)}</Select.ItemText>
                    <Select.ItemIndicator aria-hidden="true">✓</Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    );
  }

  return (
    <RadioGroup
      className="flex flex-wrap gap-3"
      id={`playground-${name}`}
      name={`playground-${name}`}
      onValueChange={(index) => onChange(options[Number(index)])}
      value={String(selectedIndex)}
    >
      {options.map((option, index) => (
        <span className="inline-flex items-center gap-2" key={optionLabel(option)}>
          <Radio.Root aria-label={optionLabel(option)} value={String(index)}>
            <Radio.Indicator aria-hidden="true" />
          </Radio.Root>
          <span>{optionLabel(option)}</span>
        </span>
      ))}
    </RadioGroup>
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
      {options.map((option) => {
        const checked = selected.some((entry) => Object.is(entry, option));
        return (
          <span className="inline-flex items-center gap-2" key={optionLabel(option)}>
            <Checkbox.Root
              aria-label={optionLabel(option)}
              checked={checked}
              onCheckedChange={() =>
                onChange(
                  checked
                    ? selected.filter((entry) => !Object.is(entry, option))
                    : [...selected, option],
                )
              }
            >
              <Checkbox.Indicator aria-hidden="true">✓</Checkbox.Indicator>
            </Checkbox.Root>
            <span>{optionLabel(option)}</span>
          </span>
        );
      })}
    </div>
  );
}

function JsonControl({
  name,
  onChange,
  validate,
  validationMessage = 'Enter valid JSON.',
  value,
}: {
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
      <Textarea
        aria-invalid={invalid}
        className="min-h-24 font-mono"
        id={`playground-${name}`}
        onChange={updateDraft}
        value={draft}
      />
      {invalid ? (
        <span className="text-tinyrack-xs text-tinyrack-danger" role="status">
          {validationMessage}
        </span>
      ) : null}
    </>
  );
}

function ControlField({
  name,
  onChange,
  spec,
  value,
}: {
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
    control = (
      <Checkbox.Root
        aria-label={name}
        checked={Boolean(value)}
        id={`playground-${name}`}
        onCheckedChange={(checked) => onChange(checked)}
      >
        <Checkbox.Indicator aria-hidden="true">✓</Checkbox.Indicator>
      </Checkbox.Root>
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
      <Slider.Root
        {...limits}
        onValueChange={(values) =>
          onChange(Array.isArray(values) ? (values[0] ?? numericValue) : values)
        }
        value={[numericValue]}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
          </Slider.Track>
          <Slider.Thumb aria-label={name} id={`playground-${name}`} />
        </Slider.Control>
      </Slider.Root>
    );
  } else {
    control = (
      <Input
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
    <Field.Root className="grid gap-2" data-playground-control={name}>
      <Field.Label
        className="text-tinyrack-sm font-medium"
        htmlFor={`playground-${name}`}
      >
        {name}
      </Field.Label>
      {control}
    </Field.Root>
  );
}

export function ComponentPlayground<TArgs extends DemoArgs>({
  definition,
}: {
  definition: PlaygroundDefinition<TArgs>;
}) {
  const [args, setArgs] = useState<TArgs>(() => ({ ...definition.args }));
  const [resetKey, setResetKey] = useState(0);
  const Render = definition.render;

  function updateArgs(patch: DemoArgs) {
    setArgs((current) => ({ ...current, ...patch }) as TArgs);
  }

  return (
    <section
      aria-label={`${definition.title.replace(/^Components\//, '')} playground`}
      className="my-6 grid min-w-0 overflow-hidden border border-tinyrack-border bg-tinyrack-surface lg:grid-cols-[minmax(0,1fr)_18rem]"
      data-component-playground=""
      data-pagefind-ignore="all"
    >
      <ScrollArea.Root
        className="min-h-64 min-w-0 bg-tinyrack-canvas"
        data-playground-preview=""
        variant="plain"
      >
        <ScrollArea.Viewport>
          <ScrollArea.Content className="grid min-h-64 min-w-0 place-items-center p-4 sm:p-8">
            <PlaygroundArgsProvider key={resetKey} args={args} updateArgs={updateArgs}>
              {createElement(Render, args)}
            </PlaygroundArgsProvider>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
      <aside
        className="grid content-start gap-4 border-t border-tinyrack-border p-4 lg:border-t-0 lg:border-l"
        data-playground-controls=""
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="m-0 text-tinyrack-base font-semibold">Controls</h3>
          <Button
            appearance="outline"
            onClick={() => {
              setArgs({ ...definition.args });
              setResetKey((current) => current + 1);
            }}
            size="sm"
          >
            Reset
          </Button>
        </div>
        {Object.entries(definition.argTypes).map(([name, spec]) =>
          spec === undefined ? null : (
            <ControlField
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
