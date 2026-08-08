import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';

/// A controlled two-pane layout with an accessible resizable separator.
class TRSplitView extends StatefulWidget {
  const TRSplitView({
    required this.first,
    required this.second,
    required this.ratio,
    required this.separatorLabel,
    required this.onRatioChanged,
    this.onRatioChangeEnd,
    this.axis = Axis.horizontal,
    this.minFirstExtent = TRGeneratedMeasurements.splitPaneMinExtent,
    this.minSecondExtent = TRGeneratedMeasurements.splitPaneMinExtent,
    super.key,
  }) : assert(ratio >= 0 && ratio <= 1),
       assert(minFirstExtent >= 0),
       assert(minSecondExtent >= 0);

  final Widget first;
  final Widget second;
  final Axis axis;
  final double ratio;
  final String separatorLabel;
  final double minFirstExtent;
  final double minSecondExtent;
  final ValueChanged<double> onRatioChanged;
  final ValueChanged<double>? onRatioChangeEnd;

  @override
  State<TRSplitView> createState() => _TRSplitViewState();
}

class _TRSplitViewState extends State<TRSplitView> {
  final FocusNode _focusNode = FocusNode();
  double? _dragRatio;
  double? _lastReportedRatio;

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  double _clamp(double ratio, double available) {
    if (available <= 0) return 0.5;
    if (widget.minFirstExtent + widget.minSecondExtent > available) {
      return ratio.clamp(0.0, 1.0);
    }
    return ratio.clamp(
      widget.minFirstExtent / available,
      1 - widget.minSecondExtent / available,
    );
  }

  void _report(double ratio, double available) {
    final next = _clamp(ratio, available);
    _lastReportedRatio = next;
    widget.onRatioChanged(next);
  }

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final dividerExtent = TRGeneratedBorders.defaultWidth;
      final interactionExtent = TRGeneratedSpacing.sm;
      final total = widget.axis == Axis.horizontal
          ? constraints.maxWidth
          : constraints.maxHeight;
      final available = (total - dividerExtent).clamp(0.0, double.infinity);
      final ratio = _clamp(_dragRatio ?? widget.ratio, available);
      final firstExtent = available * ratio;
      final secondExtent = available - firstExtent;
      final direction = Directionality.of(context);
      final first = SizedBox(
        width: widget.axis == Axis.horizontal ? firstExtent : null,
        height: widget.axis == Axis.vertical ? firstExtent : null,
        child: widget.first,
      );
      final second = SizedBox(
        width: widget.axis == Axis.horizontal ? secondExtent : null,
        height: widget.axis == Axis.vertical ? secondExtent : null,
        child: widget.second,
      );
      final separator = _separator(
        context,
        available: available,
        ratio: ratio,
        direction: direction,
      );
      final layout = widget.axis == Axis.horizontal
          ? Row(
              children: <Widget>[
                first,
                SizedBox(width: dividerExtent),
                second,
              ],
            )
          : Column(
              children: <Widget>[
                first,
                SizedBox(height: dividerExtent),
                second,
              ],
            );
      final interactionOffset =
          firstExtent - (interactionExtent - dividerExtent) / 2;
      return Stack(
        fit: StackFit.passthrough,
        children: <Widget>[
          layout,
          if (widget.axis == Axis.horizontal)
            PositionedDirectional(
              start: interactionOffset,
              top: 0,
              bottom: 0,
              width: interactionExtent,
              child: separator,
            )
          else
            Positioned(
              left: 0,
              right: 0,
              top: interactionOffset,
              height: interactionExtent,
              child: separator,
            ),
        ],
      );
    },
  );

  Widget _separator(
    BuildContext context, {
    required double available,
    required double ratio,
    required TextDirection direction,
  }) {
    final colors = context.tinyrackTheme;
    final horizontal = widget.axis == Axis.horizontal;
    final cursor = horizontal
        ? SystemMouseCursors.resizeLeftRight
        : SystemMouseCursors.resizeUpDown;
    void adjust(double delta) {
      final directionSign = horizontal && direction == TextDirection.rtl
          ? -1.0
          : 1.0;
      final next = ratio + delta * directionSign / available;
      setState(() => _dragRatio = _clamp(next, available));
      _report(next, available);
    }

    void finish() {
      final value = _lastReportedRatio ?? ratio;
      widget.onRatioChangeEnd?.call(value);
      setState(() => _dragRatio = null);
    }

    final line = Center(
      child: SizedBox(
        width: horizontal ? TRGeneratedBorders.defaultWidth : null,
        height: horizontal ? null : TRGeneratedBorders.defaultWidth,
        child: ColoredBox(color: colors.border),
      ),
    );
    return Semantics(
      label: widget.separatorLabel,
      slider: true,
      value: '${(ratio * 100).round()}%',
      increasedValue: '${((ratio + 0.05).clamp(0, 1) * 100).round()}%',
      decreasedValue: '${((ratio - 0.05).clamp(0, 1) * 100).round()}%',
      onIncrease: () {
        adjust(TRGeneratedSpacing.lg);
        finish();
      },
      onDecrease: () {
        adjust(-TRGeneratedSpacing.lg);
        finish();
      },
      child: Focus(
        focusNode: _focusNode,
        onKeyEvent: (_, event) {
          if (event is! KeyDownEvent) return KeyEventResult.ignored;
          final increase = horizontal
              ? event.logicalKey == LogicalKeyboardKey.arrowRight
              : event.logicalKey == LogicalKeyboardKey.arrowDown;
          final decrease = horizontal
              ? event.logicalKey == LogicalKeyboardKey.arrowLeft
              : event.logicalKey == LogicalKeyboardKey.arrowUp;
          if (!increase && !decrease) return KeyEventResult.ignored;
          adjust(increase ? TRGeneratedSpacing.lg : -TRGeneratedSpacing.lg);
          finish();
          return KeyEventResult.handled;
        },
        child: MouseRegion(
          cursor: cursor,
          child: GestureDetector(
            key: const ValueKey<String>('tr-split-view-separator'),
            behavior: HitTestBehavior.opaque,
            onTap: _focusNode.requestFocus,
            onHorizontalDragUpdate: horizontal
                ? (details) => adjust(details.delta.dx)
                : null,
            onHorizontalDragEnd: horizontal ? (_) => finish() : null,
            onVerticalDragUpdate: horizontal
                ? null
                : (details) => adjust(details.delta.dy),
            onVerticalDragEnd: horizontal ? null : (_) => finish(),
            child: line,
          ),
        ),
      ),
    );
  }
}
