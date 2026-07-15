import type { ComponentPropsWithRef } from 'react';
import { mergeClassNames } from '../../internal/component-class-name.js';

export type StepsRootProps = ComponentPropsWithRef<'ol'>;
export type StepsItemProps = ComponentPropsWithRef<'li'>;

export function StepsRoot({ className, ...props }: StepsRootProps) {
  return <ol {...props} className={mergeClassNames('tr-steps', className)} />;
}

export function StepsItem({ className, ...props }: StepsItemProps) {
  return <li {...props} className={mergeClassNames('tr-steps-item', className)} />;
}
