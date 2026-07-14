'use client';

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
    return (
      <select
        className="tr-playground-input"
        id={`playground-${name}`}
        onChange={(event) => onChange(options[Number(event.currentTarget.value)])}
        value={selectedIndex}
      >
        {options.map((option, index) => (
          <option key={optionLabel(option)} value={index}>
            {optionLabel(option)}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex flex-wrap gap-3" id={`playground-${name}`}>
      {options.map((option, index) => (
        <label className="inline-flex items-center gap-2" key={optionLabel(option)}>
          <input
            checked={index === selectedIndex}
            name={`playground-${name}`}
            onChange={() => onChange(option)}
            type="radio"
          />
          <span>{optionLabel(option)}</span>
        </label>
      ))}
    </div>
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
          <label className="inline-flex items-center gap-2" key={optionLabel(option)}>
            <input
              checked={checked}
              onChange={() =>
                onChange(
                  checked
                    ? selected.filter((entry) => !Object.is(entry, option))
                    : [...selected, option],
                )
              }
              type="checkbox"
            />
            <span>{optionLabel(option)}</span>
          </label>
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
      <textarea
        aria-invalid={invalid}
        className="tr-playground-input min-h-24 font-mono"
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
      <input
        checked={Boolean(value)}
        id={`playground-${name}`}
        onChange={(event) => onChange(event.currentTarget.checked)}
        type="checkbox"
      />
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
  } else {
    control = (
      <input
        {...limits}
        className="tr-playground-input"
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
          onChange(
            kind === 'range'
              ? event.currentTarget.valueAsNumber
              : event.currentTarget.value,
          );
        }}
        type={kind}
        value={typeof value === 'number' || typeof value === 'string' ? value : ''}
      />
    );
  }

  return (
    <div className="grid gap-2" data-playground-control={name}>
      <label className="text-tinyrack-sm font-medium" htmlFor={`playground-${name}`}>
        {name}
      </label>
      {control}
    </div>
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
    >
      <div
        className="grid min-h-64 min-w-0 place-items-center overflow-auto bg-tinyrack-canvas p-4 sm:p-8"
        data-playground-preview=""
      >
        <PlaygroundArgsProvider key={resetKey} args={args} updateArgs={updateArgs}>
          {createElement(Render, args)}
        </PlaygroundArgsProvider>
      </div>
      <aside
        className="grid content-start gap-4 border-t border-tinyrack-border p-4 lg:border-t-0 lg:border-l"
        data-playground-controls=""
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="m-0 text-tinyrack-base font-semibold">Controls</h3>
          <button
            className="tr-playground-reset"
            onClick={() => {
              setArgs({ ...definition.args });
              setResetKey((current) => current + 1);
            }}
            type="button"
          >
            Reset
          </button>
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
