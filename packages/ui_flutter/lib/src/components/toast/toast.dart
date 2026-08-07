import 'dart:async';
import 'dart:collection';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_flutter/lucide_flutter.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../theme.dart';
import '../../types.dart';
import '../button/button.dart';

/// Logical viewport position of a toast stack.
enum TRToastPlacement {
  topStart,
  topCenter,
  topEnd,
  bottomStart,
  bottomCenter,
  bottomEnd,
}

/// Content and lifecycle settings for one toast.
@immutable
class TRToastData {
  const TRToastData({
    required this.title,
    this.action,
    this.description,
    this.dismissible = true,
    this.duration,
    this.id,
    this.variant = TRStatusVariant.neutral,
  });

  final Widget title;
  final Widget? action;
  final Widget? description;
  final bool dismissible;
  final Duration? duration;
  final String? id;
  final TRStatusVariant variant;

  TRToastData copyWith({
    Widget? title,
    Widget? action,
    Widget? description,
    bool? dismissible,
    Duration? duration,
    String? id,
    TRStatusVariant? variant,
  }) => TRToastData(
    title: title ?? this.title,
    action: action ?? this.action,
    description: description ?? this.description,
    dismissible: dismissible ?? this.dismissible,
    duration: duration ?? this.duration,
    id: id ?? this.id,
    variant: variant ?? this.variant,
  );
}

/// Stable reference returned when a toast is shown.
class TRToastHandle {
  const TRToastHandle._(this.id, this._controller);

  final String id;
  final TRToastController _controller;

  void dismiss() => _controller.dismiss(id);
  void update(TRToastData data) => _controller.update(id, data);
}

/// Queues, updates, tracks, and dismisses toast notifications.
class TRToastController extends ChangeNotifier {
  TRToastController({
    this.defaultDuration = TRGeneratedMotion.toast,
    this.maxVisible = 3,
  }) : assert(maxVisible > 0);

  final Duration defaultDuration;
  final int maxVisible;
  final List<TRToastData> _toasts = [];
  final Map<String, Timer> _timers = {};
  var _nextId = 0;

  UnmodifiableListView<TRToastData> get toasts => UnmodifiableListView(_toasts);

  TRToastHandle show(TRToastData data) {
    final id = data.id ?? 'toast-${_nextId++}';
    final existing = _toasts.indexWhere((toast) => toast.id == id);
    final resolved = data.copyWith(id: id);
    if (existing >= 0) {
      _toasts[existing] = resolved;
    } else {
      _toasts.add(resolved);
    }
    while (_toasts.length > maxVisible) {
      _remove(_toasts.first.id!);
    }
    _schedule(resolved);
    notifyListeners();
    return TRToastHandle._(id, this);
  }

  void update(String id, TRToastData data) {
    final index = _toasts.indexWhere((toast) => toast.id == id);
    if (index < 0) return;
    final resolved = data.copyWith(id: id);
    _toasts[index] = resolved;
    _schedule(resolved);
    notifyListeners();
  }

  void dismiss(String id) {
    if (_remove(id)) notifyListeners();
  }

  void dismissAll() {
    if (_toasts.isEmpty) return;
    for (final timer in _timers.values) {
      timer.cancel();
    }
    _timers.clear();
    _toasts.clear();
    notifyListeners();
  }

  TRToastHandle track<T>(
    Future<T> future, {
    required TRToastData loading,
    required TRToastData Function(T value) success,
    required TRToastData Function(Object error, StackTrace stackTrace) error,
  }) {
    final handle = show(loading.copyWith(duration: const Duration(days: 3650)));
    future.then(
      (value) => handle.update(success(value)),
      onError: (Object exception, StackTrace stackTrace) {
        handle.update(error(exception, stackTrace));
      },
    );
    return handle;
  }

  bool _remove(String id) {
    _timers.remove(id)?.cancel();
    final before = _toasts.length;
    _toasts.removeWhere((toast) => toast.id == id);
    return before != _toasts.length;
  }

  void _schedule(TRToastData toast) {
    final id = toast.id!;
    _timers.remove(id)?.cancel();
    final duration = toast.duration ?? defaultDuration;
    if (duration == Duration.zero) return;
    _timers[id] = Timer(duration, () => dismiss(id));
  }

  @override
  void dispose() {
    for (final timer in _timers.values) {
      timer.cancel();
    }
    super.dispose();
  }
}

/// Marks a subtree as the visual anchor associated with a toast action.
class TRToastAnchor extends StatelessWidget {
  const TRToastAnchor({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) => KeyedSubtree(child: child);
}

// @tinyrack-preview toast
/// Renders a keyboard-accessible live toast region over its child.
class TRToastRegion extends StatefulWidget {
  const TRToastRegion({
    required this.child,
    this.controller,
    this.placement = TRToastPlacement.bottomEnd,
    this.semanticLabel = 'Notifications',
    super.key,
  });

  final Widget child;
  final TRToastController? controller;
  final TRToastPlacement placement;
  final String semanticLabel;

  @override
  State<TRToastRegion> createState() => _TRToastRegionState();
}

class _TRToastRegionState extends State<TRToastRegion> {
  TRToastController? _internalController;
  final FocusNode _regionFocusNode = FocusNode(debugLabel: 'TRToastRegion');

  TRToastController get _controller =>
      widget.controller ?? (_internalController ??= TRToastController());

  @override
  void initState() {
    super.initState();
    _controller.addListener(_changed);
  }

  @override
  void didUpdateWidget(TRToastRegion oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller == widget.controller) return;
    (oldWidget.controller ?? _internalController)?.removeListener(_changed);
    if (widget.controller != null) {
      _internalController?.dispose();
      _internalController = null;
    }
    _controller.addListener(_changed);
  }

  @override
  void dispose() {
    _controller.removeListener(_changed);
    _internalController?.dispose();
    _regionFocusNode.dispose();
    super.dispose();
  }

  void _changed() => setState(() {});

  @override
  Widget build(BuildContext context) => Shortcuts(
    shortcuts: const {
      SingleActivator(LogicalKeyboardKey.f6): _TRFocusToastIntent(),
      SingleActivator(LogicalKeyboardKey.escape): _TRDismissToastIntent(),
    },
    child: Actions(
      actions: {
        _TRFocusToastIntent: CallbackAction<_TRFocusToastIntent>(
          onInvoke: (_) {
            if (_controller.toasts.isNotEmpty) _regionFocusNode.requestFocus();
            return null;
          },
        ),
        _TRDismissToastIntent: CallbackAction<_TRDismissToastIntent>(
          onInvoke: (_) {
            if (_regionFocusNode.hasFocus && _controller.toasts.isNotEmpty) {
              _controller.dismiss(_controller.toasts.last.id!);
            }
            return null;
          },
        ),
      },
      child: Stack(
        fit: StackFit.passthrough,
        children: [
          widget.child,
          Positioned.fill(
            child: SafeArea(
              minimum: const EdgeInsets.all(TRGeneratedSpacing.lg),
              child: IgnorePointer(
                ignoring: _controller.toasts.isEmpty,
                child: Align(
                  alignment: _alignment(widget.placement),
                  child: Focus(
                    focusNode: _regionFocusNode,
                    child: Semantics(
                      container: true,
                      label: widget.semanticLabel,
                      liveRegion: true,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: _crossAxis(widget.placement),
                        children: [
                          for (final toast in _orderedToasts)
                            Padding(
                              padding: const EdgeInsets.only(
                                top: TRGeneratedSpacing.sm,
                              ),
                              child: _TRToastCard(
                                data: toast,
                                onDismiss: () => _controller.dismiss(toast.id!),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    ),
  );

  Iterable<TRToastData> get _orderedToasts {
    final toasts = _controller.toasts;
    return switch (widget.placement) {
      TRToastPlacement.bottomStart ||
      TRToastPlacement.bottomCenter ||
      TRToastPlacement.bottomEnd => toasts.reversed,
      _ => toasts,
    };
  }
}

class _TRToastCard extends StatefulWidget {
  const _TRToastCard({required this.data, required this.onDismiss});

  final TRToastData data;
  final VoidCallback onDismiss;

  @override
  State<_TRToastCard> createState() => _TRToastCardState();
}

class _TRToastCardState extends State<_TRToastCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    duration: TRGeneratedMotion.fast,
    vsync: this,
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _controller.value = 1;
    } else if (!_controller.isAnimating && _controller.value == 0) {
      _controller.forward();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final generated = Theme.of(context).brightness == Brightness.light
        ? TRGeneratedColors.light
        : TRGeneratedColors.dark;
    final accent = switch (widget.data.variant) {
      TRStatusVariant.neutral => colors.textMuted,
      TRStatusVariant.info => generated.infoBorder,
      TRStatusVariant.success => generated.successBorder,
      TRStatusVariant.warning => generated.warningBorder,
      TRStatusVariant.danger => generated.dangerBorder,
    };
    final card = TRLayerBoundary(
      kind: TRLayerBoundaryKind.toast,
      child: Container(
        width: TRGeneratedLayerMetrics.toastWidth,
        constraints: const BoxConstraints(
          minHeight: TRGeneratedLayerMetrics.toastMinHeight,
        ),
        decoration: BoxDecoration(
          color: colors.surface,
          border: BorderDirectional(
            top: BorderSide(color: generated.controlBorder),
            end: BorderSide(color: generated.controlBorder),
            bottom: BorderSide(color: generated.controlBorder),
            start: BorderSide(
              color: accent,
              width: TRGeneratedBorders.strongWidth,
            ),
          ),
          borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
          boxShadow: const [TRGeneratedShadows.raised],
        ),
        padding: const EdgeInsetsDirectional.fromSTEB(
          TRGeneratedSpacing.md,
          TRGeneratedSpacing.md,
          TRGeneratedSpacing.sm,
          TRGeneratedSpacing.md,
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                spacing: TRGeneratedSpacing.xs,
                children: [
                  TRLayerPartBoundary(
                    name: 'title',
                    child: DefaultTextStyle.merge(
                      style: TextStyle(
                        color: colors.text,
                        fontFamily: TRGeneratedFontFamilies.body,
                        fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                        fontSize: TRGeneratedTypographySizes.sm,
                        fontWeight: TRGeneratedFontWeights.strong,
                        height:
                            TRGeneratedFlutterRendering.normalLineMd /
                            TRGeneratedTypographySizes.sm,
                      ),
                      child: widget.data.title,
                    ),
                  ),
                  if (widget.data.description case final description?)
                    TRLayerPartBoundary(
                      name: 'description',
                      child: DefaultTextStyle.merge(
                        style: TextStyle(
                          color: colors.textMuted,
                          fontFamily: TRGeneratedFontFamilies.body,
                          fontFamilyFallback: TRGeneratedFontFamilies.fallback,
                          fontSize: TRGeneratedTypographySizes.xs,
                          height:
                              TRGeneratedFlutterRendering.normalLineMd /
                              TRGeneratedTypographySizes.xs,
                        ),
                        child: description,
                      ),
                    ),
                  ?widget.data.action,
                ],
              ),
            ),
            if (widget.data.dismissible)
              Transform.translate(
                offset: const Offset(-TRGeneratedSpacing.sm, 0),
                child: TRLayerPartBoundary(
                  name: 'dismissIcon',
                  child: TRIconButton(
                    icon: const Icon(LucideIcons.x),
                    label: MaterialLocalizations.of(context).closeButtonTooltip,
                    onPressed: widget.onDismiss,
                    appearance: TRAppearance.ghost,
                    uiSize: TRUiSize.md,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
    final animatedCard = AnimatedBuilder(
      animation: _controller,
      child: card,
      builder: (context, child) {
        final progress = TRGeneratedMotion.standard.transform(
          _controller.value,
        );
        return Opacity(
          opacity: progress,
          child: Transform.translate(
            offset: Offset(0, TRGeneratedSpacing.sm * (1 - progress)),
            child: child,
          ),
        );
      },
    );
    if (!widget.data.dismissible) return animatedCard;
    return Dismissible(
      key: ValueKey(widget.data.id),
      onDismissed: (_) => widget.onDismiss(),
      child: animatedCard,
    );
  }
}

class _TRFocusToastIntent extends Intent {
  const _TRFocusToastIntent();
}

class _TRDismissToastIntent extends Intent {
  const _TRDismissToastIntent();
}

AlignmentGeometry _alignment(TRToastPlacement placement) => switch (placement) {
  TRToastPlacement.topStart => AlignmentDirectional.topStart,
  TRToastPlacement.topCenter => AlignmentDirectional.topCenter,
  TRToastPlacement.topEnd => AlignmentDirectional.topEnd,
  TRToastPlacement.bottomStart => AlignmentDirectional.bottomStart,
  TRToastPlacement.bottomCenter => AlignmentDirectional.bottomCenter,
  TRToastPlacement.bottomEnd => AlignmentDirectional.bottomEnd,
};

CrossAxisAlignment _crossAxis(TRToastPlacement placement) =>
    switch (placement) {
      TRToastPlacement.topStart ||
      TRToastPlacement.bottomStart => CrossAxisAlignment.start,
      TRToastPlacement.topCenter ||
      TRToastPlacement.bottomCenter => CrossAxisAlignment.center,
      TRToastPlacement.topEnd ||
      TRToastPlacement.bottomEnd => CrossAxisAlignment.end,
    };
