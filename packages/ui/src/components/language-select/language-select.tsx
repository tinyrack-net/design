'use client';

import { ChevronDown } from 'lucide-react';
import type { Ref } from 'react';
import { TRSelect } from '../select/index.js';
import type { TRSelectTriggerUiSize } from '../select/select-trigger.js';

export type TRLanguageSelectOption = {
  label: string;
  language?: string;
  value: string;
};

export type TRLanguageSelectProps = {
  label?: string;
  onValueChange: (value: string) => void;
  options: readonly TRLanguageSelectOption[];
  triggerRef?: Ref<HTMLButtonElement>;
  uiSize?: TRSelectTriggerUiSize;
  value: string;
};

export function TRLanguageSelect({
  label = 'Language',
  onValueChange,
  options,
  triggerRef,
  uiSize = 'md',
  value,
}: TRLanguageSelectProps) {
  return (
    <TRSelect.Root
      items={options.map((option) => ({
        label: option.label,
        value: option.value,
      }))}
      onValueChange={(nextValue) => onValueChange(String(nextValue))}
      value={value}
    >
      <TRSelect.Trigger
        aria-label={label}
        className="tr-language-select-trigger"
        ref={triggerRef}
        uiSize={uiSize}
      >
        <TRSelect.Value>
          {options.find((option) => option.value === value)?.label ?? value}
        </TRSelect.Value>
        <TRSelect.Icon aria-hidden="true">
          <ChevronDown />
        </TRSelect.Icon>
      </TRSelect.Trigger>
      <TRSelect.Portal>
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
