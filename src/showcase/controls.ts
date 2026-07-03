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
  options?: NonNullable<ShowcaseControlDefinition['options']>;
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
    const numberControl: Extract<StorybookArgType['control'], { type: 'number' }> = {
      type: 'number',
    };
    const argType: StorybookArgType = { control: numberControl };

    if (control.max !== undefined) {
      numberControl.max = control.max;
    }

    if (control.min !== undefined) {
      numberControl.min = control.min;
    }

    if (control.step !== undefined) {
      numberControl.step = control.step;
    }

    if (control.description !== undefined) {
      argType.description = control.description;
    }

    return argType;
  }

  const argType: StorybookArgType = { control: control.type };

  if (control.description !== undefined) {
    argType.description = control.description;
  }

  if (control.options !== undefined) {
    argType.options = control.options;
  }

  return argType;
}
