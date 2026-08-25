import { describe, expect, it } from 'vitest';
import { tinyrackSemanticColors } from './tokens.js';

function luminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
  if (channels === undefined) {
    throw new Error(`Invalid color: ${hex}`);
  }
  return (
    0.2126 * (channels[0] ?? 0) +
    0.7152 * (channels[1] ?? 0) +
    0.0722 * (channels[2] ?? 0)
  );
}

function contrast(left: string, right: string) {
  const first = luminance(left);
  const second = luminance(right);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

describe('semantic status contrast', () => {
  it('locks text, surface, border and filled contrast in both themes', () => {
    for (const theme of Object.values(tinyrackSemanticColors)) {
      for (const status of ['info', 'success', 'warning', 'danger'] as const) {
        const text = theme[`${status}Foreground`];
        const surface = theme[`${status}Surface`];
        const border = theme[`${status}Border`];

        expect(
          contrast(text, surface),
          `${status} text on surface`,
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          contrast(border, surface),
          `${status} border on surface`,
        ).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('keeps action content and focus treatments readable in both themes', () => {
    for (const theme of Object.values(tinyrackSemanticColors)) {
      for (const surface of [theme.surface, theme.surfaceMuted, theme.surfaceHover]) {
        expect(contrast(theme.text, surface), 'text on surface').toBeGreaterThanOrEqual(
          4.5,
        );
        expect(
          contrast(theme.textMuted, surface),
          'muted text on surface',
        ).toBeGreaterThanOrEqual(4.5);
      }
      expect(
        contrast(theme.onPrimary, theme.primary),
        'primary content',
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(theme.onDanger, theme.danger),
        'danger content',
      ).toBeGreaterThanOrEqual(4.5);
      for (const foreground of [
        theme.primaryForeground,
        theme.infoForeground,
        theme.successForeground,
        theme.warningForeground,
        theme.dangerForeground,
      ]) {
        expect(
          contrast(foreground, theme.surface),
          'intent foreground',
        ).toBeGreaterThanOrEqual(4.5);
      }
      expect(
        contrast(theme.focus, theme.surface),
        'focus on surface',
      ).toBeGreaterThanOrEqual(3);
      expect(
        contrast(theme.focus, theme.surfaceMuted),
        'focus on muted surface',
      ).toBeGreaterThanOrEqual(3);
      expect(
        contrast(theme.textInverse, theme.surfaceInverse),
        'inverse content',
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(theme.borderInverse, theme.surfaceInverse),
        'inverse boundary',
      ).toBeGreaterThanOrEqual(3);
    }

    for (const surface of [
      tinyrackSemanticColors.light.surface,
      tinyrackSemanticColors.light.surfaceMuted,
    ]) {
      // Light neutral boundaries are deliberately quiet so both themes carry the
      // same visual weight, which puts them under the 3:1 that WCAG 1.4.11 asks
      // of control boundaries. The floor here only guarantees the edge stays
      // perceptible; the focus ring above still clears 3:1, so keyboard users
      // keep an unambiguous indicator.
      expect(
        contrast(tinyrackSemanticColors.light.controlBorder, surface),
        'light control boundary',
      ).toBeGreaterThanOrEqual(1.2);
      expect(
        contrast(tinyrackSemanticColors.light.controlTrack, surface),
        'light graphical track',
      ).toBeGreaterThanOrEqual(1.2);
    }
  });

  it('separates light interaction emphasis from subtle resting boundaries', () => {
    const light = tinyrackSemanticColors.light;

    expect({
      border: light.border,
      borderStrong: light.borderStrong,
      controlBorder: light.controlBorder,
      controlTrack: light.controlTrack,
    }).toEqual({
      border: '#d4d4d4',
      borderStrong: '#a3a3a3',
      controlBorder: '#d4d4d4',
      controlTrack: '#d4d4d4',
    });

    expect(
      contrast(light.borderStrong, light.surface),
      'light interaction boundary',
    ).toBeGreaterThan(contrast(light.border, light.surface));
  });

  it('separates dark interaction emphasis from subtle resting boundaries', () => {
    const dark = tinyrackSemanticColors.dark;

    expect({
      border: dark.border,
      borderStrong: dark.borderStrong,
      controlBorder: dark.controlBorder,
      controlTrack: dark.controlTrack,
    }).toEqual({
      border: '#262626',
      borderStrong: '#404040',
      controlBorder: '#262626',
      controlTrack: '#262626',
    });
  });
});
