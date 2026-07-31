import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const flutterSource = resolve(root, 'packages/tinyrack_ui/lib/src');
const styleFiles = [
  ...readdirSync(join(flutterSource, 'components'))
    .filter((file) => file.endsWith('.dart'))
    .map((file) => join(flutterSource, 'components', file)),
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

test('the canonical token source covers Flutter component metrics', () => {
  const tokens = JSON.parse(
    readFileSync(resolve(root, 'design-tokens/tokens.json'), 'utf8'),
  ) as {
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
    { sm: '1rem', md: '1rem', lg: '1.5rem' },
  );
  assert.deepEqual(tokens.spinnerMetrics, {
    sizeSm: '1rem',
    sizeMd: '1.25rem',
    sizeLg: '1.75rem',
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
    normalLine: { sm: '18px', md: '20px' },
    textField: {
      paddingInlineCorrection: '0.25rem',
      paddingBlockCorrection: '0.1875rem',
    },
  });
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
