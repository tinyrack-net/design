part of 'button_widget.dart';

class _TRButtonInteractionFrame extends StatefulWidget {
  const _TRButtonInteractionFrame({
    required this.builder,
    required this.color,
    required this.disabled,
    required this.fill,
    required this.motionDuration,
    required this.onActivate,
    required this.opacity,
    this.autofocus = false,
    this.focusNode,
  });

  final Widget Function(
    FocusNode focusNode,
    WidgetStatesController statesController,
    VoidCallback? onPressed,
  )
  builder;
  final bool autofocus;
  final Color color;
  final bool disabled;
  final Color Function({required bool hovered, required bool pressed}) fill;
  final FocusNode? focusNode;
  final Duration motionDuration;
  final VoidCallback? onActivate;
  final double opacity;

  @override
  State<_TRButtonInteractionFrame> createState() =>
      _TRButtonInteractionFrameState();
}

class _TRButtonInteractionFrameState extends State<_TRButtonInteractionFrame>
    with TRFocusSourceMixin, TRForcedStatesMixin {
  FocusNode? _internalFocusNode;
  late final FocusNode _materialFocusNode;
  late final WidgetStatesController _statesController;
  bool _keyboardVisualPressed = false;
  bool _pointerDown = false;
  bool _syncingDisabled = false;

  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  bool _showRing(BuildContext context) =>
      resolveFocusVisible(context, hasFocus: _focusNode.hasFocus);

  @override
  void initState() {
    super.initState();
    _statesController = WidgetStatesController({
      if (widget.disabled) WidgetState.disabled,
    });
    _materialFocusNode = FocusNode(canRequestFocus: false, skipTraversal: true);
    _focusNode.addListener(_handleFocusChange);
    _statesController.addListener(_handleStatesChange);
    initFocusSource();
  }

  @override
  void didUpdateWidget(_TRButtonInteractionFrame oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.disabled != widget.disabled) {
      _pointerDown = false;
      _keyboardVisualPressed = false;
      _syncingDisabled = true;
      _statesController.update(WidgetState.pressed, false);
      _statesController.update(WidgetState.disabled, widget.disabled);
      _syncingDisabled = false;
    }
    if (oldWidget.focusNode == widget.focusNode) return;
    final oldFocusNode = oldWidget.focusNode ?? _internalFocusNode;
    oldFocusNode?.removeListener(_handleFocusChange);
    _internalFocusNode?.dispose();
    _internalFocusNode = null;
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChange);
    _statesController
      ..removeListener(_handleStatesChange)
      ..dispose();
    _materialFocusNode.dispose();
    disposeFocusSource();
    _internalFocusNode?.dispose();
    super.dispose();
  }

  void _handleFocusChange() {
    if (mounted) setState(() {});
  }

  void _handleStatesChange() {
    if (mounted && !_syncingDisabled) setState(() {});
  }

  void _handleNativeActivate() {
    widget.onActivate?.call();
  }

  KeyEventResult _handleKeyEvent(FocusNode node, KeyEvent event) {
    if (widget.disabled) return KeyEventResult.ignored;
    if (event.logicalKey == LogicalKeyboardKey.enter && event is KeyDownEvent) {
      widget.onActivate?.call();
      return KeyEventResult.handled;
    }
    if (event.logicalKey != LogicalKeyboardKey.space) {
      return KeyEventResult.ignored;
    }
    final pressed = event is! KeyUpEvent;
    if (_keyboardVisualPressed != pressed && mounted) {
      setState(() => _keyboardVisualPressed = pressed);
    }
    if (event is KeyUpEvent) widget.onActivate?.call();
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final forced = forcedStates(context);
    final statePressed =
        !widget.disabled &&
        _statesController.value.contains(WidgetState.pressed);
    // The declared press is folded in at the read, never written into
    // `_pointerDown`: that flag has exactly one writer, the real pointer
    // listener below, and a second one would leave the button stuck down once
    // the declaration went away. The disabled gate is explicit so a declared
    // press on a disabled button cannot paint one.
    final pointerPressed =
        !widget.disabled && (forced.pressed || (statePressed && _pointerDown));
    final keyboardPressed =
        !widget.disabled && (forced.keyboardPressed || _keyboardVisualPressed);
    final pressed = keyboardPressed || pointerPressed;
    final hovered =
        !widget.disabled &&
        (forced.hovered ||
            _statesController.value.contains(WidgetState.hovered));
    final background = widget.fill(hovered: hovered, pressed: pressed);
    return Focus(
      autofocus: widget.autofocus,
      focusNode: _focusNode,
      onKeyEvent: _handleKeyEvent,
      child: Listener(
        onPointerCancel: (_) => setState(() => _pointerDown = false),
        onPointerDown: widget.disabled
            ? null
            : (_) {
                _focusNode.requestFocus();
                setState(() => _pointerDown = true);
              },
        onPointerUp: (_) => setState(() => _pointerDown = false),
        child: Transform.translate(
          offset: Offset(
            0,
            keyboardPressed ? TRGeneratedMeasurements.controlPressDistance : 0,
          ),
          child: AnimatedContainer(
            curve: TRMotion.standard,
            duration: widget.motionDuration,
            transform: Matrix4.translationValues(
              0,
              pointerPressed ? TRGeneratedMeasurements.controlPressDistance : 0,
              0,
            ),
            child: AnimatedOpacity(
              curve: TRMotion.standard,
              duration: widget.motionDuration,
              opacity: widget.opacity,
              child: AnimatedContainer(
                curve: TRMotion.standard,
                duration: widget.motionDuration,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
                  color: background,
                ),
                child: CustomPaint(
                  foregroundPainter: _TRFocusRingPainter(
                    color: widget.color,
                    visible: _showRing(context),
                  ),
                  child: widget.builder(
                    _materialFocusNode,
                    _statesController,
                    widget.disabled ? null : _handleNativeActivate,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _TRFocusRingPainter extends CustomPainter {
  const _TRFocusRingPainter({required this.color, required this.visible});

  final Color color;
  final bool visible;

  @override
  void paint(Canvas canvas, Size size) {
    if (!visible) return;
    const width = TRGeneratedBorders.focusWidth;
    const offset = TRGeneratedBorders.focusOffset;
    final rect = (Offset.zero & size).inflate(offset + width / 2);
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        rect,
        const Radius.circular(
          TRGeneratedRadii.md +
              TRGeneratedBorders.focusOffset +
              TRGeneratedBorders.focusWidth / 2,
        ),
      ),
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = width,
    );
  }

  @override
  bool shouldRepaint(_TRFocusRingPainter oldDelegate) =>
      color != oldDelegate.color || visible != oldDelegate.visible;
}
