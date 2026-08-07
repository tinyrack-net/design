import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../generated/tokens.g.dart';
import '../../internal/field_chrome.dart';
import '../../internal/focus_source.dart';
import '../../internal/layer.dart';
import '../../internal/form_registry.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';

part 'select_chevron.dart';
part 'select_form_field.dart';
part 'select_item.dart';

// @tinyrack-preview select
/// A Material-native, single-value select with controlled and uncontrolled APIs.
class TRSelect<T> extends StatefulWidget {
  const TRSelect({
    required this.items,
    this.defaultValue,
    this.label,
    this.placeholder,
    this.helperText,
    this.errorText,
    this.appearance = TRFieldAppearance.solid,
    this.uiSize = TRUiSize.md,
    this.enabled = true,
    this.readOnly = false,
    this.focusNode,
    this.autofocus = false,
    this.menuController,
    this.onOpen,
    this.onClose,
    this.onValueChange,
    this.width,
    this.restorationId,
    super.key,
  }) : value = null,
       _controlled = false;

  /// Creates a select whose value is always supplied by its parent.
  ///
  /// Unlike the default constructor, a `null` [value] explicitly means that no
  /// option is selected.
  const TRSelect.controlled({
    required this.items,
    required this.value,
    this.label,
    this.placeholder,
    this.helperText,
    this.errorText,
    this.appearance = TRFieldAppearance.solid,
    this.uiSize = TRUiSize.md,
    this.enabled = true,
    this.readOnly = false,
    this.focusNode,
    this.autofocus = false,
    this.menuController,
    this.onOpen,
    this.onClose,
    this.onValueChange,
    this.width,
    this.restorationId,
    super.key,
  }) : defaultValue = null,
       _controlled = true;

  final List<TRSelectItem<T>> items;
  final T? defaultValue;
  final T? value;
  final String? label;
  final String? placeholder;
  final String? helperText;
  final String? errorText;

  /// Whether the trigger paints a resting border and fill.
  ///
  /// [TRFieldAppearance.ghost] drops both so a host surface can frame the
  /// select. Unlike a bare surface, the trigger still paints its own hover,
  /// focus, open, and invalid emphasis.
  final TRFieldAppearance appearance;

  final TRUiSize uiSize;
  final bool enabled;
  final bool readOnly;
  final FocusNode? focusNode;
  final bool autofocus;
  final MenuController? menuController;
  final VoidCallback? onOpen;
  final VoidCallback? onClose;
  final ValueChanged<T?>? onValueChange;
  final double? width;
  final String? restorationId;
  final bool _controlled;

  @override
  State<TRSelect<T>> createState() => _TRSelectState<T>();
}

class _TRSelectState<T> extends State<TRSelect<T>>
    with RestorationMixin, TRFocusSourceMixin {
  late T? _uncontrolledValue = widget.defaultValue;
  FocusNode? _internalFocusNode;
  late final MenuController _internalMenuController;
  late final RestorableStringN _restoredLabel;
  final GlobalKey _anchorKey = GlobalKey();
  final List<FocusNode> _itemFocusNodes = [];
  Timer? _typeaheadTimer;
  String _typeaheadBuffer = '';
  double? _anchorWidth;
  bool _reportedOpen = false;

  T? get _selectedValue =>
      widget._controlled ? widget.value : _uncontrolledValue;

  FocusNode get _focusNode =>
      widget.focusNode ?? (_internalFocusNode ??= FocusNode());

  MenuController get _menuController =>
      widget.menuController ?? _internalMenuController;

  @override
  String? get restorationId => widget.restorationId;

  @override
  void initState() {
    super.initState();
    initFocusSource();
    _internalMenuController = MenuController();
    _restoredLabel = RestorableStringN(_labelFor(_selectedValue));
    _syncItemFocusNodes();
    if (widget.autofocus) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _focusNode.requestFocus();
      });
    }
  }

  @override
  void didUpdateWidget(TRSelect<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.items.length != widget.items.length) _syncItemFocusNodes();
    if (oldWidget.value != widget.value || oldWidget.items != widget.items) {
      _restoredLabel.value = _labelFor(_selectedValue);
    }
    if (!oldWidget.autofocus && widget.autofocus) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _focusNode.requestFocus();
      });
    }
  }

  @override
  void dispose() {
    disposeFocusSource();
    _typeaheadTimer?.cancel();
    _restoredLabel.dispose();
    for (final focusNode in _itemFocusNodes) {
      focusNode.dispose();
    }
    _internalFocusNode?.dispose();
    super.dispose();
  }

  @override
  void restoreState(RestorationBucket? oldBucket, bool initialRestore) {
    registerForRestoration(_restoredLabel, 'selected_label');
    if (widget._controlled) return;
    for (final item in widget.items) {
      if (item.label == _restoredLabel.value) {
        _uncontrolledValue = item.value;
        break;
      }
    }
  }

  String _labelFor(T? value) {
    for (final item in widget.items) {
      if (item.value == value) return item.label;
    }
    return '';
  }

  void _syncItemFocusNodes() {
    while (_itemFocusNodes.length > widget.items.length) {
      _itemFocusNodes.removeLast().dispose();
    }
    while (_itemFocusNodes.length < widget.items.length) {
      _itemFocusNodes.add(FocusNode());
    }
  }

  void _handleOpen() {
    if (_reportedOpen) return;
    _reportedOpen = true;
    if (mounted) setState(() {});
    widget.onOpen?.call();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !_menuController.isOpen) return;
      final selectedIndex = widget.items.indexWhere(
        (item) => item.enabled && item.value == _selectedValue,
      );
      if (selectedIndex >= 0) {
        _itemFocusNodes[selectedIndex].requestFocus();
      } else {
        _focusNode.requestFocus();
      }
    });
  }

  void _handleClose() {
    if (!_reportedOpen) return;
    _reportedOpen = false;
    if (mounted) setState(() {});
    widget.onClose?.call();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) _focusNode.requestFocus();
    });
  }

  void _handleSelected(T? value) {
    if (!widget._controlled) {
      setState(() => _uncontrolledValue = value);
    }
    _restoredLabel.value = _labelFor(value);
    widget.onValueChange?.call(value);
    _menuController.close();
  }

  void _toggleMenu() {
    if (_menuController.isOpen) {
      _menuController.close();
      return;
    }
    final renderObject = _anchorKey.currentContext?.findRenderObject();
    if (renderObject is RenderBox && renderObject.hasSize) {
      _anchorWidth = renderObject.size.width;
    }
    setState(() {});
    _menuController.open();
  }

  KeyEventResult _handleTriggerKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent || !widget.enabled || widget.readOnly) {
      return KeyEventResult.ignored;
    }
    final key = event.logicalKey;
    if (key == LogicalKeyboardKey.enter || key == LogicalKeyboardKey.space) {
      _toggleMenu();
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.arrowDown) {
      if (!_menuController.isOpen) {
        _toggleMenu();
      } else {
        final firstEnabled = widget.items.indexWhere((item) => item.enabled);
        if (firstEnabled >= 0) {
          _itemFocusNodes[firstEnabled].requestFocus();
        }
      }
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.escape && _menuController.isOpen) {
      _menuController.close();
      return KeyEventResult.handled;
    }
    return _handleTypeahead(event);
  }

  KeyEventResult _handleTypeahead(KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final character = event.character;
    if (character == null ||
        character.runes.length != 1 ||
        character.trim().isEmpty) {
      return KeyEventResult.ignored;
    }
    _typeaheadTimer?.cancel();
    _typeaheadBuffer += character.toLowerCase();
    _typeaheadTimer = Timer(TRGeneratedMotion.typeaheadDelay, () {
      _typeaheadBuffer = '';
    });
    final index = widget.items.indexWhere(
      (item) =>
          item.enabled && item.label.toLowerCase().startsWith(_typeaheadBuffer),
    );
    if (index < 0) return KeyEventResult.handled;
    if (!_menuController.isOpen) _toggleMenu();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted && _menuController.isOpen) {
        _itemFocusNodes[index].requestFocus();
      }
    });
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final controlHeight = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
    };
    final horizontalPadding = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smPaddingInline,
      TRUiSize.md => TRGeneratedControlMetrics.mdPaddingInline,
      TRUiSize.lg => TRGeneratedControlMetrics.lgPaddingInline,
    };
    final fontSize = switch (widget.uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smFontSize,
      TRUiSize.md => TRGeneratedControlMetrics.mdFontSize,
      TRUiSize.lg => TRGeneratedControlMetrics.lgFontSize,
    };
    final selectedValue = _selectedValue;
    final interactive = widget.enabled && !widget.readOnly;
    final selectedLabel = _labelFor(selectedValue);
    final popupWidth = math.min(
      _anchorWidth ?? widget.width ?? TRGeneratedMeasurements.measureMd,
      math.max(
        0.0,
        MediaQuery.sizeOf(context).width -
            TRGeneratedMeasurements.overlayInlineInset,
      ),
    );
    ButtonStyle itemStyle(bool selected) => ButtonStyle(
      alignment: AlignmentDirectional.centerStart,
      backgroundColor: WidgetStateProperty.resolveWith((states) {
        // Highlight before selection, matching the web and TRLayerStyles.option:
        // the check indicator says which row is selected, the background says
        // which row the keyboard or pointer is on.
        if (states.contains(WidgetState.focused) ||
            states.contains(WidgetState.hovered)) {
          return colors.surfaceHover;
        }
        if (selected) return colors.surfaceSelected;
        return Colors.transparent;
      }),
      foregroundColor: WidgetStateProperty.resolveWith(
        (states) => states.contains(WidgetState.disabled)
            ? colors.textMuted
            : colors.text,
      ),
      iconSize: WidgetStatePropertyAll(
        TRControlMetrics.iconSizeOf(TRLayerStyles.rowSize),
      ),
      minimumSize: WidgetStatePropertyAll(
        Size(0, TRControlMetrics.heightOf(TRLayerStyles.rowSize)),
      ),
      maximumSize: WidgetStatePropertyAll(
        Size(double.infinity, TRControlMetrics.heightOf(TRLayerStyles.rowSize)),
      ),
      overlayColor: const WidgetStatePropertyAll(Colors.transparent),
      padding: WidgetStatePropertyAll(
        EdgeInsets.symmetric(
          horizontal: TRControlMetrics.inlinePaddingOf(TRLayerStyles.rowSize),
        ),
      ),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(TRGeneratedRadii.sm),
        ),
      ),
      side: WidgetStateProperty.resolveWith((states) {
        final highlighted =
            states.contains(WidgetState.focused) || (selected && _reportedOpen);
        return BorderSide(
          color: highlighted ? colors.focus : Colors.transparent,
          width: highlighted
              ? TRGeneratedBorders.focusWidth
              : TRGeneratedBorders.defaultWidth,
        );
      }),
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      textStyle: WidgetStatePropertyAll(
        TRControlMetrics.labelStyleOf(TRLayerStyles.rowSize),
      ),
      visualDensity: VisualDensity.standard,
    );
    // Resolved from the same states for both the fill and the border so the
    // two never disagree about the trigger's appearance.
    TRFieldChrome triggerChrome(Set<WidgetState> states) {
      // Closing the popup restores focus to the trigger unconditionally, so
      // raw focus ownership would light the trigger up after a mouse-driven
      // round trip. Only keyboard focus paints emphasis.
      final focused = focusVisible(
        hasFocus: states.contains(WidgetState.focused),
      );
      final hovered = states.contains(WidgetState.hovered);
      final error = widget.errorText != null;
      return resolveFieldChrome(
        appearance: widget.appearance,
        colors: colors,
        solidFill: !interactive
            ? colors.surfaceMuted
            : hovered
            ? colors.surfaceHover
            : colors.surface,
        solidBorderColor: focused
            ? error
                  ? colors.danger
                  : colors.focus
            : error
            ? colors.dangerBorder
            : colors.border,
        solidBorderWidth: focused
            ? TRGeneratedBorders.focusWidth
            : TRGeneratedBorders.defaultWidth,
        enabled: widget.enabled,
        error: error,
        focused: focused,
        hovered: hovered,
        open: _menuController.isOpen,
        readOnly: widget.readOnly,
      );
    }

    final triggerStyle = ButtonStyle(
      alignment: AlignmentDirectional.centerStart,
      backgroundColor: WidgetStateProperty.resolveWith(
        (states) => triggerChrome(states).fill,
      ),
      // Material paints its own focus and hover overlay on top of the
      // background. The chrome above already answers both, and the web trigger
      // has no focus fill at all, so the overlay is turned off rather than
      // left to tint the trigger after a mouse round trip.
      overlayColor: const WidgetStatePropertyAll(Colors.transparent),
      foregroundColor: WidgetStatePropertyAll(
        widget.enabled ? colors.text : colors.textMuted,
      ),
      minimumSize: const WidgetStatePropertyAll(Size.zero),
      maximumSize: const WidgetStatePropertyAll(Size.infinite),
      padding: WidgetStatePropertyAll(
        EdgeInsets.symmetric(
          horizontal: horizontalPadding + TRGeneratedBorders.defaultWidth,
        ),
      ),
      shape: WidgetStatePropertyAll(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
        ),
      ),
      side: WidgetStateProperty.resolveWith((states) {
        final chrome = triggerChrome(states);
        return BorderSide(color: chrome.borderColor, width: chrome.borderWidth);
      }),
      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      textStyle: WidgetStatePropertyAll(
        TextStyle(
          fontFamily: TRGeneratedFontFamilies.body,
          fontFamilyFallback: TRGeneratedFontFamilies.fallback,
          fontSize: fontSize,
          height: TRGeneratedControlMetrics.mdLineHeight / fontSize,
        ),
      ),
      visualDensity: VisualDensity.standard,
    );
    final triggerContent = widget.width == null
        ? Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              TRLayerPartBoundary(
                name: 'triggerLabel',
                child: Text(
                  selectedLabel.isEmpty
                      ? widget.placeholder ?? ''
                      : selectedLabel,
                  style: selectedLabel.isEmpty
                      ? TextStyle(color: colors.textPlaceholder)
                      : null,
                ),
              ),
              SizedBox(
                width: switch (widget.uiSize) {
                  TRUiSize.sm => TRGeneratedControlMetrics.smGap,
                  TRUiSize.md => TRGeneratedControlMetrics.mdGap,
                  TRUiSize.lg => TRGeneratedControlMetrics.lgGap,
                },
              ),
              TRLayerPartBoundary(
                name: 'triggerIcon',
                child: _TRSelectChevron(color: colors.textMuted),
              ),
            ],
          )
        : Row(
            children: [
              Expanded(
                child: TRLayerPartBoundary(
                  name: 'triggerLabel',
                  child: Text(
                    selectedLabel.isEmpty
                        ? widget.placeholder ?? ''
                        : selectedLabel,
                    overflow: TextOverflow.ellipsis,
                    style: selectedLabel.isEmpty
                        ? TextStyle(color: colors.textPlaceholder)
                        : null,
                  ),
                ),
              ),
              TRLayerPartBoundary(
                name: 'triggerIcon',
                child: _TRSelectChevron(color: colors.textMuted),
              ),
            ],
          );
    final select = MenuAnchor(
      alignmentOffset: const Offset(0, TRGeneratedSpacing.xs),
      animated: !MediaQuery.disableAnimationsOf(context),
      controller: _menuController,
      crossAxisUnconstrained: false,
      menuChildren: [
        TRLayerSurface(
          kind: TRLayerBoundaryKind.select,
          minWidth: popupWidth,
          maxWidth: popupWidth,
          padding: const EdgeInsets.all(TRGeneratedSpacing.sm),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            spacing: TRGeneratedSpacing.xs,
            children: [
              for (var index = 0; index < widget.items.length; index += 1)
                Focus(
                  onKeyEvent: (_, event) => _handleTypeahead(event),
                  child: MenuItemButton(
                    closeOnActivate: true,
                    focusNode: _itemFocusNodes[index],
                    leadingIcon: widget.items[index].leading,
                    onPressed: interactive && widget.items[index].enabled
                        ? () => _handleSelected(widget.items[index].value)
                        : null,
                    style: itemStyle(
                      widget.items[index].value == selectedValue,
                    ),
                    trailingIcon: widget.items[index].trailing == null
                        ? null
                        : TRLayerPartBoundary(
                            name: 'item${index}Indicator',
                            child: widget.items[index].trailing!,
                          ),
                    child: TRLayerPartBoundary(
                      name: 'item${index}Label',
                      child: Text(widget.items[index].label),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
      onClose: _handleClose,
      onOpen: _handleOpen,
      style: TRLayerStyles.menu(
        context,
        alignment: AlignmentDirectional.bottomStart,
        minWidth: popupWidth,
        maxWidth: popupWidth,
      ),
      useRootOverlay: true,
      builder: (context, controller, child) => Focus(
        onKeyEvent: _handleTriggerKey,
        child: Semantics(
          button: true,
          enabled: widget.enabled,
          expanded: controller.isOpen,
          readOnly: widget.readOnly,
          value: selectedLabel.isEmpty ? null : selectedLabel,
          child: SizedBox(
            key: _anchorKey,
            height: controlHeight,
            width: widget.width,
            child: TextButton(
              autofocus: widget.autofocus,
              focusNode: _focusNode,
              onPressed: interactive ? _toggleMenu : null,
              style: triggerStyle,
              child: triggerContent,
            ),
          ),
        ),
      ),
    );
    final supportingText = widget.errorText ?? widget.helperText;
    if (widget.label == null && supportingText == null) return select;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: TRGeneratedControlMetrics.mdGap,
      children: [
        if (widget.label case final label?)
          Text(
            label.toUpperCase(),
            style: TextStyle(
              color: widget.enabled ? colors.text : colors.textMuted,
              fontFamily: TRGeneratedFontFamilies.body,
              fontFamilyFallback: TRGeneratedFontFamilies.fallback,
              fontSize: TRGeneratedTypographySizes.xs,
              fontWeight: TRGeneratedFontWeights.strong,
              height: TRGeneratedTypographyLineHeights.xs,
              letterSpacing:
                  TRGeneratedTypographyTracking.lg *
                  TRGeneratedTypographySizes.xs,
            ),
          ),
        select,
        if (supportingText case final supportingText?)
          Text(
            supportingText,
            style: TextStyle(
              color: widget.errorText == null
                  ? colors.textMuted
                  : colors.danger,
              fontFamily: TRGeneratedFontFamilies.body,
              fontFamilyFallback: TRGeneratedFontFamilies.fallback,
              fontSize: TRGeneratedTypographySizes.xs,
              height: TRGeneratedTypographyLineHeights.md,
            ),
          ),
      ],
    );
  }
}
