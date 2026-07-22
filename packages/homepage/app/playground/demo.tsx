'use client';

import { createContext, type ReactNode, useContext } from 'react';
import type { DemoLocale } from '../documentation/shared/demo-locale.js';

export type DemoArgs = Record<string, unknown>;

export type DemoControl =
  | 'boolean'
  | 'text'
  | 'number'
  | 'range'
  | 'select'
  | 'radio'
  | 'textarea'
  | 'checklist'
  | 'json'
  | {
      max?: number;
      min?: number;
      step?: number;
      type: 'checklist' | 'number' | 'range';
    };

export type DemoArgType = {
  control: DemoControl;
  options?: readonly unknown[];
  when?: (args: DemoArgs) => boolean;
  validate?: (value: unknown) => boolean;
  validationMessage?: string;
};

export type DemoMeta<TArgs extends DemoArgs = DemoArgs> = {
  args: TArgs;
  argTypes: Partial<Record<keyof TArgs, DemoArgType>>;
  excludeStories?: RegExp;
  parameters?: Record<string, unknown>;
  localizedArgs?: Partial<Record<DemoLocale, Partial<TArgs>>>;
  render: (args: TArgs) => ReactNode;
  title: string;
  component?: unknown;
  [key: string]: unknown;
};

export type DemoVariant<_TMeta = unknown> = {
  args?: DemoArgs;
};

export type PlaygroundDefinition<TArgs extends DemoArgs = DemoArgs> = DemoMeta<TArgs>;

type PlaygroundArgsContextValue = {
  args: DemoArgs;
  updateArgs: (patch: DemoArgs) => void;
};

const PlaygroundArgsContext = createContext<PlaygroundArgsContextValue | null>(null);

export function definePlayground<TArgs extends DemoArgs>(
  definition: DemoMeta<TArgs>,
): PlaygroundDefinition<TArgs> {
  return definition;
}

export function PlaygroundArgsProvider({
  args,
  children,
  updateArgs,
}: PlaygroundArgsContextValue & { children: ReactNode }) {
  return (
    <PlaygroundArgsContext value={{ args, updateArgs }}>
      {children}
    </PlaygroundArgsContext>
  );
}

export function usePlaygroundArgs<TArgs extends DemoArgs>() {
  const context = useContext(PlaygroundArgsContext);

  if (context === null) {
    throw new Error('usePlaygroundArgs must be used inside ComponentPlayground.');
  }

  return [context.args as TArgs, context.updateArgs] as const;
}
