import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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
    terminal: {
      selectionOpacity: string;
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
  version: number;
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = resolve(root, 'design-tokens/tokens.json');
const typescriptPath = resolve(root, 'packages/ui_web/src/core/tokens.ts');
const cssPath = resolve(root, 'packages/ui_web/src/core/tokens.generated.css');
const dartPath = resolve(root, 'packages/ui_flutter/lib/src/generated/tokens.g.dart');
const check = process.argv.includes('--check');
const webOnly = process.argv.includes('--web-only');
const rawTokens: unknown = JSON.parse(await readFile(sourcePath, 'utf8'));

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
  'controlMetrics',
  'flutterRenderingMetrics',
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

if (rawTokens['version'] !== 1) {
  throw new Error(`Unsupported design token version: ${rawTokens['version']}`);
}
const tokens = rawTokens as DesignTokens;

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
    brandMarkSm: requiredLayerMeasurement('brand-mark-sm'),
    brandMarkMd: requiredLayerMeasurement('brand-mark-md'),
    brandMarkLg: requiredLayerMeasurement('brand-mark-lg'),
    measureXs: requiredLayerMeasurement('measure-xs'),
    measureSm: requiredLayerMeasurement('measure-sm'),
    measureMd: requiredLayerMeasurement('measure-md'),
    measureLg: requiredLayerMeasurement('measure-lg'),
    measureXl: requiredLayerMeasurement('measure-xl'),
    paneSm: requiredLayerMeasurement('pane-sm'),
    paneMd: requiredLayerMeasurement('pane-md'),
    splitPaneMinExtent: requiredLayerMeasurement('split-pane-min-extent'),
    readingWidthSm: requiredLayerMeasurement('reading-width-sm'),
    readingWidthMd: requiredLayerMeasurement('reading-width-md'),
    readingWidthLg: requiredLayerMeasurement('reading-width-lg'),
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
    `  static const double terminalSelectionOpacity = ${dartPercentage(
      flutterMetrics.terminal.selectionOpacity,
      'flutterRenderingMetrics.terminal.selectionOpacity',
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

const outputs = [emit(typescriptPath, typescriptOutput()), emit(cssPath, cssOutput())];
if (!webOnly) {
  outputs.push(emit(dartPath, await formatDart(dartOutput())));
}
await Promise.all(outputs);
