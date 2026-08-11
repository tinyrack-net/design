import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_flutter/lucide_flutter.dart';

import '../../generated/tokens.g.dart';
import '../../internal/motion_boundary.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';
import '../focus_ring/focus_ring.dart';
import '../text/text.dart';

/// Visual state of a tool or status entry in a chat transcript.
enum TRChatToolStatus { running, succeeded, failed, denied }

/// Semantic emphasis of a leading visual in a chat message row.
enum TRChatMessageTone { defaultTone, muted, primary, danger }

/// How a chat message's leading visual aligns with its content.
enum TRChatMessageAlignment { firstLine, center }

// @tinyrack-preview chat
/// A start-aligned chat row with a shared leading icon rail.
class TRChatMessageRow extends StatelessWidget {
  const TRChatMessageRow({
    required this.icon,
    required this.child,
    this.tone = TRChatMessageTone.muted,
    this.alignment = TRChatMessageAlignment.firstLine,
    this.textVariant = TRTextVariant.body,
    this.semanticLabel,
    super.key,
  });

  final IconData icon;
  final Widget child;
  final TRChatMessageTone tone;

  /// Aligns the leading icon to the first text line by default. Use [TRChatMessageAlignment.center]
  /// when [child] is a compound surface rather than prose.
  final TRChatMessageAlignment alignment;

  /// Typography role that defines the first-line extent.
  final TRTextVariant textVariant;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final iconSize = TRGeneratedControlMetrics.smIconSize;
    final lineExtent = _scaledLineExtent(context, textVariant);
    final firstLine = alignment == TRChatMessageAlignment.firstLine;
    final leadingInset = firstLine && lineExtent > iconSize
        ? (lineExtent - iconSize) / 2
        : 0.0;
    final contentInset = firstLine && iconSize > lineExtent
        ? (iconSize - lineExtent) / 2
        : 0.0;
    final row = Padding(
      padding: const EdgeInsets.symmetric(vertical: TRGeneratedSpacing.xs),
      child: Row(
        crossAxisAlignment: firstLine
            ? CrossAxisAlignment.start
            : CrossAxisAlignment.center,
        children: [
          Padding(
            padding: EdgeInsets.only(top: leadingInset),
            child: SizedBox(
              width: TRGeneratedControlMetrics.mdIconSize,
              child: Icon(
                icon,
                size: iconSize,
                color: switch (tone) {
                  TRChatMessageTone.defaultTone => context.tinyrackTheme.text,
                  TRChatMessageTone.muted => context.tinyrackTheme.textMuted,
                  TRChatMessageTone.primary => context.tinyrackTheme.primary,
                  TRChatMessageTone.danger => context.tinyrackTheme.danger,
                },
              ),
            ),
          ),
          const SizedBox(width: TRGeneratedSpacing.sm),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(top: contentInset),
              child: child,
            ),
          ),
        ],
      ),
    );
    final label = semanticLabel;
    return label == null
        ? row
        : Semantics(
            container: true,
            label: label,
            excludeSemantics: true,
            child: row,
          );
  }
}

double _scaledLineExtent(BuildContext context, TRTextVariant variant) {
  final style = switch (variant) {
    TRTextVariant.caption => TRGeneratedTextStyles.caption,
    TRTextVariant.label => TRGeneratedTextStyles.label,
    TRTextVariant.body => TRGeneratedTextStyles.body,
    TRTextVariant.bodySm => TRGeneratedTextStyles.bodySm,
    TRTextVariant.code => TRGeneratedTextStyles.code,
    TRTextVariant.headingSm => TRGeneratedTextStyles.headingSm,
    TRTextVariant.headingMd => TRGeneratedTextStyles.headingMd,
    TRTextVariant.headingLg => TRGeneratedTextStyles.headingLg,
    TRTextVariant.display => TRGeneratedTextStyles.display,
    TRTextVariant.displayLg => TRGeneratedTextStyles.displayLg,
  };
  return MediaQuery.textScalerOf(context).scale(style.fontSize!) *
      style.height!;
}

/// An end-aligned bubble for user-authored chat content.
class TRChatUserBubble extends StatelessWidget {
  const TRChatUserBubble({required this.child, this.semanticLabel, super.key});

  final Widget child;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final bubble = Align(
      alignment: AlignmentDirectional.centerEnd,
      child: ConstrainedBox(
        constraints: const BoxConstraints(
          maxWidth: TRGeneratedMeasurements.measureLg,
        ),
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: context.tinyrackTheme.surfaceMuted,
            borderRadius: const BorderRadiusDirectional.only(
              topStart: TRRadii.extraLarge,
              topEnd: TRRadii.small,
              bottomStart: TRRadii.extraLarge,
              bottomEnd: TRRadii.extraLarge,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: TRGeneratedSpacing.lg,
              vertical: TRGeneratedSpacing.md,
            ),
            child: child,
          ),
        ),
      ),
    );
    final label = semanticLabel;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: TRGeneratedSpacing.xs),
      child: label == null
          ? bubble
          : Semantics(container: true, label: label, child: bubble),
    );
  }
}

/// An expandable chat tool row with a compact action and status summary.
class TRChatToolDisclosure extends StatefulWidget {
  const TRChatToolDisclosure({
    required this.icon,
    required this.label,
    required this.status,
    required this.statusLabel,
    required this.details,
    this.secondaryLabel,
    this.open,
    this.defaultOpen = false,
    this.onOpenChange,
    super.key,
  });

  final IconData icon;
  final String label;

  /// Optional concrete activity shown after [label] in the compact row.
  final String? secondaryLabel;

  final TRChatToolStatus status;
  final String statusLabel;
  final Widget details;
  final bool? open;
  final bool defaultOpen;
  final ValueChanged<bool>? onOpenChange;

  @override
  State<TRChatToolDisclosure> createState() => _TRChatToolDisclosureState();
}

class _TRChatToolDisclosureState extends State<TRChatToolDisclosure> {
  late bool _uncontrolledOpen = widget.defaultOpen;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final open = widget.open ?? _uncontrolledOpen;
    final colors = context.tinyrackTheme;
    final statusColor = _statusColor(colors, widget.status);
    final displayLabel = switch (widget.secondaryLabel) {
      final secondary? when secondary.isNotEmpty =>
        '${widget.label} $secondary',
      _ => widget.label,
    };

    void toggle() {
      final next = !open;
      if (widget.open == null) setState(() => _uncontrolledOpen = next);
      widget.onOpenChange?.call(next);
    }

    return Semantics(
      container: true,
      button: true,
      expanded: open,
      label: [
        widget.label,
        if (widget.secondaryLabel case final secondary?
            when secondary.isNotEmpty)
          secondary,
        widget.statusLabel,
      ].join(', '),
      excludeSemantics: true,
      onTap: toggle,
      child: FocusableActionDetector(
        mouseCursor: SystemMouseCursors.click,
        onFocusChange: (value) => setState(() => _focused = value),
        shortcuts: const {
          SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
          SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
        },
        actions: {
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (_) {
              toggle();
              return null;
            },
          ),
        },
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: toggle,
          child: TRFocusRing(
            focused: _focused,
            child: Padding(
              padding: const EdgeInsets.symmetric(
                vertical: TRGeneratedSpacing.xs,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: [
                      SizedBox(
                        width: TRGeneratedControlMetrics.mdIconSize,
                        child: Icon(
                          widget.icon,
                          size: TRGeneratedControlMetrics.smIconSize,
                          color: statusColor,
                        ),
                      ),
                      const SizedBox(width: TRGeneratedSpacing.sm),
                      Expanded(
                        child: widget.status == TRChatToolStatus.running
                            ? _TRChatRunningText(
                                child: TRText(displayLabel, truncate: true),
                              )
                            : TRText(displayLabel, truncate: true),
                      ),
                      const SizedBox(width: TRGeneratedSpacing.sm),
                      if (widget.status != TRChatToolStatus.running) ...[
                        TRText(
                          widget.statusLabel,
                          variant: TRTextVariant.bodySm,
                          color: widget.status == TRChatToolStatus.failed
                              ? TRTextColor.danger
                              : TRTextColor.muted,
                        ),
                        const SizedBox(width: TRGeneratedSpacing.xs),
                      ],
                      AnimatedRotation(
                        turns: open ? 0.25 : 0,
                        duration: MediaQuery.disableAnimationsOf(context)
                            ? Duration.zero
                            : TRMotion.fast,
                        curve: TRMotion.standard,
                        child: Icon(
                          LucideIcons.chevronRight,
                          size: TRGeneratedControlMetrics.smIconSize,
                          color: colors.textMuted,
                        ),
                      ),
                    ],
                  ),
                  if (open) ...[
                    const SizedBox(height: TRGeneratedSpacing.sm),
                    Padding(
                      padding: const EdgeInsetsDirectional.only(
                        start:
                            TRGeneratedControlMetrics.mdIconSize +
                            TRGeneratedSpacing.sm,
                      ),
                      child: widget.details,
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// A compact non-interactive status entry in a chat transcript.
class TRChatStatusRow extends StatelessWidget {
  const TRChatStatusRow({
    required this.label,
    required this.status,
    this.icon,
    super.key,
  });

  final String label;
  final TRChatToolStatus status;
  final IconData? icon;

  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    label: label,
    excludeSemantics: true,
    child: Padding(
      padding: const EdgeInsets.symmetric(vertical: TRGeneratedSpacing.xs),
      child: Row(
        children: [
          SizedBox(
            width: TRGeneratedControlMetrics.mdIconSize,
            child: Center(
              child: Icon(
                icon ?? _statusIcon(status),
                size: TRGeneratedControlMetrics.smIconSize,
                color: _statusColor(context.tinyrackTheme, status),
              ),
            ),
          ),
          const SizedBox(width: TRGeneratedSpacing.sm),
          Expanded(
            child: status == TRChatToolStatus.running
                ? _TRChatRunningText(
                    child: TRText(
                      label,
                      variant: TRTextVariant.bodySm,
                      color: TRTextColor.muted,
                    ),
                  )
                : TRText(
                    label,
                    variant: TRTextVariant.bodySm,
                    color: status == TRChatToolStatus.failed
                        ? TRTextColor.danger
                        : TRTextColor.muted,
                  ),
          ),
        ],
      ),
    ),
  );
}

class _TRChatRunningText extends StatefulWidget {
  const _TRChatRunningText({required this.child});

  final Widget child;

  @override
  State<_TRChatRunningText> createState() => _TRChatRunningTextState();
}

class _TRChatRunningTextState extends State<_TRChatRunningText>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: TRMotion.loading,
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncAnimation();
  }

  void _syncAnimation() {
    if (MediaQuery.disableAnimationsOf(context)) {
      _controller
        ..stop()
        ..value = 0;
      return;
    }
    if (!_controller.isAnimating) _controller.repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return widget.child;
    final colors = context.tinyrackTheme;
    final textDirection = Directionality.of(context);
    return AnimatedBuilder(
      animation: _controller,
      child: widget.child,
      builder: (context, child) => TRMotionBoundary(
        progress: _controller.value,
        child: ShaderMask(
          blendMode: BlendMode.srcIn,
          shaderCallback: (bounds) {
            final progress = textDirection == TextDirection.ltr
                ? _controller.value
                : 1 - _controller.value;
            final center = bounds.width * (-1 + 3 * progress);
            return LinearGradient(
              colors: <Color>[colors.textMuted, colors.text, colors.textMuted],
            ).createShader(
              Rect.fromLTWH(
                center - bounds.width,
                0,
                bounds.width * 2,
                bounds.height,
              ),
            );
          },
          child: child,
        ),
      ),
    );
  }
}

Color _statusColor(TinyrackThemeData colors, TRChatToolStatus status) =>
    switch (status) {
      TRChatToolStatus.running => colors.primary,
      TRChatToolStatus.succeeded => colors.success,
      TRChatToolStatus.failed => colors.danger,
      TRChatToolStatus.denied => colors.textMuted,
    };

IconData _statusIcon(TRChatToolStatus status) => switch (status) {
  TRChatToolStatus.running => LucideIcons.loaderCircle,
  TRChatToolStatus.succeeded => LucideIcons.circleCheck,
  TRChatToolStatus.failed => LucideIcons.circleX,
  TRChatToolStatus.denied => LucideIcons.ban,
};
