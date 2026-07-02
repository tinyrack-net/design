import * as Mantine from '@mantine/core';
import {
  booleanControlValue,
  numberControlValue,
  selectControlValue,
} from './controls.js';
import type { ShowcaseEntry } from './types.js';

type MantineEntrySpec = Omit<ShowcaseEntry, 'render'> & {
  render: ShowcaseEntry['render'];
};

const mantineToneOptions = [
  'tinyrack',
  'blue',
  'gray',
  'green',
  'yellow',
  'red',
] as const;
const mantineSizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const mantineRadiusOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const mantineButtonVariantOptions = [
  'filled',
  'light',
  'outline',
  'subtle',
  'transparent',
  'white',
  'default',
  'gradient',
] as const;
const mantineInputVariantOptions = ['default', 'filled', 'unstyled'] as const;
const mantineControlLabelPositions = ['right', 'left'] as const;
const mantineShadowOptions = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

const mantineButtonControls: ShowcaseEntry['controls'] = {
  variant: {
    type: 'select',
    defaultValue: 'filled',
    options: mantineButtonVariantOptions,
    description: 'Mantine visual variant.',
  },
  size: {
    type: 'select',
    defaultValue: 'sm',
    options: mantineSizeOptions,
    description: 'Component size token.',
  },
  color: {
    type: 'select',
    defaultValue: 'tinyrack',
    options: mantineToneOptions,
    description: 'Theme color token.',
  },
  radius: {
    type: 'select',
    defaultValue: 'md',
    options: mantineRadiusOptions,
    description: 'Border radius token.',
  },
  disabled: {
    type: 'boolean',
    defaultValue: false,
    description: 'Disabled state.',
  },
  loading: {
    type: 'boolean',
    defaultValue: false,
    description: 'Loading state.',
  },
};

const mantineInputControls: ShowcaseEntry['controls'] = {
  variant: {
    type: 'select',
    defaultValue: 'default',
    options: mantineInputVariantOptions,
    description: 'Mantine input variant.',
  },
  size: {
    type: 'select',
    defaultValue: 'sm',
    options: mantineSizeOptions,
    description: 'Input size token.',
  },
  radius: {
    type: 'select',
    defaultValue: 'md',
    options: mantineRadiusOptions,
    description: 'Border radius token.',
  },
  disabled: {
    type: 'boolean',
    defaultValue: false,
    description: 'Disabled state.',
  },
  error: {
    type: 'boolean',
    defaultValue: false,
    description: 'Error state.',
  },
};

const mantineInlineControlControls: ShowcaseEntry['controls'] = {
  variant: {
    type: 'select',
    defaultValue: 'filled',
    options: ['filled', 'outline'],
    description: 'Mantine control variant.',
  },
  size: {
    type: 'select',
    defaultValue: 'sm',
    options: mantineSizeOptions,
    description: 'Control size token.',
  },
  color: {
    type: 'select',
    defaultValue: 'tinyrack',
    options: mantineToneOptions,
    description: 'Checked color token.',
  },
  radius: {
    type: 'select',
    defaultValue: 'sm',
    options: mantineRadiusOptions,
    description: 'Control radius token.',
  },
  checked: {
    type: 'boolean',
    defaultValue: true,
    description: 'Checked state.',
  },
  disabled: {
    type: 'boolean',
    defaultValue: false,
    description: 'Disabled state.',
  },
  labelPosition: {
    type: 'select',
    defaultValue: 'right',
    options: mantineControlLabelPositions,
    description: 'Label placement.',
  },
};

export const mantineShowcaseEntries: MantineEntrySpec[] = [
  {
    id: 'mantine-accordion',
    name: 'Accordion',
    category: 'Mantine Core',
    description: '@mantine/core Accordion themed preview',
    render: () => (
      <Mantine.Accordion defaultValue="item">
        <Mantine.Accordion.Item value="item">
          <Mantine.Accordion.Control>Section</Mantine.Accordion.Control>
          <Mantine.Accordion.Panel>Accordion panel</Mantine.Accordion.Panel>
        </Mantine.Accordion.Item>
      </Mantine.Accordion>
    ),
  },
  {
    id: 'mantine-actionicon',
    name: 'ActionIcon',
    category: 'Mantine Core',
    description: '@mantine/core ActionIcon themed preview',
    storyKinds: ['default', 'variants', 'sizes', 'states'],
    controls: mantineButtonControls,
    render: (controlValues) => (
      <Mantine.ActionIcon
        aria-label="Settings"
        color={selectControlValue(controlValues, 'color', 'tinyrack')}
        disabled={booleanControlValue(controlValues, 'disabled')}
        loading={booleanControlValue(controlValues, 'loading')}
        radius={selectControlValue(controlValues, 'radius', 'md')}
        size={selectControlValue(controlValues, 'size', 'sm')}
        variant={selectControlValue(controlValues, 'variant', 'filled')}
      >
        ★
      </Mantine.ActionIcon>
    ),
  },
  {
    id: 'mantine-affix',
    name: 'Affix',
    category: 'Mantine Core',
    description: '@mantine/core Affix themed preview',
    render: () => (
      <Mantine.Box pos="relative" h={80}>
        <Mantine.Affix position={{ bottom: 8, right: 8 }} withinPortal={false}>
          <Mantine.Button size="xs">Affix</Mantine.Button>
        </Mantine.Affix>
      </Mantine.Box>
    ),
  },
  {
    id: 'mantine-alert',
    name: 'Alert',
    category: 'Mantine Core',
    description: '@mantine/core Alert themed preview',
    storyKinds: ['default', 'variants', 'states'],
    controls: {
      variant: {
        type: 'select',
        defaultValue: 'light',
        options: ['light', 'filled', 'outline', 'transparent', 'default'],
        description: 'Mantine alert visual variant.',
      },
      color: {
        type: 'select',
        defaultValue: 'tinyrack',
        options: mantineToneOptions,
        description: 'Theme color token.',
      },
      radius: {
        type: 'select',
        defaultValue: 'md',
        options: mantineRadiusOptions,
        description: 'Border radius token.',
      },
      withCloseButton: {
        type: 'boolean',
        defaultValue: false,
        description: 'Show close button affordance.',
      },
    },
    render: (controlValues) => (
      <Mantine.Alert
        color={selectControlValue(controlValues, 'color', 'tinyrack')}
        radius={selectControlValue(controlValues, 'radius', 'md')}
        title="Alert"
        variant={selectControlValue(controlValues, 'variant', 'light')}
        withCloseButton={booleanControlValue(controlValues, 'withCloseButton')}
      >
        Important themed message
      </Mantine.Alert>
    ),
  },
  {
    id: 'mantine-anchor',
    name: 'Anchor',
    category: 'Mantine Core',
    description: '@mantine/core Anchor themed preview',
    render: () => <Mantine.Anchor href="#mantine-anchor">Anchor link</Mantine.Anchor>,
  },
  {
    id: 'mantine-appshell',
    name: 'AppShell',
    category: 'Mantine Core',
    description: '@mantine/core AppShell themed preview',
    render: () => (
      <Mantine.Box className="tinyrack-demo-appshell">
        <Mantine.AppShell
          header={{ height: 40 }}
          mode="static"
          navbar={{ width: 128, breakpoint: 'sm' }}
          padding="sm"
        >
          <Mantine.AppShell.Header px="sm">Header</Mantine.AppShell.Header>
          <Mantine.AppShell.Navbar p="sm">Nav</Mantine.AppShell.Navbar>
          <Mantine.AppShell.Main>Main content</Mantine.AppShell.Main>
        </Mantine.AppShell>
      </Mantine.Box>
    ),
  },
  {
    id: 'mantine-aspectratio',
    name: 'AspectRatio',
    category: 'Mantine Core',
    description: '@mantine/core AspectRatio themed preview',
    render: () => (
      <Mantine.AspectRatio ratio={16 / 9} maw={220}>
        <Mantine.Center bg="tinyrack.1">16:9</Mantine.Center>
      </Mantine.AspectRatio>
    ),
  },
  {
    id: 'mantine-autocomplete',
    name: 'Autocomplete',
    category: 'Mantine Core',
    description: '@mantine/core Autocomplete themed preview',
    render: () => (
      <Mantine.Autocomplete
        label="Autocomplete"
        data={['Mantine', 'daisyUI', 'Starlight']}
        defaultValue="Mantine"
      />
    ),
  },
  {
    id: 'mantine-avatar',
    name: 'Avatar',
    category: 'Mantine Core',
    description: '@mantine/core Avatar themed preview',
    render: () => (
      <Mantine.Avatar color="tinyrack" radius="xl">
        TR
      </Mantine.Avatar>
    ),
  },
  {
    id: 'mantine-backgroundimage',
    name: 'BackgroundImage',
    category: 'Mantine Core',
    description: '@mantine/core BackgroundImage themed preview',
    render: () => (
      <Mantine.BackgroundImage
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 80'%3E%3Crect width='160' height='80' fill='%23d9edff'/%3E%3Ccircle cx='40' cy='40' r='24' fill='%233297f0'/%3E%3C/svg%3E"
        radius="md"
      >
        <Mantine.Center h={80}>Background</Mantine.Center>
      </Mantine.BackgroundImage>
    ),
  },
  {
    id: 'mantine-badge',
    name: 'Badge',
    category: 'Mantine Core',
    description: '@mantine/core Badge themed preview',
    storyKinds: ['default', 'variants', 'states'],
    controls: {
      variant: {
        type: 'select',
        defaultValue: 'filled',
        options: [
          'filled',
          'light',
          'outline',
          'dot',
          'transparent',
          'white',
          'default',
          'gradient',
        ],
        description: 'Mantine badge visual variant.',
      },
      size: {
        type: 'select',
        defaultValue: 'md',
        options: mantineSizeOptions,
        description: 'Badge size token.',
      },
      color: {
        type: 'select',
        defaultValue: 'tinyrack',
        options: mantineToneOptions,
        description: 'Theme color token.',
      },
      radius: {
        type: 'select',
        defaultValue: 'xl',
        options: mantineRadiusOptions,
        description: 'Border radius token.',
      },
    },
    render: (controlValues) => (
      <Mantine.Badge
        color={selectControlValue(controlValues, 'color', 'tinyrack')}
        radius={selectControlValue(controlValues, 'radius', 'xl')}
        size={selectControlValue(controlValues, 'size', 'md')}
        variant={selectControlValue(controlValues, 'variant', 'filled')}
      >
        Tinyrack
      </Mantine.Badge>
    ),
  },
  {
    id: 'mantine-blockquote',
    name: 'Blockquote',
    category: 'Mantine Core',
    description: '@mantine/core Blockquote themed preview',
    render: () => (
      <Mantine.Blockquote cite="Tinyrack">Theme-first design system</Mantine.Blockquote>
    ),
  },
  {
    id: 'mantine-box',
    name: 'Box',
    category: 'Mantine Core',
    description: '@mantine/core Box themed preview',
    render: () => (
      <Mantine.Box p="md" bg="tinyrack.0">
        Box
      </Mantine.Box>
    ),
  },
  {
    id: 'mantine-breadcrumbs',
    name: 'Breadcrumbs',
    category: 'Mantine Core',
    description: '@mantine/core Breadcrumbs themed preview',
    render: () => (
      <Mantine.Breadcrumbs>
        <Mantine.Anchor href="#">Home</Mantine.Anchor>
        <Mantine.Anchor href="#">Themes</Mantine.Anchor>
      </Mantine.Breadcrumbs>
    ),
  },
  {
    id: 'mantine-burger',
    name: 'Burger',
    category: 'Mantine Core',
    description: '@mantine/core Burger themed preview',
    render: () => <Mantine.Burger opened={false} aria-label="Toggle navigation" />,
  },
  {
    id: 'mantine-button',
    name: 'Button',
    category: 'Mantine Core',
    description: '@mantine/core Button themed preview',
    storyKinds: ['default', 'variants', 'sizes', 'states'],
    controls: mantineButtonControls,
    render: (controlValues) => {
      const color = selectControlValue(controlValues, 'color', 'tinyrack');
      const disabled = booleanControlValue(controlValues, 'disabled');
      const loading = booleanControlValue(controlValues, 'loading');
      const radius = selectControlValue(controlValues, 'radius', 'md');
      const size = selectControlValue(controlValues, 'size', 'sm');
      const variant = selectControlValue(controlValues, 'variant', 'filled');

      return (
        <Mantine.Stack className="tinyrack-control-review" gap="sm">
          <Mantine.Group className="tinyrack-control-review__row" gap="xs">
            <Mantine.Button
              color={color}
              disabled={disabled}
              loading={loading}
              radius={radius}
              size={size}
              variant={variant}
            >
              Button
            </Mantine.Button>
            <Mantine.Button color={color} radius={radius} size={size} variant="default">
              Secondary
            </Mantine.Button>
            <Mantine.Button
              color={color}
              disabled
              radius={radius}
              size={size}
              variant={variant}
            >
              Disabled
            </Mantine.Button>
            <Mantine.Button
              color={color}
              loading
              radius={radius}
              size={size}
              variant={variant}
            >
              Loading
            </Mantine.Button>
          </Mantine.Group>
        </Mantine.Stack>
      );
    },
  },
  {
    id: 'mantine-card',
    name: 'Card',
    category: 'Mantine Core',
    description: '@mantine/core Card themed preview',
    storyKinds: ['default', 'variants', 'states', 'examples'],
    controls: {
      shadow: {
        type: 'select',
        defaultValue: 'sm',
        options: mantineShadowOptions,
        description: 'Card shadow token.',
      },
      padding: {
        type: 'select',
        defaultValue: 'md',
        options: mantineSizeOptions,
        description: 'Card padding token.',
      },
      radius: {
        type: 'select',
        defaultValue: 'md',
        options: mantineRadiusOptions,
        description: 'Card radius token.',
      },
      withBorder: {
        type: 'boolean',
        defaultValue: true,
        description: 'Show card border.',
      },
    },
    render: (controlValues) => (
      <Mantine.Card
        padding={selectControlValue(controlValues, 'padding', 'md')}
        radius={selectControlValue(controlValues, 'radius', 'md')}
        shadow={selectControlValue(controlValues, 'shadow', 'sm')}
        withBorder={booleanControlValue(controlValues, 'withBorder', true)}
      >
        <Mantine.Text fw={600}>Card</Mantine.Text>
        <Mantine.Text c="dimmed" size="sm">
          Status copy and action stay grouped inside the surface.
        </Mantine.Text>
        <Mantine.Group justify="flex-end" mt="md">
          <Mantine.Button size="xs">Open</Mantine.Button>
        </Mantine.Group>
      </Mantine.Card>
    ),
  },
  {
    id: 'mantine-center',
    name: 'Center',
    category: 'Mantine Core',
    description: '@mantine/core Center themed preview',
    render: () => (
      <Mantine.Center h={64} bg="tinyrack.0">
        Centered
      </Mantine.Center>
    ),
  },
  {
    id: 'mantine-checkbox',
    name: 'Checkbox',
    category: 'Mantine Core',
    description: '@mantine/core Checkbox themed preview',
    storyKinds: ['default', 'variants', 'states', 'sizes'],
    controls: mantineInlineControlControls,
    render: (controlValues) => (
      <Mantine.Checkbox
        checked={booleanControlValue(controlValues, 'checked', true)}
        color={selectControlValue(controlValues, 'color', 'tinyrack')}
        disabled={booleanControlValue(controlValues, 'disabled')}
        label="Checkbox"
        labelPosition={selectControlValue(controlValues, 'labelPosition', 'right')}
        radius={selectControlValue(controlValues, 'radius', 'sm')}
        readOnly
        size={selectControlValue(controlValues, 'size', 'sm')}
        variant={selectControlValue(controlValues, 'variant', 'filled')}
      />
    ),
  },
  {
    id: 'mantine-chip',
    name: 'Chip',
    category: 'Mantine Core',
    description: '@mantine/core Chip themed preview',
    render: () => <Mantine.Chip defaultChecked>Chip</Mantine.Chip>,
  },
  {
    id: 'mantine-code',
    name: 'Code',
    category: 'Mantine Core',
    description: '@mantine/core Code themed preview',
    render: () => <Mantine.Code>@tinyrack/themes</Mantine.Code>,
  },
  {
    id: 'mantine-collapse',
    name: 'Collapse',
    category: 'Mantine Core',
    description: '@mantine/core Collapse themed preview',
    render: () => <Mantine.Collapse expanded>Collapse content</Mantine.Collapse>,
  },
  {
    id: 'mantine-colorinput',
    name: 'ColorInput',
    category: 'Mantine Core',
    description: '@mantine/core ColorInput themed preview',
    render: () => <Mantine.ColorInput label="Color input" defaultValue="#1762ae" />,
  },
  {
    id: 'mantine-colorpicker',
    name: 'ColorPicker',
    category: 'Mantine Core',
    description: '@mantine/core ColorPicker themed preview',
    render: () => <Mantine.ColorPicker defaultValue="#1762ae" format="hex" />,
  },
  {
    id: 'mantine-colorswatch',
    name: 'ColorSwatch',
    category: 'Mantine Core',
    description: '@mantine/core ColorSwatch themed preview',
    render: () => <Mantine.ColorSwatch color="#1762ae" />,
  },
  {
    id: 'mantine-combobox',
    name: 'Combobox',
    category: 'Mantine Core',
    description: '@mantine/core Combobox themed preview',
    render: () => (
      <Mantine.Combobox store={Mantine.useCombobox()}>
        <Mantine.Combobox.Target>
          <Mantine.Input component="button" type="button">
            Combobox target
          </Mantine.Input>
        </Mantine.Combobox.Target>
      </Mantine.Combobox>
    ),
  },
  {
    id: 'mantine-container',
    name: 'Container',
    category: 'Mantine Core',
    description: '@mantine/core Container themed preview',
    render: () => (
      <Mantine.Container size="xs" bg="tinyrack.0" p="sm">
        Container
      </Mantine.Container>
    ),
  },
  {
    id: 'mantine-copybutton',
    name: 'CopyButton',
    category: 'Mantine Core',
    description: '@mantine/core CopyButton themed preview',
    render: () => (
      <Mantine.CopyButton value="@tinyrack/themes">
        {({ copied, copy }) => (
          <Mantine.Button onClick={copy}>{copied ? 'Copied' : 'Copy'}</Mantine.Button>
        )}
      </Mantine.CopyButton>
    ),
  },
  {
    id: 'mantine-datalist',
    name: 'DataList',
    category: 'Mantine Core',
    description: '@mantine/core DataList themed preview',
    render: () => (
      <Mantine.DataList>
        <Mantine.DataList.Item>
          <Mantine.DataList.ItemLabel>Package</Mantine.DataList.ItemLabel>
          <Mantine.DataList.ItemValue>@tinyrack/themes</Mantine.DataList.ItemValue>
        </Mantine.DataList.Item>
      </Mantine.DataList>
    ),
  },
  {
    id: 'mantine-dialog',
    name: 'Dialog',
    category: 'Mantine Core',
    description: '@mantine/core Dialog themed preview',
    render: () => (
      <Mantine.Box pos="relative" h={84}>
        <Mantine.Dialog
          opened
          withCloseButton={false}
          withinPortal={false}
          position={{ bottom: 8, right: 8 }}
          size="sm"
        >
          Dialog
        </Mantine.Dialog>
      </Mantine.Box>
    ),
  },
  {
    id: 'mantine-divider',
    name: 'Divider',
    category: 'Mantine Core',
    description: '@mantine/core Divider themed preview',
    render: () => <Mantine.Divider label="Divider" labelPosition="center" />,
  },
  {
    id: 'mantine-drawer',
    name: 'Drawer',
    category: 'Mantine Core',
    description: '@mantine/core Drawer themed preview',
    render: () => (
      <Mantine.Box>
        <Mantine.Drawer
          opened={false}
          onClose={() => undefined}
          title="Drawer"
          withinPortal={false}
        >
          Drawer content
        </Mantine.Drawer>
        <Mantine.Button variant="light">Drawer trigger</Mantine.Button>
      </Mantine.Box>
    ),
  },
  {
    id: 'mantine-emptystate',
    name: 'EmptyState',
    category: 'Mantine Core',
    description: '@mantine/core EmptyState themed preview',
    render: () => (
      <Mantine.EmptyState>
        <Mantine.EmptyState.Indicator>◇</Mantine.EmptyState.Indicator>
        <Mantine.EmptyState.Title>Empty state</Mantine.EmptyState.Title>
        <Mantine.EmptyState.Description>No items yet</Mantine.EmptyState.Description>
      </Mantine.EmptyState>
    ),
  },
  {
    id: 'mantine-fieldset',
    name: 'Fieldset',
    category: 'Mantine Core',
    description: '@mantine/core Fieldset themed preview',
    render: () => (
      <Mantine.Fieldset legend="Fieldset">
        <Mantine.TextInput label="Name" />
      </Mantine.Fieldset>
    ),
  },
  {
    id: 'mantine-fileinput',
    name: 'FileInput',
    category: 'Mantine Core',
    description: '@mantine/core FileInput themed preview',
    render: () => <Mantine.FileInput label="File input" placeholder="Select file" />,
  },
  {
    id: 'mantine-flex',
    name: 'Flex',
    category: 'Mantine Core',
    description: '@mantine/core Flex themed preview',
    render: () => (
      <Mantine.Flex gap="sm">
        <Mantine.Badge>One</Mantine.Badge>
        <Mantine.Badge>Two</Mantine.Badge>
      </Mantine.Flex>
    ),
  },
  {
    id: 'mantine-grid',
    name: 'Grid',
    category: 'Mantine Core',
    description: '@mantine/core Grid themed preview',
    render: () => (
      <Mantine.Grid>
        <Mantine.Grid.Col span={6}>
          <Mantine.Paper p="xs">A</Mantine.Paper>
        </Mantine.Grid.Col>
        <Mantine.Grid.Col span={6}>
          <Mantine.Paper p="xs">B</Mantine.Paper>
        </Mantine.Grid.Col>
      </Mantine.Grid>
    ),
  },
  {
    id: 'mantine-group',
    name: 'Group',
    category: 'Mantine Core',
    description: '@mantine/core Group themed preview',
    render: () => (
      <Mantine.Group>
        <Mantine.Button size="xs">A</Mantine.Button>
        <Mantine.Button size="xs" variant="light">
          B
        </Mantine.Button>
      </Mantine.Group>
    ),
  },
  {
    id: 'mantine-highlight',
    name: 'Highlight',
    category: 'Mantine Core',
    description: '@mantine/core Highlight themed preview',
    render: () => (
      <Mantine.Highlight highlight="theme">Tinyrack theme system</Mantine.Highlight>
    ),
  },
  {
    id: 'mantine-hovercard',
    name: 'HoverCard',
    category: 'Mantine Core',
    description: '@mantine/core HoverCard themed preview',
    render: () => (
      <Mantine.HoverCard defaultOpened withinPortal={false}>
        <Mantine.HoverCard.Target>
          <Mantine.Button size="xs">Hover</Mantine.Button>
        </Mantine.HoverCard.Target>
        <Mantine.HoverCard.Dropdown>Hover content</Mantine.HoverCard.Dropdown>
      </Mantine.HoverCard>
    ),
  },
  {
    id: 'mantine-image',
    name: 'Image',
    category: 'Mantine Core',
    description: '@mantine/core Image themed preview',
    render: () => (
      <Mantine.Image
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 90'%3E%3Crect width='160' height='90' fill='%23d9edff'/%3E%3Ctext x='80' y='50' text-anchor='middle' font-size='16'%3EImage%3C/text%3E%3C/svg%3E"
        alt="Theme placeholder"
        radius="md"
      />
    ),
  },
  {
    id: 'mantine-indicator',
    name: 'Indicator',
    category: 'Mantine Core',
    description: '@mantine/core Indicator themed preview',
    render: () => (
      <Mantine.Indicator label="new">
        <Mantine.Avatar radius="sm">TR</Mantine.Avatar>
      </Mantine.Indicator>
    ),
  },
  {
    id: 'mantine-input',
    name: 'Input',
    category: 'Mantine Core',
    description: '@mantine/core Input themed preview',
    storyKinds: ['default', 'variants', 'states', 'sizes'],
    controls: mantineInputControls,
    render: (controlValues) => (
      <Mantine.Input
        disabled={booleanControlValue(controlValues, 'disabled')}
        error={booleanControlValue(controlValues, 'error')}
        placeholder="Input"
        radius={selectControlValue(controlValues, 'radius', 'md')}
        size={selectControlValue(controlValues, 'size', 'sm')}
        variant={selectControlValue(controlValues, 'variant', 'default')}
      />
    ),
  },
  {
    id: 'mantine-jsoninput',
    name: 'JsonInput',
    category: 'Mantine Core',
    description: '@mantine/core JsonInput themed preview',
    render: () => (
      <Mantine.JsonInput
        label="JSON"
        defaultValue={'{\n  "theme": "tinyrack"\n}'}
        autosize
      />
    ),
  },
  {
    id: 'mantine-kbd',
    name: 'Kbd',
    category: 'Mantine Core',
    description: '@mantine/core Kbd themed preview',
    render: () => <Mantine.Kbd>⌘ K</Mantine.Kbd>,
  },
  {
    id: 'mantine-list',
    name: 'List',
    category: 'Mantine Core',
    description: '@mantine/core List themed preview',
    render: () => (
      <Mantine.List>
        <Mantine.List.Item>Tokens</Mantine.List.Item>
        <Mantine.List.Item>Adapters</Mantine.List.Item>
      </Mantine.List>
    ),
  },
  {
    id: 'mantine-loader',
    name: 'Loader',
    category: 'Mantine Core',
    description: '@mantine/core Loader themed preview',
    render: () => <Mantine.Loader />,
  },
  {
    id: 'mantine-loadingoverlay',
    name: 'LoadingOverlay',
    category: 'Mantine Core',
    description: '@mantine/core LoadingOverlay themed preview',
    render: () => (
      <Mantine.Box pos="relative" h={72}>
        <Mantine.LoadingOverlay visible zIndex={1} />
        <Mantine.Text>Loading area</Mantine.Text>
      </Mantine.Box>
    ),
  },
  {
    id: 'mantine-mark',
    name: 'Mark',
    category: 'Mantine Core',
    description: '@mantine/core Mark themed preview',
    render: () => <Mantine.Mark>Marked text</Mantine.Mark>,
  },
  {
    id: 'mantine-marquee',
    name: 'Marquee',
    category: 'Mantine Core',
    description: '@mantine/core Marquee themed preview',
    render: () => (
      <Mantine.Marquee>Theme tokens · Mantine · daisyUI · Starlight</Mantine.Marquee>
    ),
  },
  {
    id: 'mantine-menu',
    name: 'Menu',
    category: 'Mantine Core',
    description: '@mantine/core Menu themed preview',
    render: () => (
      <Mantine.Menu opened withinPortal={false}>
        <Mantine.Menu.Target>
          <Mantine.Button size="xs">Menu</Mantine.Button>
        </Mantine.Menu.Target>
        <Mantine.Menu.Dropdown>
          <Mantine.Menu.Item>Item</Mantine.Menu.Item>
        </Mantine.Menu.Dropdown>
      </Mantine.Menu>
    ),
  },
  {
    id: 'mantine-modal',
    name: 'Modal',
    category: 'Mantine Core',
    description: '@mantine/core Modal themed preview',
    storyKinds: ['default', 'states', 'examples'],
    controls: {
      opened: {
        type: 'boolean',
        defaultValue: false,
        description: 'Open modal state.',
      },
      size: {
        type: 'select',
        defaultValue: 'md',
        options: mantineSizeOptions,
        description: 'Modal size token.',
      },
      centered: {
        type: 'boolean',
        defaultValue: false,
        description: 'Center the modal in the viewport.',
      },
      fullScreen: {
        type: 'boolean',
        defaultValue: false,
        description: 'Use fullscreen modal layout.',
      },
      withCloseButton: {
        type: 'boolean',
        defaultValue: true,
        description: 'Show close button affordance.',
      },
    },
    render: (controlValues) => (
      <Mantine.Box>
        <Mantine.Modal
          centered={booleanControlValue(controlValues, 'centered')}
          fullScreen={booleanControlValue(controlValues, 'fullScreen')}
          opened={booleanControlValue(controlValues, 'opened')}
          onClose={() => undefined}
          size={selectControlValue(controlValues, 'size', 'md')}
          title="Modal"
          withCloseButton={booleanControlValue(controlValues, 'withCloseButton', true)}
          withinPortal={false}
        >
          Modal content
        </Mantine.Modal>
        <Mantine.Button variant="light">Modal trigger</Mantine.Button>
      </Mantine.Box>
    ),
  },
  {
    id: 'mantine-multiselect',
    name: 'MultiSelect',
    category: 'Mantine Core',
    description: '@mantine/core MultiSelect themed preview',
    render: () => (
      <Mantine.MultiSelect
        label="Multi select"
        data={['Mantine', 'daisyUI']}
        defaultValue={['Mantine']}
      />
    ),
  },
  {
    id: 'mantine-nativeselect',
    name: 'NativeSelect',
    category: 'Mantine Core',
    description: '@mantine/core NativeSelect themed preview',
    render: () => (
      <Mantine.NativeSelect label="Native select" data={['Mantine', 'daisyUI']} />
    ),
  },
  {
    id: 'mantine-navlink',
    name: 'NavLink',
    category: 'Mantine Core',
    description: '@mantine/core NavLink themed preview',
    render: () => <Mantine.NavLink label="Navigation link" active />,
  },
  {
    id: 'mantine-notification',
    name: 'Notification',
    category: 'Mantine Core',
    description: '@mantine/core Notification themed preview',
    render: () => (
      <Mantine.Notification title="Notification" withCloseButton={false}>
        Saved
      </Mantine.Notification>
    ),
  },
  {
    id: 'mantine-numberformatter',
    name: 'NumberFormatter',
    category: 'Mantine Core',
    description: '@mantine/core NumberFormatter themed preview',
    render: () => (
      <Mantine.NumberFormatter value={12345.67} thousandSeparator prefix="$" />
    ),
  },
  {
    id: 'mantine-numberinput',
    name: 'NumberInput',
    category: 'Mantine Core',
    description: '@mantine/core NumberInput themed preview',
    render: () => <Mantine.NumberInput label="Number" defaultValue={42} />,
  },
  {
    id: 'mantine-overlay',
    name: 'Overlay',
    category: 'Mantine Core',
    description: '@mantine/core Overlay themed preview',
    render: () => (
      <Mantine.Box pos="relative" h={72} bg="gray.2">
        <Mantine.Overlay color="#000" backgroundOpacity={0.25} />
        <Mantine.Text c="white" pos="relative" p="sm">
          Overlay
        </Mantine.Text>
      </Mantine.Box>
    ),
  },
  {
    id: 'mantine-pagination',
    name: 'Pagination',
    category: 'Mantine Core',
    description: '@mantine/core Pagination themed preview',
    render: () => <Mantine.Pagination total={6} value={2} />,
  },
  {
    id: 'mantine-paper',
    name: 'Paper',
    category: 'Mantine Core',
    description: '@mantine/core Paper themed preview',
    render: () => (
      <Mantine.Paper p="md" shadow="sm" withBorder>
        Paper
      </Mantine.Paper>
    ),
  },
  {
    id: 'mantine-passwordinput',
    name: 'PasswordInput',
    category: 'Mantine Core',
    description: '@mantine/core PasswordInput themed preview',
    render: () => <Mantine.PasswordInput label="Password" defaultValue="secret" />,
  },
  {
    id: 'mantine-pill',
    name: 'Pill',
    category: 'Mantine Core',
    description: '@mantine/core Pill themed preview',
    render: () => <Mantine.Pill>Theme</Mantine.Pill>,
  },
  {
    id: 'mantine-pillsinput',
    name: 'PillsInput',
    category: 'Mantine Core',
    description: '@mantine/core PillsInput themed preview',
    render: () => (
      <Mantine.PillsInput label="Pills input">
        <Mantine.Pill.Group>
          <Mantine.Pill>React</Mantine.Pill>
          <Mantine.PillsInput.Field placeholder="Add" />
        </Mantine.Pill.Group>
      </Mantine.PillsInput>
    ),
  },
  {
    id: 'mantine-pininput',
    name: 'PinInput',
    category: 'Mantine Core',
    description: '@mantine/core PinInput themed preview',
    render: () => <Mantine.PinInput defaultValue="1234" />,
  },
  {
    id: 'mantine-popover',
    name: 'Popover',
    category: 'Mantine Core',
    description: '@mantine/core Popover themed preview',
    render: () => (
      <Mantine.Popover opened withinPortal={false}>
        <Mantine.Popover.Target>
          <Mantine.Button size="xs">Popover</Mantine.Button>
        </Mantine.Popover.Target>
        <Mantine.Popover.Dropdown>Popover content</Mantine.Popover.Dropdown>
      </Mantine.Popover>
    ),
  },
  {
    id: 'mantine-progress',
    name: 'Progress',
    category: 'Mantine Core',
    description: '@mantine/core Progress themed preview',
    render: () => <Mantine.Progress value={68} />,
  },
  {
    id: 'mantine-radio',
    name: 'Radio',
    category: 'Mantine Core',
    description: '@mantine/core Radio themed preview',
    storyKinds: ['default', 'variants', 'states', 'sizes'],
    controls: mantineInlineControlControls,
    render: (controlValues) => (
      <Mantine.Radio
        checked={booleanControlValue(controlValues, 'checked', true)}
        color={selectControlValue(controlValues, 'color', 'tinyrack')}
        disabled={booleanControlValue(controlValues, 'disabled')}
        label="Radio"
        labelPosition={selectControlValue(controlValues, 'labelPosition', 'right')}
        radius={selectControlValue(controlValues, 'radius', 'sm')}
        readOnly
        size={selectControlValue(controlValues, 'size', 'sm')}
        variant={selectControlValue(controlValues, 'variant', 'filled')}
      />
    ),
  },
  {
    id: 'mantine-rangeslider',
    name: 'RangeSlider',
    category: 'Mantine Core',
    description: '@mantine/core RangeSlider themed preview',
    render: () => (
      <Mantine.RangeSlider
        className="tinyrack-demo-wide-control"
        defaultValue={[20, 80]}
      />
    ),
  },
  {
    id: 'mantine-rating',
    name: 'Rating',
    category: 'Mantine Core',
    description: '@mantine/core Rating themed preview',
    render: () => <Mantine.Rating defaultValue={4} />,
  },
  {
    id: 'mantine-ringprogress',
    name: 'RingProgress',
    category: 'Mantine Core',
    description: '@mantine/core RingProgress themed preview',
    render: () => (
      <Mantine.RingProgress
        sections={[{ value: 70, color: 'tinyrack' }]}
        label={<Mantine.Text ta="center">70%</Mantine.Text>}
      />
    ),
  },
  {
    id: 'mantine-scrollarea',
    name: 'ScrollArea',
    category: 'Mantine Core',
    description: '@mantine/core ScrollArea themed preview',
    render: () => (
      <Mantine.ScrollArea h={80}>
        <Mantine.Text>
          Scrollable content
          <br />
          Line 2<br />
          Line 3<br />
          Line 4<br />
          Line 5
        </Mantine.Text>
      </Mantine.ScrollArea>
    ),
  },
  {
    id: 'mantine-segmentedcontrol',
    name: 'SegmentedControl',
    category: 'Mantine Core',
    description: '@mantine/core SegmentedControl themed preview',
    render: () => <Mantine.SegmentedControl data={['React', 'Astro']} />,
  },
  {
    id: 'mantine-select',
    name: 'Select',
    category: 'Mantine Core',
    description: '@mantine/core Select themed preview',
    render: () => (
      <Mantine.Select
        label="Select"
        data={['Mantine', 'daisyUI']}
        defaultValue="Mantine"
      />
    ),
  },
  {
    id: 'mantine-semicircleprogress',
    name: 'SemiCircleProgress',
    category: 'Mantine Core',
    description: '@mantine/core SemiCircleProgress themed preview',
    render: () => <Mantine.SemiCircleProgress value={72} label="72%" />,
  },
  {
    id: 'mantine-simplegrid',
    name: 'SimpleGrid',
    category: 'Mantine Core',
    description: '@mantine/core SimpleGrid themed preview',
    render: () => (
      <Mantine.SimpleGrid cols={2}>
        <Mantine.Paper p="xs">A</Mantine.Paper>
        <Mantine.Paper p="xs">B</Mantine.Paper>
      </Mantine.SimpleGrid>
    ),
  },
  {
    id: 'mantine-skeleton',
    name: 'Skeleton',
    category: 'Mantine Core',
    description: '@mantine/core Skeleton themed preview',
    render: () => <Mantine.Skeleton height={40} radius="md" />,
  },
  {
    id: 'mantine-slider',
    name: 'Slider',
    category: 'Mantine Core',
    description: '@mantine/core Slider themed preview',
    render: () => (
      <Mantine.Slider className="tinyrack-demo-wide-control" defaultValue={60} />
    ),
  },
  {
    id: 'mantine-space',
    name: 'Space',
    category: 'Mantine Core',
    description: '@mantine/core Space themed preview',
    render: () => (
      <Mantine.Box>
        <Mantine.Text>Before</Mantine.Text>
        <Mantine.Space h="sm" />
        <Mantine.Text>After</Mantine.Text>
      </Mantine.Box>
    ),
  },
  {
    id: 'mantine-spoiler',
    name: 'Spoiler',
    category: 'Mantine Core',
    description: '@mantine/core Spoiler themed preview',
    render: () => (
      <Mantine.Spoiler maxHeight={36} showLabel="Show" hideLabel="Hide">
        Spoiler content with more text for previewing typography and spacing.
      </Mantine.Spoiler>
    ),
  },
  {
    id: 'mantine-stack',
    name: 'Stack',
    category: 'Mantine Core',
    description: '@mantine/core Stack themed preview',
    render: () => (
      <Mantine.Stack gap="xs">
        <Mantine.Badge>Stack</Mantine.Badge>
        <Mantine.Button size="xs">Button</Mantine.Button>
      </Mantine.Stack>
    ),
  },
  {
    id: 'mantine-stepper',
    name: 'Stepper',
    category: 'Mantine Core',
    description: '@mantine/core Stepper themed preview',
    storyKinds: ['default', 'examples'],
    controls: {
      active: {
        type: 'number',
        defaultValue: 1,
        min: 0,
        max: 3,
        step: 1,
        description: 'Active step index.',
      },
      orientation: {
        type: 'select',
        defaultValue: 'horizontal',
        options: ['horizontal', 'vertical'],
        description: 'Stepper orientation.',
      },
      size: {
        type: 'select',
        defaultValue: 'sm',
        options: mantineSizeOptions,
        description: 'Stepper size token.',
      },
      color: {
        type: 'select',
        defaultValue: 'tinyrack',
        options: mantineToneOptions,
        description: 'Active step color token.',
      },
    },
    render: (controlValues) => (
      <Mantine.Stepper
        active={numberControlValue(controlValues, 'active', 1)}
        className="tinyrack-demo-stepper"
        color={selectControlValue(controlValues, 'color', 'tinyrack')}
        orientation={selectControlValue(controlValues, 'orientation', 'horizontal')}
        size={selectControlValue(controlValues, 'size', 'sm')}
      >
        <Mantine.Stepper.Step label="Profile" description="Create account" />
        <Mantine.Stepper.Step label="Workspace" description="Configure rack" />
        <Mantine.Stepper.Step label="Deploy" description="Launch service" />
      </Mantine.Stepper>
    ),
  },
  {
    id: 'mantine-switch',
    name: 'Switch',
    category: 'Mantine Core',
    description: '@mantine/core Switch themed preview',
    storyKinds: ['default', 'variants', 'states', 'sizes'],
    controls: {
      size: mantineInlineControlControls.size,
      color: mantineInlineControlControls.color,
      radius: mantineInlineControlControls.radius,
      checked: mantineInlineControlControls.checked,
      disabled: mantineInlineControlControls.disabled,
      labelPosition: mantineInlineControlControls.labelPosition,
    },
    render: (controlValues) => (
      <Mantine.Switch
        checked={booleanControlValue(controlValues, 'checked', true)}
        color={selectControlValue(controlValues, 'color', 'tinyrack')}
        disabled={booleanControlValue(controlValues, 'disabled')}
        label="Switch"
        labelPosition={selectControlValue(controlValues, 'labelPosition', 'right')}
        radius={selectControlValue(controlValues, 'radius', 'sm')}
        readOnly
        size={selectControlValue(controlValues, 'size', 'sm')}
      />
    ),
  },
  {
    id: 'mantine-table',
    name: 'Table',
    category: 'Mantine Core',
    description: '@mantine/core Table themed preview',
    storyKinds: ['default', 'variants', 'states', 'examples'],
    controls: {
      striped: {
        type: 'boolean',
        defaultValue: true,
        description: 'Show striped rows.',
      },
      highlightOnHover: {
        type: 'boolean',
        defaultValue: true,
        description: 'Highlight rows on hover.',
      },
      withTableBorder: {
        type: 'boolean',
        defaultValue: true,
        description: 'Show outer table border.',
      },
      withColumnBorders: {
        type: 'boolean',
        defaultValue: false,
        description: 'Show column borders.',
      },
    },
    render: (controlValues) => (
      <div className="tinyrack-showcase-table-scroll">
        <Mantine.Table
          highlightOnHover={booleanControlValue(
            controlValues,
            'highlightOnHover',
            true,
          )}
          striped={booleanControlValue(controlValues, 'striped', true)}
          withColumnBorders={booleanControlValue(controlValues, 'withColumnBorders')}
          withTableBorder={booleanControlValue(controlValues, 'withTableBorder', true)}
        >
          <Mantine.Table.Thead>
            <Mantine.Table.Tr>
              <Mantine.Table.Th>Service</Mantine.Table.Th>
              <Mantine.Table.Th>Status</Mantine.Table.Th>
              <Mantine.Table.Th>Owner</Mantine.Table.Th>
              <Mantine.Table.Th>Error budget</Mantine.Table.Th>
            </Mantine.Table.Tr>
          </Mantine.Table.Thead>
          <Mantine.Table.Tbody>
            {[
              ['API Gateway', 'Healthy', 'Platform', '71%'],
              ['Checkout Worker', 'Review', 'Commerce', '42%'],
              ['Docs Search', 'Healthy', 'Docs', '88%'],
            ].map(([service, status, owner, budget]) => (
              <Mantine.Table.Tr key={service}>
                <Mantine.Table.Td>{service}</Mantine.Table.Td>
                <Mantine.Table.Td>
                  <Mantine.Badge
                    color={status === 'Healthy' ? 'green' : 'yellow'}
                    variant="light"
                  >
                    {status}
                  </Mantine.Badge>
                </Mantine.Table.Td>
                <Mantine.Table.Td>{owner}</Mantine.Table.Td>
                <Mantine.Table.Td>{budget}</Mantine.Table.Td>
              </Mantine.Table.Tr>
            ))}
          </Mantine.Table.Tbody>
        </Mantine.Table>
      </div>
    ),
  },
  {
    id: 'mantine-tabs',
    name: 'Tabs',
    category: 'Mantine Core',
    description: '@mantine/core Tabs themed preview',
    storyKinds: ['default', 'variants', 'states'],
    controls: {
      variant: {
        type: 'select',
        defaultValue: 'default',
        options: ['default', 'outline', 'pills'],
        description: 'Mantine tabs visual variant.',
      },
      orientation: {
        type: 'select',
        defaultValue: 'horizontal',
        options: ['horizontal', 'vertical'],
        description: 'Tabs orientation.',
      },
      color: {
        type: 'select',
        defaultValue: 'tinyrack',
        options: mantineToneOptions,
        description: 'Theme color token.',
      },
      radius: {
        type: 'select',
        defaultValue: 'md',
        options: mantineRadiusOptions,
        description: 'Border radius token.',
      },
      inverted: {
        type: 'boolean',
        defaultValue: false,
        description: 'Invert tab border placement.',
      },
    },
    render: (controlValues) => (
      <Mantine.Tabs
        className="tinyrack-demo-tabs"
        color={selectControlValue(controlValues, 'color', 'tinyrack')}
        defaultValue="one"
        inverted={booleanControlValue(controlValues, 'inverted')}
        orientation={selectControlValue(controlValues, 'orientation', 'horizontal')}
        radius={selectControlValue(controlValues, 'radius', 'md')}
        variant={selectControlValue(controlValues, 'variant', 'default')}
      >
        <Mantine.Tabs.List>
          <Mantine.Tabs.Tab value="one">One</Mantine.Tabs.Tab>
          <Mantine.Tabs.Tab value="two">Two</Mantine.Tabs.Tab>
        </Mantine.Tabs.List>
        <Mantine.Tabs.Panel value="one">Tab panel</Mantine.Tabs.Panel>
      </Mantine.Tabs>
    ),
  },
  {
    id: 'mantine-tagsinput',
    name: 'TagsInput',
    category: 'Mantine Core',
    description: '@mantine/core TagsInput themed preview',
    render: () => (
      <Mantine.TagsInput
        label="Tags"
        data={['theme', 'token']}
        defaultValue={['theme']}
      />
    ),
  },
  {
    id: 'mantine-text',
    name: 'Text',
    category: 'Mantine Core',
    description: '@mantine/core Text themed preview',
    render: () => <Mantine.Text>Text component</Mantine.Text>,
  },
  {
    id: 'mantine-textinput',
    name: 'TextInput',
    category: 'Mantine Core',
    description: '@mantine/core TextInput themed preview',
    storyKinds: ['default', 'variants', 'states', 'sizes'],
    controls: mantineInputControls,
    render: (controlValues) => {
      const disabled = booleanControlValue(controlValues, 'disabled');
      const error = booleanControlValue(controlValues, 'error')
        ? 'Invalid value'
        : undefined;
      const radius = selectControlValue(controlValues, 'radius', 'md');
      const size = selectControlValue(controlValues, 'size', 'sm');
      const variant = selectControlValue(controlValues, 'variant', 'default');

      return (
        <Mantine.Stack className="tinyrack-control-review" gap="sm">
          <Mantine.TextInput
            disabled={disabled}
            error={error}
            label="Text input"
            placeholder="Tinyrack"
            radius={radius}
            size={size}
            variant={variant}
          />
          <Mantine.TextInput
            error="Invalid value"
            label="Error state"
            placeholder="Needs attention"
            radius={radius}
            size={size}
            variant={variant}
          />
          <Mantine.TextInput
            disabled
            label="Disabled state"
            placeholder="Unavailable"
            radius={radius}
            size={size}
            variant={variant}
          />
        </Mantine.Stack>
      );
    },
  },
  {
    id: 'mantine-textarea',
    name: 'Textarea',
    category: 'Mantine Core',
    description: '@mantine/core Textarea themed preview',
    render: () => <Mantine.Textarea label="Textarea" defaultValue="Theme notes" />,
  },
  {
    id: 'mantine-themeicon',
    name: 'ThemeIcon',
    category: 'Mantine Core',
    description: '@mantine/core ThemeIcon themed preview',
    render: () => <Mantine.ThemeIcon>★</Mantine.ThemeIcon>,
  },
  {
    id: 'mantine-timeline',
    name: 'Timeline',
    category: 'Mantine Core',
    description: '@mantine/core Timeline themed preview',
    render: () => (
      <Mantine.Timeline active={1}>
        <Mantine.Timeline.Item title="Tokens">Shared tokens</Mantine.Timeline.Item>
        <Mantine.Timeline.Item title="Adapters">Library themes</Mantine.Timeline.Item>
      </Mantine.Timeline>
    ),
  },
  {
    id: 'mantine-title',
    name: 'Title',
    category: 'Mantine Core',
    description: '@mantine/core Title themed preview',
    render: () => <Mantine.Title order={3}>Title</Mantine.Title>,
  },
  {
    id: 'mantine-tooltip',
    name: 'Tooltip',
    category: 'Mantine Core',
    description: '@mantine/core Tooltip themed preview',
    render: () => (
      <Mantine.Tooltip label="Tooltip" opened withinPortal={false}>
        <Mantine.Button size="xs">Target</Mantine.Button>
      </Mantine.Tooltip>
    ),
  },
  {
    id: 'mantine-typography',
    name: 'Typography',
    category: 'Mantine Core',
    description: '@mantine/core Typography themed preview',
    render: () => (
      <Mantine.Typography>
        <h3>Typography</h3>
        <p>Document content preview.</p>
      </Mantine.Typography>
    ),
  },
  {
    id: 'mantine-unstyledbutton',
    name: 'UnstyledButton',
    category: 'Mantine Core',
    description: '@mantine/core UnstyledButton themed preview',
    render: () => (
      <Mantine.UnstyledButton p="xs">Unstyled button</Mantine.UnstyledButton>
    ),
  },
];
