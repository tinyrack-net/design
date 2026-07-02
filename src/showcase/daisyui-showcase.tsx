import type React from 'react';
import {
  booleanControlValue,
  numberControlValue,
  selectControlValue,
} from './controls.js';
import type { ShowcaseEntry } from './types.js';

type DaisyControls = NonNullable<ShowcaseEntry['controls']>;
type DaisyControl = DaisyControls[string];

const daisyToneOptions = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
] as const;
const daisySizeOptions = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const daisyToneControl: DaisyControl = {
  type: 'select',
  defaultValue: 'primary',
  options: daisyToneOptions,
  description: 'Color modifier class such as primary, success, or error.',
};

const daisyStatusToneControl: DaisyControl = {
  type: 'select',
  defaultValue: 'info',
  options: ['info', 'success', 'warning', 'error'] as const,
  description: 'Status color modifier class.',
};

const daisySizeControl: DaisyControl = {
  type: 'select',
  defaultValue: 'md',
  options: daisySizeOptions,
  description: 'Size modifier class from xs through xl.',
};

const daisyBooleanControlControls: ShowcaseEntry['controls'] = {
  tone: daisyToneControl,
  size: daisySizeControl,
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
};

const daisyButtonControls: DaisyControls = {
  tone: daisyToneControl,
  style: {
    type: 'select',
    defaultValue: 'default',
    options: ['default', 'outline', 'dash', 'soft', 'ghost', 'link'] as const,
    description: 'Button treatment class such as btn-outline or btn-ghost.',
  },
  size: daisySizeControl,
  shape: {
    type: 'select',
    defaultValue: 'default',
    options: ['default', 'square', 'circle', 'wide', 'block'] as const,
    description: 'Button shape or width class.',
  },
  loading: {
    type: 'boolean',
    defaultValue: false,
    description: 'Shows a loading-spinner inside the button.',
  },
  active: {
    type: 'boolean',
    defaultValue: false,
    description: 'Applies the btn-active state class.',
  },
  disabled: {
    type: 'boolean',
    defaultValue: false,
    description: 'Applies the disabled button state.',
  },
};

const daisyAlertControls: DaisyControls = {
  tone: daisyStatusToneControl,
  style: {
    type: 'select',
    defaultValue: 'default',
    options: ['default', 'soft', 'outline', 'dash'] as const,
    description: 'Alert treatment class such as alert-soft or alert-outline.',
  },
  layout: {
    type: 'select',
    defaultValue: 'horizontal',
    options: ['horizontal', 'vertical'] as const,
    description: 'Alert layout class.',
  },
};

const daisyBadgeControls: DaisyControls = {
  tone: daisyToneControl,
  style: {
    type: 'select',
    defaultValue: 'default',
    options: ['default', 'outline', 'dash', 'soft', 'ghost'] as const,
    description: 'Badge treatment class such as badge-outline or badge-soft.',
  },
  size: daisySizeControl,
};

const daisyInputControls: DaisyControls = {
  tone: daisyToneControl,
  appearance: {
    type: 'select',
    defaultValue: 'default',
    options: ['default', 'ghost'] as const,
    description: 'Input appearance class.',
  },
  size: daisySizeControl,
  disabled: {
    type: 'boolean',
    defaultValue: false,
    description: 'Applies the disabled input state.',
  },
};

const daisyLoadingControls: DaisyControls = {
  indicator: {
    type: 'select',
    defaultValue: 'spinner',
    options: ['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity'] as const,
    description: 'Loading indicator class.',
  },
  size: daisySizeControl,
};

const daisyTooltipControls: DaisyControls = {
  tone: {
    type: 'select',
    defaultValue: 'default',
    options: [
      'default',
      'primary',
      'secondary',
      'accent',
      'info',
      'success',
      'warning',
      'error',
    ] as const,
    description: 'Tooltip color modifier class.',
  },
  placement: {
    type: 'select',
    defaultValue: 'top',
    options: ['top', 'bottom', 'left', 'right'] as const,
    description: 'Tooltip placement class.',
  },
  open: {
    type: 'boolean',
    defaultValue: true,
    description: 'Applies the tooltip-open state class.',
  },
};

const daisyTabControls: DaisyControls = {
  style: {
    type: 'select',
    defaultValue: 'box',
    options: ['default', 'border', 'lift', 'box'] as const,
    description: 'Tabs container treatment class.',
  },
  placement: {
    type: 'select',
    defaultValue: 'top',
    options: ['top', 'bottom'] as const,
    description: 'Tabs placement class.',
  },
  size: daisySizeControl,
  activeTab: {
    type: 'select',
    defaultValue: 'first',
    options: ['first', 'second'] as const,
    description: 'Moves the tab-active state class.',
  },
  disabled: {
    type: 'boolean',
    defaultValue: false,
    description: 'Applies tab-disabled to the second tab.',
  },
};

const daisyCardControls: DaisyControls = {
  style: {
    type: 'select',
    defaultValue: 'default',
    options: ['default', 'border', 'dash'] as const,
    description: 'Card border treatment class.',
  },
  size: daisySizeControl,
  layout: {
    type: 'select',
    defaultValue: 'default',
    options: ['default', 'side'] as const,
    description: 'Card layout class.',
  },
  actions: {
    type: 'boolean',
    defaultValue: true,
    description: 'Shows a card-actions footer.',
  },
};

const daisyDropdownControls: DaisyControls = {
  placement: {
    type: 'select',
    defaultValue: 'bottom',
    options: ['bottom', 'top', 'left', 'right'] as const,
    description: 'Dropdown placement class.',
  },
  align: {
    type: 'select',
    defaultValue: 'start',
    options: ['start', 'center', 'end'] as const,
    description: 'Dropdown horizontal alignment class.',
  },
  open: {
    type: 'boolean',
    defaultValue: true,
    description: 'Applies the dropdown-open state class.',
  },
  hover: {
    type: 'boolean',
    defaultValue: false,
    description: 'Applies the dropdown-hover trigger class.',
  },
};

const daisyModalControls: DaisyControls = {
  placement: {
    type: 'select',
    defaultValue: 'middle',
    options: ['top', 'middle', 'bottom', 'start', 'end'] as const,
    description: 'Modal placement class.',
  },
  open: {
    type: 'boolean',
    defaultValue: true,
    description: 'Applies the modal-open state class.',
  },
  actions: {
    type: 'boolean',
    defaultValue: true,
    description: 'Shows modal-action buttons.',
  },
};

const daisyNavbarControls: DaisyControls = {
  layout: {
    type: 'select',
    defaultValue: 'brand-action',
    options: ['brand-action', 'centered', 'menu'] as const,
    description: 'Navbar content arrangement.',
  },
  action: {
    type: 'boolean',
    defaultValue: true,
    description: 'Shows the primary navbar action.',
  },
};

const daisyStepsControls: DaisyControls = {
  orientation: {
    type: 'select',
    defaultValue: 'horizontal',
    options: ['horizontal', 'vertical'] as const,
    description: 'Steps orientation class.',
  },
  tone: daisyToneControl,
  currentStep: {
    type: 'number',
    defaultValue: 2,
    min: 1,
    max: 3,
    step: 1,
    description: 'Number of active steps.',
  },
};

const daisyTableControls: DaisyControls = {
  size: daisySizeControl,
  zebra: {
    type: 'boolean',
    defaultValue: true,
    description: 'Applies the table-zebra row treatment.',
  },
  rowHover: {
    type: 'boolean',
    defaultValue: false,
    description: 'Applies row-hover to table rows.',
  },
  pinRows: {
    type: 'boolean',
    defaultValue: false,
    description: 'Applies the table-pin-rows sticky row class.',
  },
};

function classes(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ');
}

function modifierClass(prefix: string, value: string, defaultValue = 'default') {
  return value === defaultValue ? undefined : `${prefix}-${value}`;
}

function selectDaisyControl(
  controlValues: Parameters<ShowcaseEntry['render']>[0],
  name: string,
  fallback: string,
) {
  return selectControlValue<string>(controlValues, name, fallback);
}

export const daisyUiShowcaseEntries: ShowcaseEntry[] = [
  {
    id: 'daisyui-alert',
    name: 'alert',
    category: 'daisyUI',
    description: 'daisyUI alert themed preview',
    storyKinds: ['default', 'variants', 'states'],
    controls: daisyAlertControls,
    render: (controlValues) => {
      const tone = selectDaisyControl(controlValues, 'tone', 'info');
      const style = selectDaisyControl(controlValues, 'style', 'default');
      const layout = selectDaisyControl(controlValues, 'layout', 'horizontal');

      return (
        <div
          role="alert"
          className={classes(
            'alert',
            modifierClass('alert', tone),
            modifierClass('alert', style),
            modifierClass('alert', layout),
          )}
        >
          <span>{tone} alert message</span>
        </div>
      );
    },
  },
  {
    id: 'daisyui-avatar',
    name: 'avatar',
    category: 'daisyUI',
    description: 'daisyUI avatar themed preview',
    render: () => (
      <div className="avatar avatar-placeholder">
        <div className="bg-primary text-primary-content w-12 rounded-full">
          <span>TR</span>
        </div>
      </div>
    ),
  },
  {
    id: 'daisyui-badge',
    name: 'badge',
    category: 'daisyUI',
    description: 'daisyUI badge themed preview',
    storyKinds: ['default', 'variants', 'states'],
    controls: daisyBadgeControls,
    render: (controlValues) => {
      const tone = selectDaisyControl(controlValues, 'tone', 'primary');
      const style = selectDaisyControl(controlValues, 'style', 'default');
      const size = selectDaisyControl(controlValues, 'size', 'md');

      return (
        <span
          className={classes(
            'badge',
            modifierClass('badge', tone),
            modifierClass('badge', style),
            modifierClass('badge', size),
          )}
        >
          Badge
        </span>
      );
    },
  },
  {
    id: 'daisyui-breadcrumbs',
    name: 'breadcrumbs',
    category: 'daisyUI',
    description: 'daisyUI breadcrumbs themed preview',
    render: () => (
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <a href="#daisyui-breadcrumbs-home">Home</a>
          </li>
          <li>Themes</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'daisyui-button',
    name: 'button',
    category: 'daisyUI',
    description: 'daisyUI button themed preview',
    storyKinds: ['default', 'variants', 'sizes', 'states'],
    controls: daisyButtonControls,
    render: (controlValues) => {
      const tone = selectDaisyControl(controlValues, 'tone', 'primary');
      const style = selectDaisyControl(controlValues, 'style', 'default');
      const size = selectDaisyControl(controlValues, 'size', 'md');
      const shape = selectControlValue<
        'block' | 'circle' | 'default' | 'square' | 'wide'
      >(controlValues, 'shape', 'default');
      const loading = booleanControlValue(controlValues, 'loading');
      const active = booleanControlValue(controlValues, 'active');
      const disabled = booleanControlValue(controlValues, 'disabled');

      return (
        <button
          className={classes(
            'btn',
            modifierClass('btn', tone),
            modifierClass('btn', style),
            modifierClass('btn', size),
            modifierClass('btn', shape),
            active && 'btn-active',
          )}
          disabled={disabled}
          type="button"
        >
          {loading ? <span className="loading loading-spinner" /> : null}
          {shape === 'circle' || shape === 'square' ? 'B' : 'Button'}
        </button>
      );
    },
  },
  {
    id: 'daisyui-calendar',
    name: 'calendar',
    category: 'daisyUI',
    description: 'daisyUI calendar themed preview',
    render: () => (
      <div className="mockup-code text-xs">
        <pre data-prefix=">">
          <code>calendar class preview</code>
        </pre>
      </div>
    ),
  },
  {
    id: 'daisyui-card',
    name: 'card',
    category: 'daisyUI',
    description: 'daisyUI card themed preview',
    storyKinds: ['default', 'examples'],
    controls: daisyCardControls,
    render: (controlValues) => {
      const style = selectDaisyControl(controlValues, 'style', 'default');
      const size = selectDaisyControl(controlValues, 'size', 'md');
      const layout = selectDaisyControl(controlValues, 'layout', 'default');
      const actions = booleanControlValue(controlValues, 'actions', true);

      return (
        <div
          className={classes(
            'card bg-base-100 shadow-md',
            modifierClass('card', style),
            modifierClass('card', size),
            modifierClass('card', layout),
            layout === 'side' && 'max-w-md',
          )}
        >
          {layout === 'side' ? (
            <figure className="bg-base-200 min-w-24">
              <div className="text-primary text-2xl font-bold">TR</div>
            </figure>
          ) : null}
          <div className="card-body">
            <h3 className="card-title">Card</h3>
            <p>Card content</p>
            {actions ? (
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm" type="button">
                  Open
                </button>
              </div>
            ) : null}
          </div>
        </div>
      );
    },
  },
  {
    id: 'daisyui-carousel',
    name: 'carousel',
    category: 'daisyUI',
    description: 'daisyUI carousel themed preview',
    render: () => (
      <div className="carousel w-full max-w-xs">
        <div className="carousel-item w-full">
          <div className="bg-primary text-primary-content p-6 w-full text-center">
            Slide
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'daisyui-chat',
    name: 'chat',
    category: 'daisyUI',
    description: 'daisyUI chat themed preview',
    render: () => (
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-primary">Chat bubble</div>
      </div>
    ),
  },
  {
    id: 'daisyui-checkbox',
    name: 'checkbox',
    category: 'daisyUI',
    description: 'daisyUI checkbox themed preview',
    storyKinds: ['default', 'states', 'sizes'],
    controls: daisyBooleanControlControls,
    render: (controlValues) => (
      <input
        aria-label="Checkbox"
        type="checkbox"
        checked={booleanControlValue(controlValues, 'checked', true)}
        className={classes(
          'checkbox',
          `checkbox-${selectControlValue(controlValues, 'tone', 'primary')}`,
          `checkbox-${selectControlValue(controlValues, 'size', 'md')}`,
        )}
        disabled={booleanControlValue(controlValues, 'disabled')}
        readOnly
      />
    ),
  },
  {
    id: 'daisyui-collapse',
    name: 'collapse',
    category: 'daisyUI',
    description: 'daisyUI collapse themed preview',
    render: () => (
      <div className="collapse collapse-arrow bg-base-200">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title">Collapse</div>
        <div className="collapse-content">Content</div>
      </div>
    ),
  },
  {
    id: 'daisyui-countdown',
    name: 'countdown',
    category: 'daisyUI',
    description: 'daisyUI countdown themed preview',
    render: () => (
      <span className="countdown font-mono text-2xl">
        <span style={{ '--value': 42 } as React.CSSProperties} aria-live="polite">
          42
        </span>
      </span>
    ),
  },
  {
    id: 'daisyui-diff',
    name: 'diff',
    category: 'daisyUI',
    description: 'daisyUI diff themed preview',
    render: () => (
      <div className="diff aspect-16/9 max-h-24">
        <div className="diff-item-1">
          <div className="bg-primary text-primary-content grid place-content-center text-sm">
            Before
          </div>
        </div>
        <div className="diff-item-2">
          <div className="bg-secondary text-secondary-content grid place-content-center text-sm">
            After
          </div>
        </div>
        <div className="diff-resizer" />
      </div>
    ),
  },
  {
    id: 'daisyui-divider',
    name: 'divider',
    category: 'daisyUI',
    description: 'daisyUI divider themed preview',
    render: () => <div className="divider">Divider</div>,
  },
  {
    id: 'daisyui-dock',
    name: 'dock',
    category: 'daisyUI',
    description: 'daisyUI dock themed preview',
    render: () => (
      <div className="dock dock-xs relative">
        <button type="button">⌂</button>
        <button type="button" className="dock-active">
          ★
        </button>
      </div>
    ),
  },
  {
    id: 'daisyui-drawer',
    name: 'drawer',
    category: 'daisyUI',
    description: 'daisyUI drawer themed preview',
    render: () => (
      <div className="drawer drawer-open tinyrack-demo-drawer">
        <input
          aria-label="drawer"
          type="checkbox"
          className="drawer-toggle"
          defaultChecked
        />
        <div className="drawer-content p-4">Drawer content</div>
        <div className="drawer-side relative">
          <div aria-hidden="true" className="drawer-overlay" />
          <ul className="menu bg-base-200 min-h-full w-36 p-2">
            <li>
              <a href="#daisyui-drawer-item">Item</a>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'daisyui-dropdown',
    name: 'dropdown',
    category: 'daisyUI',
    description: 'daisyUI dropdown themed preview',
    storyKinds: ['default', 'examples'],
    controls: daisyDropdownControls,
    render: (controlValues) => {
      const placement = selectDaisyControl(controlValues, 'placement', 'bottom');
      const align = selectDaisyControl(controlValues, 'align', 'start');
      const open = booleanControlValue(controlValues, 'open', true);
      const hover = booleanControlValue(controlValues, 'hover');

      return (
        <div
          className={classes(
            'dropdown',
            modifierClass('dropdown', placement),
            modifierClass('dropdown', align, 'start'),
            open && 'dropdown-open',
            hover && 'dropdown-hover',
          )}
        >
          <button tabIndex={0} className="btn btn-sm" type="button">
            Dropdown
          </button>
          <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow">
            <li>
              <a href="#daisyui-dropdown-item">Item</a>
            </li>
          </ul>
        </div>
      );
    },
  },
  {
    id: 'daisyui-fab',
    name: 'fab',
    category: 'daisyUI',
    description: 'daisyUI fab themed preview',
    render: () => (
      <button
        className="btn btn-circle btn-primary"
        type="button"
        aria-label="Floating action"
      >
        +
      </button>
    ),
  },
  {
    id: 'daisyui-fieldset',
    name: 'fieldset',
    category: 'daisyUI',
    description: 'daisyUI fieldset themed preview',
    render: () => (
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Fieldset</legend>
        <input className="input" placeholder="Input" />
      </fieldset>
    ),
  },
  {
    id: 'daisyui-fileinput',
    name: 'fileinput',
    category: 'daisyUI',
    description: 'daisyUI fileinput themed preview',
    render: () => (
      <input
        aria-label="File input"
        type="file"
        className="file-input file-input-primary"
      />
    ),
  },
  {
    id: 'daisyui-filter',
    name: 'filter',
    category: 'daisyUI',
    description: 'daisyUI filter themed preview',
    render: () => (
      <div className="filter">
        <input
          className="btn filter-reset"
          type="radio"
          name="daisy-filter"
          aria-label="All"
        />
        <input className="btn" type="radio" name="daisy-filter" aria-label="Tag" />
      </div>
    ),
  },
  {
    id: 'daisyui-footer',
    name: 'footer',
    category: 'daisyUI',
    description: 'daisyUI footer themed preview',
    render: () => (
      <footer className="footer bg-base-200 p-4">
        <aside>
          <p>Tinyrack Themes</p>
        </aside>
      </footer>
    ),
  },
  {
    id: 'daisyui-hero',
    name: 'hero',
    category: 'daisyUI',
    description: 'daisyUI hero themed preview',
    render: () => (
      <div className="hero bg-base-200 min-h-32">
        <div className="hero-content text-center">
          <div>
            <h3 className="text-xl font-bold">Hero</h3>
            <p>Theme preview</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'daisyui-hover3d',
    name: 'hover3d',
    category: 'daisyUI',
    description: 'daisyUI hover3d themed preview',
    render: () => (
      <div className="hover-3d">
        <div className="card bg-primary text-primary-content p-4">Hover 3D</div>
      </div>
    ),
  },
  {
    id: 'daisyui-hovergallery',
    name: 'hovergallery',
    category: 'daisyUI',
    description: 'daisyUI hovergallery themed preview',
    render: () => (
      <div className="hovergallery">
        <img
          alt="gallery"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 48'%3E%3Crect width='80' height='48' fill='%231762ae'/%3E%3C/svg%3E"
        />
      </div>
    ),
  },
  {
    id: 'daisyui-indicator',
    name: 'indicator',
    category: 'daisyUI',
    description: 'daisyUI indicator themed preview',
    render: () => (
      <div className="indicator">
        <span className="indicator-item badge badge-secondary">new</span>
        <button className="btn" type="button">
          Inbox
        </button>
      </div>
    ),
  },
  {
    id: 'daisyui-input',
    name: 'input',
    category: 'daisyUI',
    description: 'daisyUI input themed preview',
    storyKinds: ['default', 'states', 'sizes'],
    controls: daisyInputControls,
    render: (controlValues) => {
      const tone = selectDaisyControl(controlValues, 'tone', 'primary');
      const appearance = selectDaisyControl(controlValues, 'appearance', 'default');
      const size = selectDaisyControl(controlValues, 'size', 'md');

      return (
        <input
          className={classes(
            'input',
            modifierClass('input', tone),
            modifierClass('input', appearance),
            modifierClass('input', size),
          )}
          disabled={booleanControlValue(controlValues, 'disabled')}
          placeholder="Input"
        />
      );
    },
  },
  {
    id: 'daisyui-kbd',
    name: 'kbd',
    category: 'daisyUI',
    description: 'daisyUI kbd themed preview',
    render: () => <kbd className="kbd">⌘</kbd>,
  },
  {
    id: 'daisyui-label',
    name: 'label',
    category: 'daisyUI',
    description: 'daisyUI label themed preview',
    render: () => (
      <label className="label">
        <span>Label</span>
        <input className="input" placeholder="Value" />
      </label>
    ),
  },
  {
    id: 'daisyui-link',
    name: 'link',
    category: 'daisyUI',
    description: 'daisyUI link themed preview',
    render: () => (
      <a className="link link-primary" href="#daisyui-link-preview">
        Tinyrack link
      </a>
    ),
  },
  {
    id: 'daisyui-list',
    name: 'list',
    category: 'daisyUI',
    description: 'daisyUI list themed preview',
    render: () => (
      <ul className="list bg-base-100 rounded-box shadow">
        <li className="list-row">List item</li>
      </ul>
    ),
  },
  {
    id: 'daisyui-loading',
    name: 'loading',
    category: 'daisyUI',
    description: 'daisyUI loading themed preview',
    storyKinds: ['default', 'variants', 'sizes'],
    controls: daisyLoadingControls,
    render: (controlValues) => (
      <span
        aria-label="Loading"
        className={classes(
          'loading',
          `loading-${selectDaisyControl(controlValues, 'indicator', 'spinner')}`,
          `loading-${selectDaisyControl(controlValues, 'size', 'md')}`,
        )}
        role="status"
      />
    ),
  },
  {
    id: 'daisyui-mask',
    name: 'mask',
    category: 'daisyUI',
    description: 'daisyUI mask themed preview',
    render: () => <div className="mask mask-squircle bg-primary w-16 h-16" />,
  },
  {
    id: 'daisyui-menu',
    name: 'menu',
    category: 'daisyUI',
    description: 'daisyUI menu themed preview',
    render: () => (
      <ul className="menu bg-base-200 rounded-box w-48">
        <li>
          <a href="#daisyui-menu-item">Menu item</a>
        </li>
        <li>
          <a href="#daisyui-menu-second-item">Second item</a>
        </li>
      </ul>
    ),
  },
  {
    id: 'daisyui-mockup',
    name: 'mockup',
    category: 'daisyUI',
    description: 'daisyUI mockup themed preview',
    render: () => (
      <div className="mockup-code">
        <pre data-prefix="$">
          <code>pnpm test</code>
        </pre>
      </div>
    ),
  },
  {
    id: 'daisyui-modal',
    name: 'modal',
    category: 'daisyUI',
    description: 'daisyUI modal themed preview',
    storyKinds: ['default', 'states', 'examples'],
    controls: daisyModalControls,
    render: (controlValues) => {
      const placement = selectDaisyControl(controlValues, 'placement', 'middle');
      const open = booleanControlValue(controlValues, 'open', true);
      const actions = booleanControlValue(controlValues, 'actions', true);

      return (
        <div
          className={classes(
            'modal relative',
            open && 'modal-open',
            modifierClass('modal', placement),
          )}
        >
          <div className="modal-box">
            <h3 className="font-bold">Modal</h3>
            <p>Modal content</p>
            {actions ? (
              <div className="modal-action">
                <button className="btn btn-ghost btn-sm" type="button">
                  Cancel
                </button>
                <button className="btn btn-primary btn-sm" type="button">
                  Confirm
                </button>
              </div>
            ) : null}
          </div>
        </div>
      );
    },
  },
  {
    id: 'daisyui-navbar',
    name: 'navbar',
    category: 'daisyUI',
    description: 'daisyUI navbar themed preview',
    storyKinds: ['default', 'examples'],
    controls: daisyNavbarControls,
    render: (controlValues) => {
      const layout = selectControlValue<'brand-action' | 'centered' | 'menu'>(
        controlValues,
        'layout',
        'brand-action',
      );
      const action = booleanControlValue(controlValues, 'action', true);

      return (
        <div className="navbar bg-base-200 rounded-box">
          <div className={layout === 'centered' ? 'navbar-start' : 'flex-1'}>
            <a className="btn btn-ghost text-xl" href="#daisyui-navbar-home">
              Tinyrack
            </a>
          </div>
          {layout === 'centered' ? (
            <div className="navbar-center">
              <a className="btn btn-ghost btn-sm" href="#daisyui-navbar-docs">
                Docs
              </a>
            </div>
          ) : null}
          {layout === 'menu' ? (
            <div className="flex-none">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <a href="#daisyui-navbar-dashboard">Dashboard</a>
                </li>
              </ul>
            </div>
          ) : null}
          <div className={layout === 'centered' ? 'navbar-end' : 'flex-none'}>
            {action ? (
              <button className="btn btn-primary btn-sm" type="button">
                Action
              </button>
            ) : (
              <button className="btn btn-square btn-ghost" type="button">
                Menu
              </button>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: 'daisyui-progress',
    name: 'progress',
    category: 'daisyUI',
    description: 'daisyUI progress themed preview',
    render: () => (
      <progress className="progress progress-primary w-56" value="70" max="100" />
    ),
  },
  {
    id: 'daisyui-radialprogress',
    name: 'radialprogress',
    category: 'daisyUI',
    description: 'daisyUI radialprogress themed preview',
    render: () => (
      <div
        className="radial-progress text-primary"
        style={{ '--value': 70 } as React.CSSProperties}
        aria-valuenow={70}
        role="progressbar"
      >
        70%
      </div>
    ),
  },
  {
    id: 'daisyui-radio',
    name: 'radio',
    category: 'daisyUI',
    description: 'daisyUI radio themed preview',
    storyKinds: ['default', 'states', 'sizes'],
    controls: daisyBooleanControlControls,
    render: (controlValues) => (
      <input
        aria-label="Radio"
        type="radio"
        name="radio-preview"
        checked={booleanControlValue(controlValues, 'checked', true)}
        className={classes(
          'radio',
          `radio-${selectControlValue(controlValues, 'tone', 'primary')}`,
          `radio-${selectControlValue(controlValues, 'size', 'md')}`,
        )}
        disabled={booleanControlValue(controlValues, 'disabled')}
        readOnly
      />
    ),
  },
  {
    id: 'daisyui-range',
    name: 'range',
    category: 'daisyUI',
    description: 'daisyUI range themed preview',
    render: () => (
      <input
        aria-label="Range"
        type="range"
        min="0"
        max="100"
        defaultValue="60"
        className="range range-primary"
      />
    ),
  },
  {
    id: 'daisyui-rating',
    name: 'rating',
    category: 'daisyUI',
    description: 'daisyUI rating themed preview',
    render: () => (
      <div className="rating">
        <input
          type="radio"
          name="rating-preview"
          className="mask mask-star-2 bg-orange-400"
          aria-label="1 star"
        />
        <input
          type="radio"
          name="rating-preview"
          className="mask mask-star-2 bg-orange-400"
          aria-label="2 stars"
          defaultChecked
        />
      </div>
    ),
  },
  {
    id: 'daisyui-select',
    name: 'select',
    category: 'daisyUI',
    description: 'daisyUI select themed preview',
    render: () => (
      <select className="select select-primary" defaultValue="theme">
        <option value="theme">Theme</option>
      </select>
    ),
  },
  {
    id: 'daisyui-skeleton',
    name: 'skeleton',
    category: 'daisyUI',
    description: 'daisyUI skeleton themed preview',
    render: () => <div className="skeleton h-12 w-full" />,
  },
  {
    id: 'daisyui-stack',
    name: 'stack',
    category: 'daisyUI',
    description: 'daisyUI stack themed preview',
    render: () => (
      <div className="stack">
        <div className="card bg-primary text-primary-content p-4">1</div>
        <div className="card bg-secondary text-secondary-content p-4">2</div>
      </div>
    ),
  },
  {
    id: 'daisyui-stat',
    name: 'stat',
    category: 'daisyUI',
    description: 'daisyUI stat themed preview',
    render: () => (
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Themes</div>
          <div className="stat-value">3</div>
        </div>
      </div>
    ),
  },
  {
    id: 'daisyui-status',
    name: 'status',
    category: 'daisyUI',
    description: 'daisyUI status themed preview',
    render: () => (
      <div className="flex items-center gap-2">
        <span className="status status-success" /> Ready
      </div>
    ),
  },
  {
    id: 'daisyui-steps',
    name: 'steps',
    category: 'daisyUI',
    description: 'daisyUI steps themed preview',
    storyKinds: ['default', 'examples'],
    controls: daisyStepsControls,
    render: (controlValues) => {
      const orientation = selectDaisyControl(
        controlValues,
        'orientation',
        'horizontal',
      );
      const tone = selectDaisyControl(controlValues, 'tone', 'primary');
      const currentStep = numberControlValue(controlValues, 'currentStep', 2);
      const stepLabels = ['Tokens', 'Adapters', 'Apps'];

      return (
        <ul
          className={classes(
            'steps tinyrack-demo-steps',
            modifierClass('steps', orientation),
          )}
        >
          {stepLabels.map((label, index) => (
            <li
              className={classes('step', index < currentStep && `step-${tone}`)}
              key={label}
            >
              {label}
            </li>
          ))}
        </ul>
      );
    },
  },
  {
    id: 'daisyui-swap',
    name: 'swap',
    category: 'daisyUI',
    description: 'daisyUI swap themed preview',
    render: () => (
      <label className="swap swap-rotate">
        <input type="checkbox" defaultChecked />
        <span className="swap-on">ON</span>
        <span className="swap-off">OFF</span>
      </label>
    ),
  },
  {
    id: 'daisyui-tab',
    name: 'tab',
    category: 'daisyUI',
    description: 'daisyUI tab themed preview',
    storyKinds: ['default', 'variants', 'states'],
    controls: daisyTabControls,
    render: (controlValues) => {
      const style = selectDaisyControl(controlValues, 'style', 'box');
      const placement = selectDaisyControl(controlValues, 'placement', 'top');
      const size = selectDaisyControl(controlValues, 'size', 'md');
      const activeTab = selectControlValue<'first' | 'second'>(
        controlValues,
        'activeTab',
        'first',
      );
      const disabled = booleanControlValue(controlValues, 'disabled');

      return (
        <div
          role="tablist"
          className={classes(
            'tabs',
            modifierClass('tabs', style),
            modifierClass('tabs', placement),
            modifierClass('tabs', size),
          )}
        >
          <button
            aria-selected={activeTab === 'first'}
            role="tab"
            className={classes('tab', activeTab === 'first' && 'tab-active')}
            type="button"
          >
            Tab
          </button>
          <button
            aria-selected={activeTab === 'second'}
            role="tab"
            className={classes(
              'tab',
              activeTab === 'second' && 'tab-active',
              disabled && 'tab-disabled',
            )}
            disabled={disabled}
            type="button"
          >
            Other
          </button>
        </div>
      );
    },
  },
  {
    id: 'daisyui-table',
    name: 'table',
    category: 'daisyUI',
    description: 'daisyUI table themed preview',
    storyKinds: ['default', 'examples'],
    controls: daisyTableControls,
    render: (controlValues) => {
      const size = selectDaisyControl(controlValues, 'size', 'md');
      const zebra = booleanControlValue(controlValues, 'zebra', true);
      const rowHover = booleanControlValue(controlValues, 'rowHover');
      const pinRows = booleanControlValue(controlValues, 'pinRows');

      return (
        <div className="overflow-x-auto">
          <table
            className={classes(
              'table',
              modifierClass('table', size),
              zebra && 'table-zebra',
              pinRows && 'table-pin-rows',
            )}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className={rowHover ? 'row-hover' : undefined}>
                <td>Theme</td>
                <td>Ready</td>
              </tr>
              <tr className={rowHover ? 'row-hover' : undefined}>
                <td>Tokens</td>
                <td>Synced</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    },
  },
  {
    id: 'daisyui-textarea',
    name: 'textarea',
    category: 'daisyUI',
    description: 'daisyUI textarea themed preview',
    render: () => (
      <textarea className="textarea textarea-primary" defaultValue="Textarea" />
    ),
  },
  {
    id: 'daisyui-textrotate',
    name: 'textrotate',
    category: 'daisyUI',
    description: 'daisyUI textrotate themed preview',
    render: () => (
      <span className="text-rotate">
        <span>Rotate</span>
      </span>
    ),
  },
  {
    id: 'daisyui-timeline',
    name: 'timeline',
    category: 'daisyUI',
    description: 'daisyUI timeline themed preview',
    render: () => (
      <ul className="timeline">
        <li>
          <div className="timeline-start">Tokens</div>
          <div className="timeline-middle">●</div>
          <div className="timeline-end">Theme</div>
        </li>
      </ul>
    ),
  },
  {
    id: 'daisyui-toast',
    name: 'toast',
    category: 'daisyUI',
    description: 'daisyUI toast themed preview',
    render: () => (
      <div className="toast toast-start relative">
        <div className="alert alert-success">
          <span>Toast</span>
        </div>
      </div>
    ),
  },
  {
    id: 'daisyui-toggle',
    name: 'toggle',
    category: 'daisyUI',
    description: 'daisyUI toggle themed preview',
    storyKinds: ['default', 'states', 'sizes'],
    controls: daisyBooleanControlControls,
    render: (controlValues) => (
      <input
        aria-label="Toggle"
        type="checkbox"
        checked={booleanControlValue(controlValues, 'checked', true)}
        className={classes(
          'toggle',
          `toggle-${selectControlValue(controlValues, 'tone', 'primary')}`,
          `toggle-${selectControlValue(controlValues, 'size', 'md')}`,
        )}
        disabled={booleanControlValue(controlValues, 'disabled')}
        readOnly
      />
    ),
  },
  {
    id: 'daisyui-tooltip',
    name: 'tooltip',
    category: 'daisyUI',
    description: 'daisyUI tooltip themed preview',
    storyKinds: ['default', 'variants', 'states'],
    controls: daisyTooltipControls,
    render: (controlValues) => (
      <div
        className={classes(
          'tooltip',
          booleanControlValue(controlValues, 'open', true) && 'tooltip-open',
          modifierClass(
            'tooltip',
            selectDaisyControl(controlValues, 'tone', 'default'),
          ),
          `tooltip-${selectDaisyControl(controlValues, 'placement', 'top')}`,
        )}
        data-tip="Tooltip"
      >
        <button className="btn" type="button">
          Hover
        </button>
      </div>
    ),
  },
  {
    id: 'daisyui-validator',
    name: 'validator',
    category: 'daisyUI',
    description: 'daisyUI validator themed preview',
    render: () => (
      <input
        className="input validator"
        required
        type="email"
        defaultValue="hello@tinyrack.net"
      />
    ),
  },
];
