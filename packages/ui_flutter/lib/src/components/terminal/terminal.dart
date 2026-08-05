import 'package:flutter/material.dart';
import 'package:xterm/xterm.dart' as xterm;

import '../../theme.dart';
import '../../tokens.dart';

/// Character-cell dimensions reported by a [TRTerminalView].
@immutable
final class TRTerminalSize {
  const TRTerminalSize({required this.columns, required this.rows});

  final int columns;
  final int rows;
}

/// Owns the emulator state rendered by a [TRTerminalView].
final class TRTerminalController {
  TRTerminalController({int maxLines = 10000})
    : _terminal = xterm.Terminal(maxLines: maxLines);

  final xterm.Terminal _terminal;

  /// Feeds output from the connected terminal process into the emulator.
  void write(String data) => _terminal.write(data);

  /// Sends text through the same input path used by the terminal view.
  void input(String data) => _terminal.textInput(data);

  /// Releases the controller. Present for symmetry with other TR controllers.
  void dispose() {}
}

/// A token-backed interactive terminal emulator surface.
class TRTerminalView extends StatefulWidget {
  const TRTerminalView({
    required this.controller,
    this.onInput,
    this.onResize,
    this.autofocus = false,
    this.readOnly = false,
    super.key,
  });

  final TRTerminalController controller;
  final ValueChanged<String>? onInput;
  final ValueChanged<TRTerminalSize>? onResize;
  final bool autofocus;
  final bool readOnly;

  @override
  State<TRTerminalView> createState() => _TRTerminalViewState();
}

final class _TRTerminalViewState extends State<TRTerminalView> {
  @override
  void initState() {
    super.initState();
    _connect();
  }

  @override
  void didUpdateWidget(TRTerminalView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      oldWidget.controller._terminal
        ..onOutput = null
        ..onResize = null;
    }
    _connect();
  }

  void _connect() {
    widget.controller._terminal.onOutput = (value) {
      widget.onInput?.call(value);
    };
    widget.controller._terminal.onResize = (columns, rows, _, _) {
      widget.onResize?.call(TRTerminalSize(columns: columns, rows: rows));
    };
  }

  @override
  void dispose() {
    widget.controller._terminal
      ..onOutput = null
      ..onResize = null;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final terminalTheme = xterm.TerminalTheme(
      cursor: colors.focus,
      selection: colors.surfaceSelected,
      foreground: colors.text,
      background: colors.surface,
      black: colors.surface,
      red: colors.danger,
      green: colors.success,
      yellow: colors.warning,
      blue: colors.info,
      magenta: colors.primary,
      cyan: colors.infoBorder,
      white: colors.text,
      brightBlack: colors.textMuted,
      brightRed: colors.dangerBorder,
      brightGreen: colors.successBorder,
      brightYellow: colors.warningBorder,
      brightBlue: colors.infoBorder,
      brightMagenta: colors.primary,
      brightCyan: colors.info,
      brightWhite: colors.text,
      searchHitBackground: colors.warningSurface,
      searchHitBackgroundCurrent: colors.surfaceSelected,
      searchHitForeground: colors.text,
    );
    return ColoredBox(
      key: const ValueKey<String>('tr-terminal-surface'),
      color: colors.surface,
      child: xterm.TerminalView(
        widget.controller._terminal,
        autofocus: widget.autofocus,
        readOnly: widget.readOnly,
        padding: const EdgeInsets.all(TRSpacing.small),
        textStyle: xterm.TerminalStyle.fromTextStyle(TRTypography.code),
        textScaler: MediaQuery.textScalerOf(context),
        theme: terminalTheme,
      ),
    );
  }
}
