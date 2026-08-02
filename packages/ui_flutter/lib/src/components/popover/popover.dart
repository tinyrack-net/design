import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../generated/tokens.g.dart';
import '../../internal/layer.dart';
import '../../types.dart';

/// Controls an uncontrolled [TRPopover].
class TRPopoverController extends ChangeNotifier {
  TRPopoverController({bool open = false})
    : _controller = TRAnchoredLayerController(open: open) {
    _controller.addListener(notifyListeners);
  }

  final TRAnchoredLayerController _controller;

  bool get isOpen => _controller.isOpen;

  void open() => _controller.open();

  void close() => _controller.close();

  void toggle() => _controller.toggle();

  @override
  void dispose() {
    _controller.removeListener(notifyListeners);
    _controller.dispose();
    super.dispose();
  }
}

// @tinyrack-preview popover
/// An interactive, collision-aware surface anchored to a trigger.
class TRPopover extends StatelessWidget {
  const TRPopover({
    required this.trigger,
    required this.content,
    this.actions,
    this.controller,
    this.defaultOpen = false,
    this.description,
    this.onOpenChange,
    this.placement = TRLayerPlacement.bottomStart,
    this.title,
    this.useRootOverlay = true,
    this.width = TRGeneratedMeasurements.overlayWidthSm,
    super.key,
  }) : open = null;

  const TRPopover.controlled({
    required this.trigger,
    required this.content,
    required this.open,
    this.actions,
    this.controller,
    this.description,
    this.onOpenChange,
    this.placement = TRLayerPlacement.bottomStart,
    this.title,
    this.useRootOverlay = true,
    this.width = TRGeneratedMeasurements.overlayWidthSm,
    super.key,
  }) : defaultOpen = false;

  final Widget trigger;
  final Widget content;
  final Widget? actions;
  final TRPopoverController? controller;
  final bool defaultOpen;
  final Widget? description;
  final bool? open;
  final ValueChanged<bool>? onOpenChange;
  final TRLayerPlacement placement;
  final Widget? title;
  final bool useRootOverlay;
  final double width;

  @override
  Widget build(BuildContext context) => TRAnchoredLayer(
    controller: controller?._controller,
    defaultOpen: defaultOpen,
    open: open,
    onOpenChange: onOpenChange,
    placement: placement,
    useRootOverlay: useRootOverlay,
    triggerBuilder: (context, open, openLayer, closeLayer, toggleLayer) =>
        _TRPopoverTrigger(open: open, onActivate: toggleLayer, child: trigger),
    layerBuilder: (context) => TRLayerSurface(
      kind: TRLayerBoundaryKind.popover,
      minWidth: width,
      maxWidth: width,
      padding: const EdgeInsets.all(TRGeneratedSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRGeneratedSpacing.sm,
        children: [
          if (title case final title?)
            TRLayerPartBoundary(
              name: 'title',
              child: DefaultTextStyle.merge(
                style: TRGeneratedTextStyles.headingSm,
                child: title,
              ),
            ),
          if (description case final description?)
            TRLayerPartBoundary(
              name: 'description',
              child: DefaultTextStyle.merge(
                style: TRGeneratedTextStyles.bodySm,
                child: description,
              ),
            ),
          TRLayerPartBoundary(name: 'content', child: content),
          if (actions case final actions?) ...[
            const SizedBox(height: TRGeneratedSpacing.xs),
            Align(alignment: AlignmentDirectional.centerEnd, child: actions),
          ],
        ],
      ),
    ),
  );
}

class _TRPopoverTrigger extends StatelessWidget {
  const _TRPopoverTrigger({
    required this.child,
    required this.onActivate,
    required this.open,
  });

  final Widget child;
  final VoidCallback onActivate;
  final bool open;

  @override
  Widget build(BuildContext context) => Semantics(
    button: true,
    expanded: open,
    child: FocusableActionDetector(
      shortcuts: const {
        SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
        SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
      },
      actions: {
        ActivateIntent: CallbackAction<ActivateIntent>(
          onInvoke: (_) {
            onActivate();
            return null;
          },
        ),
      },
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onActivate,
        child: child,
      ),
    ),
  );
}
