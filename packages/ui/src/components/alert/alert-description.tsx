'use client';

import { useRender } from '@base-ui/react/use-render';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type TRAlertDescriptionProps = useRender.ComponentProps<'p'>;

export function TRAlertDescription({
  className,
  ref,
  render,
  ...props
}: TRAlertDescriptionProps) {
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
