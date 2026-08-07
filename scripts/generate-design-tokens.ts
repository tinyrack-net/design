import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDesignTokens } from './design-token-source.ts';

type TokenPrimitive = number | string;
type TokenRecord = Record<string, TokenPrimitive>;

type ControlMetrics = {
  fontSize: string;
  gap: string;
  height: string;
  iconSize: string;
  lineHeight: string;
  paddingInline: string;
};

type TextStyleToken = {
  fontSize: string;
  fontWeight: string;
  letterSpacing: string;
  lineHeight: string;
};

type DesignTokens = {
  borders: {
    focus: { offset: string; width: string };
    width: TokenRecord;
  };
  breakpoints: TokenRecord;
  componentColors: TokenRecord;
  controlMetrics: Record<string, ControlMetrics>;
  flutterRenderingMetrics: {
    accordionHeader: { marginBlock: string };
    alert: { cjkDescriptionLineHeight: number };
    card: { blockInsetCorrection: string };
    code: { inlineLineHeight: number };
    normalLine: { lg: string; md: string; sm: string };
    fontFamily: {
      body: string;
      fallbackJp: string;
      fallbackKr: string;
      mono: string;
    };
    textField: {
      paddingBlockCorrection: string;
      paddingInlineCorrection: string;
    };
    textTracking: Record<string, number>;
    windowFrame: {
      bodyLineHeight: string;
      browserTitleBarHeight: string;
      controlClose: string;
      controlMaximize: string;
      controlMinimize: string;
    };
    layerComponents: TokenRecord;
  };
  layers: TokenRecord;
  measurements: TokenRecord;
  motion: {
    duration: TokenRecord;
    easing: { easeOut: string; linear: string; standard: string };
  };
  opacity: TokenRecord;
  palettes: Record<string, TokenRecord>;
  radii: TokenRecord;
  semanticColors: Record<'dark' | 'light', TokenRecord>;
  shadows: TokenRecord;
  spacing: TokenRecord;
  spinnerMetrics: {
    sizeLg: string;
    sizeMd: string;
    sizeSm: string;
    strokeWidth: string;
    trackOpacity: string;
  };
  typography: {
    fontFamily: TokenRecord;
    fontSize: TokenRecord;
    fontStack: TokenRecord;
    fontWeight: TokenRecord;
    letterSpacing: TokenRecord;
    lineHeight: TokenRecord;
    textStyle: Record<string, TextStyleToken>;
  };
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const typescriptPath = resolve(root, 'packages/ui_web/src/core/tokens.ts');
const cssPath = resolve(root, 'packages/ui_web/src/core/tokens.generated.css');
const coreCssPath = resolve(root, 'packages/ui_web/src/core/core.css');
const catalogPath = resolve(
  root,
  'packages/homepage/app/documentation/shared/tailwind-token-catalog.ts',
);
const dartPath = resolve(root, 'packages/ui_flutter/lib/src/generated/tokens.g.dart');
const check = process.argv.includes('--check');
const webOnly = process.argv.includes('--web-only');
const rawTokens: unknown = await loadDesignTokens(root, 'web');

function assertRecord(
  value: unknown,
  path: string,
): asserts value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
}

assertRecord(rawTokens, 'tokens');
for (const key of [
  'borders',
  'breakpoints',
  'componentColors',
  'controlMetrics',
  'layers',
  'measurements',
  'motion',
  'opacity',
  'palettes',
  'radii',
  'semanticColors',
  'shadows',
  'spacing',
  'spinnerMetrics',
  'typography',
]) {
  assertRecord(rawTokens[key], key);
}

let tokens = rawTokens as DesignTokens;

function kebab(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase();
}

function dartName(value: string) {
  const normalized = value.replace(/[^a-zA-Z0-9]+(.)/g, (_match, next: string) =>
    next.toUpperCase(),
  );
  return /^\d/.test(normalized) ? `size${normalized}` : normalized;
}

function dartNumber(value: unknown, path: string) {
  if (typeof value === 'number') return `${value}.0`;
  if (String(value) === '0') return '0.0';
  const match = String(value).match(/^(-?\d+(?:\.\d+)?)(rem|px)$/);
  if (!match) {
    throw new Error(`${path} has no Flutter dimension transform: ${value}`);
  }
  const amount = Number(match[1]) * (match[2] === 'rem' ? 16 : 1);
  return Number.isInteger(amount) ? `${amount}.0` : String(amount);
}

function dartScalar(value: unknown, path: string) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new Error(`${path} is not a finite number: ${value}`);
  }
  return Number.isInteger(number) ? `${number}.0` : String(number);
}

function dartPercentage(value: unknown, path: string) {
  const match = String(value).match(/^(-?\d+(?:\.\d+)?)%$/);
  if (!match) {
    throw new Error(`${path} is not a percentage: ${value}`);
  }
  return dartScalar(Number(match[1]) / 100, path);
}

function dartDuration(value: unknown, path: string) {
  const match = String(value).match(/^(\d+(?:\.\d+)?)(ms|s)$/);
  if (!match) throw new Error(`${path} is not a duration: ${value}`);
  const milliseconds = Number(match[1]) * (match[2] === 's' ? 1000 : 1);
  return `Duration(milliseconds: ${milliseconds})`;
}

function dartColor(value: unknown, path: string) {
  const match = String(value).match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (!match) throw new Error(`${path} is not a hex color: ${value}`);
  const rgb = match[1];
  const alpha = match[2] ?? 'ff';
  return `Color(0x${alpha}${rgb})`;
}

function dartFontWeight(value: unknown) {
  const weight = Number(value);
  const rounded = Math.max(100, Math.min(900, Math.round(weight / 100) * 100));
  return `FontWeight.w${rounded}`;
}

function dartTextStyles() {
  const families = tokens.flutterRenderingMetrics.fontFamily;
  return [
    'abstract final class TRGeneratedTextStyles {',
    ...Object.entries(tokens.typography.textStyle).flatMap(([name, style]) => {
      const fontSize = Number.parseFloat(
        dartNumber(
          tokens.typography.fontSize[style.fontSize],
          `typography.textStyle.${name}.fontSize`,
        ),
      );
      const height = Number(tokens.typography.lineHeight[style.lineHeight]);
      const tracking = tokens.typography.letterSpacing[style.letterSpacing];
      const trackingMatch = String(tracking).match(/^(-?\d+(?:\.\d+)?)(em)?$/);
      if (!trackingMatch) {
        throw new Error(
          `typography.textStyle.${name}.letterSpacing has no Flutter transform: ${tracking}`,
        );
      }
      const letterSpacing =
        Number(trackingMatch[1]) * (trackingMatch[2] === 'em' ? fontSize : 1);
      const family = name === 'code' ? families.mono : families.body;
      return [
        `  static const ${dartName(name)} = TextStyle(`,
        `    fontFamily: '${family}',`,
        `    fontSize: ${fontSize},`,
        `    fontWeight: ${dartFontWeight(tokens.typography.fontWeight[style.fontWeight])},`,
        `    height: ${height},`,
        `    letterSpacing: ${letterSpacing},`,
        '  );',
      ];
    }),
    '}',
  ].join('\n');
}

function dartShadows() {
  return [
    'abstract final class TRGeneratedShadows {',
    ...Object.entries(tokens.shadows).flatMap(([name, value]) => {
      const match = String(value).match(
        /^(-?(?:0|[\d.]+(?:rem|px))) (-?(?:0|[\d.]+(?:rem|px))) (-?(?:0|[\d.]+(?:rem|px))) (-?(?:0|[\d.]+(?:rem|px))) rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)$/,
      );
      if (!match) {
        throw new Error(`shadows.${name} has no Flutter shadow transform: ${value}`);
      }
      const alpha = Math.round(Number(match[8]) * 255)
        .toString(16)
        .padStart(2, '0');
      const rgb = [match[5], match[6], match[7]]
        .map((channel) => Number(channel).toString(16).padStart(2, '0'))
        .join('');
      return [
        `  static const ${dartName(name)} = BoxShadow(`,
        `    color: Color(0x${alpha}${rgb}),`,
        `    offset: Offset(${dartNumber(match[1], `shadows.${name}.x`)}, ${dartNumber(match[2], `shadows.${name}.y`)}),`,
        `    blurRadius: ${dartNumber(match[3], `shadows.${name}.blur`)},`,
        `    spreadRadius: ${dartNumber(match[4], `shadows.${name}.spread`)},`,
        '  );',
      ];
    }),
    '}',
  ].join('\n');
}

function typescriptOutput() {
  const exports: readonly (readonly [string, keyof DesignTokens])[] = [
    ['tinyrackBorders', 'borders'],
    ['tinyrackBreakpoints', 'breakpoints'],
    ['tinyrackComponentColors', 'componentColors'],
    ['tinyrackControlMetrics', 'controlMetrics'],
    ['tinyrackLayers', 'layers'],
    ['tinyrackMeasurements', 'measurements'],
    ['tinyrackMotion', 'motion'],
    ['tinyrackOpacity', 'opacity'],
    ['tinyrackPalettes', 'palettes'],
    ['tinyrackRadii', 'radii'],
    ['tinyrackSemanticColors', 'semanticColors'],
    ['tinyrackShadows', 'shadows'],
    ['tinyrackSpacing', 'spacing'],
    ['tinyrackSpinnerMetrics', 'spinnerMetrics'],
    ['tinyrackTypography', 'typography'],
  ];
  return [
    '// Generated by scripts/generate-design-tokens.ts. Do not edit.',
    '',
    ...exports.flatMap(([name, key]) => [
      `export const ${name} = ${JSON.stringify(tokens[key], null, 2)} as const;`,
      '',
    ]),
    'export type TRControlUiSize = keyof typeof tinyrackControlMetrics;',
    '',
  ].join('\n');
}

function declarations(object: TokenRecord, prefix: string) {
  return Object.entries(object).map(
    ([name, value]) => `  --tinyrack-${prefix}${kebab(name)}: ${value};`,
  );
}

function cssOutput() {
  const rootDeclarations = [
    ...declarations(tokens.typography.fontStack, 'font-'),
    ...declarations(tokens.typography.fontSize, 'text-'),
    ...declarations(tokens.typography.lineHeight, 'leading-'),
    ...declarations(tokens.typography.letterSpacing, 'tracking-'),
    ...declarations(tokens.typography.fontWeight, 'weight-'),
    ...declarations(tokens.spacing, 'space-'),
    ...declarations(tokens.radii, 'radius-'),
    ...declarations(tokens.borders.width, 'border-width-'),
    `  --tinyrack-focus-width: ${tokens.borders.focus.width};`,
    `  --tinyrack-focus-offset: ${tokens.borders.focus.offset};`,
    ...declarations(tokens.shadows, 'shadow-'),
    ...declarations(tokens.motion.duration, 'duration-'),
    `  --tinyrack-ease-standard: ${tokens.motion.easing.standard};`,
    `  --tinyrack-ease-out: ${tokens.motion.easing.easeOut};`,
    `  --tinyrack-ease-linear: ${tokens.motion.easing.linear};`,
    ...declarations(tokens.opacity, 'opacity-'),
    ...declarations(tokens.layers, 'layer-'),
    ...declarations(tokens.componentColors, ''),
  ];

  for (const [size, metrics] of Object.entries(tokens.controlMetrics)) {
    rootDeclarations.push(
      `  --tinyrack-control-height-${size}: ${metrics.height};`,
      `  --tinyrack-control-padding-inline-${size}: ${metrics.paddingInline};`,
      `  --tinyrack-control-gap-${size}: ${metrics.gap};`,
      `  --tinyrack-control-font-size-${size}: var(--tinyrack-text-${metrics.fontSize});`,
      `  --tinyrack-control-line-height-${size}: ${metrics.lineHeight};`,
    );
  }

  rootDeclarations.push(
    ...declarations(tokens.measurements, ''),
    ...declarations(
      Object.fromEntries(
        Object.entries(tokens.spinnerMetrics)
          .filter(([key]) => key.startsWith('size'))
          .map(([key, value]) => [key.slice(4), value]),
      ),
      'spinner-size-',
    ),
    `  --tinyrack-spinner-stroke-width: ${tokens.spinnerMetrics.strokeWidth};`,
    `  --tinyrack-spinner-track-opacity: ${tokens.spinnerMetrics.trackOpacity};`,
  );

  const theme = (mode: 'dark' | 'light') => [
    `[data-theme="tinyrack-${mode}"] {`,
    `  color-scheme: ${mode};`,
    ...declarations(tokens.semanticColors[mode], ''),
    '}',
  ];

  return [
    '/* Generated by scripts/generate-design-tokens.ts. Do not edit. */',
    ':root {',
    ...rootDeclarations,
    '}',
    '',
    ...theme('light'),
    '',
    ...theme('dark'),
    '',
  ].join('\n');
}

type TailwindEntry = {
  group: string;
  runtimeVariable?: string;
  themeVariable: string;
  value?: string;
};

function tailwindEntries(): TailwindEntry[] {
  const entries: TailwindEntry[] = [];
  const add = (group: string, themeVariable: string, runtimeVariable: string) =>
    entries.push({ group, runtimeVariable, themeVariable });
  for (const [name, value] of Object.entries(tokens.breakpoints)) {
    entries.push({
      group: 'breakpoint',
      themeVariable: `--breakpoint-${name}`,
      value: String(value),
    });
  }
  for (const name of Object.keys(tokens.typography.fontStack))
    add(
      'typography',
      `--font-tinyrack-${kebab(name)}`,
      `--tinyrack-font-${kebab(name)}`,
    );
  const leadingForSize: Record<string, string> = {
    '2xs': 'sm',
    xs: 'sm',
    sm: 'md',
    md: 'md',
    lg: 'md',
    xl: 'sm',
    '2xl': 'sm',
    '3xl': 'sm',
    '4xl': 'sm',
    '5xl': 'sm',
    '6xl': 'xs',
  };
  for (const name of Object.keys(tokens.typography.fontSize)) {
    add('typography', `--text-tinyrack-${name}`, `--tinyrack-text-${name}`);
    add(
      'typography',
      `--text-tinyrack-${name}--line-height`,
      `--tinyrack-leading-${leadingForSize[name]}`,
    );
  }
  for (const name of Object.keys(tokens.typography.lineHeight))
    add('typography', `--leading-tinyrack-${name}`, `--tinyrack-leading-${name}`);
  for (const size of Object.keys(tokens.controlMetrics)) {
    add(
      'typography',
      `--text-tinyrack-control-${size}`,
      `--tinyrack-control-font-size-${size}`,
    );
    add(
      'typography',
      `--text-tinyrack-control-${size}--line-height`,
      `--tinyrack-control-line-height-${size}`,
    );
    add(
      'typography',
      `--leading-tinyrack-control-${size}`,
      `--tinyrack-control-line-height-${size}`,
    );
  }
  for (const name of Object.keys(tokens.typography.letterSpacing))
    add('typography', `--tracking-tinyrack-${name}`, `--tinyrack-tracking-${name}`);
  for (const name of Object.keys(tokens.typography.fontWeight))
    add('typography', `--font-weight-tinyrack-${name}`, `--tinyrack-weight-${name}`);
  for (const name of Object.keys(tokens.spacing))
    add('spacing', `--spacing-tinyrack-${name}`, `--tinyrack-space-${name}`);
  for (const [size] of Object.entries(tokens.controlMetrics)) {
    for (const metric of ['height', 'padding-inline', 'gap'])
      add(
        'spacing',
        `--spacing-tinyrack-control-${metric}-${size}`,
        `--tinyrack-control-${metric}-${size}`,
      );
  }
  for (const name of Object.keys(tokens.measurements)) {
    const value = String(tokens.measurements[name]);
    if (
      [
        'overlay-closed-scale',
        'text-decoration-thickness',
        'text-underline-offset',
      ].includes(name) ||
      !/(?:px|rem)$/u.test(value)
    )
      continue;
    add('spacing', `--spacing-tinyrack-${name}`, `--tinyrack-${name}`);
    if (name.startsWith('measure-'))
      add('container', `--container-tinyrack-${name}`, `--tinyrack-${name}`);
    if (name.startsWith('overlay-width-'))
      add(
        'container',
        `--container-tinyrack-overlay-${name.slice('overlay-width-'.length)}`,
        `--tinyrack-${name}`,
      );
  }
  for (const size of ['sm', 'md', 'lg'] as const) {
    const key = ({ sm: 'sizeSm', md: 'sizeMd', lg: 'sizeLg' } as const)[size];
    if (tokens.spinnerMetrics[key])
      add(
        'spacing',
        `--spacing-tinyrack-spinner-size-${size}`,
        `--tinyrack-spinner-size-${size}`,
      );
  }
  add(
    'spacing',
    '--spacing-tinyrack-spinner-stroke-width',
    '--tinyrack-spinner-stroke-width',
  );
  for (const name of Object.keys(tokens.borders.width))
    add(
      'border-focus',
      `--border-width-tinyrack-${name}`,
      `--tinyrack-border-width-${name}`,
    );
  add('border-focus', '--outline-width-tinyrack-focus', '--tinyrack-focus-width');
  add('border-focus', '--outline-offset-tinyrack-focus', '--tinyrack-focus-offset');
  for (const name of Object.keys(tokens.radii))
    add('radius', `--radius-tinyrack-${name}`, `--tinyrack-radius-${name}`);
  for (const name of Object.keys(tokens.shadows))
    add('shadow', `--shadow-tinyrack-${name}`, `--tinyrack-shadow-${name}`);
  for (const name of Object.keys(tokens.motion.duration))
    add(
      'motion',
      `--transition-duration-tinyrack-${name}`,
      `--tinyrack-duration-${name}`,
    );
  for (const name of Object.keys(tokens.motion.easing)) {
    add(
      'motion',
      `--ease-tinyrack-${kebab(name)}`,
      `--tinyrack-ease-${name === 'easeOut' ? 'out' : kebab(name)}`,
    );
  }
  for (const name of Object.keys(tokens.opacity))
    add('opacity', `--opacity-tinyrack-${name}`, `--tinyrack-opacity-${name}`);
  add(
    'opacity',
    '--opacity-tinyrack-spinner-track',
    '--tinyrack-spinner-track-opacity',
  );
  for (const name of Object.keys(tokens.layers))
    add('layer', `--z-index-tinyrack-${name}`, `--tinyrack-layer-${name}`);
  add('scale', '--scale-tinyrack-overlay-closed', '--tinyrack-overlay-closed-scale');
  if (tokens.measurements['text-decoration-thickness'])
    add(
      'decoration',
      '--text-decoration-thickness-tinyrack',
      '--tinyrack-text-decoration-thickness',
    );
  if (tokens.measurements['text-underline-offset'])
    add(
      'decoration',
      '--text-underline-offset-tinyrack',
      '--tinyrack-text-underline-offset',
    );
  for (const name of Object.keys(tokens.semanticColors.light))
    add('color', `--color-tinyrack-${kebab(name)}`, `--tinyrack-${kebab(name)}`);
  return entries;
}

function coreCssOutput() {
  return [
    '/* Generated by scripts/generate-design-tokens.ts. Do not edit. */',
    '@import "./tokens.generated.css";',
    '',
    ':where(html, body) {',
    '  background-color: var(--tinyrack-surface);',
    '  color: var(--tinyrack-text);',
    '}',
    '',
    '@theme static {',
    ...tailwindEntries().map(
      (entry) =>
        `  ${entry.themeVariable}: ${entry.runtimeVariable ? `var(${entry.runtimeVariable})` : entry.value};`,
    ),
    '}',
    '',
  ].join('\n');
}

function catalogOutput() {
  const groups = [
    ['breakpoint', 'breakpoints', 'breakpoints', 'Breakpoints', 'sm/md/lg:*'],
    ['color', 'colors', 'colors', 'Color', 'bg/text/border-tinyrack-*'],
    [
      'typography',
      'typography',
      'typography',
      'Typography',
      'font/text/leading/tracking-tinyrack-*',
    ],
    [
      'spacing',
      'spacing-controls',
      'spacing',
      'Spacing and controls',
      'gap/p/m/w/h-tinyrack-*',
    ],
    ['container', 'containers', 'breakpoints', 'Containers', 'max-w-tinyrack-*'],
    [
      'border-focus',
      'borders-focus',
      'radius',
      'Borders and focus',
      'border/outline/outline-offset-tinyrack-*',
    ],
    ['radius', 'radius', 'radius', 'Radius', 'rounded-tinyrack-*'],
    ['shadow', 'shadows', 'elevation', 'Shadows', 'shadow-tinyrack-*'],
    ['motion', 'motion', 'motion', 'Motion', 'duration/ease-tinyrack-*'],
    ['opacity', 'opacity', 'colors', 'Opacity', 'opacity-tinyrack-*'],
    ['layer', 'layers', 'elevation', 'Layers', 'z-tinyrack-*'],
    ['scale', 'scale', 'motion', 'Scale', 'scale-tinyrack-*'],
    [
      'decoration',
      'decoration',
      'typography',
      'Text decoration',
      'decoration/underline-offset-tinyrack',
    ],
  ].map(([id, anchor, guide, label, utilityPattern]) => ({
    id,
    anchor,
    guide,
    label,
    utilityPattern,
  }));
  return [
    '// Generated by scripts/generate-design-tokens.ts. Do not edit.',
    'export type TailwindTokenGroupId =',
    ...groups.map(
      (group, index) =>
        `  ${index ? '| ' : '| '}'${group.id}'${index === groups.length - 1 ? ';' : ''}`,
    ),
    '',
    'export type TailwindTokenBridgeEntry =',
    `  | { group: Exclude<TailwindTokenGroupId, 'breakpoint'>; runtimeVariable: \`--tinyrack-\${string}\`; themeVariable: \`--\${string}\` }`,
    `  | { group: 'breakpoint'; themeVariable: \`--breakpoint-\${string}\`; value: \`\${number}rem\` };`,
    '',
    `export const tailwindTokenGroups = ${JSON.stringify(groups, null, 2)} as const;`,
    '',
    `export const tailwindTokenBridge = ${JSON.stringify(tailwindEntries(), null, 2)} as const satisfies readonly TailwindTokenBridgeEntry[];`,
    '',
  ].join('\n');
}

function dartFields(names: readonly string[]) {
  return names.map((name) => `    required this.${dartName(name)},`).join('\n');
}

function dartColorTheme() {
  const names = Object.keys(tokens.semanticColors.light);
  return [
    'final class TRGeneratedColorTheme {',
    '  const TRGeneratedColorTheme({',
    dartFields(names),
    '  });',
    '',
    ...names.map((name) => `  final Color ${dartName(name)};`),
    '}',
    '',
    'abstract final class TRGeneratedColors {',
    ...(['light', 'dark'] as const).flatMap((mode) => [
      `  static const ${mode} = TRGeneratedColorTheme(`,
      ...names.map(
        (name) =>
          `    ${dartName(name)}: ${dartColor(tokens.semanticColors[mode][name], `semanticColors.${mode}.${name}`)},`,
      ),
      '  );',
      '',
    ]),
    '}',
  ].join('\n');
}

function dartConstClass(
  name: string,
  values: TokenRecord,
  convert: (value: unknown, path: string) => string,
) {
  return [
    `abstract final class ${name} {`,
    ...Object.entries(values).map(([key, value]) => {
      const declaration = `  static const double ${dartName(key)} = ${convert(value, `${name}.${key}`)};`;
      return declaration.length <= 80
        ? declaration
        : declaration.replace(' = ', ' =\n      ');
    }),
    '}',
  ].join('\n');
}

function dartOutput() {
  const fontSizes = tokens.typography.fontSize;
  const fontWeights = tokens.typography.fontWeight;
  const lineHeights = tokens.typography.lineHeight;
  const letterSpacing = tokens.typography.letterSpacing;
  const controlSizes = Object.entries(tokens.controlMetrics).flatMap(
    ([size, metrics]) => [
      [`${size}Height`, metrics.height],
      [`${size}PaddingInline`, metrics.paddingInline],
      [`${size}Gap`, metrics.gap],
      [`${size}FontSize`, tokens.typography.fontSize[metrics.fontSize]],
      [`${size}LineHeight`, metrics.lineHeight],
      [`${size}IconSize`, metrics.iconSize],
    ],
  );
  const flutterMetrics = tokens.flutterRenderingMetrics;
  const controlPressDistance = tokens.measurements['control-press-distance'];
  if (controlPressDistance === undefined) {
    throw new Error('measurements.control-press-distance is required.');
  }
  const skeletonRectangleHeight = tokens.measurements['measure-xs'];
  if (skeletonRectangleHeight === undefined) {
    throw new Error('measurements.measure-xs is required.');
  }
  const requiredLayerMeasurement = (name: string): TokenPrimitive => {
    const value = tokens.measurements[name];
    if (value === undefined) {
      throw new Error(`measurements.${name} is required.`);
    }
    return value;
  };
  const layerMeasurements = {
    measureXs: requiredLayerMeasurement('measure-xs'),
    measureSm: requiredLayerMeasurement('measure-sm'),
    measureMd: requiredLayerMeasurement('measure-md'),
    measureLg: requiredLayerMeasurement('measure-lg'),
    measureXl: requiredLayerMeasurement('measure-xl'),
    splitPaneMinExtent: requiredLayerMeasurement('split-pane-min-extent'),
    overlayWidthSm: requiredLayerMeasurement('overlay-width-sm'),
    overlayWidthMd: requiredLayerMeasurement('overlay-width-md'),
    overlayInlineInset: requiredLayerMeasurement('overlay-inline-inset'),
  };
  const overlayClosedScale = requiredLayerMeasurement('overlay-closed-scale');
  return [
    '// Generated by scripts/generate-design-tokens.ts. Do not edit.',
    "import 'package:flutter/material.dart';",
    '',
    dartColorTheme(),
    '',
    dartConstClass('TRGeneratedSpacing', tokens.spacing, dartNumber),
    '',
    dartConstClass('TRGeneratedRadii', tokens.radii, dartNumber),
    '',
    dartConstClass('TRGeneratedOpacity', tokens.opacity, dartScalar),
    '',
    dartConstClass('TRGeneratedTypographySizes', fontSizes, dartNumber),
    '',
    dartConstClass('TRGeneratedTypographyLineHeights', lineHeights, dartScalar),
    '',
    dartConstClass('TRGeneratedTypographyTracking', letterSpacing, (value, path) => {
      const match = String(value).match(/^(-?\d+(?:\.\d+)?)(em)?$/);
      if (!match) {
        throw new Error(`${path} is not a Flutter tracking ratio: ${value}`);
      }
      return dartScalar(match[1], path);
    }),
    '',
    dartTextStyles(),
    '',
    dartShadows(),
    '',
    'abstract final class TRGeneratedFontWeights {',
    ...Object.entries(fontWeights).map(
      ([key, value]) =>
        `  static const FontWeight ${dartName(key)} = ${dartFontWeight(value)};`,
    ),
    '}',
    '',
    dartConstClass(
      'TRGeneratedBorders',
      {
        ...Object.fromEntries(
          Object.entries(tokens.borders.width).map(([key, value]) => [
            `${key}Width`,
            value,
          ]),
        ),
        focusWidth: tokens.borders.focus.width,
        focusOffset: tokens.borders.focus.offset,
      },
      dartNumber,
    ),
    '',
    dartConstClass(
      'TRGeneratedMeasurements',
      {
        controlPressDistance,
        skeletonRectangleHeight,
        ...layerMeasurements,
        overlayClosedScale,
      },
      (value, path) =>
        path.endsWith('.overlayClosedScale')
          ? dartScalar(value, path)
          : dartNumber(value, path),
    ),
    '',
    dartConstClass('TRGeneratedBreakpoints', tokens.breakpoints, dartNumber),
    '',
    dartConstClass('TRGeneratedLayers', tokens.layers, dartScalar),
    '',
    dartConstClass(
      'TRGeneratedLayerMetrics',
      flutterMetrics.layerComponents,
      dartNumber,
    ),
    '',
    dartConstClass(
      'TRGeneratedControlMetrics',
      Object.fromEntries(controlSizes),
      dartNumber,
    ),
    '',
    dartConstClass(
      'TRGeneratedSpinnerMetrics',
      {
        sizeSm: tokens.spinnerMetrics.sizeSm,
        sizeMd: tokens.spinnerMetrics.sizeMd,
        sizeLg: tokens.spinnerMetrics.sizeLg,
        strokeWidth: tokens.spinnerMetrics.strokeWidth,
      },
      dartNumber,
    ),
    '',
    'abstract final class TRGeneratedSpinnerOpacity {',
    `  static const double track = ${dartPercentage(
      tokens.spinnerMetrics.trackOpacity,
      'spinnerMetrics.trackOpacity',
    )};`,
    '}',
    '',
    'abstract final class TRGeneratedFontFamilies {',
    `  static const String body = '${flutterMetrics.fontFamily.body}';`,
    `  static const String mono = '${flutterMetrics.fontFamily.mono}';`,
    '  static const List<String> fallback = [',
    `    '${flutterMetrics.fontFamily.fallbackKr}',`,
    `    '${flutterMetrics.fontFamily.fallbackJp}',`,
    '  ];',
    '}',
    '',
    'abstract final class TRGeneratedFlutterRendering {',
    `  static const double accordionHeaderMarginBlock = ${dartNumber(
      flutterMetrics.accordionHeader.marginBlock,
      'flutterRenderingMetrics.accordionHeader.marginBlock',
    )};`,
    `  static const double alertCjkDescriptionLineHeight = ${dartScalar(
      flutterMetrics.alert.cjkDescriptionLineHeight,
      'flutterRenderingMetrics.alert.cjkDescriptionLineHeight',
    )};`,
    `  static const double cardBlockInsetCorrection = ${dartNumber(
      flutterMetrics.card.blockInsetCorrection,
      'flutterRenderingMetrics.card.blockInsetCorrection',
    )};`,
    `  static const double codeInlineLineHeight = ${dartScalar(
      flutterMetrics.code.inlineLineHeight,
      'flutterRenderingMetrics.code.inlineLineHeight',
    )};`,
    `  static const double normalLineSm = ${dartNumber(
      flutterMetrics.normalLine.sm,
      'flutterRenderingMetrics.normalLine.sm',
    )};`,
    `  static const double normalLineMd = ${dartNumber(
      flutterMetrics.normalLine.md,
      'flutterRenderingMetrics.normalLine.md',
    )};`,
    `  static const double normalLineLg = ${dartNumber(
      flutterMetrics.normalLine.lg,
      'flutterRenderingMetrics.normalLine.lg',
    )};`,
    `  static const double textFieldPaddingInlineCorrection = ${dartNumber(
      flutterMetrics.textField.paddingInlineCorrection,
      'flutterRenderingMetrics.textField.paddingInlineCorrection',
    )};`,
    `  static const double textFieldPaddingBlockCorrection = ${dartNumber(
      flutterMetrics.textField.paddingBlockCorrection,
      'flutterRenderingMetrics.textField.paddingBlockCorrection',
    )};`,
    ...Object.entries(flutterMetrics.textTracking).map(
      ([key, value]) =>
        `  static const double textTracking${key[0]?.toUpperCase()}${key.slice(1)} = ${dartScalar(
          value,
          `flutterRenderingMetrics.textTracking.${key}`,
        )};`,
    ),
    `  static const double windowFrameBodyLineHeight = ${dartNumber(
      flutterMetrics.windowFrame.bodyLineHeight,
      'flutterRenderingMetrics.windowFrame.bodyLineHeight',
    )};`,
    `  static const double windowFrameBrowserTitleBarHeight = ${dartNumber(
      flutterMetrics.windowFrame.browserTitleBarHeight,
      'flutterRenderingMetrics.windowFrame.browserTitleBarHeight',
    )};`,
    `  static const Color windowFrameControlClose = ${dartColor(
      flutterMetrics.windowFrame.controlClose,
      'flutterRenderingMetrics.windowFrame.controlClose',
    )};`,
    `  static const Color windowFrameControlMinimize = ${dartColor(
      flutterMetrics.windowFrame.controlMinimize,
      'flutterRenderingMetrics.windowFrame.controlMinimize',
    )};`,
    `  static const Color windowFrameControlMaximize = ${dartColor(
      flutterMetrics.windowFrame.controlMaximize,
      'flutterRenderingMetrics.windowFrame.controlMaximize',
    )};`,
    '}',
    '',
    'abstract final class TRGeneratedMotion {',
    ...Object.entries(tokens.motion.duration).map(([key, value]) => {
      const declaration = `  static const Duration ${dartName(key)} = ${dartDuration(value, `motion.duration.${key}`)};`;
      return declaration.length <= 80
        ? declaration
        : declaration.replace(' = ', ' =\n      ');
    }),
    '  static const Curve standard = Curves.ease;',
    '  static const Curve easeOut = Curves.easeOut;',
    '  static const Curve linear = Curves.linear;',
    '}',
    '',
  ].join('\n');
}

async function emit(path: string, content: string) {
  let existing = '';
  try {
    existing = await readFile(path, 'utf8');
  } catch {}

  if (existing === content) return;
  if (check) {
    throw new Error(`${path} is not up to date; run pnpm tokens:generate`);
  }
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

async function formatDart(content: string) {
  const directory = await mkdtemp(join(tmpdir(), 'tinyrack-tokens-'));
  const path = join(directory, 'tokens.g.dart');
  try {
    await writeFile(path, content);
    const result =
      process.platform === 'win32'
        ? spawnSync(
            process.env['ComSpec'] ?? 'C:\\Windows\\System32\\cmd.exe',
            ['/d', '/s', '/c', 'dart', 'format', path],
            { stdio: 'ignore' },
          )
        : spawnSync('dart', ['format', path], { stdio: 'ignore' });
    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error('dart format failed for generated design tokens.');
    }
    return await readFile(path, 'utf8');
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}

async function formatBiome(content: string, extension: 'css' | 'ts') {
  const directory = await mkdtemp(join(root, '.tinyrack-tokens-'));
  const path = join(directory, `generated.${extension}`);
  try {
    await writeFile(path, content);
    const executable = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
    const result = spawnSync(executable, ['exec', 'biome', 'format', '--write', path], {
      stdio: 'ignore',
    });
    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error('Biome format failed for generated design tokens.');
    }
    return await readFile(path, 'utf8');
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}

const outputs = [
  emit(typescriptPath, await formatBiome(typescriptOutput(), 'ts')),
  emit(cssPath, await formatBiome(cssOutput(), 'css')),
  emit(coreCssPath, await formatBiome(coreCssOutput(), 'css')),
  emit(catalogPath, await formatBiome(catalogOutput(), 'ts')),
];
if (!webOnly) {
  tokens = (await loadDesignTokens(root, 'flutter')) as DesignTokens;
  outputs.push(emit(dartPath, await formatDart(dartOutput())));
}
await Promise.all(outputs);
