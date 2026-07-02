import type {
  ShowcaseControlDefinition,
  ShowcaseControlValues,
  ShowcaseEntry,
} from './types.js';

type StorybookArgType = {
  control:
    | false
    | 'boolean'
    | 'number'
    | 'select'
    | 'text'
    | { type: 'number'; max?: number; min?: number; step?: number };
  description?: string;
  options?: ShowcaseControlDefinition['options'];
  table?: { disable?: boolean };
};

export function getShowcaseControlArgs(entry: ShowcaseEntry): ShowcaseControlValues {
  return Object.fromEntries(
    Object.entries(entry.controls ?? {}).map(([name, control]) => [
      name,
      control.defaultValue,
    ]),
  );
}

export function getShowcaseControlArgTypes(
  entry: ShowcaseEntry,
): Record<string, StorybookArgType> {
  return Object.fromEntries(
    Object.entries(entry.controls ?? {}).map(([name, control]) => [
      name,
      toStorybookArgType(control),
    ]),
  );
}

export function selectControlValue<T extends string>(
  controlValues: ShowcaseControlValues | undefined,
  name: string,
  fallback: T,
): T {
  const value = controlValues?.[name];

  return typeof value === 'string' ? (value as T) : fallback;
}

export function booleanControlValue(
  controlValues: ShowcaseControlValues | undefined,
  name: string,
  fallback = false,
) {
  const value = controlValues?.[name];

  return typeof value === 'boolean' ? value : fallback;
}

export function numberControlValue(
  controlValues: ShowcaseControlValues | undefined,
  name: string,
  fallback: number,
) {
  const value = controlValues?.[name];

  return typeof value === 'number' ? value : fallback;
}

function toStorybookArgType(control: ShowcaseControlDefinition): StorybookArgType {
  if (control.type === 'number') {
    return {
      control: {
        type: 'number',
        max: control.max,
        min: control.min,
        step: control.step,
      },
      description: control.description,
    };
  }

  return {
    control: control.type,
    description: control.description,
    options: control.options,
  };
}
