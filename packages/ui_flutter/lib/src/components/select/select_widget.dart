import 'dart:async';
import 'dart:math' as math;

import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';

import '../../ui_density.dart';
import '../../generated/tokens.g.dart';
import '../../internal/field_chrome.dart';
import '../../internal/focus_source.dart';
import '../../internal/layer.dart';
import '../../internal/press_interaction.dart';
import '../../internal/form_registry.dart';
import '../../internal/drawer_scroll_region.dart';
import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';
import '../drawer/drawer.dart';
import '../separator/separator.dart';
import '../text_field/text_field.dart';

part 'select_chevron.dart';
part 'select_form_field.dart';
part 'select_item.dart';
part 'select_options.dart';
part 'select_sheet.dart';

/// Surface a [TRSelect] presents its options on.
enum TRSelectSurface {
  /// A bottom sheet in comfortable [TRUiDensityScope] density, and an
  /// anchored dropdown in standard density.
  ///
  /// Without a density scope, the viewport remains the fallback: a dropdown
  /// at least [TRBreakpoints.small] wide, and a bottom sheet below it.
  auto,

  /// Always an anchored dropdown.
  menu,

  /// Always a bottom sheet.
  sheet,
}

/// Matches an option against the current query.
typedef TRSelectFilter<T> = bool Function(TRSelectItem<T> item, String query);

// @tinyrack-preview select
/// A Material-native, single-value select with controlled and uncontrolled APIs.
class TRSelect<T> extends StatefulWidget {
  const TRSelect({
    required this.items,
    this.defaultValue,
    this.leading,
    this.label,
    this.placeholder,
    this.helperText,
    this.errorText,
    this.appearance = TRFieldAppearance.solid,
    this.uiSize,
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
    this.searchable = false,
    this.searchPlaceholder = 'Search',
    this.noResultsText = 'No results',
    this.filter,
    this.surface = TRSelectSurface.auto,
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
    this.leading,
    this.label,
    this.placeholder,
    this.helperText,
    this.errorText,
    this.appearance = TRFieldAppearance.solid,
    this.uiSize,
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
    this.searchable = false,
    this.searchPlaceholder = 'Search',
    this.noResultsText = 'No results',
    this.filter,
    this.surface = TRSelectSurface.auto,
    super.key,
  }) : defaultValue = null,
       _controlled = true;

  final List<TRSelectItem<T>> items;
  final T? defaultValue;
  final T? value;

  /// Optional content shown before the selected value in the trigger.
  final Widget? leading;

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

  /// Overrides the size supplied by [TRUiDensityScope].
  final TRUiSize? uiSize;
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

  /// Whether the open surface offers a field that filters the options.
  ///
  /// A short list is faster to read than to type against, so this stays off
  /// until a call site says its list is long enough to be worth searching.
  final bool searchable;

  /// Placeholder of the filter field.
  final String searchPlaceholder;

  /// Shown in place of the rows when the filter matches nothing.
  final String noResultsText;

  /// Replaces the default case-insensitive substring match on the item label.
  final TRSelectFilter<T>? filter;

  /// Whether the options open in a dropdown, a sheet, or whichever suits the
  /// inherited density and viewport fallback.
  final TRSelectSurface surface;
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
  TextEditingController? _searchController;
  FocusNode? _searchFocusNode;
  String _query = '';

  /// The surface the currently open options are on, or null while closed.
  ///
  /// Resolved once at open time so a resize cannot swap the surface out from
  /// under a list the user is already reading.
  TRSelectSurface? _openSurface;

  T? get _selectedValue =>
      widget._controlled ? widget.value : _uncontrolledValue;

  TextEditingController get _searchTextController =>
      _searchController ??= TextEditingController(text: _query);

  FocusNode get _searchFocus =>
      _searchFocusNode ??= FocusNode(onKeyEvent: _handleSearchKey);

  /// Options matching the current query, paired with their focus nodes.
  ///
  /// The nodes stay indexed by the item's position in [TRSelect.items] so a
  /// filter change cannot leave arrow-key focus pointing at another row.
  ({List<TRSelectItem<T>> items, List<FocusNode> focusNodes}) get _visible {
    final items = <TRSelectItem<T>>[];
    final focusNodes = <FocusNode>[];
    for (var index = 0; index < widget.items.length; index += 1) {
      final item = widget.items[index];
      if (!_matches(item)) continue;
      items.add(item);
      focusNodes.add(_itemFocusNodes[index]);
    }
    return (items: items, focusNodes: focusNodes);
  }

  bool _matches(TRSelectItem<T> item) {
    if (!widget.searchable || _query.isEmpty) return true;
    final filter = widget.filter;
    if (filter != null) return filter(item, _query);
    final query = _query.toLowerCase();
    return item.label.toLowerCase().contains(query) ||
        (item.description?.toLowerCase().contains(query) ?? false);
  }

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
    _searchController?.dispose();
    _searchFocusNode?.dispose();
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
      if (!mounted || _openSurface != TRSelectSurface.menu) return;
      if (!_menuController.isOpen) return;
      // A searchable select is opened to be typed into, so the query field
      // takes focus rather than the row the value already sits on.
      if (widget.searchable) {
        _searchFocus.requestFocus();
        return;
      }
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
    _openSurface = null;
    _query = '';
    _searchController?.clear();
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
    // The sheet has already popped itself with the chosen value; only the
    // dropdown still needs dismissing.
    if (_openSurface == TRSelectSurface.menu) _menuController.close();
  }

  TRSelectSurface _resolveSurface() {
    if (widget.surface case final surface
        when surface != TRSelectSurface.auto) {
      return surface;
    }
    final density = context
        .getInheritedWidgetOfExactType<TRUiDensityScope>()
        ?.density;
    if (density != null) {
      return density == TRUiDensity.comfortable
          ? TRSelectSurface.sheet
          : TRSelectSurface.menu;
    }
    return MediaQuery.sizeOf(context).width < TRBreakpoints.small
        ? TRSelectSurface.sheet
        : TRSelectSurface.menu;
  }

  void _toggleMenu() {
    if (_reportedOpen) {
      if (_openSurface == TRSelectSurface.menu) _menuController.close();
      return;
    }
    final renderObject = _anchorKey.currentContext?.findRenderObject();
    if (renderObject is RenderBox && renderObject.hasSize) {
      _anchorWidth = renderObject.size.width;
    }
    _query = '';
    _searchController?.clear();
    _openSurface = _resolveSurface();
    if (_openSurface == TRSelectSurface.sheet) {
      unawaited(_openSheet());
      return;
    }
    setState(() {});
    _menuController.open();
  }

  Future<void> _openSheet() async {
    final uiSize = TRUiDensityScope.resolveSize(context, widget.uiSize);
    _handleOpen();
    final choice = await showTRDrawer<_TRSelectChoice<T>>(
      context: context,
      builder: (_) => _TRSelectSheet<T>(
        items: widget.items,
        selectedValue: _selectedValue,
        searchable: widget.searchable,
        initialQuery: _query,
        matches: (item, query) {
          final filter = widget.filter;
          if (filter != null) return filter(item, query);
          final normalizedQuery = query.toLowerCase();
          return item.label.toLowerCase().contains(normalizedQuery) ||
              (item.description?.toLowerCase().contains(normalizedQuery) ??
                  false);
        },
        noResultsText: widget.noResultsText,
        searchPlaceholder: widget.searchPlaceholder,
        uiSize: uiSize,
        label: widget.label,
      ),
    );
    if (!mounted) return;
    if (choice != null) _handleSelected(choice.value);
    _handleClose();
  }

  void _setQuery(String query) {
    if (_query == query) return;
    setState(() => _query = query);
    final controller = _searchController;
    if (controller != null && controller.text != query) {
      controller.value = TextEditingValue(
        text: query,
        selection: TextSelection.collapsed(offset: query.length),
      );
    }
  }

  /// Commits the only remaining match, so Enter finishes a query that has
  /// already narrowed the list to one answer.
  void _commitSoleMatch() {
    final visible = _visible.items;
    if (visible.length != 1) return;
    final item = visible.single;
    if (!item.enabled) return;
    _handleSelected(item.value);
  }

  KeyEventResult _handleSearchKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final key = event.logicalKey;
    if (key == LogicalKeyboardKey.escape) {
      _menuController.close();
      return KeyEventResult.handled;
    }
    if (key != LogicalKeyboardKey.arrowDown) return KeyEventResult.ignored;
    final visible = _visible;
    final index = visible.items.indexWhere((item) => item.enabled);
    if (index < 0) return KeyEventResult.handled;
    visible.focusNodes[index].requestFocus();
    return KeyEventResult.handled;
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
      if (!_reportedOpen) {
        _toggleMenu();
      } else if (widget.searchable) {
        _searchFocus.requestFocus();
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
    // Typeahead jumps between rows, which a query field already does better,
    // so a searchable select spends the same keystroke on the query instead.
    return widget.searchable ? _seedQuery(event) : _handleTypeahead(event);
  }

  KeyEventResult _seedQuery(KeyEvent event) {
    final character = event.character;
    if (character == null ||
        character.runes.length != 1 ||
        character.trim().isEmpty) {
      return KeyEventResult.ignored;
    }
    if (!_reportedOpen) _toggleMenu();
    _setQuery(_query + character);
    return KeyEventResult.handled;
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
    final uiSize = TRUiDensityScope.resolveSize(context, widget.uiSize);
    final density = TRUiDensityScope.of(context);
    final rowSize = TRLayerStyles.rowSizeOf(context);
    final colors = context.tinyrackTheme;
    final controlHeight = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smHeight,
      TRUiSize.md => TRGeneratedControlMetrics.mdHeight,
      TRUiSize.lg => TRGeneratedControlMetrics.lgHeight,
      TRUiSize.xl => TRGeneratedControlMetrics.xlHeight,
    };
    final horizontalPadding = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smPaddingInline,
      TRUiSize.md => TRGeneratedControlMetrics.mdPaddingInline,
      TRUiSize.lg => TRGeneratedControlMetrics.lgPaddingInline,
      TRUiSize.xl => TRGeneratedControlMetrics.xlPaddingInline,
    };
    final fontSize = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smFontSize,
      TRUiSize.md => TRGeneratedControlMetrics.mdFontSize,
      TRUiSize.lg => TRGeneratedControlMetrics.lgFontSize,
      TRUiSize.xl => TRGeneratedControlMetrics.xlFontSize,
    };
    final controlGap = switch (uiSize) {
      TRUiSize.sm => TRGeneratedControlMetrics.smGap,
      TRUiSize.md => TRGeneratedControlMetrics.mdGap,
      TRUiSize.lg => TRGeneratedControlMetrics.lgGap,
      TRUiSize.xl => TRGeneratedControlMetrics.xlGap,
    };
    final selectedValue = _selectedValue;
    final interactive = widget.enabled && !widget.readOnly;
    final selectedLabel = _labelFor(selectedValue);
    final visible = _visible;
    final anchorWidth =
        _anchorWidth ?? widget.width ?? TRGeneratedMeasurements.measureMd;
    final availablePopupWidth = math.max(
      0.0,
      MediaQuery.sizeOf(context).width -
          TRGeneratedMeasurements.overlayInlineInset,
    );
    final contentWidth =
        widget.searchable ||
            widget.items.any((item) => item.description != null)
        ? TRGeneratedMeasurements.measureLg
        : anchorWidth;
    final popupWidth = math.min(
      math.max(anchorWidth, contentWidth),
      math.min(TRGeneratedMeasurements.overlayWidthSm, availablePopupWidth),
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
            : focused
            ? colors.surface
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
        open: _reportedOpen,
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
              if (widget.leading case final leading?) ...[
                TRLayerPartBoundary(
                  name: 'triggerLeading',
                  child: IconTheme.merge(
                    data: IconThemeData(
                      size: TRControlMetrics.iconSizeOf(uiSize),
                    ),
                    child: leading,
                  ),
                ),
                SizedBox(width: controlGap),
              ],
              Flexible(
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
              SizedBox(width: controlGap),
              TRLayerPartBoundary(
                name: 'triggerIcon',
                child: _TRSelectChevron(color: colors.textMuted),
              ),
            ],
          )
        : Row(
            children: [
              if (widget.leading case final leading?) ...[
                TRLayerPartBoundary(
                  name: 'triggerLeading',
                  child: IconTheme.merge(
                    data: IconThemeData(
                      size: TRControlMetrics.iconSizeOf(uiSize),
                    ),
                    child: leading,
                  ),
                ),
                SizedBox(width: controlGap),
              ],
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
      crossAxisUnconstrained: true,
      menuChildren: [
        TRUiDensityScope(
          density: density,
          child: TRLayerSurface(
            kind: TRLayerBoundaryKind.select,
            minWidth: popupWidth,
            maxWidth: popupWidth,
            padding: EdgeInsets.zero,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisSize: MainAxisSize.min,
              children: [
                if (widget.searchable)
                  Padding(
                    padding: const EdgeInsets.all(TRGeneratedSpacing.sm),
                    child: TRTextField(
                      controller: _searchTextController,
                      focusNode: _searchFocus,
                      onChanged: _setQuery,
                      onSubmitted: (_) => _commitSoleMatch(),
                      placeholder: widget.searchPlaceholder,
                      uiSize: rowSize,
                    ),
                  ),
                if (widget.searchable)
                  const TRSeparator(variant: TRSeparatorVariant.muted),
                // A long list has to scroll inside the layer rather than grow
                // past the viewport it is anchored in.
                ConstrainedBox(
                  constraints: const BoxConstraints(
                    maxHeight: TRGeneratedMeasurements.measureXl,
                  ),
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(TRGeneratedSpacing.sm),
                    // The menu panel already owns the primary controller, and
                    // a scrollbar cannot be shared between two positions.
                    primary: false,
                    child: _TRSelectOptions<T>(
                      items: visible.items,
                      selectedValue: selectedValue,
                      interactive: interactive,
                      noResultsText: widget.noResultsText,
                      onSelected: _handleSelected,
                      uiSize: rowSize,
                      focusNodes: visible.focusNodes,
                      onRowKeyEvent: widget.searchable
                          ? null
                          : _handleTypeahead,
                    ),
                  ),
                ),
              ],
            ),
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
          // Both surfaces answer this, so it tracks the select's own open
          // state rather than the menu controller the sheet never uses.
          expanded: _reportedOpen,
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
