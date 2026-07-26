/**
 * Generates the Korean lockup from outlined IBM Plex Sans KR SemiBold.
 *
 * The logo rules forbid typesetting the wordmark as live text, so the Korean
 * wordmark has to ship as outline paths exactly like the Latin one. Doing it
 * by hand would be unreproducible, so this script derives it from the licensed
 * font and the geometry of the existing Latin lockup.
 *
 *   pnpm --filter @tinyrack/ui generate:wordmark          # write
 *   pnpm --filter @tinyrack/ui generate:wordmark --check  # verify committed output
 */

import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import opentype from 'opentype.js';

const require = createRequire(import.meta.url);
const brandRoot = join(process.cwd(), 'src/brand');
const checkOnly = process.argv.includes('--check');

/** The Korean brand name. Must match SITE_TITLES.ko on consuming sites. */
const WORDMARK_TEXT = '타이니랙';

/**
 * Geometry shared with `tinyrack-lockup.svg`, which is the reference artwork.
 * The mark is a 32-unit square inset by 3 on a 38-tall canvas, so its ink band
 * runs y 6..32 and its optical centre is y 19.
 */
const CANVAS_HEIGHT = 38;
const MARK_INSET = 3;
const MARK_SIZE = 32;
const MARK_INK_TOP = 6;
const MARK_INK_BOTTOM = 32;
/** Gap between the mark's right edge and the first glyph, from the Latin lockup. */
const WORDMARK_GAP = 5.4;
/** Latin cap height. The Korean ink band is matched to it so the two lockups
 *  read at the same weight when placed side by side. */
const TARGET_INK_HEIGHT = 19.54;
/** Right padding, measured from the Latin lockup (156 − 151.7). */
const RIGHT_PADDING = 4.3;

const COLORS = { inverse: '#fafafa', primary: '#0a0a0a' } as const;

function resolveKoreanFont(): string {
  // The package has no main entry, so resolve a known file and walk up.
  const cssPath = require.resolve('@fontsource/ibm-plex-sans-kr/korean-600.css');
  return join(dirname(cssPath), 'files/ibm-plex-sans-kr-korean-600-normal.woff');
}

async function buildWordmarkPath() {
  const file = await readFile(resolveKoreanFont());
  const font = opentype.parse(
    file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength),
  );

  for (const character of WORDMARK_TEXT) {
    if (font.charToGlyph(character).index === 0) {
      throw new Error(`Font subset is missing a glyph for "${character}"`);
    }
  }

  // Measure at a nominal size, then scale so the inked height matches the
  // Latin cap height. Korean has no cap/x-height split, so the ink box is the
  // only meaningful reference.
  const probeSize = 100;
  const probe = font.getPath(WORDMARK_TEXT, 0, 0, probeSize).getBoundingBox();
  const scale = TARGET_INK_HEIGHT / (probe.y2 - probe.y1);
  const fontSize = probeSize * scale;

  const inkLeft = probe.x1 * scale;
  const inkTop = probe.y1 * scale;
  const inkWidth = (probe.x2 - probe.x1) * scale;

  // Left-align the ink to the gap, and centre the ink band on the mark's.
  const markCentre = (MARK_INK_TOP + MARK_INK_BOTTOM) / 2;
  const originX = MARK_INSET + MARK_SIZE + WORDMARK_GAP - inkLeft;
  const originY = markCentre - TARGET_INK_HEIGHT / 2 - inkTop;

  const path = font.getPath(WORDMARK_TEXT, originX, originY, fontSize);
  const width =
    Math.round(
      (MARK_INSET + MARK_SIZE + WORDMARK_GAP + inkWidth + RIGHT_PADDING) * 10,
    ) / 10;

  return { pathData: path.toPathData(3), width };
}

async function readMarkPath(): Promise<string> {
  const mark = await readFile(join(brandRoot, 'tinyrack-mark.svg'), 'utf8');
  const match = /<path[^>]*\sd="([^"]+)"/.exec(mark);
  if (match?.[1] === undefined) {
    throw new Error('Could not read the mark path from tinyrack-mark.svg');
  }
  return match[1];
}

function renderLockup({
  fill,
  markPath,
  wordmarkPath,
  width,
}: {
  fill: string;
  markPath: string;
  wordmarkPath: string;
  width: number;
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${CANVAS_HEIGHT}" role="img" aria-labelledby="tinyrack-lockup-ko-title tinyrack-lockup-ko-description">
  <title id="tinyrack-lockup-ko-title">타이니랙</title>
  <desc id="tinyrack-lockup-ko-description">Tinyrack rack mark and Korean wordmark</desc>
  <g fill="${fill}">
    <path fill-rule="evenodd" transform="translate(${MARK_INSET} ${MARK_INSET})" d="${markPath}"/>
    <path d="${wordmarkPath}"/>
  </g>
</svg>
`;
}

const { pathData, width } = await buildWordmarkPath();
const markPath = await readMarkPath();

const outputs = [
  ['tinyrack-lockup-ko.svg', COLORS.primary],
  ['tinyrack-lockup-ko-inverse.svg', COLORS.inverse],
] as const;

let stale = false;
for (const [name, fill] of outputs) {
  const svg = renderLockup({ fill, markPath, wordmarkPath: pathData, width });
  const target = join(brandRoot, name);

  if (checkOnly) {
    const existing = await readFile(target, 'utf8').catch(() => '');
    if (existing !== svg) {
      console.error(`Generated wordmark is stale: ${name}`);
      stale = true;
    }
    continue;
  }

  await writeFile(target, svg, 'utf8');
  console.log(`wrote ${name} (${width} x ${CANVAS_HEIGHT})`);
}

if (stale) {
  process.exitCode = 1;
} else if (checkOnly) {
  console.log('Korean lockup is up to date.');
}
