import { describe, expect, it } from 'vitest';
import { daisyUiShowcaseEntries } from '../daisyui-showcase.js';
import { mantineShowcaseEntries } from '../mantine-showcase.js';

const requiredDaisyUiComponents = [
  'alert',
  'avatar',
  'badge',
  'breadcrumbs',
  'button',
  'calendar',
  'card',
  'carousel',
  'chat',
  'checkbox',
  'collapse',
  'countdown',
  'diff',
  'divider',
  'dock',
  'drawer',
  'dropdown',
  'fab',
  'fieldset',
  'fileinput',
  'filter',
  'footer',
  'hero',
  'hover3d',
  'hovergallery',
  'indicator',
  'input',
  'kbd',
  'label',
  'link',
  'list',
  'loading',
  'mask',
  'menu',
  'mockup',
  'modal',
  'navbar',
  'progress',
  'radialprogress',
  'radio',
  'range',
  'rating',
  'select',
  'skeleton',
  'stack',
  'stat',
  'status',
  'steps',
  'swap',
  'tab',
  'table',
  'textarea',
  'textrotate',
  'timeline',
  'toast',
  'toggle',
  'tooltip',
  'validator',
] as const;

const requiredMantineComponents = [
  'Accordion',
  'ActionIcon',
  'Affix',
  'Alert',
  'Anchor',
  'AppShell',
  'AspectRatio',
  'Autocomplete',
  'Avatar',
  'BackgroundImage',
  'Badge',
  'Blockquote',
  'Box',
  'Breadcrumbs',
  'Burger',
  'Button',
  'Card',
  'Center',
  'Checkbox',
  'Chip',
  'Code',
  'Collapse',
  'ColorInput',
  'ColorPicker',
  'ColorSwatch',
  'Combobox',
  'Container',
  'CopyButton',
  'DataList',
  'Dialog',
  'Divider',
  'Drawer',
  'EmptyState',
  'Fieldset',
  'FileInput',
  'Flex',
  'Grid',
  'Group',
  'Highlight',
  'HoverCard',
  'Image',
  'Indicator',
  'Input',
  'JsonInput',
  'Kbd',
  'List',
  'Loader',
  'LoadingOverlay',
  'Mark',
  'Marquee',
  'Menu',
  'Modal',
  'MultiSelect',
  'NativeSelect',
  'NavLink',
  'Notification',
  'NumberFormatter',
  'NumberInput',
  'Overlay',
  'Pagination',
  'Paper',
  'PasswordInput',
  'Pill',
  'PillsInput',
  'PinInput',
  'Popover',
  'Progress',
  'Radio',
  'RangeSlider',
  'Rating',
  'RingProgress',
  'ScrollArea',
  'SegmentedControl',
  'Select',
  'SemiCircleProgress',
  'SimpleGrid',
  'Skeleton',
  'Slider',
  'Space',
  'Spoiler',
  'Stack',
  'Stepper',
  'Switch',
  'Table',
  'Tabs',
  'TagsInput',
  'Text',
  'TextInput',
  'Textarea',
  'ThemeIcon',
  'Timeline',
  'Title',
  'Tooltip',
  'Typography',
  'UnstyledButton',
] as const;

describe('showcase registries', () => {
  it('covers every daisyUI component shipped in daisyUI 5.5', () => {
    expect(daisyUiShowcaseEntries.map((entry) => entry.name).sort()).toEqual(
      [...requiredDaisyUiComponents].sort(),
    );
  });

  it('covers Mantine core components selected for visual theme review', () => {
    expect(mantineShowcaseEntries.map((entry) => entry.name).sort()).toEqual(
      [...requiredMantineComponents].sort(),
    );
  });

  it('uses stable ids for Storybook and browser tests', () => {
    const ids = [...daisyUiShowcaseEntries, ...mantineShowcaseEntries].map(
      (entry) => entry.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-z0-9-]+$/.test(id))).toBe(true);
  });

  it('defines Storybook controls for high-priority Mantine components', () => {
    const expectedControls: Record<string, string[]> = {
      'mantine-actionicon': [
        'variant',
        'size',
        'color',
        'radius',
        'disabled',
        'loading',
      ],
      'mantine-alert': ['variant', 'color', 'radius', 'withCloseButton'],
      'mantine-badge': ['variant', 'size', 'color', 'radius'],
      'mantine-button': ['variant', 'size', 'color', 'radius', 'disabled', 'loading'],
      'mantine-card': ['shadow', 'padding', 'radius', 'withBorder'],
      'mantine-checkbox': [
        'variant',
        'size',
        'color',
        'radius',
        'checked',
        'disabled',
        'labelPosition',
      ],
      'mantine-input': ['variant', 'size', 'radius', 'disabled', 'error'],
      'mantine-modal': ['opened', 'size', 'centered', 'fullScreen', 'withCloseButton'],
      'mantine-radio': [
        'variant',
        'size',
        'color',
        'radius',
        'checked',
        'disabled',
        'labelPosition',
      ],
      'mantine-stepper': ['active', 'orientation', 'size', 'color'],
      'mantine-switch': [
        'size',
        'color',
        'radius',
        'checked',
        'disabled',
        'labelPosition',
      ],
      'mantine-table': [
        'striped',
        'highlightOnHover',
        'withTableBorder',
        'withColumnBorders',
      ],
      'mantine-tabs': ['variant', 'orientation', 'color', 'radius', 'inverted'],
      'mantine-textinput': ['variant', 'size', 'radius', 'disabled', 'error'],
    };

    for (const [entryId, controlNames] of Object.entries(expectedControls)) {
      const entry = mantineShowcaseEntries.find((entry) => entry.id === entryId);

      expect(entry, `${entryId} should exist`).toBeDefined();
      expect(Object.keys(entry?.controls ?? {})).toEqual(controlNames);
    }
  });

  it('defines Storybook controls for high-priority daisyUI components', () => {
    const expectedControls: Record<string, string[]> = {
      'daisyui-alert': ['tone', 'style', 'layout'],
      'daisyui-badge': ['tone', 'style', 'size'],
      'daisyui-button': [
        'tone',
        'style',
        'size',
        'shape',
        'loading',
        'active',
        'disabled',
      ],
      'daisyui-card': ['style', 'size', 'layout', 'actions'],
      'daisyui-checkbox': ['tone', 'size', 'checked', 'disabled'],
      'daisyui-dropdown': ['placement', 'align', 'open', 'hover'],
      'daisyui-input': ['tone', 'appearance', 'size', 'disabled'],
      'daisyui-loading': ['indicator', 'size'],
      'daisyui-modal': ['placement', 'open', 'actions'],
      'daisyui-navbar': ['layout', 'action'],
      'daisyui-radio': ['tone', 'size', 'checked', 'disabled'],
      'daisyui-steps': ['orientation', 'tone', 'currentStep'],
      'daisyui-tab': ['style', 'placement', 'size', 'activeTab', 'disabled'],
      'daisyui-table': ['size', 'zebra', 'rowHover', 'pinRows'],
      'daisyui-toggle': ['tone', 'size', 'checked', 'disabled'],
      'daisyui-tooltip': ['tone', 'placement', 'open'],
    };

    for (const [entryId, controlNames] of Object.entries(expectedControls)) {
      const entry = daisyUiShowcaseEntries.find((entry) => entry.id === entryId);

      expect(entry, `${entryId} should exist`).toBeDefined();
      expect(Object.keys(entry?.controls ?? {})).toEqual(controlNames);
    }
  });
});
