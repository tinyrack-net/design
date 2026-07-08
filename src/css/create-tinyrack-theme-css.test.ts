import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createTinyrackThemeCssFiles } from './create-tinyrack-theme-css.js';

const repoRoot = process.cwd();
const expectedGeneratedCssPaths = [
  'tailwind/theme.css',
  'tailwind/daisyui.css',
  'tailwind/mantine.css',
  'daisyui/theme.css',
  'mantine/styles.css',
  'astro/starlight/theme.css',
] as const;

describe('generated Tinyrack theme CSS', () => {
  it('generates the expected public CSS entrypoints', () => {
    const generatedCssFiles = createTinyrackThemeCssFiles();

    expect(Object.keys(generatedCssFiles).sort()).toEqual(
      [...expectedGeneratedCssPaths].sort(),
    );
  });

  it.each(
    Object.entries(createTinyrackThemeCssFiles()),
  )('marks src/%s as generated CSS', (_path, css) => {
    expect(css).toContain(
      '/* Generated from src/css/create-tinyrack-theme-css.ts. Do not edit directly. */',
    );
  });

  it('keeps generated CSS files ignored by git', () => {
    const gitignore = readFileSync(join(repoRoot, '.gitignore'), 'utf8');

    for (const path of expectedGeneratedCssPaths) {
      expect(gitignore).toContain(`src/${path}`);
    }
  });

  it('sets Mantine filled text fallback to the dark primary contrast token', () => {
    const css = createTinyrackThemeCssFiles()['mantine/styles.css'];

    expect(css).not.toContain(':root {');
    expect(css).toContain('[data-mantine-color-scheme="dark"]');
    expect(css).toContain('--tinyrack-mantine-filled-color: #0a0a0a;');
  });

  it('generates shared typography variables with a single Noto Sans family', () => {
    const css = createTinyrackThemeCssFiles()['tailwind/theme.css'];

    expect(css).toContain('--tinyrack-font-body:');
    expect(css).toContain('"Noto Sans"');
    expect(css).not.toContain('"Noto Sans KR"');
    expect(css).not.toContain('"Noto Sans JP"');
    expect(css).not.toContain('"Noto Sans Mono"');
    expect(css).not.toContain('system-ui');
    expect(css).not.toContain('sans-serif');
    expect(css).not.toContain('monospace');
    expect(css).toContain('--tinyrack-text-md: 1rem;');
    expect(css).toContain('--tinyrack-leading-lg: 1.65;');
    expect(css).toContain('--tinyrack-tracking-none: 0;');
    expect(css).not.toContain(':lang(ko)');
    expect(css).not.toContain(':lang(ja)');
  });

  it('generates shared control contract variables', () => {
    const css = createTinyrackThemeCssFiles()['tailwind/theme.css'];

    expect(css).toContain('--tinyrack-control-height-sm: 2rem;');
    expect(css).toContain('--tinyrack-control-padding-x-sm: 0.75rem;');
    expect(css).toContain('--tinyrack-control-padding-y-sm: 0.375rem;');
    expect(css).toContain('--tinyrack-control-font-size-sm: 0.75rem;');
    expect(css).toContain('--tinyrack-control-radius: 0.25rem;');
  });

  it('maps Tinyrack Button control sizing into Mantine and daisyUI CSS', () => {
    const mantineCss = createTinyrackThemeCssFiles()['mantine/styles.css'];
    const daisyCss = createTinyrackThemeCssFiles()['tailwind/daisyui.css'];

    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Button-root');
    expect(mantineCss).toContain(
      '--button-height-sm: var(--tinyrack-control-height-sm);',
    );
    expect(mantineCss).toContain(
      '--button-padding-x-sm: var(--tinyrack-control-padding-x-sm);',
    );
    expect(mantineCss).toContain(
      '--mantine-font-size-sm: var(--tinyrack-control-font-size-sm);',
    );
    expect(mantineCss).toContain('--button-radius: var(--tinyrack-control-radius);');

    expect(daisyCss).toContain('.btn-sm');
    expect(daisyCss).toContain('--size: var(--tinyrack-control-height-sm, 2rem);');
    expect(daisyCss).toContain(
      '--btn-p: var(--tinyrack-control-padding-x-sm, 0.75rem);',
    );
    expect(daisyCss).toContain(
      '--fontsize: var(--tinyrack-control-font-size-sm, 0.75rem);',
    );
    expect(daisyCss).toContain(
      'font-size: var(--tinyrack-control-font-size-sm, 0.75rem);',
    );
  });

  it('maps Tinyrack form control sizing into Mantine and daisyUI CSS', () => {
    const mantineCss = createTinyrackThemeCssFiles()['mantine/styles.css'];
    const daisyCss = createTinyrackThemeCssFiles()['tailwind/daisyui.css'];

    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Input-wrapper');
    expect(mantineCss).toContain(
      '--input-height-sm: var(--tinyrack-control-height-sm);',
    );
    expect(mantineCss).toContain(
      '--input-padding-y-sm: var(--tinyrack-control-padding-y-sm);',
    );
    expect(mantineCss).toContain('--input-bg: var(--tinyrack-surface);');
    expect(mantineCss).toContain('--input-bd: var(--tinyrack-border);');

    expect(daisyCss).toContain('.input-sm, .select-sm, .file-input-sm');
    expect(daisyCss).toContain('.textarea-sm');
    expect(daisyCss).toContain('border-color: var(--tinyrack-border');
    expect(daisyCss).toContain('min-height: var(--tinyrack-control-height-sm, 2rem);');
  });

  it('maps Tinyrack compact display sizing into Mantine and daisyUI CSS', () => {
    const mantineCss = createTinyrackThemeCssFiles()['mantine/styles.css'];
    const daisyCss = createTinyrackThemeCssFiles()['tailwind/daisyui.css'];

    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Badge-root');
    expect(mantineCss).toContain('--badge-height-sm: var(--tinyrack-badge-height-sm);');
    expect(mantineCss).toContain('--badge-fz-sm: var(--tinyrack-badge-font-size-sm);');
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Kbd-root');
    expect(mantineCss).toContain('--kbd-fz-sm: var(--tinyrack-kbd-font-size-sm);');
    expect(mantineCss).toContain(
      '[data-mantine-color-scheme] .mantine-Kbd-root[data-size="sm"]',
    );

    expect(daisyCss).toContain('.badge-sm');
    expect(daisyCss).toContain('--size: var(--tinyrack-badge-height-sm, 1.25rem);');
    expect(daisyCss).toContain('.kbd-sm');
    expect(daisyCss).toContain('--size: var(--tinyrack-kbd-height-sm, 1.25rem);');
  });

  it('maps Tinyrack selection control sizing and state colors into Mantine and daisyUI CSS', () => {
    const mantineCss = createTinyrackThemeCssFiles()['mantine/styles.css'];
    const daisyCss = createTinyrackThemeCssFiles()['tailwind/daisyui.css'];

    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Checkbox-root');
    expect(mantineCss).toContain(
      '--checkbox-size-sm: var(--tinyrack-selection-control-size-sm);',
    );
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Radio-root');
    expect(mantineCss).toContain(
      '--radio-size-sm: var(--tinyrack-selection-control-size-sm);',
    );
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Switch-root');
    expect(mantineCss).toContain(
      '--switch-height-sm: var(--tinyrack-switch-height-sm);',
    );

    expect(daisyCss).toContain('.checkbox-sm, .radio-sm');
    expect(daisyCss).toContain(
      '--size: var(--tinyrack-selection-control-size-sm, 1.25rem);',
    );
    expect(daisyCss).toContain('.toggle-sm');
    expect(daisyCss).toContain('--size: var(--tinyrack-switch-height-sm, 1.25rem);');
    expect(daisyCss).toContain(
      '.toggle:checked, .toggle[aria-checked="true"], .toggle:has(> input:checked)',
    );
  });

  it('maps Tinyrack surface and feedback components into Mantine and daisyUI CSS', () => {
    const mantineCss = createTinyrackThemeCssFiles()['mantine/styles.css'];
    const daisyCss = createTinyrackThemeCssFiles()['tailwind/daisyui.css'];

    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Alert-root');
    expect(mantineCss).toContain('--alert-bg: var(--tinyrack-surface-muted);');
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Card-root');
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Divider-root');
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Fieldset-root');
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Progress-root');
    expect(mantineCss).toContain(
      '--progress-size-sm: var(--tinyrack-progress-size-sm);',
    );
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Skeleton-root');

    expect(daisyCss).toContain('.alert');
    expect(daisyCss).toContain('.card');
    expect(daisyCss).toContain('.divider');
    expect(daisyCss).toContain('.fieldset');
    expect(daisyCss).toContain('.progress-sm');
    expect(daisyCss).toContain('height: var(--tinyrack-progress-size-sm, 0.375rem);');
    expect(daisyCss).toContain('.skeleton');
  });

  it('maps Tinyrack visual status components into Mantine and daisyUI CSS', () => {
    const mantineCss = createTinyrackThemeCssFiles()['mantine/styles.css'];
    const daisyCss = createTinyrackThemeCssFiles()['tailwind/daisyui.css'];

    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Avatar-root');
    expect(mantineCss).toContain('--avatar-size-sm: var(--tinyrack-avatar-size-sm);');
    expect(mantineCss).toContain(
      '[data-mantine-color-scheme] .mantine-Indicator-indicator',
    );
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Loader-root');
    expect(mantineCss).toContain('--loader-size-sm: var(--tinyrack-loader-size-sm);');
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Rating-root');
    expect(mantineCss).toContain('--rating-size-sm: var(--tinyrack-rating-size-sm);');
    expect(mantineCss).toContain(
      '[data-mantine-color-scheme] .mantine-RingProgress-root',
    );

    expect(daisyCss).toContain('.avatar-sm > div');
    expect(daisyCss).toContain('height: var(--tinyrack-avatar-size-sm, 2rem);');
    expect(daisyCss).toContain('.indicator-sm .indicator-item');
    expect(daisyCss).toContain('.loading-sm');
    expect(daisyCss).toContain('height: var(--tinyrack-loader-size-sm, 1.25rem);');
    expect(daisyCss).toContain('.rating-sm');
    expect(daisyCss).toContain('--size: var(--tinyrack-rating-size-sm, 1.25rem);');
    expect(daisyCss).toContain('.radial-progress-sm');
    expect(daisyCss).toContain(
      '--size: var(--tinyrack-radial-progress-size-sm, 4rem);',
    );
  });

  it('maps Tinyrack navigation and data-display components into Mantine and daisyUI CSS', () => {
    const mantineCss = createTinyrackThemeCssFiles()['mantine/styles.css'];
    const daisyCss = createTinyrackThemeCssFiles()['tailwind/daisyui.css'];

    expect(mantineCss).toContain(
      '[data-mantine-color-scheme] .mantine-Breadcrumbs-root',
    );
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-List-root');
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Table-table');
    expect(mantineCss).toContain(
      '--table-horizontal-spacing: var(--tinyrack-table-padding-x-md);',
    );
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Tabs-root');
    expect(mantineCss).toContain('height: var(--tinyrack-tabs-height-md);');
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Timeline-root');
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Stepper-root');
    expect(mantineCss).toContain(
      '--stepper-icon-size-sm: var(--tinyrack-stepper-icon-size-sm);',
    );
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Slider-root');
    expect(mantineCss).toContain(
      '--slider-thumb-size-sm: var(--tinyrack-range-thumb-size-sm);',
    );

    expect(daisyCss).toContain('.breadcrumbs');
    expect(daisyCss).toContain('.list .list-row');
    expect(daisyCss).toContain('.table-sm :where(th, td)');
    expect(daisyCss).toContain(
      'padding-inline: var(--tinyrack-table-padding-x-sm, 0.75rem);',
    );
    expect(daisyCss).toContain('.tabs-sm > .tab');
    expect(daisyCss).toContain('height: var(--tinyrack-tabs-height-sm, 2rem);');
    expect(daisyCss).toContain('.timeline :where(hr)');
    expect(daisyCss).toContain('.steps .step-primary');
    expect(daisyCss).toContain('.range-sm');
    expect(daisyCss).toContain(
      '--range-thumb-size: var(--tinyrack-range-thumb-size-sm, 1.25rem);',
    );
  });

  it('maps Tinyrack overlay components into Mantine and daisyUI CSS', () => {
    const mantineCss = createTinyrackThemeCssFiles()['mantine/styles.css'];
    const daisyCss = createTinyrackThemeCssFiles()['tailwind/daisyui.css'];

    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Menu-dropdown');
    expect(mantineCss).toContain('background-color: var(--tinyrack-menu-background);');
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Modal-content');
    expect(mantineCss).toContain('[data-mantine-color-scheme] .mantine-Drawer-content');
    expect(mantineCss).toContain(
      '[data-mantine-color-scheme] .mantine-Tooltip-tooltip',
    );
    expect(mantineCss).toContain('padding-inline: var(--tinyrack-tooltip-padding-x);');

    expect(daisyCss).toContain('.menu, .dropdown-content.menu');
    expect(daisyCss).toContain(
      '--menu-active-bg: var(--tinyrack-menu-active-background);',
    );
    expect(daisyCss).toContain('.modal-box');
    expect(daisyCss).toContain('.drawer-side > :not(.drawer-overlay)');
    expect(daisyCss).toContain(
      '.tooltip > .tooltip-content, .tooltip[data-tip]::before',
    );
    expect(daisyCss).toContain(
      'background-color: var(--tinyrack-tooltip-background, var(--color-primary));',
    );
  });

  it('hardens Mantine generated CSS against low-contrast light states', () => {
    const css = createTinyrackThemeCssFiles()['mantine/styles.css'];

    expect(css).toContain('--mantine-color-disabled-color: #737373 !important;');
    expect(css).toContain('--tinyrack-mantine-stepper-outline-color: #e5e5e5;');
    expect(css).toContain(
      '--stepper-outline-color: var(--tinyrack-stepper-inactive-color);',
    );
    expect(css).toContain('background-color: var(--tinyrack-stepper-inactive-color);');
    expect(css).toContain(
      '[data-mantine-color-scheme] .mantine-SegmentedControl-label:not([data-active]):not([data-disabled]) .mantine-SegmentedControl-innerLabel',
    );
    expect(css).toContain(
      '[data-mantine-color-scheme] .mantine-SegmentedControl-label[data-active] .mantine-SegmentedControl-innerLabel',
    );
  });
});
