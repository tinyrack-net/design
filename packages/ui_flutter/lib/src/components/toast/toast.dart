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

/// Lines a toast title may occupy before it is clipped.
const _titleMaxLines = 2;

/// Lines a toast description may occupy before it is clipped.
const _descriptionMaxLines = 3;

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

  /// How many times each queued toast has been shown under its own id.
  ///
  /// The region watches this so that a report which replaced an identical one
  /// still arrives visibly. Nothing outside the queue needs it, which is why it
  /// is not part of [TRToastData]: a caller describes what to say, not how many
  /// times it has already been said.
  final Map<String, int> _revisions = {};
  var _nextId = 0;
  var _paused = false;

  /// Whether the auto-dismiss countdown is suspended.
  bool get isPaused => _paused;

  /// Suspends the auto-dismiss countdown for every queued toast.
  ///
  /// A pointer resting on the stack, or keyboard focus inside it, means the
  /// reader is still there. [resumeAutoDismiss] restarts each countdown rather
  /// than continuing it, so a toast the reader has only just uncovered is given
  /// its whole dwell time instead of the remainder of it.
  void pauseAutoDismiss() {
    if (_paused) return;
    _paused = true;
    for (final timer in _timers.values) {
      timer.cancel();
    }
    _timers.clear();
  }

  /// Restarts the countdown that [pauseAutoDismiss] suspended.
  void resumeAutoDismiss() {
    if (!_paused) return;
    _paused = false;
    for (final toast in _toasts) {
      _schedule(toast);
    }
  }

  UnmodifiableListView<TRToastData> get toasts => UnmodifiableListView(_toasts);

  TRToastHandle show(TRToastData data) {
    final id = data.id ?? 'toast-${_nextId++}';
    final existing = _toasts.indexWhere((toast) => toast.id == id);
    final resolved = data.copyWith(id: id);
    if (existing >= 0) {
      // Repeating an action reports it again rather than stacking a second card
      // for it, so the refreshed report takes the newest place in the queue.
      // Left where it was, and identical to what it replaced, it would look for
      // all the world like the action had been ignored.
      _toasts
        ..removeAt(existing)
        ..add(resolved);
      _revisions[id] = (_revisions[id] ?? 0) + 1;
    } else {
      _toasts.add(resolved);
      _revisions[id] = 0;
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
    _revisions.clear();
    notifyListeners();
  }

  TRToastHandle track<T>(
    Future<T> future, {
    required TRToastData loading,
    required TRToastData Function(T value) success,
    required TRToastData Function(Object error, StackTrace stackTrace) error,
  }) {
    // Zero is the sticky duration [_schedule] already understands. A very long
    // finite duration would instead overflow the 32-bit millisecond argument a
    // browser timer takes, which fires the timer at once and drops the loading
    // toast before the future it is reporting on has settled.
    final handle = show(loading.copyWith(duration: Duration.zero));
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
    _revisions.remove(id);
    final before = _toasts.length;
    _toasts.removeWhere((toast) => toast.id == id);
    return before != _toasts.length;
  }

  /// How many times the toast under [id] has been shown again over itself.
  int _revisionOf(String id) => _revisions[id] ?? 0;

  void _schedule(TRToastData toast) {
    final id = toast.id!;
    _timers.remove(id)?.cancel();
    if (_paused) return;
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

/// One toast the region is showing, and whether it is on its way out.
///
/// The controller drops a toast the moment it is dismissed, but the card has to
/// stay mounted long enough to animate away, so the region keeps its own list.
class _TRToastEntry {
  _TRToastEntry(this.data, this.key, this.revision);

  /// Identity for the widget tree, unique within the region.
  ///
  /// A toast id is only unique to the controller that minted it, and a card
  /// that is still animating out keeps its slot, so the same id can legitimately
  /// appear twice: once leaving and once arriving.
  final Key key;

  TRToastData data;

  /// How many times the queue has shown this toast under its own id.
  int revision;

  bool exiting = false;
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
  final List<_TRToastEntry> _entries = [];
  var _nextEntryKey = 0;

  TRToastController get _controller =>
      widget.controller ?? (_internalController ??= TRToastController());

  @override
  void initState() {
    super.initState();
    _controller.addListener(_changed);
    _sync();
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
    _sync();
  }

  @override
  void dispose() {
    _controller.removeListener(_changed);
    _internalController?.dispose();
    _regionFocusNode.dispose();
    super.dispose();
  }

  void _changed() => setState(_sync);

  /// Reconciles the region's cards against the controller's queue.
  ///
  /// A card the controller has dropped is marked rather than removed so that it
  /// can play its exit before [_retire] takes it out of the tree.
  void _sync() {
    final queued = _controller.toasts;
    final queuedIds = <String>{for (final toast in queued) toast.id!};
    for (final entry in _entries) {
      if (!entry.exiting && !queuedIds.contains(entry.data.id)) {
        entry.exiting = true;
      }
    }
    // The cards the queue still wants, in the order it wants them.
    final live = <_TRToastEntry>[];
    for (final toast in queued) {
      // A toast re-shown under an id that is still animating out takes its slot
      // back rather than stacking a second card for the same notification.
      final index = _entries.indexWhere((entry) => entry.data.id == toast.id);
      final revision = _controller._revisionOf(toast.id!);
      if (index >= 0) {
        live.add(
          _entries[index]
            ..data = toast
            ..revision = revision
            ..exiting = false,
        );
      } else {
        final entry = _TRToastEntry(
          toast,
          ValueKey<int>(_nextEntryKey++),
          revision,
        );
        _entries.add(entry);
        live.add(entry);
      }
    }
    // A card that has been shown again moves to the newest place, but one that
    // is playing its exit keeps the slot it is animating in, so the stack
    // around it does not jump before it has finished leaving.
    var next = 0;
    for (var slot = 0; slot < _entries.length; slot += 1) {
      if (_entries[slot].exiting) continue;
      _entries[slot] = live[next++];
    }
  }

  void _retire(_TRToastEntry entry) {
    if (!mounted || !entry.exiting) return;
    setState(() => _entries.remove(entry));
  }

  @override
  Widget build(BuildContext context) => Shortcuts(
    // Only the focus shortcut is global. Dismissal lives with the stack itself
    // so that pressing escape anywhere else in the application is not consumed
    // by a region that has nothing to dismiss.
    shortcuts: const {
      SingleActivator(LogicalKeyboardKey.f6): _TRFocusToastIntent(),
    },
    child: Actions(
      actions: {
        _TRFocusToastIntent: CallbackAction<_TRFocusToastIntent>(
          onInvoke: (_) {
            if (_controller.toasts.isNotEmpty) _regionFocusNode.requestFocus();
            return null;
          },
        ),
      },
      child: Stack(
        fit: StackFit.passthrough,
        children: [
          widget.child,
          Positioned.fill(
            // The stack is mounted above the navigator so that a report can
            // outlive the route that asked for it, which also puts it outside
            // every [Scaffold] in the application. Unstyled text there inherits
            // the fallback style [MaterialApp] paints with — a yellow double
            // underline — because the cards draw their own surface rather than
            // standing on one. Carrying a transparent [Material] keeps that
            // surface out of the painting while still answering for the text
            // style and the ink its controls splash onto.
            child: Material(
              type: MaterialType.transparency,
              child: SafeArea(
                minimum: const EdgeInsets.all(TRGeneratedSpacing.lg),
                child: IgnorePointer(
                  ignoring: _entries.isEmpty,
                  child: Align(
                    alignment: _alignment(widget.placement),
                    child: MouseRegion(
                      // A pointer resting on the stack means the reader is still
                      // there, so the countdown waits for them.
                      onEnter: (_) => _controller.pauseAutoDismiss(),
                      onExit: (_) => _controller.resumeAutoDismiss(),
                      child: Shortcuts(
                        shortcuts: const {
                          SingleActivator(LogicalKeyboardKey.escape):
                              _TRDismissToastIntent(),
                        },
                        child: Actions(
                          actions: {
                            _TRDismissToastIntent:
                                CallbackAction<_TRDismissToastIntent>(
                                  onInvoke: (_) {
                                    final toasts = _controller.toasts;
                                    if (toasts.isNotEmpty) {
                                      _controller.dismiss(toasts.last.id!);
                                    }
                                    return null;
                                  },
                                ),
                          },
                          child: Focus(
                            focusNode: _regionFocusNode,
                            onFocusChange: (focused) => focused
                                ? _controller.pauseAutoDismiss()
                                : _controller.resumeAutoDismiss(),
                            child: Semantics(
                              container: true,
                              label: widget.semanticLabel,
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                crossAxisAlignment: _crossAxis(
                                  widget.placement,
                                ),
                                children: [
                                  for (final entry in _orderedEntries)
                                    Padding(
                                      // Keyed by identity so that removing a card
                                      // from the middle of the stack does not hand
                                      // its animation state to its neighbour.
                                      key: entry.key,
                                      padding: const EdgeInsets.only(
                                        top: TRGeneratedSpacing.sm,
                                      ),
                                      child: _TRToastCard(
                                        data: entry.data,
                                        exiting: entry.exiting,
                                        revision: entry.revision,
                                        onDismiss: () =>
                                            _controller.dismiss(entry.data.id!),
                                        onExited: () => _retire(entry),
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
                ),
              ),
            ),
          ),
        ],
      ),
    ),
  );

  Iterable<_TRToastEntry> get _orderedEntries => switch (widget.placement) {
    TRToastPlacement.bottomStart ||
    TRToastPlacement.bottomCenter ||
    TRToastPlacement.bottomEnd => _entries.reversed,
    _ => _entries,
  };
}

class _TRToastCard extends StatefulWidget {
  const _TRToastCard({
    required this.data,
    required this.exiting,
    required this.revision,
    required this.onDismiss,
    required this.onExited,
  });

  final TRToastData data;

  /// How many times this toast has been shown again over itself.
  final int revision;

  /// Whether this card has been dismissed and is playing its exit.
  final bool exiting;

  final VoidCallback onDismiss;

  /// Called once the exit has finished and the card can leave the tree.
  final VoidCallback onExited;

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
      _controller.value = widget.exiting ? 0 : 1;
      if (widget.exiting) _retireAfterFrame();
      return;
    }
    if (widget.exiting) {
      _exit();
    } else if (!_controller.isAnimating && _controller.value == 0) {
      _controller.forward();
    }
  }

  @override
  void didUpdateWidget(_TRToastCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.exiting != oldWidget.exiting) {
      if (!widget.exiting) {
        // Re-shown while it was leaving: play the entry again from wherever the
        // exit had got to rather than snapping back.
        _controller.forward();
      } else if (MediaQuery.disableAnimationsOf(context)) {
        _retireAfterFrame();
      } else {
        _exit();
      }
      return;
    }
    if (widget.revision == oldWidget.revision || widget.exiting) return;
    // The same report, asked for again. Arriving a second time is the only
    // thing that separates an answer from a card that has simply been sitting
    // there since the first attempt.
    if (MediaQuery.disableAnimationsOf(context)) {
      _controller.value = 1;
    } else {
      _controller
        ..value = 0
        ..forward();
    }
  }

  /// Plays the entry in reverse, then hands the card back to the region.
  void _exit() {
    _controller.reverse().whenComplete(() {
      if (mounted) widget.onExited();
    });
  }

  /// Hands the card back once the current frame is done.
  ///
  /// Retiring is a `setState` on the region, so reporting it from inside a
  /// build or a dependency change would tear this subtree out of the tree that
  /// is still being built.
  void _retireAfterFrame() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) widget.onExited();
    });
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
        // Width is fixed so a stack of reports reads as one column, but height
        // is left to the content: a floor tall enough for a description would
        // otherwise pad every one-line report with dead space.
        width: TRGeneratedLayerMetrics.toastWidth,
        decoration: BoxDecoration(
          color: colors.surface,
          border: Border.all(color: generated.controlBorder),
          borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
          boxShadow: const [TRGeneratedShadows.raised],
        ),
        // The variant reads as a leading bar inside the card rather than as a
        // heavier border side. Flutter can only stroke a rounded rectangle
        // whose sides all match, so a decoration that carried both an accent
        // side and a radius asserted on every paint and dropped the radius in
        // a release build.
        child: ClipRRect(
          borderRadius: BorderRadius.circular(
            TRGeneratedRadii.md - TRGeneratedBorders.defaultWidth,
          ),
          // Intrinsic height so the accent bar can stretch to whatever the
          // content ends up being, without the bar itself having any say in how
          // tall the card is.
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                SizedBox(
                  width: TRGeneratedBorders.strongWidth,
                  child: ColoredBox(color: accent),
                ),
                Expanded(
                  child: Padding(
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
                                  // A toast reports an outcome; it is not where a
                                  // stack trace is read. Clamping keeps the card a
                                  // predictable height whatever a caller passes,
                                  // so a long message cannot push the stack past
                                  // the viewport.
                                  maxLines: _titleMaxLines,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    color: colors.text,
                                    fontFamily: TRGeneratedFontFamilies.body,
                                    fontFamilyFallback:
                                        TRGeneratedFontFamilies.fallback,
                                    fontSize: TRGeneratedTypographySizes.sm,
                                    fontWeight: TRGeneratedFontWeights.strong,
                                    height:
                                        TRGeneratedFlutterRendering
                                            .normalLineMd /
                                        TRGeneratedTypographySizes.sm,
                                  ),
                                  child: widget.data.title,
                                ),
                              ),
                              if (widget.data.description
                                  case final description?)
                                TRLayerPartBoundary(
                                  name: 'description',
                                  child: DefaultTextStyle.merge(
                                    maxLines: _descriptionMaxLines,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      color: colors.textMuted,
                                      fontFamily: TRGeneratedFontFamilies.body,
                                      fontFamilyFallback:
                                          TRGeneratedFontFamilies.fallback,
                                      fontSize: TRGeneratedTypographySizes.xs,
                                      height:
                                          TRGeneratedFlutterRendering
                                              .normalLineMd /
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
                            // Pulls the ghost button's optical bounds back toward
                            // the trailing edge. The sign follows the reading
                            // direction; a fixed negative offset pushed the button
                            // into the leading border under right-to-left text.
                            offset: Offset(
                              Directionality.of(context) == TextDirection.rtl
                                  ? TRGeneratedSpacing.sm
                                  : -TRGeneratedSpacing.sm,
                              0,
                            ),
                            child: TRLayerPartBoundary(
                              name: 'dismissIcon',
                              child: TRIconButton(
                                icon: const Icon(LucideIcons.x),
                                label: MaterialLocalizations.of(
                                  context,
                                ).closeButtonTooltip,
                                onPressed: widget.onDismiss,
                                appearance: TRAppearance.ghost,
                                uiSize: TRUiSize.md,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
    // Announced per toast rather than from the stack around it: the region's
    // label never changes, so a screen reader watching only the container has
    // nothing to report when a toast arrives.
    final announced = Semantics(
      // Keyed by revision so a repeat builds a new node. A live region only
      // reports a label that changed, and a report shown again says exactly
      // what it said the first time, so reusing the node would leave a reader
      // with no answer at all to the second attempt.
      key: ValueKey<int>(widget.revision),
      container: true,
      liveRegion: !widget.exiting,
      child: card,
    );
    final animatedCard = AnimatedBuilder(
      animation: _controller,
      child: announced,
      builder: (context, child) {
        final progress = TRGeneratedMotion.standard.transform(
          _controller.value,
        );
        return Align(
          // Collapsing the card's own height is what keeps the toasts above it
          // from jumping when one leaves the middle of the stack. The width
          // factor keeps the card shrink-wrapped; without it the align would
          // stretch the row and its swipe target across the whole region.
          alignment: AlignmentDirectional.topCenter,
          heightFactor: progress,
          widthFactor: 1,
          child: Opacity(
            opacity: progress,
            child: Transform.translate(
              offset: Offset(0, TRGeneratedSpacing.sm * (1 - progress)),
              child: child,
            ),
          ),
        );
      },
    );
    if (!widget.data.dismissible) return animatedCard;
    return Dismissible(
      key: ValueKey(widget.data.id),
      // The card plays its own exit once the controller drops it, so the
      // fling should hand over immediately instead of resizing first.
      resizeDuration: null,
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
