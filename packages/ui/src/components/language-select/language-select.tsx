'use client';

import { ChevronDown } from 'lucide-react';
import type { Ref } from 'react';
import { Select } from '../select/index.js';
import type { SelectTriggerUiSize } from '../select/select-trigger.js';

export type LanguageSelectOption = {
  label: string;
  language?: string;
  value: string;
};

export type LanguageSelectProps = {
  label?: string;
  onValueChange: (value: string) => void;
  options: readonly LanguageSelectOption[];
  triggerRef?: Ref<HTMLButtonElement>;
  uiSize?: SelectTriggerUiSize;
  value: string;
};

export function LanguageSelect({
  label = 'Language',
  onValueChange,
  options,
  triggerRef,
  uiSize = 'md',
  value,
}: LanguageSelectProps) {
  return (
    <Select.Root
      items={options.map((option) => ({
        label: option.label,
        value: option.value,
      }))}
      onValueChange={(nextValue) => onValueChange(String(nextValue))}
      value={value}
    >
      <Select.Trigger
        aria-label={label}
        className="tr-language-select-trigger"
        ref={triggerRef}
        uiSize={uiSize}
      >
        <Select.Value>
          {options.find((option) => option.value === value)?.label ?? value}
        </Select.Value>
        <Select.Icon aria-hidden="true">
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.List>
              {options.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  <Select.ItemText lang={option.language}>
                    {option.label}
                  </Select.ItemText>
                  <Select.ItemIndicator aria-hidden="true">✓</Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
