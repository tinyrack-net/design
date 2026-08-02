import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../tree_nav/tree_nav.dart';

/// Base node in a [TRFileTree].
sealed class TRFileTreeNode {
  const TRFileTreeNode({
    required this.name,
    required this.path,
    this.disabled = false,
  });

  final String name;
  final String path;
  final bool disabled;
}

/// Leaf file in a [TRFileTree].
final class TRFileTreeFile extends TRFileTreeNode {
  const TRFileTreeFile({
    required super.name,
    required super.path,
    super.disabled,
    this.icon,
  });

  final Widget? icon;
}

/// Expandable directory in a [TRFileTree].
final class TRFileTreeDirectory extends TRFileTreeNode {
  const TRFileTreeDirectory({
    required super.name,
    required super.path,
    required this.children,
    super.disabled,
    this.initiallyExpanded = false,
  });

  final List<TRFileTreeNode> children;
  final bool initiallyExpanded;
}

// @tinyrack-preview file-tree
/// A file-system-specific tree navigation view.
class TRFileTree extends StatefulWidget {
  const TRFileTree({
    required this.nodes,
    this.controller,
    this.onFileOpen,
    this.onSelectionChange,
    this.pageStorageId,
    this.semanticLabel = 'Files',
    super.key,
  });

  final List<TRFileTreeNode> nodes;
  final TRTreeNavController<String>? controller;
  final ValueChanged<TRFileTreeFile>? onFileOpen;
  final ValueChanged<String?>? onSelectionChange;
  final Object? pageStorageId;
  final String semanticLabel;

  @override
  State<TRFileTree> createState() => _TRFileTreeState();
}

class _TRFileTreeState extends State<TRFileTree> {
  late Set<String> _expanded = _initialFileTreeExpansion(widget.nodes);

  TRTreeNavController<String>? get _controller => widget.controller;

  @override
  void initState() {
    super.initState();
    _controller?.addListener(_changed);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (widget.pageStorageId case final id?) {
      final stored = PageStorage.maybeOf(
        context,
      )?.readState(context, identifier: id);
      if (stored is Set<String>) _expanded = Set<String>.of(stored);
    }
  }

  @override
  void didUpdateWidget(TRFileTree oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      oldWidget.controller?.removeListener(_changed);
      widget.controller?.addListener(_changed);
    }
  }

  @override
  void dispose() {
    _controller?.removeListener(_changed);
    super.dispose();
  }

  void _changed() {
    if (mounted) setState(() {});
  }

  bool _isExpanded(String path) =>
      _controller?.expanded.contains(path) ?? _expanded.contains(path);

  void _toggle(TRFileTreeDirectory directory) {
    if (directory.disabled) return;
    final expanded = !_isExpanded(directory.path);
    if (_controller case final controller?) {
      controller.setExpanded(directory.path, expanded);
    } else {
      setState(() {
        expanded
            ? _expanded.add(directory.path)
            : _expanded.remove(directory.path);
      });
    }
    if (widget.pageStorageId case final id?) {
      PageStorage.maybeOf(
        context,
      )?.writeState(context, _expanded, identifier: id);
    }
  }

  void _open(TRFileTreeFile file) {
    if (file.disabled) return;
    _controller?.select(file.path);
    widget.onSelectionChange?.call(file.path);
    widget.onFileOpen?.call(file);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    return Semantics(
      container: true,
      label: widget.semanticLabel,
      child: Container(
        decoration: BoxDecoration(
          color: colors.surfaceMuted,
          border: Border.all(color: colors.border),
          borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
        ),
        padding: const EdgeInsets.all(TRGeneratedSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          spacing: TRGeneratedSpacing.xs,
          children: [for (final node in widget.nodes) _node(node, generated)],
        ),
      ),
    );
  }

  Widget _node(TRFileTreeNode node, TRGeneratedColorTheme generated) {
    if (node case final TRFileTreeDirectory directory) {
      final expanded = _isExpanded(directory.path);
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          _fileRow(
            disabled: directory.disabled,
            onTap: () => _toggle(directory),
            child: Row(
              children: [
                SizedBox(
                  width: TRGeneratedSpacing.md,
                  child: Text(expanded ? '▾' : '▸'),
                ),
                Expanded(child: Text(directory.name)),
              ],
            ),
          ),
          if (expanded)
            Container(
              margin: const EdgeInsetsDirectional.only(
                start: TRGeneratedSpacing.sm,
              ),
              padding: const EdgeInsetsDirectional.only(
                start: TRGeneratedSpacing.md,
              ),
              decoration: BoxDecoration(
                border: BorderDirectional(
                  start: BorderSide(color: generated.border),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                spacing: TRGeneratedSpacing.xs,
                children: [
                  for (final child in directory.children)
                    _node(child, generated),
                ],
              ),
            ),
        ],
      );
    }
    final file = node as TRFileTreeFile;
    return _fileRow(
      disabled: file.disabled,
      onTap: () => _open(file),
      child: Row(
        children: [
          const SizedBox(width: TRGeneratedSpacing.md),
          ?file.icon,
          if (file.icon != null) const SizedBox(width: TRGeneratedSpacing.xs),
          Expanded(child: Text(file.name)),
        ],
      ),
    );
  }

  Widget _fileRow({
    required bool disabled,
    required VoidCallback onTap,
    required Widget child,
  }) => SizedBox(
    height: TRGeneratedFlutterRendering.normalLineSm,
    child: InkWell(
      onTap: disabled ? null : onTap,
      child: DefaultTextStyle(
        style: TextStyle(
          color: disabled
              ? context.tinyrackTheme.textMuted
              : context.tinyrackTheme.text,
          fontFamily: TRGeneratedFontFamilies.mono,
          fontFamilyFallback: TRGeneratedFontFamilies.fallback,
          fontSize: TRGeneratedTypographySizes.sm,
          height:
              TRGeneratedFlutterRendering.normalLineSm /
              TRGeneratedTypographySizes.sm,
        ),
        child: child,
      ),
    ),
  );
}

Set<String> _initialFileTreeExpansion(List<TRFileTreeNode> nodes) {
  final result = <String>{};
  for (final node in nodes) {
    if (node case final TRFileTreeDirectory directory) {
      if (directory.initiallyExpanded) result.add(directory.path);
      result.addAll(_initialFileTreeExpansion(directory.children));
    }
  }
  return result;
}
