'use client';

import { ChevronDown } from 'lucide-react';
import { mergeComponentClassName } from '../utils/component-class-name.ts';
import type {
  TRSelectPortalProps,
  TRSelectRootChangeEventDetails,
  TRSelectRootProps,
  TRSelectTriggerProps,
  TRSelectTriggerUiSize,
} from '@tinyrack/ui/components/select';
import { TRSelect } from '@tinyrack/ui/components/select';

export type TRLanguageSelectOption = {
  label: string;
  language?: string;
  value: string;
};

type TRLanguageSelectRootProps = Pick<
  TRSelectRootProps,
  | 'actionsRef'
  | 'defaultOpen'
  | 'highlightItemOnHover'
  | 'modal'
  | 'onOpenChange'
  | 'onOpenChangeComplete'
  | 'open'
  | 'readOnly'
>;

export type TRLanguageSelectProps = Omit<
  TRSelectTriggerProps,
  'aria-label' | 'children'
> &
  TRLanguageSelectRootProps & {
    label?: string;
    onValueChange: (
      value: string,
      eventDetails: TRSelectRootChangeEventDetails,
    ) => void;
    options: readonly TRLanguageSelectOption[];
    portalContainer?: TRSelectPortalProps['container'];
    uiSize?: TRSelectTriggerUiSize;
    value: string;
  };

export function TRLanguageSelect({
  actionsRef,
  className,
  defaultOpen,
  disabled,
  highlightItemOnHover,
  label = 'Language',
  modal,
  onOpenChange,
  onOpenChangeComplete,
  onValueChange,
  open,
  options,
  portalContainer,
  readOnly,
  uiSize = 'md',
  value,
  ...triggerProps
}: TRLanguageSelectProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <TRSelect.Root
      actionsRef={actionsRef}
      defaultOpen={defaultOpen}
      disabled={disabled}
      highlightItemOnHover={highlightItemOnHover}
      items={options.map((option) => ({
        label: option.label,
        value: option.value,
      }))}
      modal={modal}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      onValueChange={(nextValue, eventDetails) => {
        if (typeof nextValue === 'string' && nextValue !== value) {
          onValueChange(nextValue, eventDetails);
        }
      }}
      open={open}
      readOnly={readOnly}
      value={value}
    >
      <TRSelect.Trigger
        {...triggerProps}
        aria-label={label}
        className={mergeComponentClassName('tr-language-select-trigger', className)}
        disabled={disabled}
        uiSize={uiSize}
      >
        <TRSelect.Value>
          <span lang={selectedOption?.language}>{selectedOption?.label ?? value}</span>
        </TRSelect.Value>
        <TRSelect.Icon aria-hidden="true">
          <ChevronDown />
        </TRSelect.Icon>
      </TRSelect.Trigger>
      <TRSelect.Portal container={portalContainer}>
        <TRSelect.Positioner>
          <TRSelect.Popup>
            <TRSelect.List>
              {options.map((option) => (
                <TRSelect.Item key={option.value} value={option.value}>
                  <TRSelect.ItemText lang={option.language}>
                    {option.label}
                  </TRSelect.ItemText>
                  <TRSelect.ItemIndicator aria-hidden="true">✓</TRSelect.ItemIndicator>
                </TRSelect.Item>
              ))}
            </TRSelect.List>
          </TRSelect.Popup>
        </TRSelect.Positioner>
      </TRSelect.Portal>
    </TRSelect.Root>
  );
}
