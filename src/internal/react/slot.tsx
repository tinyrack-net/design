import {
  Children,
  cloneElement,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';

export type SlottableProps = Record<string, unknown> & {
  children?: ReactNode | undefined;
  onClick?: ((event: MouseEvent<HTMLElement>) => void) | undefined;
  ref?: Ref<HTMLElement> | undefined;
};

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}

export function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      setRef(ref, value);
    }
  };
}

export function renderSlottable(
  asChild: boolean | undefined,
  children: ReactNode,
  slotProps: SlottableProps,
  forwardedRef: Ref<HTMLElement>,
  fallback: (props: SlottableProps, ref: Ref<HTMLElement>) => ReactElement,
) {
  if (!asChild) {
    return fallback({ ...slotProps, children }, forwardedRef);
  }

  const child = Children.only(children);
  const element = child as ReactElement<SlottableProps>;
  const childProps = element.props;
  const childOnClick = childProps.onClick;
  const slotOnClick = slotProps.onClick;
  const childRef = childProps.ref;

  return cloneElement(element, {
    ...slotProps,
    children: childProps.children,
    onClick(event: MouseEvent<HTMLElement>) {
      childOnClick?.(event);

      if (!event.defaultPrevented) {
        slotOnClick?.(event);
      }
    },
    ref: composeRefs(childRef, forwardedRef),
  });
}
