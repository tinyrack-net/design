export type TailwindTokenGroupId =
  | 'breakpoint'
  | 'color'
  | 'typography'
  | 'spacing'
  | 'container'
  | 'border-focus'
  | 'radius-shadow'
  | 'motion'
  | 'visual-state'
  | 'decoration';

export type TailwindTokenBridgeEntry =
  | {
      group: Exclude<TailwindTokenGroupId, 'breakpoint'>;
      runtimeVariable: `--tinyrack-${string}`;
      themeVariable: `--${string}`;
    }
  | {
      group: 'breakpoint';
      themeVariable: `--breakpoint-${string}`;
      value: `${number}rem`;
    };

export const tailwindTokenGroups = [
  {
    id: 'breakpoint',
    anchor: 'breakpoints',
    guide: 'breakpoints',
    label: 'Breakpoints',
    utilityPattern: 'sm/md/lg/xl:*',
  },
  {
    id: 'color',
    anchor: 'colors',
    guide: 'colors',
    label: 'Color',
    utilityPattern: 'bg/text/border-tinyrack-*',
  },
  {
    id: 'typography',
    anchor: 'typography',
    guide: 'typography',
    label: 'Typography',
    utilityPattern: 'font/text/leading/tracking-tinyrack-*',
  },
  {
    id: 'spacing',
    anchor: 'spacing-controls',
    guide: 'spacing',
    label: 'Spacing and controls',
    utilityPattern: 'gap/p/m/w/h-tinyrack-*',
  },
  {
    id: 'container',
    anchor: 'containers',
    guide: 'spacing',
    label: 'Containers',
    utilityPattern: 'max-w-tinyrack-*',
  },
  {
    id: 'border-focus',
    anchor: 'borders-focus',
    guide: 'controls',
    label: 'Borders and focus',
    utilityPattern: 'border/outline/outline-offset-tinyrack-*',
  },
  {
    id: 'radius-shadow',
    anchor: 'radius-shadows',
    guide: 'radius',
    label: 'Radius and shadows',
    utilityPattern: 'rounded/shadow-tinyrack-*',
  },
  {
    id: 'motion',
    anchor: 'motion',
    guide: 'motion',
    label: 'Motion',
    utilityPattern: 'duration/ease-tinyrack-*',
  },
  {
    id: 'visual-state',
    anchor: 'visual-state',
    guide: 'elevation',
    label: 'Opacity, layers, and scale',
    utilityPattern: 'opacity/z/scale-tinyrack-*',
  },
  {
    id: 'decoration',
    anchor: 'decoration',
    guide: 'typography',
    label: 'Text decoration',
    utilityPattern: 'decoration/underline-offset-tinyrack',
  },
] as const;

export const tailwindTokenBridge = [
  {
    group: 'breakpoint',
    themeVariable: '--breakpoint-xs',
    value: '24rem',
  },
  {
    group: 'breakpoint',
    themeVariable: '--breakpoint-sm',
    value: '40rem',
  },
  {
    group: 'breakpoint',
    themeVariable: '--breakpoint-md',
    value: '48rem',
  },
  {
    group: 'breakpoint',
    themeVariable: '--breakpoint-lg',
    value: '64rem',
  },
  {
    group: 'breakpoint',
    themeVariable: '--breakpoint-xl',
    value: '80rem',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-font-body',
    themeVariable: '--font-tinyrack-body',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-font-heading',
    themeVariable: '--font-tinyrack-heading',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-font-mono',
    themeVariable: '--font-tinyrack-mono',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-text-2xs',
    themeVariable: '--text-tinyrack-2xs',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-sm',
    themeVariable: '--text-tinyrack-2xs--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-text-xs',
    themeVariable: '--text-tinyrack-xs',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-sm',
    themeVariable: '--text-tinyrack-xs--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-text-sm',
    themeVariable: '--text-tinyrack-sm',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-md',
    themeVariable: '--text-tinyrack-sm--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-text-md',
    themeVariable: '--text-tinyrack-md',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-md',
    themeVariable: '--text-tinyrack-md--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-text-lg',
    themeVariable: '--text-tinyrack-lg',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-md',
    themeVariable: '--text-tinyrack-lg--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-text-xl',
    themeVariable: '--text-tinyrack-xl',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-sm',
    themeVariable: '--text-tinyrack-xl--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-text-2xl',
    themeVariable: '--text-tinyrack-2xl',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-sm',
    themeVariable: '--text-tinyrack-2xl--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-text-3xl',
    themeVariable: '--text-tinyrack-3xl',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-sm',
    themeVariable: '--text-tinyrack-3xl--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-text-4xl',
    themeVariable: '--text-tinyrack-4xl',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-sm',
    themeVariable: '--text-tinyrack-4xl--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-text-5xl',
    themeVariable: '--text-tinyrack-5xl',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-sm',
    themeVariable: '--text-tinyrack-5xl--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-control-font-size-sm',
    themeVariable: '--text-tinyrack-control-sm',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-control-line-height-sm',
    themeVariable: '--text-tinyrack-control-sm--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-control-font-size-md',
    themeVariable: '--text-tinyrack-control-md',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-control-line-height-md',
    themeVariable: '--text-tinyrack-control-md--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-control-font-size-lg',
    themeVariable: '--text-tinyrack-control-lg',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-control-line-height-lg',
    themeVariable: '--text-tinyrack-control-lg--line-height',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-xs',
    themeVariable: '--leading-tinyrack-xs',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-sm',
    themeVariable: '--leading-tinyrack-sm',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-md',
    themeVariable: '--leading-tinyrack-md',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-lg',
    themeVariable: '--leading-tinyrack-lg',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-leading-xl',
    themeVariable: '--leading-tinyrack-xl',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-control-line-height-sm',
    themeVariable: '--leading-tinyrack-control-sm',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-control-line-height-md',
    themeVariable: '--leading-tinyrack-control-md',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-control-line-height-lg',
    themeVariable: '--leading-tinyrack-control-lg',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-tracking-none',
    themeVariable: '--tracking-tinyrack-none',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-tracking-sm',
    themeVariable: '--tracking-tinyrack-sm',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-tracking-md',
    themeVariable: '--tracking-tinyrack-md',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-tracking-lg',
    themeVariable: '--tracking-tinyrack-lg',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-tracking-xl',
    themeVariable: '--tracking-tinyrack-xl',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-weight-regular',
    themeVariable: '--font-weight-tinyrack-regular',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-weight-medium',
    themeVariable: '--font-weight-tinyrack-medium',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-weight-heading',
    themeVariable: '--font-weight-tinyrack-heading',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-weight-bold',
    themeVariable: '--font-weight-tinyrack-bold',
  },
  {
    group: 'typography',
    runtimeVariable: '--tinyrack-weight-strong',
    themeVariable: '--font-weight-tinyrack-strong',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-space-xs',
    themeVariable: '--spacing-tinyrack-xs',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-space-3xs',
    themeVariable: '--spacing-tinyrack-3xs',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-space-sm',
    themeVariable: '--spacing-tinyrack-sm',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-space-md',
    themeVariable: '--spacing-tinyrack-md',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-space-lg',
    themeVariable: '--spacing-tinyrack-lg',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-space-xl',
    themeVariable: '--spacing-tinyrack-xl',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-space-2xl',
    themeVariable: '--spacing-tinyrack-2xl',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-control-height-sm',
    themeVariable: '--spacing-tinyrack-control-height-sm',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-control-height-md',
    themeVariable: '--spacing-tinyrack-control-height-md',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-control-height-lg',
    themeVariable: '--spacing-tinyrack-control-height-lg',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-control-padding-inline-sm',
    themeVariable: '--spacing-tinyrack-control-padding-inline-sm',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-control-padding-inline-md',
    themeVariable: '--spacing-tinyrack-control-padding-inline-md',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-control-padding-inline-lg',
    themeVariable: '--spacing-tinyrack-control-padding-inline-lg',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-control-gap-sm',
    themeVariable: '--spacing-tinyrack-control-gap-sm',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-control-gap-md',
    themeVariable: '--spacing-tinyrack-control-gap-md',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-control-gap-lg',
    themeVariable: '--spacing-tinyrack-control-gap-lg',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-measure-xs',
    themeVariable: '--spacing-tinyrack-measure-xs',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-measure-sm',
    themeVariable: '--spacing-tinyrack-measure-sm',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-measure-md',
    themeVariable: '--spacing-tinyrack-measure-md',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-measure-lg',
    themeVariable: '--spacing-tinyrack-measure-lg',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-measure-xl',
    themeVariable: '--spacing-tinyrack-measure-xl',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-measure-2xl',
    themeVariable: '--spacing-tinyrack-measure-2xl',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-control-width-md',
    themeVariable: '--spacing-tinyrack-control-width-md',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-control-press-distance',
    themeVariable: '--spacing-tinyrack-control-press-distance',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-overlay-width-sm',
    themeVariable: '--spacing-tinyrack-overlay-width-sm',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-overlay-width-md',
    themeVariable: '--spacing-tinyrack-overlay-width-md',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-overlay-width-lg',
    themeVariable: '--spacing-tinyrack-overlay-width-lg',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-overlay-width-xl',
    themeVariable: '--spacing-tinyrack-overlay-width-xl',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-overlay-inline-inset',
    themeVariable: '--spacing-tinyrack-overlay-inline-inset',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-spinner-size-sm',
    themeVariable: '--spacing-tinyrack-spinner-size-sm',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-spinner-size-md',
    themeVariable: '--spacing-tinyrack-spinner-size-md',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-spinner-size-lg',
    themeVariable: '--spacing-tinyrack-spinner-size-lg',
  },
  {
    group: 'spacing',
    runtimeVariable: '--tinyrack-spinner-stroke-width',
    themeVariable: '--spacing-tinyrack-spinner-stroke-width',
  },
  {
    group: 'container',
    runtimeVariable: '--tinyrack-measure-xs',
    themeVariable: '--container-tinyrack-measure-xs',
  },
  {
    group: 'container',
    runtimeVariable: '--tinyrack-measure-sm',
    themeVariable: '--container-tinyrack-measure-sm',
  },
  {
    group: 'container',
    runtimeVariable: '--tinyrack-measure-md',
    themeVariable: '--container-tinyrack-measure-md',
  },
  {
    group: 'container',
    runtimeVariable: '--tinyrack-measure-lg',
    themeVariable: '--container-tinyrack-measure-lg',
  },
  {
    group: 'container',
    runtimeVariable: '--tinyrack-measure-xl',
    themeVariable: '--container-tinyrack-measure-xl',
  },
  {
    group: 'container',
    runtimeVariable: '--tinyrack-measure-2xl',
    themeVariable: '--container-tinyrack-measure-2xl',
  },
  {
    group: 'container',
    runtimeVariable: '--tinyrack-overlay-width-sm',
    themeVariable: '--container-tinyrack-overlay-sm',
  },
  {
    group: 'container',
    runtimeVariable: '--tinyrack-overlay-width-md',
    themeVariable: '--container-tinyrack-overlay-md',
  },
  {
    group: 'container',
    runtimeVariable: '--tinyrack-overlay-width-lg',
    themeVariable: '--container-tinyrack-overlay-lg',
  },
  {
    group: 'container',
    runtimeVariable: '--tinyrack-overlay-width-xl',
    themeVariable: '--container-tinyrack-overlay-xl',
  },
  {
    group: 'border-focus',
    runtimeVariable: '--tinyrack-border-width-default',
    themeVariable: '--border-width-tinyrack-default',
  },
  {
    group: 'border-focus',
    runtimeVariable: '--tinyrack-border-width-strong',
    themeVariable: '--border-width-tinyrack-strong',
  },
  {
    group: 'border-focus',
    runtimeVariable: '--tinyrack-border-width-accent',
    themeVariable: '--border-width-tinyrack-accent',
  },
  {
    group: 'border-focus',
    runtimeVariable: '--tinyrack-focus-width',
    themeVariable: '--outline-width-tinyrack-focus',
  },
  {
    group: 'border-focus',
    runtimeVariable: '--tinyrack-focus-offset',
    themeVariable: '--outline-offset-tinyrack-focus',
  },
  {
    group: 'radius-shadow',
    runtimeVariable: '--tinyrack-radius-xs',
    themeVariable: '--radius-tinyrack-xs',
  },
  {
    group: 'radius-shadow',
    runtimeVariable: '--tinyrack-radius-sm',
    themeVariable: '--radius-tinyrack-sm',
  },
  {
    group: 'radius-shadow',
    runtimeVariable: '--tinyrack-radius-md',
    themeVariable: '--radius-tinyrack-md',
  },
  {
    group: 'radius-shadow',
    runtimeVariable: '--tinyrack-radius-lg',
    themeVariable: '--radius-tinyrack-lg',
  },
  {
    group: 'radius-shadow',
    runtimeVariable: '--tinyrack-radius-xl',
    themeVariable: '--radius-tinyrack-xl',
  },
  {
    group: 'radius-shadow',
    runtimeVariable: '--tinyrack-radius-full',
    themeVariable: '--radius-tinyrack-full',
  },
  {
    group: 'radius-shadow',
    runtimeVariable: '--tinyrack-shadow-raised',
    themeVariable: '--shadow-tinyrack-raised',
  },
  {
    group: 'radius-shadow',
    runtimeVariable: '--tinyrack-shadow-overlay',
    themeVariable: '--shadow-tinyrack-overlay',
  },
  {
    group: 'motion',
    runtimeVariable: '--tinyrack-duration-fast',
    themeVariable: '--transition-duration-tinyrack-fast',
  },
  {
    group: 'motion',
    runtimeVariable: '--tinyrack-duration-normal',
    themeVariable: '--transition-duration-tinyrack-normal',
  },
  {
    group: 'motion',
    runtimeVariable: '--tinyrack-duration-slow',
    themeVariable: '--transition-duration-tinyrack-slow',
  },
  {
    group: 'motion',
    runtimeVariable: '--tinyrack-duration-loading',
    themeVariable: '--transition-duration-tinyrack-loading',
  },
  {
    group: 'motion',
    runtimeVariable: '--tinyrack-ease-standard',
    themeVariable: '--ease-tinyrack-standard',
  },
  {
    group: 'motion',
    runtimeVariable: '--tinyrack-ease-out',
    themeVariable: '--ease-tinyrack-ease-out',
  },
  {
    group: 'motion',
    runtimeVariable: '--tinyrack-ease-linear',
    themeVariable: '--ease-tinyrack-linear',
  },
  {
    group: 'visual-state',
    runtimeVariable: '--tinyrack-opacity-disabled',
    themeVariable: '--opacity-tinyrack-disabled',
  },
  {
    group: 'visual-state',
    runtimeVariable: '--tinyrack-opacity-hover',
    themeVariable: '--opacity-tinyrack-hover',
  },
  {
    group: 'visual-state',
    runtimeVariable: '--tinyrack-opacity-backdrop',
    themeVariable: '--opacity-tinyrack-backdrop',
  },
  {
    group: 'visual-state',
    runtimeVariable: '--tinyrack-spinner-track-opacity',
    themeVariable: '--opacity-tinyrack-spinner-track',
  },
  {
    group: 'visual-state',
    runtimeVariable: '--tinyrack-layer-base',
    themeVariable: '--z-index-tinyrack-base',
  },
  {
    group: 'visual-state',
    runtimeVariable: '--tinyrack-layer-backdrop',
    themeVariable: '--z-index-tinyrack-backdrop',
  },
  {
    group: 'visual-state',
    runtimeVariable: '--tinyrack-layer-dropdown',
    themeVariable: '--z-index-tinyrack-dropdown',
  },
  {
    group: 'visual-state',
    runtimeVariable: '--tinyrack-layer-popover',
    themeVariable: '--z-index-tinyrack-popover',
  },
  {
    group: 'visual-state',
    runtimeVariable: '--tinyrack-layer-dialog',
    themeVariable: '--z-index-tinyrack-dialog',
  },
  {
    group: 'visual-state',
    runtimeVariable: '--tinyrack-layer-toast',
    themeVariable: '--z-index-tinyrack-toast',
  },
  {
    group: 'visual-state',
    runtimeVariable: '--tinyrack-layer-tooltip',
    themeVariable: '--z-index-tinyrack-tooltip',
  },
  {
    group: 'visual-state',
    runtimeVariable: '--tinyrack-overlay-closed-scale',
    themeVariable: '--scale-tinyrack-overlay-closed',
  },
  {
    group: 'decoration',
    runtimeVariable: '--tinyrack-text-decoration-thickness',
    themeVariable: '--text-decoration-thickness-tinyrack',
  },
  {
    group: 'decoration',
    runtimeVariable: '--tinyrack-text-underline-offset',
    themeVariable: '--text-underline-offset-tinyrack',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-canvas',
    themeVariable: '--color-tinyrack-canvas',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-surface',
    themeVariable: '--color-tinyrack-surface',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-surface-muted',
    themeVariable: '--color-tinyrack-surface-muted',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-surface-hover',
    themeVariable: '--color-tinyrack-surface-hover',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-surface-selected',
    themeVariable: '--color-tinyrack-surface-selected',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-surface-pressed',
    themeVariable: '--color-tinyrack-surface-pressed',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-text',
    themeVariable: '--color-tinyrack-text',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-text-muted',
    themeVariable: '--color-tinyrack-text-muted',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-text-placeholder',
    themeVariable: '--color-tinyrack-text-placeholder',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-border',
    themeVariable: '--color-tinyrack-border',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-border-strong',
    themeVariable: '--color-tinyrack-border-strong',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-control-border',
    themeVariable: '--color-tinyrack-control-border',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-control-track',
    themeVariable: '--color-tinyrack-control-track',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-focus',
    themeVariable: '--color-tinyrack-focus',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-surface-inverse',
    themeVariable: '--color-tinyrack-surface-inverse',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-text-inverse',
    themeVariable: '--color-tinyrack-text-inverse',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-border-inverse',
    themeVariable: '--color-tinyrack-border-inverse',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-skeleton-fill',
    themeVariable: '--color-tinyrack-skeleton-fill',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-skeleton-highlight',
    themeVariable: '--color-tinyrack-skeleton-highlight',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-primary',
    themeVariable: '--color-tinyrack-primary',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-primary-hover',
    themeVariable: '--color-tinyrack-primary-hover',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-primary-pressed',
    themeVariable: '--color-tinyrack-primary-pressed',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-on-primary',
    themeVariable: '--color-tinyrack-on-primary',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-info',
    themeVariable: '--color-tinyrack-info',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-info-hover',
    themeVariable: '--color-tinyrack-info-hover',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-info-pressed',
    themeVariable: '--color-tinyrack-info-pressed',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-info-surface',
    themeVariable: '--color-tinyrack-info-surface',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-info-surface-subtle',
    themeVariable: '--color-tinyrack-info-surface-subtle',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-info-surface-hover',
    themeVariable: '--color-tinyrack-info-surface-hover',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-info-surface-pressed',
    themeVariable: '--color-tinyrack-info-surface-pressed',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-info-border',
    themeVariable: '--color-tinyrack-info-border',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-on-info',
    themeVariable: '--color-tinyrack-on-info',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-success',
    themeVariable: '--color-tinyrack-success',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-success-hover',
    themeVariable: '--color-tinyrack-success-hover',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-success-pressed',
    themeVariable: '--color-tinyrack-success-pressed',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-success-surface',
    themeVariable: '--color-tinyrack-success-surface',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-success-surface-subtle',
    themeVariable: '--color-tinyrack-success-surface-subtle',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-success-surface-hover',
    themeVariable: '--color-tinyrack-success-surface-hover',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-success-surface-pressed',
    themeVariable: '--color-tinyrack-success-surface-pressed',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-success-border',
    themeVariable: '--color-tinyrack-success-border',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-on-success',
    themeVariable: '--color-tinyrack-on-success',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-warning',
    themeVariable: '--color-tinyrack-warning',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-warning-hover',
    themeVariable: '--color-tinyrack-warning-hover',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-warning-pressed',
    themeVariable: '--color-tinyrack-warning-pressed',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-warning-surface',
    themeVariable: '--color-tinyrack-warning-surface',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-warning-surface-subtle',
    themeVariable: '--color-tinyrack-warning-surface-subtle',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-warning-surface-hover',
    themeVariable: '--color-tinyrack-warning-surface-hover',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-warning-surface-pressed',
    themeVariable: '--color-tinyrack-warning-surface-pressed',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-warning-border',
    themeVariable: '--color-tinyrack-warning-border',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-on-warning',
    themeVariable: '--color-tinyrack-on-warning',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-danger',
    themeVariable: '--color-tinyrack-danger',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-danger-hover',
    themeVariable: '--color-tinyrack-danger-hover',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-danger-pressed',
    themeVariable: '--color-tinyrack-danger-pressed',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-danger-surface',
    themeVariable: '--color-tinyrack-danger-surface',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-danger-surface-subtle',
    themeVariable: '--color-tinyrack-danger-surface-subtle',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-danger-surface-hover',
    themeVariable: '--color-tinyrack-danger-surface-hover',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-danger-surface-pressed',
    themeVariable: '--color-tinyrack-danger-surface-pressed',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-danger-border',
    themeVariable: '--color-tinyrack-danger-border',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-on-danger',
    themeVariable: '--color-tinyrack-on-danger',
  },
  {
    group: 'color',
    runtimeVariable: '--tinyrack-scrim',
    themeVariable: '--color-tinyrack-scrim',
  },
] as const satisfies readonly TailwindTokenBridgeEntry[];
