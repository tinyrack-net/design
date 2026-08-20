import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter/services.dart';

import '../../ui_density.dart';
import '../../generated/tokens.g.dart';
import '../../internal/field_chrome.dart';
import '../../internal/focus_source.dart';
import '../../internal/layer.dart';
import '../../internal/press_interaction.dart';
import '../../internal/form_registry.dart';
import '../../layer_size.dart';
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
part 'select_panel.dart';
part 'select_sheet.dart';

/// How a [TRSelect] presents its shared search and options panel.
sealed class TRSelectPresentation {
  const TRSelectPresentation._();

  /// Presents the panel in a collision-aware layer anchored to the trigger.
  const factory TRSelectPresentation.layer({
    TRLayerWidth width,
    TRLayerHeight height,
    TRLayerPlacement placement,
    bool useRootOverlay,
  }) = TRSelectLayerPresentation;

  /// Presents the panel in a modal bottom sheet.
  const factory TRSelectPresentation.sheet({
    double maxExtent,
    List<double> snapPoints,
    bool showDragHandle,
  }) = TRSelectSheetPresentation;
}

/// Geometry of the layer a [TRSelect] anchors to its trigger.
///
/// The two axes default independently on purpose. A caller almost always wants
/// to state one of them — a fixed popup width, say — and a single
/// [TRLayerSize] for both would make that caller responsible for restating the
/// other. Dropping the height that way is silent: the option list simply grows
/// to the viewport, which is only visible on a long list.
final class TRSelectLayerPresentation extends TRSelectPresentation {
  const TRSelectLayerPresentation({
    this.width = const TRLayerWidth.atLeastAnchor(
      min: TRGeneratedMeasurements.measureMd,
      max: TRGeneratedMeasurements.overlayWidthSm,
    ),
    this.height = const TRLayerHeight.content(
      max: TRGeneratedMeasurements.measureXl,
    ),
    this.placement = TRLayerPlacement.bottomStart,
    this.useRootOverlay = true,
  }) : super._();

  /// Width policy for the complete layer bounds.
  final TRLayerWidth width;

  /// Height policy for the complete layer bounds; the options scroll past it.
  final TRLayerHeight height;

  final TRLayerPlacement placement;
  final bool useRootOverlay;

  /// The two axes as the one policy the layer host resolves.
  TRLayerSize get layerSize => TRLayerSize(width: width, height: height);
}

final class TRSelectSheetPresentation extends TRSelectPresentation {
  const TRSelectSheetPresentation({
    this.maxExtent = 1,
    this.snapPoints = const <double>[],
    this.showDragHandle = true,
  }) : assert(maxExtent > 0 && maxExtent <= 1),
       super._();

  final double maxExtent;
  final List<double> snapPoints;
  final bool showDragHandle;
}

/// Opens and closes a [TRSelect] independently of its presentation.
class TRSelectController extends ChangeNotifier {
  TRSelectController({bool open = false}) : _isOpen = open;

  bool _isOpen;

  bool get isOpen => _isOpen;

  void open() => _setOpen(true);

  void close() => _setOpen(false);

  void toggle() => _setOpen(!_isOpen);

  void _setOpen(bool value) {
    if (_isOpen == value) return;
    _isOpen = value;
    notifyListeners();
  }
}

void _requestSelectOptionFocus(FocusNode node) {
  node.requestFocus();
  WidgetsBinding.instance.addPostFrameCallback((_) {
    final context = node.context;
    if (!node.hasFocus || context == null) return;
    unawaited(
      Scrollable.ensureVisible(
        context,
        alignment: 0.5,
        duration: Duration.zero,
      ),
    );
  });
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
    this.controller,
    this.onOpen,
    this.onClose,
    this.onValueChange,
    this.width,
    this.restorationId,
    this.searchable = false,
    this.searchPlaceholder = 'Search',
    this.noResultsText = 'No results',
    this.filter,
    this.presentation = const TRSelectPresentation.layer(),
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
    this.controller,
    this.onOpen,
    this.onClose,
    this.onValueChange,
    this.width,
    this.restorationId,
    this.searchable = false,
    this.searchPlaceholder = 'Search',
    this.noResultsText = 'No results',
    this.filter,
    this.presentation = const TRSelectPresentation.layer(),
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
  final TRSelectController? controller;
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

  /// The caller-owned presentation used the next time this select opens.
  ///
  /// The value is snapshotted at open time so a rebuild cannot move an active
  /// panel between a layer and a sheet.
  final TRSelectPresentation presentation;
  final bool _controlled;

  @override
  State<TRSelect<T>> createState() => _TRSelectState<T>();
}

class _TRSelectState<T> extends State<TRSelect<T>>
    with RestorationMixin, TRFocusSourceMixin {
  late T? _uncontrolledValue = widget.defaultValue;
  FocusNode? _internalFocusNode;
  TRSelectController? _internalController;
  late final RestorableStringN _restoredLabel;
  final GlobalKey _anchorKey = GlobalKey();
  final List<FocusNode> _itemFocusNodes = [];
  Timer? _typeaheadTimer;
  String _typeaheadBuffer = '';
  bool _reportedOpen = false;
  bool _sheetCloseRequested = false;
  bool _sheetReopenRequested = false;
  bool _deferInitialFilter = false;
  BuildContext? _sheetRouteContext;
  int _openGeneration = 0;
  TRSelectPresentation? _openPresentation;
  final ScrollController _optionsScrollController = ScrollController();
  final FocusNode _layerPanelFocusNode = FocusNode(
    debugLabel: 'TRSelect layer panel',
  );
  FocusNode? _pendingOpenItemFocus;
  TextEditingController? _searchController;
  FocusNode? _searchFocusNode;
  String _query = '';

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
      if (!_deferInitialFilter && !_matches(item)) continue;
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

  TRSelectController get _controller =>
      widget.controller ?? (_internalController ??= TRSelectController());

  @override
  String? get restorationId => widget.restorationId;

  @override
  void initState() {
    super.initState();
    initFocusSource();
    _controller.addListener(_handleControllerChange);
    _restoredLabel = RestorableStringN(_labelFor(_selectedValue));
    _syncItemFocusNodes();
    if (widget.autofocus) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _focusNode.requestFocus();
      });
    }
    if (_controller.isOpen) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted && _controller.isOpen) _open();
      });
    }
  }

  @override
  void didUpdateWidget(TRSelect<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _internalController)?.removeListener(
        _handleControllerChange,
      );
      if (widget.controller != null) {
        _internalController?.dispose();
        _internalController = null;
      }
      _controller.addListener(_handleControllerChange);
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        _controller.isOpen ? _open() : _close();
      });
    }
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
    _optionsScrollController.dispose();
    _layerPanelFocusNode.dispose();
    _controller.removeListener(_handleControllerChange);
    _internalController?.dispose();
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

  void _handleControllerChange() {
    if (_controller.isOpen) {
      if (_reportedOpen &&
          _openPresentation is TRSelectSheetPresentation &&
          _sheetCloseRequested) {
        _sheetReopenRequested = true;
        return;
      }
      _open();
    } else {
      _sheetReopenRequested = false;
      _close();
    }
  }

  void _open() {
    if (_reportedOpen) {
      if (_openPresentation is TRSelectSheetPresentation &&
          _sheetCloseRequested &&
          _controller.isOpen) {
        _sheetReopenRequested = true;
      }
      return;
    }
    if (!widget.enabled || widget.readOnly) {
      _controller.close();
      return;
    }
    if (_optionsScrollController.hasClients) {
      _optionsScrollController.jumpTo(0);
    }
    if (!_deferInitialFilter) {
      _query = '';
      _searchController?.clear();
    }
    _openPresentation = widget.presentation;
    _openGeneration += 1;
    final initialQuery = _query;
    final deferInitialFilter = _deferInitialFilter;
    _reportedOpen = true;
    _sheetCloseRequested = false;
    _sheetReopenRequested = false;
    if (mounted) setState(() {});
    widget.onOpen?.call();

    switch (_openPresentation) {
      case final TRSelectSheetPresentation presentation:
        unawaited(
          _openSheet(
            presentation,
            initialQuery: initialQuery,
            deferInitialFilter: deferInitialFilter,
          ),
        );
      case TRSelectLayerPresentation():
        _focusOpenLayerWhenReady();
      case null:
        break;
    }
  }

  void _close() {
    if (!_reportedOpen) return;
    if (_openPresentation is TRSelectSheetPresentation) {
      _sheetCloseRequested = true;
      final routeContext = _sheetRouteContext;
      if (routeContext != null) {
        unawaited(Navigator.of(routeContext).maybePop());
      }
      return;
    }
    _completeClose();
  }

  void _completeClose({bool preserveController = false}) {
    if (!_reportedOpen) return;
    _reportedOpen = false;
    _openPresentation = null;
    _sheetCloseRequested = false;
    _sheetReopenRequested = false;
    _sheetRouteContext = null;
    _deferInitialFilter = false;
    _pendingOpenItemFocus = null;
    _query = '';
    _searchController?.clear();
    if (mounted) setState(() {});
    if (!preserveController && _controller.isOpen) _controller.close();
    widget.onClose?.call();
    if (!preserveController) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _focusNode.requestFocus();
      });
    }
  }

  void _focusOpenLayerWhenReady([int attempt = 0]) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !_controller.isOpen) return;
      if (_openPresentation is! TRSelectLayerPresentation) return;
      final target = widget.searchable
          ? _searchFocus
          : _pendingOpenItemFocus ??
                _selectedItemFocusNode() ??
                _layerPanelFocusNode;
      if (target.context == null && attempt < 4) {
        _focusOpenLayerWhenReady(attempt + 1);
        return;
      }
      if (target == _searchFocus || target == _layerPanelFocusNode) {
        target.requestFocus();
      } else {
        _requestSelectOptionFocus(target);
      }
      _pendingOpenItemFocus = null;
    });
  }

  FocusNode? _selectedItemFocusNode() {
    final selectedIndex = widget.items.indexWhere(
      (item) => item.enabled && item.value == _selectedValue,
    );
    return selectedIndex < 0 ? null : _itemFocusNodes[selectedIndex];
  }

  void _handleSelected(T? value) {
    if (!widget._controlled) {
      setState(() => _uncontrolledValue = value);
    }
    _restoredLabel.value = _labelFor(value);
    widget.onValueChange?.call(value);
    if (_openPresentation is TRSelectLayerPresentation) _controller.close();
  }

  void _toggleMenu() {
    _controller.toggle();
  }

  Future<void> _openSheet(
    TRSelectSheetPresentation presentation, {
    required String initialQuery,
    required bool deferInitialFilter,
  }) async {
    final uiSize = TRUiDensityScope.resolveSize(context, widget.uiSize);
    final choice = await showTRDrawer<_TRSelectChoice<T>>(
      context: context,
      builder: (routeContext) {
        _sheetRouteContext = routeContext;
        if (_sheetCloseRequested) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (routeContext.mounted) {
              unawaited(Navigator.of(routeContext).maybePop());
            }
          });
        }
        return _TRSelectSheet<T>(
          items: widget.items,
          selectedValue: _selectedValue,
          searchable: widget.searchable,
          initialQuery: initialQuery,
          deferInitialFilter: deferInitialFilter,
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
          maxExtent: presentation.maxExtent,
          snapPoints: presentation.snapPoints,
          showDragHandle: presentation.showDragHandle,
        );
      },
    );
    if (!mounted) return;
    _sheetRouteContext = null;
    if (choice != null) {
      if (!widget._controlled) {
        setState(() => _uncontrolledValue = choice.value);
      }
      _restoredLabel.value = _labelFor(choice.value);
      widget.onValueChange?.call(choice.value);
    }
    final reopen = _sheetReopenRequested && _controller.isOpen;
    _completeClose(preserveController: reopen);
    if (reopen && mounted) _open();
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
      _controller.close();
      return KeyEventResult.handled;
    }
    if (key != LogicalKeyboardKey.arrowDown) return KeyEventResult.ignored;
    final visible = _visible;
    final index = visible.items.indexWhere((item) => item.enabled);
    if (index < 0) return KeyEventResult.handled;
    _requestSelectOptionFocus(visible.focusNodes[index]);
    return KeyEventResult.handled;
  }

  KeyEventResult _handleOptionKey(KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final key = event.logicalKey;
    if (key == LogicalKeyboardKey.escape) {
      _controller.close();
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.arrowDown ||
        key == LogicalKeyboardKey.arrowUp) {
      final visible = _visible;
      final current = visible.focusNodes.indexWhere((node) => node.hasFocus);
      final step = key == LogicalKeyboardKey.arrowDown ? 1 : -1;
      var index = current < 0
          ? (step > 0 ? 0 : visible.items.length - 1)
          : current + step;
      while (index >= 0 && index < visible.items.length) {
        if (visible.items[index].enabled) {
          _requestSelectOptionFocus(visible.focusNodes[index]);
          return KeyEventResult.handled;
        }
        index += step;
      }
      if (step < 0 && widget.searchable) _searchFocus.requestFocus();
      return KeyEventResult.handled;
    }
    return widget.searchable ? KeyEventResult.ignored : _handleTypeahead(event);
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
          _requestSelectOptionFocus(_itemFocusNodes[firstEnabled]);
        }
      }
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.escape && _reportedOpen) {
      _controller.close();
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
    if (!_reportedOpen) {
      _deferInitialFilter = true;
      _setQuery(_query + character);
      _toggleMenu();
    } else {
      _setQuery(_query + character);
    }
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
    if (!_reportedOpen) {
      _pendingOpenItemFocus = _itemFocusNodes[index];
      _toggleMenu();
    } else {
      _requestSelectOptionFocus(_itemFocusNodes[index]);
    }
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final uiSize = TRUiDensityScope.resolveSize(context, widget.uiSize);
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
    final layerPresentation = switch (_openPresentation) {
      final TRSelectLayerPresentation presentation => presentation,
      _ => switch (widget.presentation) {
        final TRSelectLayerPresentation presentation => presentation,
        _ => const TRSelectLayerPresentation(),
      },
    };
    final openGeneration = _openGeneration;
    final select = TRAnchoredLayer(
      open: _reportedOpen && _openPresentation is TRSelectLayerPresentation,
      onOpenChange: (open) => open ? _controller.open() : _controller.close(),
      placement: layerPresentation.placement,
      gap: TRGeneratedSpacing.xs,
      size: layerPresentation.layerSize,
      useRootOverlay: layerPresentation.useRootOverlay,
      layerBuilder: (context) => _TRSelectFrozenSize(
        key: ValueKey<int>(openGeneration),
        onSizeFrozen: _deferInitialFilter
            ? () {
                if (!mounted ||
                    !_reportedOpen ||
                    _openGeneration != openGeneration) {
                  return;
                }
                setState(() => _deferInitialFilter = false);
              }
            : null,
        child: Focus(
          focusNode: _layerPanelFocusNode,
          onKeyEvent: (_, event) => _handleOptionKey(event),
          child: IntrinsicWidth(
            child: TRLayerSurface(
              kind: TRLayerBoundaryKind.select,
              minWidth: 0,
              maxWidth: double.infinity,
              padding: EdgeInsets.zero,
              child: _TRSelectPanel<T>(
                items: visible.items,
                selectedValue: selectedValue,
                interactive: interactive,
                searchable: widget.searchable,
                searchController: _searchTextController,
                searchFocusNode: _searchFocus,
                onQueryChanged: _setQuery,
                onSubmitted: (_) => _commitSoleMatch(),
                searchPlaceholder: widget.searchPlaceholder,
                noResultsText: widget.noResultsText,
                onSelected: _handleSelected,
                uiSize: rowSize,
                scrollController: _optionsScrollController,
                optionsPadding: const EdgeInsets.all(TRGeneratedSpacing.sm),
                focusNodes: visible.focusNodes,
                onRowKeyEvent: _handleOptionKey,
              ),
            ),
          ),
        ),
      ),
      triggerBuilder: (context, open, openLayer, closeLayer, toggleLayer) =>
          Focus(
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
