import { mergeComponentClassName } from '../../internal/component-class-name.js';
import type { SeparatorProps } from '../separator/index.js';
import { Separator } from '../separator/index.js';

export type OTPFieldSeparatorProps = SeparatorProps;
export function OTPFieldSeparator({
  className,
  orientation = 'vertical',
  ...props
}: OTPFieldSeparatorProps) {
  return (
    <Separator
      {...props}
      className={mergeComponentClassName('tr-otp-field-separator', className)}
      orientation={orientation}
    />
  );
}
