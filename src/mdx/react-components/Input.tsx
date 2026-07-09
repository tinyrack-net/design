import type { ComponentPropsWithoutRef } from 'react';
import { Checkbox } from '../../components/form/react.js';
import { mergeClassNames } from '../shared.js';

export function TinyrackMdxInput({
  className,
  type,
  ...inputProps
}: ComponentPropsWithoutRef<'input'>) {
  if (type === 'checkbox') {
    const { size: _inputSize, ...checkboxProps } = inputProps;
    void _inputSize;

    return (
      <Checkbox
        className={mergeClassNames('tr-mdx-task-checkbox', className)}
        size="sm"
        {...checkboxProps}
      />
    );
  }

  return <input className={className} type={type} {...inputProps} />;
}
