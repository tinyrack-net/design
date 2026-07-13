import { useId } from 'react';

export type AsChildProps = {
  asChild?: boolean;
};

export type CommandAttributes = {
  command?: string;
  commandfor?: string;
  popoverTarget?: string;
  popoverTargetAction?: string;
};

export function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function useStableId(prefix: string, id?: string) {
  const reactId = useId().replaceAll(':', '');
  return id ?? `${prefix}-${reactId}`;
}
