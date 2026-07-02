import type { ReactElement } from 'react';

export type ShowcaseLibrary = 'mantine' | 'daisyui';

export type ShowcaseStoryKind =
  | 'default'
  | 'variants'
  | 'sizes'
  | 'states'
  | 'examples';

export type ShowcaseStoryDefinition = {
  id: ShowcaseStoryKind;
  exportName: string;
  name: string;
  description: string;
  render: (controlValues?: ShowcaseControlValues) => ReactElement;
};

/** @deprecated Use ShowcaseStoryKind instead. */
export type ShowcaseScenarioId =
  | ShowcaseStoryKind
  | 'preview'
  | 'composition'
  | 'tokens'
  | 'accessibility'
  | 'playground';

/** @deprecated Use ShowcaseStoryDefinition instead. */
export type ShowcaseScenario = ShowcaseStoryDefinition;

export type ShowcaseControlValue = string | number | boolean | undefined;

export type ShowcaseControlValues = Record<string, ShowcaseControlValue>;

export type ShowcaseControlDefinition = {
  type: 'boolean' | 'number' | 'select' | 'text';
  defaultValue?: ShowcaseControlValue;
  description?: string;
  max?: number;
  min?: number;
  options?: readonly Exclude<ShowcaseControlValue, undefined>[];
  step?: number;
};

export type ShowcaseEntry = {
  id: string;
  name: string;
  category: string;
  description: string;
  render: (controlValues?: ShowcaseControlValues) => ReactElement;
  controls?: Record<string, ShowcaseControlDefinition>;
  storyKinds?: ShowcaseStoryKind[];
};
