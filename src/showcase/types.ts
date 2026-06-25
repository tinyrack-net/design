import type { ReactElement } from 'react';

export type ShowcaseLibrary = 'mantine' | 'daisyui';
export type ShowcaseScenarioId = 'preview' | 'variants';

export type ShowcaseScenario = {
  id: ShowcaseScenarioId;
  name: string;
  description: string;
  render: () => ReactElement;
};

export type ShowcaseEntry = {
  id: string;
  name: string;
  category: string;
  description: string;
  render: () => ReactElement;
};
