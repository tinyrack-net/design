import { mergeComponentClassName } from '../../internal/component-class-name.js';
import type { TRSeparatorProps } from '../separator/index.js';
import { TRSeparator } from '../separator/index.js';

export type TROTPFieldSeparatorProps = TRSeparatorProps;
export function TROTPFieldSeparator({
  className,
  orientation = 'vertical',
  ...props
}: TROTPFieldSeparatorProps) {
  return (
    <TRSeparator
      {...props}
      className={mergeComponentClassName('tr-otp-field-separator', className)}
      orientation={orientation}
    />
  );
}
