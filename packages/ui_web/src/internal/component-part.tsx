import {
  type ComponentPropsWithRef,
  cloneElement,
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
  /**
   * Keep a disabled trigger in the tab order with `aria-disabled="true"`.
   *
   * Base UI applies the native `disabled` attribute to disabled native
   * buttons, which takes them out of the tab order. Tinyrack documents the
   * opposite contract for disclosure triggers: a disabled trigger stays
   * focusable so keyboard users can discover why the control is unavailable,
   * while `aria-disabled` keeps it from activating. Normalize the rendered
   * element back to that contract instead of inheriting the native behavior.
   */
  focusableWhenDisabled?: boolean;
};

type FocusableWhenDisabledState = { disabled?: boolean };

type RenderPropFunction = (
  props: Record<string, unknown>,
  state: FocusableWhenDisabledState,
) => ReactElement;

/**
 * Wrap the consumer's `render` prop so the element Base UI produces keeps
 * `aria-disabled` and drops the native `disabled` attribute. Base UI hands the
 * fully merged props and state to a render function, which is the only place
 * to change what reaches the DOM without duplicating its prop merging.
 */
function createFocusableDisabledRender(render: unknown): RenderPropFunction {
  return (elementProps, state) => {
    const element =
      render === undefined
        ? createElement('button', { type: 'button', ...elementProps })
        : typeof render === 'function'
          ? (render as RenderPropFunction)(elementProps, state)
          : cloneElement(render as ReactElement, elementProps);

    if (!state.disabled) {
      return element;
    }

    return cloneElement(element as ReactElement<Record<string, unknown>>, {
      'aria-disabled': true,
      disabled: undefined,
    });
  };
}

export function createComponentPart<Component extends ElementType>(
  Component: Component,
  baseClassName?: string,
  {
    tracksFocusModality = false,
    focusableWhenDisabled = false,
  }: CreateComponentPartOptions = {},
) {
  type Props = ComponentPropsWithRef<Component>;

  function renderComponent(props: Props): ReactElement | null {
    if (baseClassName === undefined && !focusableWhenDisabled) {
      return createElement(Component, props);
    }

    const { className, render, ...componentProps } = props as Props & {
      className?: ComponentClassName;
      render?: unknown;
    };

    return createElement(Component, {
      ...componentProps,
      ...(focusableWhenDisabled
        ? { render: createFocusableDisabledRender(render) }
        : { render }),
      ...(baseClassName === undefined
        ? {}
        : { className: mergeComponentClassName(baseClassName, className) }),
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
