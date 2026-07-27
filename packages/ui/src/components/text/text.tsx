import {
  type ComponentPropsWithRef,
  createElement,
  type ElementType,
  type ReactElement,
} from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRTextVariant =
  | 'caption'
  | 'label'
  | 'body'
  | 'bodySm'
  | 'code'
  | 'headingSm'
  | 'headingMd'
  | 'headingLg'
  | 'display'
  | 'displayLg';
export type TRTextColor =
  | 'default'
  | 'muted'
  | 'placeholder'
  | 'inverse'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';
export type TRTextAlign = 'start' | 'center' | 'end';
export type TRTextWeight = 'regular' | 'medium' | 'heading' | 'bold' | 'strong';

type TRTextOwnProps = {
  variant?: TRTextVariant;
  color?: TRTextColor;
  align?: TRTextAlign;
  truncate?: boolean;
  weight?: TRTextWeight;
};

export type TRTextProps<E extends ElementType = 'span'> = TRTextOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithRef<E>, 'as' | keyof TRTextOwnProps>;

export function TRText<E extends ElementType = 'span'>(
  props: TRTextProps<E>,
): ReactElement {
  const {
    as,
    variant = 'body',
    color,
    align,
    truncate,
    weight,
    className,
    ...rest
  } = props as TRTextProps<'span'>;

  return createElement(as ?? 'span', {
    ...rest,
    className: mergeClassNames('tr-text', className),
    'data-variant': variant,
    'data-color': color,
    'data-align': align,
    'data-truncate': truncate ? 'true' : undefined,
    'data-weight': weight,
  });
}
