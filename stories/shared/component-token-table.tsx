type ComponentTokenName =
  | 'accordion'
  | 'alert'
  | 'avatar'
  | 'badge'
  | 'button'
  | 'card'
  | 'code'
  | 'code-block'
  | 'combobox'
  | 'disclosure'
  | 'divider'
  | 'form'
  | 'link'
  | 'menu'
  | 'overlay'
  | 'pin-input'
  | 'progress'
  | 'skeleton'
  | 'spinner'
  | 'table'
  | 'tabs'
  | 'toast'
  | 'tooltip';

type CssToken = {
  name: string;
  role: string;
  fallback: string;
};

const componentTokens: Record<ComponentTokenName, readonly CssToken[]> = {
  accordion: [
    {
      name: '--tr-accordion-background',
      role: 'Grouped surface fill',
      fallback: '--tinyrack-surface',
    },
    {
      name: '--tr-accordion-radius',
      role: 'Grouped surface shape',
      fallback: '--tinyrack-radius-md',
    },
    {
      name: '--tr-accordion-content-background',
      role: 'Expanded content fill',
      fallback: 'transparent',
    },
    {
      name: '--tr-disclosure-duration',
      role: 'Inherited item expansion motion',
      fallback: '--tinyrack-duration-normal',
    },
  ],
  alert: [
    {
      name: '--tr-alert-background',
      role: 'Surface fill',
      fallback: '--tinyrack-surface-muted',
    },
    { name: '--tr-alert-border', role: 'Border color', fallback: 'semantic variant' },
    { name: '--tr-alert-color', role: 'Content color', fallback: 'semantic variant' },
    { name: '--tr-alert-radius', role: 'Shape', fallback: '--tinyrack-radius-md' },
    { name: '--tr-alert-padding-x / -y', role: 'Inset', fallback: 'spacing recipe' },
  ],
  avatar: [
    { name: '--tr-avatar-size', role: 'Box size', fallback: 'shared control metric' },
    { name: '--tr-avatar-radius', role: 'Shape', fallback: 'shape recipe' },
    {
      name: '--tr-avatar-background',
      role: 'Surface fill',
      fallback: '--tinyrack-surface-muted',
    },
    { name: '--tr-avatar-border', role: 'Border color', fallback: '--tinyrack-border' },
    { name: '--tr-avatar-color', role: 'Content color', fallback: '--tinyrack-text' },
    {
      name: '--tr-avatar-font-size / -font-weight',
      role: 'Fallback initials',
      fallback: 'size recipe',
    },
  ],
  badge: [
    { name: '--tr-badge-background', role: 'Fill', fallback: 'semantic variant' },
    { name: '--tr-badge-border', role: 'Border color', fallback: 'semantic variant' },
    { name: '--tr-badge-color', role: 'Content color', fallback: 'semantic variant' },
    { name: '--tr-badge-radius', role: 'Shape', fallback: '--tinyrack-radius-full' },
    { name: '--tr-badge-gap', role: 'Content gap', fallback: 'size recipe' },
    { name: '--tr-badge-padding-x / -y', role: 'Inset', fallback: 'size recipe' },
  ],
  button: [
    { name: '--tr-btn-height', role: 'Control height', fallback: 'shared size recipe' },
    {
      name: '--tr-btn-padding-x',
      role: 'Inline inset',
      fallback: 'shared size recipe',
    },
    { name: '--tr-btn-gap', role: 'Content gap', fallback: 'shared size recipe' },
    { name: '--tr-btn-radius', role: 'Shape', fallback: '--tinyrack-radius-md' },
    { name: '--tr-btn-variant-fill', role: 'Fill', fallback: 'semantic variant' },
    {
      name: '--tr-btn-variant-fill-hover',
      role: 'Hover fill',
      fallback: 'semantic variant',
    },
    {
      name: '--tr-btn-variant-border',
      role: 'Border/content role',
      fallback: 'semantic variant',
    },
    {
      name: '--tr-btn-duration',
      role: 'Interaction duration',
      fallback: '--tinyrack-duration-fast',
    },
  ],
  card: [
    {
      name: '--tr-card-background',
      role: 'Surface fill',
      fallback: 'semantic variant',
    },
    { name: '--tr-card-border', role: 'Border color', fallback: '--tinyrack-border' },
    { name: '--tr-card-color', role: 'Content color', fallback: '--tinyrack-text' },
    { name: '--tr-card-radius', role: 'Shape', fallback: '--tinyrack-radius-lg' },
    { name: '--tr-card-padding', role: 'Inset', fallback: 'padding recipe' },
  ],
  code: [
    {
      name: '--tr-code-background',
      role: 'Inline fill',
      fallback: '--tinyrack-surface-muted',
    },
    { name: '--tr-code-border', role: 'Border color', fallback: '--tinyrack-border' },
    { name: '--tr-code-color', role: 'Content color', fallback: '--tinyrack-text' },
    { name: '--tr-code-radius', role: 'Shape', fallback: '--tinyrack-radius-sm' },
    { name: '--tr-code-font-size', role: 'Relative type size', fallback: '0.92em' },
    { name: '--tr-code-padding-x / -y', role: 'Inset', fallback: 'inline recipe' },
  ],
  'code-block': [
    {
      name: '--tr-code-block-background',
      role: 'Surface fill',
      fallback: '--tinyrack-surface-muted',
    },
    {
      name: '--tr-code-block-border',
      role: 'Border color',
      fallback: '--tinyrack-border',
    },
    { name: '--tr-code-block-radius', role: 'Shape', fallback: '--tinyrack-radius-lg' },
    {
      name: '--tr-code-block-padding-x / -y',
      role: 'Inset',
      fallback: 'spacing recipe',
    },
    {
      name: '--tr-code-block-font-size',
      role: 'Type size',
      fallback: '--tinyrack-text-sm',
    },
    {
      name: '--tr-code-block-line-height',
      role: 'Code rhythm',
      fallback: '--tinyrack-leading-lg',
    },
  ],
  combobox: [
    {
      name: '--tr-layer-anchor-width',
      role: 'Trigger-aligned minimum width',
      fallback: 'positioning measurement',
    },
    {
      name: '--tr-layer-available-width / -height',
      role: 'Collision-safe maximum size',
      fallback: 'viewport measurement',
    },
  ],
  disclosure: [
    {
      name: '--tr-disclosure-background',
      role: 'Surface fill',
      fallback: '--tinyrack-surface',
    },
    {
      name: '--tr-disclosure-radius',
      role: 'Shape',
      fallback: '--tinyrack-radius-md',
    },
    {
      name: '--tr-disclosure-duration',
      role: 'Expansion motion',
      fallback: '--tinyrack-duration-normal',
    },
  ],
  divider: [
    { name: '--tr-divider-color', role: 'Rule color', fallback: '--tinyrack-border' },
    {
      name: '--tr-divider-thickness',
      role: 'Rule width',
      fallback: '--tinyrack-border-width-default',
    },
    {
      name: '--tr-divider-min-length',
      role: 'Vertical minimum',
      fallback: '--tinyrack-space-lg',
    },
  ],
  form: [
    {
      name: '--tr-form-control-height',
      role: 'Control height',
      fallback: 'shared size recipe',
    },
    {
      name: '--tr-form-control-padding-x',
      role: 'Inline inset',
      fallback: 'shared size recipe',
    },
    {
      name: '--tr-form-control-radius',
      role: 'Control shape',
      fallback: '--tinyrack-radius-md',
    },
    {
      name: '--tr-form-control-border',
      role: 'Border color',
      fallback: 'semantic state',
    },
    {
      name: '--tr-choice-control-size',
      role: 'Checkbox/radio size',
      fallback: 'choice size recipe',
    },
    {
      name: '--tr-choice-gap',
      role: 'Choice label gap',
      fallback: 'shared size recipe',
    },
    {
      name: '--tr-switch-width / -height',
      role: 'Switch track',
      fallback: 'switch size recipe',
    },
    {
      name: '--tr-form-duration',
      role: 'Interaction duration',
      fallback: '--tinyrack-duration-fast',
    },
  ],
  link: [
    { name: '--tr-link-color', role: 'Content color', fallback: '--tinyrack-primary' },
    {
      name: '--tr-link-font-weight',
      role: 'Emphasis',
      fallback: '--tinyrack-weight-medium',
    },
    {
      name: '--tr-link-decoration-thickness',
      role: 'Underline weight',
      fallback: 'link recipe',
    },
    {
      name: '--tr-link-underline-offset',
      role: 'Underline spacing',
      fallback: 'link recipe',
    },
    {
      name: '--tr-link-hover-opacity',
      role: 'Hover state',
      fallback: '--tinyrack-opacity-hover',
    },
    { name: '--tr-link-radius', role: 'Focus shape', fallback: '--tinyrack-radius-xs' },
  ],
  menu: [
    {
      name: '--tr-layer-available-width / -height',
      role: 'Collision-safe maximum size',
      fallback: 'viewport measurement',
    },
    {
      name: '--tr-layer-radius',
      role: 'Popup shape',
      fallback: '--tinyrack-radius-md',
    },
  ],
  overlay: [
    {
      name: '--tr-modal-background',
      role: 'Modal surface',
      fallback: '--tinyrack-surface',
    },
    {
      name: '--tr-modal-box-radius',
      role: 'Modal shape',
      fallback: '--tinyrack-radius-xl',
    },
    {
      name: '--tr-modal-box-padding',
      role: 'Modal inset',
      fallback: 'responsive spacing recipe',
    },
    {
      name: '--tr-modal-shadow',
      role: 'Modal elevation',
      fallback: '--tinyrack-shadow-overlay',
    },
    {
      name: '--tr-modal-backdrop-color',
      role: 'Backdrop',
      fallback: 'backdrop opacity recipe',
    },
    {
      name: '--tr-modal-motion-duration',
      role: 'Modal motion',
      fallback: '--tinyrack-duration-slow',
    },
    {
      name: '--tr-layer-radius',
      role: 'Layer shape',
      fallback: '--tinyrack-radius-lg',
    },
    {
      name: '--tr-layer-shadow',
      role: 'Layer elevation',
      fallback: '--tinyrack-shadow-raised',
    },
    {
      name: '--tr-layer-motion-duration',
      role: 'Layer motion',
      fallback: '--tinyrack-duration-normal',
    },
  ],
  'pin-input': [
    {
      name: '--tr-pin-input-size',
      role: 'Digit control size',
      fallback: '--tinyrack-control-height-lg',
    },
    {
      name: '--tr-pin-input-gap',
      role: 'Digit spacing',
      fallback: '--tinyrack-control-gap-sm',
    },
  ],
  progress: [
    {
      name: '--tr-progress-background',
      role: 'Track fill',
      fallback: '--tinyrack-surface-muted',
    },
    { name: '--tr-progress-fill', role: 'Value fill', fallback: 'semantic variant' },
    { name: '--tr-progress-height', role: 'Track height', fallback: 'size recipe' },
    {
      name: '--tr-progress-radius',
      role: 'Track shape',
      fallback: '--tinyrack-radius-full',
    },
    {
      name: '--tr-progress-duration / -easing',
      role: 'Indeterminate motion',
      fallback: 'loading motion tokens',
    },
  ],
  skeleton: [
    {
      name: '--tr-skeleton-background',
      role: 'Base fill',
      fallback: '--tinyrack-surface-muted',
    },
    {
      name: '--tr-skeleton-highlight',
      role: 'Shimmer fill',
      fallback: '--tinyrack-surface',
    },
    {
      name: '--tr-skeleton-min-height',
      role: 'Minimum block size',
      fallback: 'shape recipe',
    },
    { name: '--tr-skeleton-radius', role: 'Shape', fallback: 'shape recipe' },
    {
      name: '--tr-skeleton-circle-size',
      role: 'Circle size',
      fallback: '--tinyrack-control-height-lg',
    },
    {
      name: '--tr-skeleton-duration / -easing',
      role: 'Shimmer motion',
      fallback: 'loading motion tokens',
    },
  ],
  spinner: [
    {
      name: '--tr-spinner-size',
      role: 'Indicator size',
      fallback: 'size recipe',
    },
    {
      name: '--tr-spinner-color',
      role: 'Indicator color',
      fallback: 'currentColor or semantic variant',
    },
  ],
  table: [
    {
      name: '--tr-table-radius',
      role: 'Container shape',
      fallback: '--tinyrack-radius-md',
    },
    {
      name: '--tr-table-cell-padding-x / -y',
      role: 'Cell inset',
      fallback: 'density recipe',
    },
    {
      name: '--tr-table-cell-line-height',
      role: 'Row rhythm',
      fallback: 'density recipe',
    },
    {
      name: '--tr-table-row-hover',
      role: 'Hover fill',
      fallback: '--tinyrack-surface-hover',
    },
    {
      name: '--tr-table-row-striped',
      role: 'Striped fill',
      fallback: '--tinyrack-surface-muted',
    },
    {
      name: '--tr-table-duration',
      role: 'Interaction duration',
      fallback: '--tinyrack-duration-fast',
    },
  ],
  tabs: [
    {
      name: '--tr-tabs-trigger-height',
      role: 'Trigger height',
      fallback: 'shared size recipe',
    },
    {
      name: '--tr-tabs-trigger-padding-x',
      role: 'Trigger inset',
      fallback: 'shared size recipe',
    },
    {
      name: '--tr-tabs-trigger-gap',
      role: 'Trigger content gap',
      fallback: 'shared size recipe',
    },
    { name: '--tr-tabs-panel-padding', role: 'Panel inset', fallback: 'size recipe' },
    {
      name: '--tr-tabs-radius',
      role: 'Connected shape',
      fallback: '--tinyrack-radius-md',
    },
    {
      name: '--tr-tabs-hover-background',
      role: 'Hover fill',
      fallback: '--tinyrack-surface-hover',
    },
    {
      name: '--tr-tabs-selected-background',
      role: 'Selected fill',
      fallback: '--tinyrack-surface',
    },
    {
      name: '--tr-tabs-duration',
      role: 'Interaction duration',
      fallback: '--tinyrack-duration-fast',
    },
  ],
  toast: [
    {
      name: '--tr-toast-background',
      role: 'Surface fill',
      fallback: '--tinyrack-surface',
    },
    {
      name: '--tr-toast-border',
      role: 'Border color',
      fallback: '--tinyrack-border',
    },
    { name: '--tr-toast-color', role: 'Content color', fallback: '--tinyrack-text' },
    {
      name: '--tr-toast-accent',
      role: 'Status accent',
      fallback: 'matching status border token',
    },
  ],
  tooltip: [
    {
      name: '--tr-tooltip-background',
      role: 'Inverse fill',
      fallback: '--tinyrack-text',
    },
    {
      name: '--tr-tooltip-border',
      role: 'Inverse border',
      fallback: '--tinyrack-text',
    },
    {
      name: '--tr-tooltip-color',
      role: 'Inverse content',
      fallback: '--tinyrack-surface',
    },
    {
      name: '--tr-layer-available-width',
      role: 'Collision-safe maximum width',
      fallback: 'viewport measurement',
    },
    {
      name: '--tr-layer-motion-duration',
      role: 'Popup motion',
      fallback: '--tinyrack-duration-fast',
    },
  ],
};

export function ComponentTokenTable({ component }: { component: ComponentTokenName }) {
  return (
    <section data-component-token-table={component}>
      <h2 className="tr-mdx-h2">CSS tokens</h2>
      <p className="tr-mdx-p">
        Override these <code className="tr-code">--tr-*</code> variables on a component
        or ancestor. Foundation defaults continue to come from{' '}
        <code className="tr-code">--tinyrack-*</code> tokens.
      </p>
      <div className="tr-table-container tr-mdx-table-container">
        <table className="tr-table" data-density="compact">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Role</th>
              <th scope="col">Fallback</th>
            </tr>
          </thead>
          <tbody>
            {componentTokens[component].map((token) => (
              <tr key={token.name}>
                <th scope="row">
                  <code className="tr-code">{token.name}</code>
                </th>
                <td>{token.role}</td>
                <td>
                  <code className="tr-code">{token.fallback}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
