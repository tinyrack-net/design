import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { loadDesignTokens } from './design-token-source.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const flutterSource = resolve(root, 'packages/ui_flutter/lib/src');
function dartFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return dartFiles(path);
    return entry.isFile() && entry.name.endsWith('.dart') ? [path] : [];
  });
}

const styleFiles = [
  ...dartFiles(join(flutterSource, 'components')),
  // Shared chrome resolvers pick real design values too, so they are held to
  // the same no-literals rule as the components that call them.
  ...dartFiles(join(flutterSource, 'internal')),
  join(flutterSource, 'theme.dart'),
];

const forbiddenStyleLiterals = [
  {
    label: 'numeric corner radius',
    pattern: /Radius\.circular\(\s*-?\d/u,
  },
  {
    label: 'literal font weight',
    pattern: /FontWeight\.w\d+/u,
  },
  {
    label: 'literal packaged font family',
    pattern: /fontFamily:\s*'packages\/tinyrack_ui\//u,
  },
  {
    label: 'literal color',
    pattern: /Color\(0x[0-9a-f]+\)/iu,
  },
  {
    label: 'numeric style property',
    pattern:
      /(?:fontSize|height|letterSpacing|strokeWidth|opacity|dimension|horizontal|vertical|top|bottom|left|right|width)\s*:\s*-?\d/u,
  },
] as const;

test('Flutter components consume generated tokens for design values', () => {
  const violations: string[] = [];
  for (const file of styleFiles) {
    const source = readFileSync(file, 'utf8');
    for (const rule of forbiddenStyleLiterals) {
      if (rule.pattern.test(source)) {
        violations.push(`${file}: ${rule.label}`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test('the canonical token source covers Flutter component metrics', async () => {
  const tokens = (await loadDesignTokens(root, 'flutter')) as {
    controlMetrics: Record<string, { iconSize?: string }>;
    flutterRenderingMetrics?: {
      alert?: { cjkDescriptionLineHeight?: number };
      card?: { blockInsetCorrection?: string };
      textField?: {
        paddingBlockCorrection?: string;
        paddingInlineCorrection?: string;
      };
    };
    spinnerMetrics?: {
      strokeWidth?: string;
      trackOpacity?: string;
    };
  };

  assert.deepEqual(
    Object.fromEntries(
      Object.entries(tokens.controlMetrics).map(([size, metrics]) => [
        size,
        metrics.iconSize,
      ]),
    ),
    { sm: '0.875rem', md: '1rem', lg: '1rem' },
  );
  assert.deepEqual(tokens.spinnerMetrics, {
    sizeSm: '0.75rem',
    sizeMd: '1rem',
    sizeLg: '1.25rem',
    strokeWidth: '0.125rem',
    trackOpacity: '24%',
  });
  assert.deepEqual(tokens.flutterRenderingMetrics, {
    accordionHeader: { marginBlock: '18.72px' },
    fontFamily: {
      body: 'packages/tinyrack_ui/IBMPlexSans',
      mono: 'packages/tinyrack_ui/IBMPlexMono',
      fallbackKr: 'packages/tinyrack_ui/IBMPlexSansKR',
      fallbackJp: 'packages/tinyrack_ui/IBMPlexSansJP',
    },
    alert: { cjkDescriptionLineHeight: 1.45 },
    card: { blockInsetCorrection: '0.296875px' },
    code: { inlineLineHeight: 1.25 },
    normalLine: { sm: '18px', md: '20px', lg: '23px' },
    textField: {
      paddingInlineCorrection: '0.25rem',
      paddingBlockCorrection: '0.1875rem',
    },
    textTracking: {
      bodyRegularEn: 0.1784,
      bodyStrongEn: 0.0392,
      bodySmBoldEn: -0.1832,
      bodySmNonStrongKo: -0.5893,
      bodySmStrongEn: -0.1665,
      bodySmStrongJa: 0.0001,
      bodySmStrongKo: -0.442,
      captionBoldEn: 0.1144,
      captionNonStrongKo: 0.3519,
      captionStrongEn: 0.1344,
      captionStrongKo: 0.4186,
      codeNonStrongEn: -0.44,
      codeNonStrongKo: -0.6213,
      codeStrongEn: -0.42,
      codeStrongKo: -0.5546,
      displayNonStrongKo: -0.3759,
      displayMediumEn: 0.1181,
      displayRegularEn: -0.2844,
      displayStrongEn: 0.0729,
      displayLgBoldEn: -0.1328,
      headingLgRegularEn: 0.197,
      headingLgStrongEn: -0.044,
      headingLgStrongKo: 0.28,
      headingMdRegularEn: 0.1176,
      headingMdStrongEn: 0.0488,
      headingSmStrongEn: -0.0583,
      labelBoldEn: 1.0746,
      labelNonStrongKo: 1.3132,
      labelStrongEn: 1.0642,
      labelStrongKo: 1.2249,
    },
    windowFrame: {
      bodyLineHeight: '18.9px',
      browserTitleBarHeight: '41.59375px',
      controlClose: '#ff5f57',
      controlMinimize: '#febc2e',
      controlMaximize: '#28c840',
    },
    layerComponents: {
      anchorGap: '0.5rem',
      menuItemHeight: '1.75rem',
      optionItemHeight: '1.75rem',
      toastWidth: '24rem',
      drawerWidth: '32rem',
      navigationPanelWidth: '32rem',
      toolbarHeight: '2.5rem',
      treeItemHeight: '2rem',
      visuallyHiddenOpacity: 0,
      numberStepWidth: '2.75rem',
      sliderTrackThickness: '0.25rem',
      sliderVerticalWidth: '4.6875rem',
      appShellSmBreakpoint: '48rem',
      appShellLgBreakpoint: '64rem',
      appShellSidebarWidth: '18rem',
      appShellRailWidth: '4rem',
      appShellCollapsedWidth: 0,
      appShellHeaderHeight: '3rem',
    },
  });
});

test('the resolver keeps platform-only token surfaces separate', async () => {
  const web = (await loadDesignTokens(root, 'web')) as {
    breakpoints: Record<string, string>;
    spacing: Record<string, string>;
  };
  const flutter = (await loadDesignTokens(root, 'flutter')) as {
    breakpoints: Record<string, string>;
    spacing: Record<string, string>;
  };

  assert.deepEqual(web.breakpoints, {
    sm: '40rem',
    md: '48rem',
    lg: '64rem',
    xl: '80rem',
  });
  assert.deepEqual(flutter.breakpoints, {
    sm: '40rem',
    xl: '80rem',
  });
  assert.equal(web.spacing['4xl'], undefined);
  assert.equal(flutter.spacing['4xl'], '4rem');
});

test('the Dart generator exposes every Flutter style category', () => {
  const generated = readFileSync(
    join(flutterSource, 'generated', 'tokens.g.dart'),
    'utf8',
  );
  for (const symbol of [
    'TRGeneratedBorders',
    'TRGeneratedControlMetrics',
    'TRGeneratedFlutterRendering',
    'TRGeneratedFontFamilies',
    'TRGeneratedFontWeights',
    'TRGeneratedMeasurements',
    'TRGeneratedSpinnerMetrics',
    'TRGeneratedSpinnerOpacity',
    'TRGeneratedTypographyLineHeights',
    'TRGeneratedTypographyTracking',
  ]) {
    assert.match(generated, new RegExp(`class ${symbol}\\b`, 'u'));
  }
});
