export type ComponentClassName<State = unknown> =
  | string
  | ((state: State) => string | undefined)
  | undefined;

export function mergeClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function mergeComponentClassName<State>(
  baseClassName: string,
  className: ComponentClassName<State>,
): string | ((state: State) => string) {
  if (typeof className === 'function') {
    return (state) => mergeClassNames(baseClassName, className(state));
  }

  return mergeClassNames(baseClassName, className);
}
