'use client';

import type { Ref } from 'react';
import { Select } from '../select/index.js';

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
  value: string;
};

export function LanguageSelect({
  label = 'Language',
  onValueChange,
  options,
  triggerRef,
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
      >
        <Select.Value>
          {options.find((option) => option.value === value)?.label ?? value}
        </Select.Value>
        <Select.Icon aria-hidden="true">⌄</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.List>
              {options.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  <Select.ItemIndicator aria-hidden="true">✓</Select.ItemIndicator>
                  <Select.ItemText lang={option.language}>
                    {option.label}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
