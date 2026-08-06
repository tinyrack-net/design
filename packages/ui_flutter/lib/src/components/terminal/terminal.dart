import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:xterm/xterm.dart' as xterm;

import '../../theme.dart';
import '../../tokens.dart';
import '../context_menu/context_menu.dart';

/// Character-cell dimensions reported by a [TRTerminalView].
@immutable
final class TRTerminalSize {
  const TRTerminalSize({required this.columns, required this.rows});

  final int columns;
  final int rows;
}

/// Reconciles the platform editing buffer that reaches [textInput].
///
/// The terminal view reports the whole platform editing buffer every time a
/// composition ends, and relies on resetting that buffer afterwards so the next
/// report starts empty. Input methods that compose multiple characters, such as
/// Hangul and Kana ones, keep their own buffer for the length of a composition
/// session and ignore that reset, so every commit repeats everything committed
/// so far, and ending the session repeats the final buffer once more without
/// adding anything. Sending only what a report added, and nothing for a report
/// identical to the previous one, avoids the repetition. A platform that does
/// honour the reset reports one character at a time, so an identical
/// single-character report stays a distinct keystroke.
final class _TRTerminal extends xterm.Terminal {
  _TRTerminal({required super.maxLines});

  String _lastEditingBuffer = '';

  @override
  void textInput(String text) {
    final previous = _lastEditingBuffer;
    _lastEditingBuffer = text;
    if (text == previous && text.runes.length > 1) return;
    if (text.length > previous.length &&
        text.startsWith(previous) &&
        !_splitsSurrogatePair(text, previous.length)) {
      super.textInput(text.substring(previous.length));
      return;
    }
    super.textInput(text);
  }

  /// Whether cutting [text] at [index] would separate a surrogate pair, which
  /// would put a lone surrogate on the wire as invalid bytes.
  static bool _splitsSurrogatePair(String text, int index) {
    if (index <= 0 || index >= text.length) return false;
    final unit = text.codeUnitAt(index);
    return unit >= 0xDC00 && unit <= 0xDFFF;
  }

  /// Sends [text] without treating it as part of an editing buffer.
  void sendDirect(String text) {
    _lastEditingBuffer = '';
    super.textInput(text);
  }

  /// Pastes [text] without treating it as part of an editing buffer.
  void pasteDirect(String text) {
    _lastEditingBuffer = '';
    paste(text);
  }
}

/// Owns the emulator state rendered by a [TRTerminalView].
final class TRTerminalController {
  TRTerminalController({int maxLines = 10000})
    : _terminal = _TRTerminal(maxLines: maxLines);

  final _TRTerminal _terminal;
  final xterm.TerminalController _view = xterm.TerminalController();

  /// Notifies listeners when the selected region changes.
  Listenable get selectionChanges => _view;

  /// Whether the user currently has a region of the terminal selected.
  bool get hasSelection => _view.selection != null;

  /// The text inside the selected region, or `null` when nothing is selected.
  String? get selectedText {
    final selection = _view.selection;
    if (selection == null) return null;
    return _terminal.buffer.getText(selection);
  }

  /// Feeds output from the connected terminal process into the emulator.
  void write(String data) => _terminal.write(data);

  /// Sends text through the same input path used by the terminal view.
  void input(String data) => _terminal.sendDirect(data);

  /// Sends [data] as a paste, wrapping it for programs in bracketed paste mode.
  void paste(String data) => _terminal.pasteDirect(data);

  /// Selects every line the emulator still holds, including scrollback.
  void selectAll() {
    final buffer = _terminal.buffer;
    _view.setSelection(
      buffer.createAnchor(0, 0),
      buffer.createAnchor(_terminal.viewWidth, buffer.height - 1),
      mode: xterm.SelectionMode.line,
    );
  }

  /// Clears the selected region.
  void clearSelection() => _view.clearSelection();

  /// Releases the controller.
  void dispose() => _view.dispose();
}

/// A token-backed interactive terminal emulator surface.
class TRTerminalView extends StatefulWidget {
  const TRTerminalView({
    required this.controller,
    this.onInput,
    this.onResize,
    this.contextMenuBuilder,
    this.contextMenuItems,
    this.autofocus = false,
    this.readOnly = false,
    super.key,
  }) : assert(
         contextMenuBuilder == null || contextMenuItems == null,
         'a terminal has one context menu, described one way',
       );

  final TRTerminalController controller;
  final ValueChanged<String>? onInput;
  final ValueChanged<TRTerminalSize>? onResize;

  /// Builds the items of a [TRContextMenu] opened at the secondary pointer
  /// button. The terminal owns this interaction because it consumes secondary
  /// taps itself, so an enclosing [TRContextMenu] never sees them. Leave it
  /// `null` to keep the terminal without a context menu.
  ///
  /// A program that asks the terminal to report mouse events receives the
  /// secondary button instead, and the menu stays closed.
  final List<Widget> Function(BuildContext context)? contextMenuBuilder;

  /// Describes the same menu as [contextMenuBuilder] through [TRMenuElement]s,
  /// which lets the installed [TRContextMenuPresenter] hand it to the operating
  /// system. Set one of the two, never both.
  final TRMenuElementsBuilder? contextMenuItems;

  final bool autofocus;
  final bool readOnly;

  @override
  State<TRTerminalView> createState() => _TRTerminalViewState();
}

final class _TRTerminalViewState extends State<TRTerminalView> {
  final TRContextMenuController _menuController = TRContextMenuController();

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

  void _openContextMenu(Offset globalPosition) =>
      _menuController.openAt(globalPosition);

  /// Closes the context menu on Escape before the emulator can send the key
  /// to the program, which keeps focus on the terminal the whole time.
  KeyEventResult _handleKeyEvent(FocusNode node, KeyEvent event) {
    if (_menuController.isOpen &&
        event is KeyDownEvent &&
        event.logicalKey == LogicalKeyboardKey.escape) {
      _menuController.close();
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
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
    final contextMenuBuilder = widget.contextMenuBuilder;
    final contextMenuItems = widget.contextMenuItems;
    final hasContextMenu =
        contextMenuBuilder != null || contextMenuItems != null;
    final terminal = xterm.TerminalView(
      widget.controller._terminal,
      controller: widget.controller._view,
      autofocus: widget.autofocus,
      readOnly: widget.readOnly,
      padding: const EdgeInsets.all(TRSpacing.small),
      textStyle: xterm.TerminalStyle.fromTextStyle(TRTypography.code),
      textScaler: MediaQuery.textScalerOf(context),
      theme: terminalTheme,
      onSecondaryTapDown: hasContextMenu
          ? (details, _) => _openContextMenu(details.globalPosition)
          : null,
      onKeyEvent: hasContextMenu ? _handleKeyEvent : null,
    );
    return ColoredBox(
      key: const ValueKey<String>('tr-terminal-surface'),
      color: colors.surface,
      child: switch ((contextMenuBuilder, contextMenuItems)) {
        (final builder?, _) => TRContextMenu(
          menuController: _menuController,
          menuChildren: builder(context),
          child: terminal,
        ),
        (_, final items?) => TRContextMenu.itemsBuilder(
          menuController: _menuController,
          itemsBuilder: items,
          child: terminal,
        ),
        _ => terminal,
      },
    );
  }
}
