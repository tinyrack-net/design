import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../types.dart';
import '../../generated/tokens.g.dart';
import '../button/button.dart';

/// The disclosed state of a [TRCopyButton].
enum TRCopyButtonStatus { idle, copied }

// @tinyrack-preview copy-button
/// A [TRButton] that copies [value] to the clipboard and briefly confirms it.
class TRCopyButton extends StatefulWidget {
  const TRCopyButton({
    required this.value,
    this.idleLabel = 'Copy',
    this.copiedLabel = 'Copied',
    this.onStatusChange,
    this.resetDelay = const Duration(seconds: 2),
    this.appearance = TRAppearance.solid,
    this.intent = TRIntent.neutral,
    this.uiSize = TRUiSize.md,
    super.key,
  });

  final String value;
  final String idleLabel;
  final String copiedLabel;
  final ValueChanged<TRCopyButtonStatus>? onStatusChange;
  final Duration resetDelay;
  final TRAppearance appearance;
  final TRIntent intent;
  final TRUiSize uiSize;

  @override
  State<TRCopyButton> createState() => _TRCopyButtonState();
}

class _TRCopyButtonState extends State<TRCopyButton> {
  TRCopyButtonStatus _status = TRCopyButtonStatus.idle;
  Timer? _resetTimer;

  @override
  void dispose() {
    _resetTimer?.cancel();
    super.dispose();
  }

  Future<void> _handlePressed() async {
    await Clipboard.setData(ClipboardData(text: widget.value));
    if (!mounted) return;
    _resetTimer?.cancel();
    setState(() => _status = TRCopyButtonStatus.copied);
    widget.onStatusChange?.call(TRCopyButtonStatus.copied);
    _resetTimer = Timer(widget.resetDelay, () {
      if (!mounted) return;
      setState(() => _status = TRCopyButtonStatus.idle);
      widget.onStatusChange?.call(TRCopyButtonStatus.idle);
    });
  }

  @override
  Widget build(BuildContext context) {
    final cjk = RegExp(r'[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]');
    final japanese = Localizations.localeOf(context).languageCode == 'ja';
    Text label(String value) => Text(
      value,
      style: cjk.hasMatch(value) && !japanese
          ? const TextStyle(
              letterSpacing:
                  -TRGeneratedBorders.defaultWidth /
                  (TRGeneratedSpacing.size3xs +
                      TRGeneratedBorders.defaultWidth),
            )
          : null,
    );
    return TRButton(
      appearance: widget.appearance,
      intent: widget.intent,
      onPressed: _handlePressed,
      uiSize: widget.uiSize,
      // Both labels stay laid out so the button keeps the wider footprint,
      // matching the web label stack that prevents a width jump on copy.
      child: Stack(
        alignment: Alignment.center,
        children: [
          Opacity(
            opacity: _status == TRCopyButtonStatus.copied ? 1 : 0,
            child: label(widget.copiedLabel),
          ),
          Opacity(
            opacity: _status == TRCopyButtonStatus.copied ? 0 : 1,
            child: label(widget.idleLabel),
          ),
        ],
      ),
    );
  }
}
