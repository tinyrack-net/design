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
    this.focusNode,
  });

  final Widget Function(
    FocusNode focusNode,
    WidgetStatesController statesController,
  )
  builder;
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

class _TRButtonInteractionFrameState extends State<_TRButtonInteractionFrame> {
  FocusNode? _internalFocusNode;
  late final WidgetStatesController _statesController;
  bool _pointerDown = false;
  bool _spaceDown = false;
  bool _syncingDisabled = false;

  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  bool get _showRing =>
      _focusNode.hasFocus &&
      FocusManager.instance.highlightMode == FocusHighlightMode.traditional;

  @override
  void initState() {
    super.initState();
    _statesController = WidgetStatesController({
      if (widget.disabled) WidgetState.disabled,
    });
    _focusNode.addListener(_handleFocusChange);
    _statesController.addListener(_handleStatesChange);
    HardwareKeyboard.instance.addHandler(_handleKeyEvent);
    FocusManager.instance.addHighlightModeListener(_handleHighlightModeChange);
  }

  @override
  void didUpdateWidget(_TRButtonInteractionFrame oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.disabled != widget.disabled) {
      if (widget.disabled) _spaceDown = false;
      _syncingDisabled = true;
      _statesController.update(WidgetState.disabled, widget.disabled);
      _syncingDisabled = false;
    }
    if (oldWidget.focusNode == widget.focusNode) return;
    (oldWidget.focusNode ?? _internalFocusNode)?.removeListener(
      _handleFocusChange,
    );
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
    HardwareKeyboard.instance.removeHandler(_handleKeyEvent);
    FocusManager.instance.removeHighlightModeListener(
      _handleHighlightModeChange,
    );
    _internalFocusNode?.dispose();
    super.dispose();
  }

  void _handleFocusChange() {
    if (!_focusNode.hasFocus) _spaceDown = false;
    if (mounted) setState(() {});
  }

  void _handleStatesChange() {
    if (mounted && !_syncingDisabled) setState(() {});
  }

  void _handleHighlightModeChange(FocusHighlightMode _) {
    _handleFocusChange();
  }

  bool _handleKeyEvent(KeyEvent event) {
    if (event.logicalKey != LogicalKeyboardKey.space ||
        widget.disabled ||
        !_focusNode.hasFocus) {
      return false;
    }
    if (event is KeyDownEvent) {
      if (!_spaceDown) setState(() => _spaceDown = true);
      return true;
    }
    if (event is KeyUpEvent) {
      final shouldActivate = _spaceDown && _focusNode.hasFocus;
      setState(() => _spaceDown = false);
      if (shouldActivate) widget.onActivate?.call();
      return true;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    final pressed =
        !widget.disabled &&
        (_spaceDown ||
            (_pointerDown &&
                _statesController.value.contains(WidgetState.pressed)));
    final hovered =
        !widget.disabled &&
        _statesController.value.contains(WidgetState.hovered);
    final background = widget.fill(hovered: hovered, pressed: pressed);
    return Shortcuts(
      shortcuts: const {
        SingleActivator(LogicalKeyboardKey.space): DoNothingIntent(),
      },
      child: Listener(
        onPointerCancel: (_) => setState(() => _pointerDown = false),
        onPointerDown: widget.disabled
            ? null
            : (_) => setState(() => _pointerDown = true),
        onPointerUp: (_) => setState(() => _pointerDown = false),
        child: AnimatedContainer(
          curve: TRMotion.standard,
          duration: widget.motionDuration,
          transform: Matrix4.translationValues(
            0,
            pressed ? TRGeneratedMeasurements.controlPressDistance : 0,
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
                  visible: _showRing,
                ),
                child: widget.builder(_focusNode, _statesController),
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
