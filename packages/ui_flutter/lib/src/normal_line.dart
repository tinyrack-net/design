import 'package:flutter/painting.dart';

bool _hasCjk(String text) {
  for (final rune in text.runes) {
    if ((rune >= 0x1100 && rune <= 0x11FF) || // Hangul Jamo
        (rune >= 0x2E80 && rune <= 0x9FFF) || // CJK radicals through Unified
        (rune >= 0x3130 && rune <= 0x318F) || // Hangul compatibility Jamo
        (rune >= 0xAC00 && rune <= 0xD7AF) || // Hangul syllables
        (rune >= 0xF900 && rune <= 0xFAFF) || // CJK compatibility
        (rune >= 0xFF00 && rune <= 0xFFEF)) {
      // Halfwidth and fullwidth forms
      return true;
    }
  }
  return false;
}

/// Resolves a `line-height: normal` equivalent for [text].
///
/// Chromium derives the normal line box from the fonts the glyphs actually
/// use and snaps the latin IBM Plex line to a whole pixel below CanvasKit's
/// rounding; CJK fallback lines agree with the natural font metrics.
double normalLineHeightFor(String text, double fontSize, double latinLine) =>
    _hasCjk(text) ? kTextHeightNone : latinLine / fontSize;
