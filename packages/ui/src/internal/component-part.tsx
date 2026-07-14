import {
  type ComponentPropsWithRef,
  createElement,
  type ElementType,
  type ReactElement,
} from 'react';
import {
  type ComponentClassName,
  mergeComponentClassName,
} from './component-class-name.js';

export function createComponentPart<Component extends ElementType>(
  Component: Component,
  baseClassName?: string,
) {
  type Props = ComponentPropsWithRef<Component>;

  function TinyrackComponent(props: Props): ReactElement | null {
    if (baseClassName === undefined) {
      return createElement(Component, props);
    }

    const { className, ...componentProps } = props as Props & {
      className?: ComponentClassName;
    };

    return createElement(Component, {
      ...componentProps,
      className: mergeComponentClassName(baseClassName, className),
    });
  }

  return TinyrackComponent;
}
