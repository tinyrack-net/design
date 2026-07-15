'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type AlertDescriptionProps = useRender.ComponentProps<'p'>;

export function AlertDescription({
  className,
  ref,
  render,
  ...props
}: AlertDescriptionProps) {
  return useRender({
    defaultTagName: 'p',
    props: {
      ...props,
      className: mergeClassNames('tr-alert-description', className),
    },
    ref,
    render,
  });
}
