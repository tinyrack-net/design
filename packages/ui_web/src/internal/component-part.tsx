import {
  type ComponentPropsWithRef,
  createElement,
  type ElementType,
  type ReactElement,
} from 'react';
import { useTinyrackFocusModality } from '../providers/focus-modality/focus-modality-provider.js';
import {
  type ComponentClassName,
  mergeComponentClassName,
} from './component-class-name.js';

export type CreateComponentPartOptions = {
  /**
   * Set for text-editable parts. `:focus-visible` matches those however focus
   * arrived, so their CSS gates the ring on the modality tracker, which has to
   * be running for the gate to mean anything.
   */
  tracksFocusModality?: boolean;
};

export function createComponentPart<Component extends ElementType>(
  Component: Component,
  baseClassName?: string,
  { tracksFocusModality = false }: CreateComponentPartOptions = {},
) {
  type Props = ComponentPropsWithRef<Component>;

  function renderComponent(props: Props): ReactElement | null {
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

  // Two bodies rather than a conditional hook call, so the hook rule holds for
  // every generated component.
  if (!tracksFocusModality) {
    return function TinyrackComponent(props: Props): ReactElement | null {
      return renderComponent(props);
    };
  }

  return function TinyrackComponent(props: Props): ReactElement | null {
    useTinyrackFocusModality();
    return renderComponent(props);
  };
}
