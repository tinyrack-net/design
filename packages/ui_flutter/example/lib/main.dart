import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart';
// The preview reads package rendering metadata through internal helpers; it is
// not a published consumer.
// ignore: implementation_imports
import 'package:tinyrack_ui/src/generated/tokens.g.dart';
// ignore: implementation_imports
import 'package:tinyrack_ui/src/internal/layer.dart';
// ignore: implementation_imports
import 'package:tinyrack_ui/src/internal/motion_boundary.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

import 'code_highlighter.dart';
import 'preview_bridge.dart';
import 'preview_examples.dart';
import 'preview_registry.g.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  final query = Uri.base.queryParameters;
  timeDilation = query['motion'] == 'true' ? 100 : 1;
  runApp(
    TRCodeHighlighterProvider(
      highlighter: previewCodeHighlighter,
      child: PreviewApp(
        component: supportedPreviewComponents.contains(query['component'])
            ? query['component']!
            : 'button',
        example: query['example'],
        initialTheme: query['theme'] == 'dark'
            ? ThemeMode.dark
            : ThemeMode.light,
        locale: switch (query['locale']) {
          'ko' => const Locale('ko'),
          'ja' => const Locale('ja'),
          _ => const Locale('en'),
        },
      ),
    ),
  );
}

class PreviewApp extends StatefulWidget {
  const PreviewApp({
    required this.component,
    required this.initialTheme,
    required this.locale,
    this.example,
    super.key,
  });

  final String component;

  /// When set, the app renders the named docs example composition instead of
  /// the single playground widget.
  final String? example;
  final ThemeMode initialTheme;
  final Locale locale;

  @override
  State<PreviewApp> createState() => _PreviewAppState();
}

class _PreviewAppState extends State<PreviewApp> {
  late final PreviewBridge _bridge;
  late final TextEditingController _textFieldController;
  late final TROtpFieldController _otpFieldController;
  final GlobalKey<NavigatorState> _navigatorKey = GlobalKey<NavigatorState>();
  late GlobalKey _previewKey;
  final Map<String, GlobalKey> _partKeys = {};
  Map<String, Object?> _args = const {};
  late String _component;
  late Locale _locale;
  late ThemeMode _themeMode;
  bool _focused = false;
  bool _focusVisible = false;
  bool _hovered = false;
  bool _pressed = false;
  int _activations = 0;
  int _contentRevision = 0;
  final int _generation = 0;

  @override
  void initState() {
    super.initState();
    _component = widget.component;
    _locale = widget.locale;
    _previewKey = GlobalKey();
    _themeMode = widget.initialTheme;
    _textFieldController = TextEditingController();
    _otpFieldController = TROtpFieldController();
    _bridge = PreviewBridge(_handleMessage);
    HardwareKeyboard.instance.addHandler(_handleHardwareKey);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _bridge.send('ready', _component, {
        'generation': _generation,
        'supportedArgs': _supportedArgs(_component),
      });
      final example = widget.example;
      if (example != null && !previewExampleScenarios.containsKey(example)) {
        _sendSchemaError('example');
      }
      _sendMetrics();
    });
  }

  void _sendMetrics({Object? requestId}) {
    final layerKind = _args['open'] == true
        ? switch (_component) {
            'alert-dialog' => TRLayerBoundaryKind.alertDialog,
            'autocomplete' => TRLayerBoundaryKind.autocomplete,
            'combobox' => TRLayerBoundaryKind.combobox,
            'inline-suggestions' => TRLayerBoundaryKind.inlineSuggestions,
            'context-menu' => TRLayerBoundaryKind.contextMenu,
            'dialog' => TRLayerBoundaryKind.dialog,
            'drawer' => TRLayerBoundaryKind.drawer,
            'menu' => TRLayerBoundaryKind.menu,
            'menubar' => TRLayerBoundaryKind.menubar,
            'navigation-menu' => TRLayerBoundaryKind.navigationMenu,
            'popover' => TRLayerBoundaryKind.popover,
            'preview-card' => TRLayerBoundaryKind.previewCard,
            'select' => TRLayerBoundaryKind.select,
            'toast' => TRLayerBoundaryKind.toast,
            'tooltip' => TRLayerBoundaryKind.tooltip,
            _ => null,
          }
        : null;
    final popupRenderObject = layerKind == null
        ? null
        : _layerBoundary(layerKind);
    final renderObject =
        popupRenderObject ?? _previewKey.currentContext?.findRenderObject();
    if (renderObject is! RenderBox || !renderObject.hasSize) return;
    final origin = renderObject.localToGlobal(Offset.zero);
    double? motionOpacity;
    final globalTransform = renderObject.getTransformTo(null).storage;
    final motionScaleX = globalTransform[0].abs();
    final motionScaleY = globalTransform[5].abs();
    double? motionTranslateX;
    double? motionTranslateY;
    double? motionProgress;
    void findMotionProgress(RenderObject node) {
      if (motionProgress != null) return;
      if (node is RenderTRMotionBoundary) {
        motionProgress = node.progress;
        return;
      }
      node.visitChildren(findMotionProgress);
    }

    findMotionProgress(renderObject);
    RenderObject? ancestor = renderObject.parent;
    while (ancestor != null) {
      if (motionOpacity == null && ancestor is RenderOpacity) {
        motionOpacity = ancestor.opacity;
      } else if (motionOpacity == null && ancestor is RenderAnimatedOpacity) {
        motionOpacity = ancestor.opacity.value;
      }
      if (_component == 'drawer' && ancestor is RenderFractionalTranslation) {
        motionTranslateX = ancestor.translation.dx * renderObject.size.width;
        motionTranslateY = ancestor.translation.dy * renderObject.size.height;
      } else if (_component == 'toast' && ancestor is RenderTransform) {
        final transform = ancestor.getTransformTo(ancestor.parent).storage;
        motionTranslateX ??= transform[12];
        motionTranslateY ??= transform[13];
      }
      ancestor = ancestor.parent;
    }
    if (_component == 'toast' && motionOpacity != null) {
      motionTranslateX = 0;
      motionTranslateY = TRGeneratedSpacing.sm * (1 - motionOpacity);
    }
    double? baseline;
    try {
      baseline = renderObject.getDistanceToBaseline(TextBaseline.alphabetic);
    } catch (_) {
      baseline = null;
    }
    final activePartNames = _activeLayerPartNames();
    final layerParts = _layerParts(renderObject);
    final parts = {
      for (final MapEntry(:key, :value) in _partKeys.entries)
        if (key != 'popup' &&
            (activePartNames == null || activePartNames.contains(key)))
          key: _measure(value),
      for (final MapEntry(:key, :value) in layerParts.entries)
        if (activePartNames == null || activePartNames.contains(key))
          key: value,
      // The copy button's labels live inside TRButton's pressed transform;
      // report the first label paragraph so the harness can anchor the
      // press translation like it does for plain buttons.
      if (_component == 'copy-button')
        'label': _measureBox(_firstParagraph(renderObject)),
    }..removeWhere((_, value) => value == null);
    _bridge.send('metrics', _component, {
      'args': _args,
      'bounds': {
        'x': origin.dx,
        'y': origin.dy,
        'width': renderObject.size.width,
        'height': renderObject.size.height,
      },
      'baseline': baseline,
      'devicePixelRatio': View.of(context).devicePixelRatio,
      'interaction': {
        'activations': _activations,
        'enabled': _args['disabled'] != true && _args['loading'] != true,
        // Text fields used to be exempted here, transcribing the DOM rule that
        // `:focus-visible` always matches them. Both platforms now gate focus
        // emphasis on the input modality instead, so the exemption would report
        // a ring that neither of them paints.
        'focusVisible': _focused && _focusVisible,
        'focused': _focused,
        'hovered': _hovered,
        'invalid': _args['errorText'] != null,
        'loading': _args['loading'] == true,
        'pressed': _pressed,
        'readonly': _args['readOnly'] == true,
      },
      if (motionOpacity != null || layerKind != null)
        'motion': {
          'opacity': ?motionOpacity,
          'scaleX': motionScaleX,
          'scaleY': motionScaleY,
          'translateX': ?motionTranslateX,
          'translateY': ?motionTranslateY,
        },
      'motionProgress': ?motionProgress,
      if (renderObject is RenderParagraph)
        'textStyle': {
          'fontFamily': renderObject.text.style?.fontFamily,
          'fontSize': renderObject.text.style?.fontSize,
          'fontWeight': renderObject.text.style?.fontWeight?.value,
          'letterSpacing': renderObject.text.style?.letterSpacing,
        },
      'parts': parts,
      'generation': _generation,
      'theme': _themeMode.name,
      if (requestId is num) 'requestId': requestId,
    });
  }

  RenderParagraph? _firstParagraph(RenderObject root) {
    RenderParagraph? paragraph;
    void visit(RenderObject node) {
      if (paragraph != null) return;
      if (node is RenderParagraph) {
        paragraph = node;
        return;
      }
      node.visitChildren(visit);
    }

    visit(root);
    return paragraph;
  }

  Set<String>? _activeLayerPartNames() {
    final open = _args['open'] == true;
    return switch ((_component, open)) {
      ('menu', false) => const {'triggerLabel'},
      ('menu', true) => const {
        'checkboxIndicator',
        'checkboxLabel',
        'groupLabel',
        'radioIndicator',
        'radioLabel',
      },
      ('select', false) => const {'triggerIcon', 'triggerLabel'},
      ('select', true) => const {'item0Indicator', 'item0Label', 'item1Label'},
      ('dialog', false) => const {'triggerLabel'},
      ('dialog', true) => const {
        'actionLabel',
        'body',
        'cancelLabel',
        'description',
        'title',
      },
      _ => null,
    };
  }

  Map<String, Map<String, Object?>> _layerParts(RenderObject root) {
    final parts = <String, Map<String, Object?>>{};
    final rootBounds = root is RenderBox && root.hasSize
        ? root.localToGlobal(Offset.zero) & root.size
        : null;
    void visit(RenderObject node) {
      if (node is RenderTRLayerPartBoundary) {
        final nodeBounds = node.hasSize
            ? node.localToGlobal(Offset.zero) & node.size
            : null;
        final measurement = _measureBox(node);
        if (measurement != null &&
            (rootBounds == null ||
                nodeBounds == null ||
                rootBounds.overlaps(nodeBounds) ||
                rootBounds.contains(nodeBounds.center))) {
          parts.putIfAbsent(node.name, () => measurement);
        }
      }
      node.visitChildren(visit);
    }

    visit(root);
    for (final view in RendererBinding.instance.renderViews) {
      visit(view);
    }
    return parts;
  }

  Map<String, Object?>? _measure(GlobalKey key) =>
      _measureBox(key.currentContext?.findRenderObject());

  RenderTRLayerBoundary? _layerBoundary(TRLayerBoundaryKind expectedKind) {
    RenderTRLayerBoundary? result;
    void visit(RenderObject node) {
      if (result != null) return;
      if (node is RenderTRLayerBoundary && node.kind == expectedKind) {
        result = node;
        return;
      }
      node.visitChildren(visit);
    }

    for (final view in RendererBinding.instance.renderViews) {
      visit(view);
      if (result != null) break;
    }
    return result;
  }

  Map<String, Object?>? _measureBox(RenderObject? renderObject) {
    if (renderObject is! RenderBox || !renderObject.hasSize) return null;
    final paragraph = switch (renderObject) {
      RenderParagraph paragraph => paragraph,
      RenderTRLayerPartBoundary part
          when !part.name.endsWith('Indicator') &&
              !part.name.endsWith('Icon') &&
              !part.name.endsWith('Surface') =>
        _firstParagraph(part),
      _ => null,
    };
    final textBounds = paragraph == null ? null : _paragraphBounds(paragraph);
    final origin =
        textBounds?.topLeft ?? renderObject.localToGlobal(Offset.zero);
    final size = textBounds?.size ?? renderObject.size;
    double? baseline;
    try {
      final paragraphOrigin = paragraph?.localToGlobal(Offset.zero);
      final paragraphBaseline = paragraph?.getDistanceToBaseline(
        TextBaseline.alphabetic,
      );
      baseline = paragraphOrigin != null && paragraphBaseline != null
          ? paragraphOrigin.dy + paragraphBaseline - origin.dy
          : renderObject.getDistanceToBaseline(TextBaseline.alphabetic);
    } catch (_) {
      baseline = null;
    }
    return {
      'bounds': {
        'x': origin.dx,
        'y': origin.dy,
        'width': size.width,
        'height': size.height,
      },
      'baseline': baseline,
      if (paragraph != null) 'text': paragraph.text.toPlainText(),
    };
  }

  Rect? _paragraphBounds(RenderParagraph paragraph) {
    final text = paragraph.text.toPlainText();
    if (text.isEmpty) return null;
    final boxes = paragraph.getBoxesForSelection(
      TextSelection(baseOffset: 0, extentOffset: text.length),
    );
    if (boxes.isEmpty) return null;
    var bounds = boxes.first.toRect();
    for (final box in boxes.skip(1)) {
      bounds = bounds.expandToInclude(box.toRect());
    }
    final paragraphOrigin = paragraph.localToGlobal(Offset.zero);
    final glyphOrigin = paragraph.localToGlobal(Offset(bounds.left, 0));
    return Rect.fromLTWH(
      glyphOrigin.dx,
      paragraphOrigin.dy,
      bounds.width,
      paragraph.size.height,
    );
  }

  void _handleMessage(Map<String, Object?> message) {
    if (message['channel'] != 'tinyrack.flutter-preview.v1') {
      return;
    }
    final type = message['type'];
    final payload = message['payload'];
    final requestId = message['requestId'];
    if (message['component'] != _component) return;
    if (type == 'ready' ||
        type == 'configured' ||
        type == 'environmentConfigured' ||
        type == 'scenarioRendered' ||
        type == 'stateChanged' ||
        type == 'metrics' ||
        type == 'error') {
      // The standalone preview posts responses to its own window. Ignore
      // outbound protocol messages when parent and child are the same realm.
      return;
    }
    if (type == 'reset') {
      FocusManager.instance.primaryFocus?.unfocus();
      _textFieldController.clear();
      _otpFieldController.clear();
      setState(() {
        _activations = 0;
        _args = const {};
        _contentRevision += 1;
        _focusVisible = false;
        _focused = false;
        _pressed = false;
      });
    } else if (type == 'setTheme' && payload is Map) {
      if (payload['theme'] case final String theme
          when theme == 'light' || theme == 'dark') {
        setState(() {
          _themeMode = theme == 'dark' ? ThemeMode.dark : ThemeMode.light;
        });
      } else {
        _sendSchemaError(type);
        return;
      }
    } else if (type == 'updateArgs' && payload is Map) {
      final nextArgs = _validateArgs(_component, payload);
      if (nextArgs == null) {
        _sendSchemaError(type);
        return;
      }
      if (_component == 'text-field') {
        final value = nextArgs['value'];
        if (value is String && _textFieldController.text != value) {
          _textFieldController.value = TextEditingValue(
            text: value,
            selection: TextSelection.collapsed(offset: value.length),
          );
        }
      }
      if (_component == 'otp-field') {
        final value = nextArgs['value'];
        if (value is String) _otpFieldController.value = value;
      }
      setState(() {
        _args = {..._args, ...nextArgs};
      });
    } else if (type == 'measure') {
      if (payload is Map && payload['afterFrame'] == false) {
        _sendMetrics(requestId: requestId);
        return;
      }
      // Report after the next frame so layout, paint transforms and
      // interaction state all belong to the same request generation.
      WidgetsBinding.instance.addPostFrameCallback(
        (_) => _sendMetrics(requestId: requestId),
      );
      WidgetsBinding.instance.ensureVisualUpdate();
      return;
    } else {
      _sendSchemaError(type);
      return;
    }
    _bridge.send('stateChanged', _component, {
      'args': _args,
      'generation': _generation,
      'theme': _themeMode.name,
      if (requestId is num) 'requestId': requestId,
    });
    WidgetsBinding.instance.addPostFrameCallback(
      (_) => _sendMetrics(requestId: requestId),
    );
  }

  void _sendSchemaError(Object? type) {
    _bridge.send('error', _component, {
      'code': 'invalid-message',
      'messageType': type is String ? type : 'unknown',
    });
  }

  void _updateInteraction({bool? focused, bool? hovered, bool? pressed}) {
    _focused = focused ?? _focused;
    _hovered = hovered ?? _hovered;
    _pressed = pressed ?? _pressed;
    WidgetsBinding.instance.addPostFrameCallback((_) => _sendMetrics());
  }

  bool _handleHardwareKey(KeyEvent event) {
    if (event is KeyDownEvent) _focusVisible = true;
    return false;
  }

  Widget _previewContent(PreviewExampleBuilder? exampleBuilder) {
    if (exampleBuilder != null) {
      return Builder(builder: (context) => exampleBuilder(context, _locale));
    }
    return MouseRegion(
      onEnter: (_) => _updateInteraction(hovered: true),
      onExit: (_) => _updateInteraction(hovered: false),
      child: Listener(
        onPointerCancel: (_) => _updateInteraction(pressed: false),
        onPointerDown: (_) {
          _focusVisible = false;
          _updateInteraction(pressed: true);
        },
        onPointerUp: (_) => _updateInteraction(pressed: false),
        child: Focus(
          canRequestFocus: false,
          onFocusChange: (focused) => _updateInteraction(focused: focused),
          child: PreviewComponent(
            key: ValueKey('$_component-$_contentRevision'),
            args: _args,
            component: _component,
            contentRevision: _contentRevision,
            locale: _locale.languageCode,
            measureKey: _previewKey,
            partKeys: _partKeys,
            textFieldController: _textFieldController,
            otpFieldController: _otpFieldController,
            onStateChanged: (payload) {
              if (payload['pressed'] == true) _activations += 1;
              _bridge.send('stateChanged', _component, {
                ...payload,
                'generation': _generation,
              });
              WidgetsBinding.instance.addPostFrameCallback(
                (_) => _sendMetrics(),
              );
            },
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    HardwareKeyboard.instance.removeHandler(_handleHardwareKey);
    _bridge.dispose();
    _textFieldController.dispose();
    _otpFieldController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final exampleBuilder = widget.example == null
        ? null
        : previewExampleScenarios[widget.example];
    final preview = _previewContent(exampleBuilder);
    _bridge.syncPageBackground(
      _cssColor(
        (_themeMode == ThemeMode.dark
                ? TRGeneratedColors.dark
                : TRGeneratedColors.light)
            .surface,
      ),
    );
    return MaterialApp(
      navigatorKey: _navigatorKey,
      debugShowCheckedModeBanner: false,
      locale: _locale,
      localizationsDelegates: GlobalMaterialLocalizations.delegates,
      supportedLocales: const [Locale('en'), Locale('ko'), Locale('ja')],
      theme: TinyrackTheme.light(),
      darkTheme: TinyrackTheme.dark(),
      themeAnimationDuration: Duration.zero,
      themeMode: _themeMode,
      home: Scaffold(
        body: SafeArea(
          child: Center(
            child: _component == 'app-shell'
                ? preview
                : SingleChildScrollView(
                    padding: const EdgeInsets.all(32),
                    child: preview,
                  ),
          ),
        ),
      ),
    );
  }
}

/// Reads the field appearance a preview scenario asks for.
TRFieldAppearance _fieldAppearance(Map<String, Object?> args) =>
    switch (args['appearance']) {
      'ghost' => TRFieldAppearance.ghost,
      'plain' => TRFieldAppearance.plain,
      _ => TRFieldAppearance.solid,
    };

List<String> _supportedArgs(String component) => switch (component) {
  'button' => [
    'appearance',
    'children',
    'disabled',
    'intent',
    'loading',
    'loadingLabel',
    'uiSize',
  ],
  'alert' => ['showActions', 'showDescription', 'showIcon', 'variant'],
  'badge' => ['uiSize', 'variant'],
  'card' => ['focused', 'padding', 'variant'],
  'drop-overlay' => ['visible'],
  'focus-ring' => ['focused'],
  'code-block' => ['code', 'language', 'wrap'],
  'dialog' => ['open', 'placement'],
  'autocomplete' => [
    'appearance',
    'completionMode',
    'disabled',
    'errorText',
    'open',
    'placeholder',
    'readOnly',
    'uiSize',
  ],
  'alert-dialog' => ['disabled', 'label', 'open'],
  'combobox' => [
    'appearance',
    'autoHighlight',
    'clearable',
    'disabled',
    'disabledOption',
    'filterMode',
    'layout',
    'open',
    'placeholder',
    'readOnly',
    'uiSize',
  ],
  'inline-suggestions' => ['disabledOption', 'open', 'status'],
  'context-menu' ||
  'navigation-menu' ||
  'popover' ||
  'preview-card' ||
  'toast' ||
  'tooltip' => ['open'],
  'app-shell' => [
    'breakpoint',
    'controlAppearance',
    'layout',
    'mobileSidebar',
    'open',
    'sidebarCollapsed',
    'sidebarMode',
  ],
  'drawer' => ['open', 'swipeDirection'],
  'slider' => ['disabled', 'label', 'orientation', 'uiSize'],
  'menu' => ['disabled', 'open'],
  'menubar' => ['open'],
  'select' => [
    'appearance',
    'disabled',
    'errorText',
    'open',
    'readOnly',
    'uiSize',
    'value',
  ],
  'icon-button' => [
    'appearance',
    'disabled',
    'intent',
    'loading',
    'loadingLabel',
    'uiSize',
  ],
  'spinner' => ['uiSize', 'variant'],
  'text' => ['align', 'color', 'truncate', 'variant', 'weight'],
  'separator' => ['orientation', 'variant'],
  'skeleton' => ['animate', 'shape'],
  'avatar' => ['shape', 'uiSize'],
  'fieldset' => ['disabled', 'legend'],
  'field' => ['disabled', 'errorText', 'helper'],
  'form' => ['label', 'required', 'submitLabel'],
  'meter' => ['value', 'variant'],
  'progress' => ['uiSize', 'value', 'variant'],
  'qr-code' => ['data', 'uiSize'],
  'radial-meter' => ['uiSize', 'value', 'variant'],
  'link' => ['disabled', 'underline', 'variant'],
  'toggle' => ['disabled', 'pressed', 'uiSize'],
  'checkbox' => ['checked', 'disabled', 'indeterminate', 'mark', 'uiSize'],
  'radio' => ['checked', 'disabled', 'readOnly', 'uiSize'],
  'switch' => ['checked', 'disabled', 'invalid', 'readOnly'],
  'toggle-group' => [
    'disabled',
    'disabledItem',
    'loopFocus',
    'multiple',
    'orientation',
    'selectedValues',
  ],
  'collapsible' => ['disabled', 'open'],
  'accordion' => ['disabledItem', 'multiple', 'open'],
  'animated-number' => [
    'animation',
    'duration',
    'formatPreset',
    'locale',
    'rollDirection',
    'value',
  ],
  'code' => ['data'],
  'copy-button' => [
    'appearance',
    'copiedLabel',
    'idleLabel',
    'intent',
    'resetDelay',
    'uiSize',
    'value',
  ],
  'checkbox-group' => ['disabled', 'label', 'readOnly', 'selectedValues'],
  'radio-group' => ['disabled', 'readOnly', 'selectedValue'],
  'textarea' => [
    'appearance',
    'disabled',
    'placeholder',
    'readOnly',
    'uiSize',
    'value',
  ],
  'tabs' => ['uiSize'],
  'pagination' => [
    'boundaryCount',
    'currentPage',
    'siblingCount',
    'totalPages',
  ],
  'scroll-area' => ['autoHide'],
  'table' => ['density', 'striped'],
  'tree-nav' => ['collapsed', 'selected'],
  'window-frame' => ['padding', 'variant'],
  'text-field' => [
    'appearance',
    'disabled',
    'errorText',
    'placeholder',
    'readOnly',
    'uiSize',
    'value',
  ],
  'otp-field' => [
    'appearance',
    'disabled',
    'errorText',
    'helperText',
    'length',
    'obscureText',
    'readOnly',
    'uiSize',
    'value',
  ],
  'number-field' => ['appearance'],
  _ => const <String>[],
};

String _cssColor(Color color) =>
    '#${(color.toARGB32() & 0xffffff).toRadixString(16).padLeft(6, '0')}';

Map<String, Object?>? _validateArgs(
  String component,
  Map<Object?, Object?> raw,
) {
  final allowed = _supportedArgs(component).toSet();
  final result = <String, Object?>{};
  for (final MapEntry(:key, :value) in raw.entries) {
    if (key is! String || !allowed.contains(key)) return null;
    final valid = switch (key) {
      'boundaryCount' || 'currentPage' || 'siblingCount' || 'totalPages' =>
        value is num || (value is String && int.tryParse(value) != null),
      'density' =>
        value is String &&
            const {'compact', 'comfortable', 'spacious'}.contains(value),
      'striped' => value is bool,
      // A field has no outline step, so it is checked before the shared action
      // rule that allows one.
      'appearance'
          when const {
            'autocomplete',
            'combobox',
            'number-field',
            'otp-field',
            'select',
            'text-field',
            'textarea',
          }.contains(component) =>
        value is String && const {'solid', 'ghost', 'plain'}.contains(value),
      'appearance' =>
        value is String && const {'solid', 'outline', 'ghost'}.contains(value),
      'filterMode' when component == 'combobox' =>
        value is String &&
            const {'contains', 'startsWith', 'none'}.contains(value),
      'layout' when component == 'combobox' =>
        value is String && const {'list', 'grid'}.contains(value),
      'status' when component == 'inline-suggestions' =>
        value is String && const {'ready', 'loading', 'error'}.contains(value),
      'required' when component == 'form' => value is bool,
      'submitLabel' when component == 'form' => value is String,
      'copiedLabel' when component == 'copy-button' => value is String,
      'idleLabel' when component == 'copy-button' => value is String,
      'resetDelay' when component == 'copy-button' =>
        value is num && value >= 0 && value <= 5000,
      'value' when component == 'animated-number' || component == 'meter' =>
        value is num,
      'value' when component == 'progress' =>
        value is num || value == 'indeterminate',
      'duration' when component == 'animated-number' =>
        value is num && value >= 0 && value <= 1500,
      'animation' when component == 'animated-number' =>
        value is String && const {'roll', 'count'}.contains(value),
      'formatPreset' when component == 'animated-number' =>
        value is String &&
            const {'decimal', 'currency', 'percent', 'unit'}.contains(value),
      'locale' when component == 'animated-number' =>
        value is String && const {'en-US', 'ko-KR', 'ja-JP'}.contains(value),
      'rollDirection' when component == 'animated-number' =>
        value is String && const {'auto', 'up', 'down'}.contains(value),
      'controlAppearance' =>
        value is String && const {'solid', 'outline', 'ghost'}.contains(value),
      'breakpoint' => value is String && const {'sm', 'lg'}.contains(value),
      'layout' =>
        value is String &&
            const {'header-first', 'sidebar-first'}.contains(value),
      'mobileSidebar' =>
        value is String && const {'drawer', 'rail'}.contains(value),
      'sidebarMode' =>
        value is String && const {'expanded', 'rail'}.contains(value),
      'children' ||
      'code' ||
      'data' ||
      'errorText' ||
      'helperText' ||
      'label' ||
      'legend' ||
      'loadingLabel' ||
      'placeholder' ||
      'selectedValue' ||
      'value' => value is String,
      'animate' ||
      'autoHide' ||
      'autoHighlight' ||
      'checked' ||
      'clearable' ||
      'collapsed' ||
      'disabled' ||
      'disabledItem' ||
      'disabledOption' ||
      'focused' ||
      'indeterminate' ||
      'invalid' ||
      'open' ||
      'loading' ||
      'loopFocus' ||
      'multiple' ||
      'obscureText' ||
      'pressed' ||
      'readOnly' ||
      'showActions' ||
      'showDescription' ||
      'showIcon' ||
      'sidebarCollapsed' ||
      'selected' ||
      'truncate' ||
      'visible' => value is bool,
      'wrap' => value is bool,
      'language' =>
        value is String && const {'plain', 'dart', 'json'}.contains(value),
      'underline' =>
        value is String && const {'always', 'hover', 'none'}.contains(value),
      'variant' when component == 'link' =>
        value is String && const {'default', 'muted', 'danger'}.contains(value),
      'mark' =>
        value is String &&
            const {'unchecked', 'checked', 'indeterminate'}.contains(value),
      'selectedValues' =>
        value is List && value.every((entry) => entry is String),
      'orientation' =>
        value is String && const {'horizontal', 'vertical'}.contains(value),
      'swipeDirection' =>
        value is String &&
            const {'down', 'up', 'left', 'right'}.contains(value),
      'placement' =>
        value is String &&
            const {'middle', 'top', 'bottom', 'start', 'end'}.contains(value),
      'shape' when component == 'skeleton' =>
        value is String &&
            const {'text', 'rectangle', 'circle'}.contains(value),
      'shape' when component == 'avatar' =>
        value is String && const {'circle', 'square'}.contains(value),
      'intent' =>
        value is String &&
            const {
              'neutral',
              'primary',
              'info',
              'success',
              'warning',
              'danger',
            }.contains(value),
      'variant'
          when component == 'alert' ||
              component == 'badge' ||
              component == 'meter' ||
              component == 'progress' =>
        value is String &&
            const {
              'neutral',
              'info',
              'success',
              'warning',
              'danger',
            }.contains(value),
      'helper' =>
        value is String && const {'none', 'description'}.contains(value),
      'variant' when component == 'card' =>
        value is String &&
            const {'default', 'outlined', 'elevated'}.contains(value),
      'variant' when component == 'window-frame' =>
        value is String && const {'macos', 'browser'}.contains(value),
      'padding' =>
        value is String && const {'none', 'sm', 'md', 'lg'}.contains(value),
      'completionMode' =>
        value is String &&
            const {'manual', 'list', 'inline', 'both'}.contains(value),
      'variant' when component == 'spinner' =>
        value is String &&
            const {'current', 'muted', 'primary', 'danger'}.contains(value),
      'variant' when component == 'separator' =>
        value is String && const {'defaultVariant', 'muted'}.contains(value),
      'variant' when component == 'text' =>
        value is String &&
            const {
              'caption',
              'label',
              'body',
              'bodySm',
              'code',
              'headingSm',
              'headingMd',
              'headingLg',
              'display',
              'displayLg',
            }.contains(value),
      'color' =>
        value is String &&
            const {
              'default',
              'muted',
              'placeholder',
              'inverse',
              'primary',
              'info',
              'success',
              'warning',
              'danger',
            }.contains(value),
      'align' =>
        value is String && const {'start', 'center', 'end'}.contains(value),
      'weight' =>
        value is String &&
            const {
              'regular',
              'medium',
              'heading',
              'bold',
              'strong',
            }.contains(value),
      'uiSize' => value is String && const {'sm', 'md', 'lg'}.contains(value),
      'length' when component == 'otp-field' =>
        value is num && value >= 3 && value <= 8,
      _ => false,
    };
    if (!valid) return null;
    result[key] = value;
  }
  return result;
}

class _PreviewAnimatedNumber extends StatelessWidget {
  const _PreviewAnimatedNumber({required this.args, required this.measureKey});

  final Map<String, Object?> args;
  final Key measureKey;

  @override
  Widget build(BuildContext context) {
    final locale = (args['locale'] as String? ?? 'en-US').replaceAll('-', '_');
    final preset = args['formatPreset'] as String? ?? 'decimal';
    final hasFormatPreset = args.containsKey('formatPreset');
    final numberFormat = switch (preset) {
      'currency' => NumberFormat.simpleCurrency(locale: locale, name: 'USD'),
      'percent' => NumberFormat.percentPattern(
        locale,
      )..maximumFractionDigits = 1,
      _ => NumberFormat.decimalPattern(locale),
    };
    final unitFormatter = hasFormatPreset && preset == 'unit'
        ? (double value) => '${numberFormat.format(value)} GB'
        : null;
    return TRAnimatedNumber(
      animation: TRAnimatedNumberAnimation.values.byName(
        args['animation'] as String? ?? 'roll',
      ),
      duration: Duration(
        milliseconds: (args['duration'] as num? ?? 600).round(),
      ),
      formatter: unitFormatter,
      key: measureKey,
      numberFormat: hasFormatPreset && unitFormatter == null
          ? numberFormat
          : null,
      rollDirection: TRAnimatedNumberRollDirection.values.byName(
        args['rollDirection'] as String? ?? 'auto',
      ),
      value: (args['value'] as num? ?? 12345).toDouble(),
    );
  }
}

class PreviewComponent extends StatelessWidget {
  const PreviewComponent({
    required this.args,
    required this.component,
    this.contentRevision = 0,
    required this.locale,
    required this.measureKey,
    required this.partKeys,
    required this.textFieldController,
    required this.otpFieldController,
    required this.onStateChanged,
    super.key,
  });

  final Map<String, Object?> args;
  final String component;
  final int contentRevision;
  final String locale;
  final Key measureKey;
  final Map<String, GlobalKey> partKeys;
  final TextEditingController textFieldController;
  final TROtpFieldController otpFieldController;
  final ValueChanged<Map<String, Object?>> onStateChanged;

  String get _label => switch (locale) {
    'ko' => '배포',
    'ja' => 'デプロイ',
    _ => 'Deploy',
  };

  String get _otpLabel => switch (locale) {
    'ko' => '인증 코드',
    'ja' => '認証コード',
    _ => 'Verification code',
  };

  /// Splits the slot row in half with a rule, and keeps the plain gaps on the
  /// remaining seams aligned with the resolved [TRUiSize].
  TROtpSeparatorBuilder _otpSeparatorBuilder(TRUiSize uiSize, int length) {
    final slotHeight = TRControlMetrics.heightOf(uiSize);
    final gap = TRControlMetrics.gapOf(uiSize);
    final middle = length ~/ 2 - 1;
    return (context, index) => index == middle
        ? SizedBox(
            width: gap * 2,
            child: Center(
              child: Container(
                width: TRGeneratedBorders.defaultWidth,
                height: slotHeight,
                color: context.tinyrackTheme.border,
              ),
            ),
          )
        : SizedBox(width: gap);
  }

  GlobalKey _partKey(String name) => partKeys.putIfAbsent(name, GlobalKey.new);

  int _intArg(String name, int fallback) => switch (args[name]) {
    final num value => value.round(),
    final String value => int.tryParse(value) ?? fallback,
    _ => fallback,
  };

  @override
  Widget build(BuildContext context) {
    final intent = TRIntent.values.byName(
      args['intent'] is String ? args['intent']! as String : 'primary',
    );
    final size = TRUiSize.values.byName(
      args['uiSize'] is String ? args['uiSize']! as String : 'md',
    );
    final statusVariant = switch (component) {
      'alert' ||
      'badge' ||
      'meter' ||
      'progress' => TRStatusVariant.values.byName(
        args['variant'] is String ? args['variant']! as String : 'neutral',
      ),
      _ => TRStatusVariant.neutral,
    };
    return switch (component) {
      'button' => TRButton(
        appearance: TRAppearance.values.byName(
          args['appearance'] is String
              ? args['appearance']! as String
              : 'solid',
        ),
        intent: intent,
        loading: args['loading'] == true,
        loadingLabel: args['loadingLabel'] is String
            ? args['loadingLabel']! as String
            : switch (locale) {
                'ko' => '배포 중',
                'ja' => 'デプロイ中',
                _ => 'Deploying',
              },
        onPressed: args['disabled'] == true
            ? null
            : () => onStateChanged({'pressed': true}),
        uiSize: size,
        key: measureKey,
        child: Text(
          key: _partKey('label'),
          args['children'] is String ? args['children']! as String : _label,
        ),
      ),
      'icon-button' => TRIconButton(
        appearance: TRAppearance.values.byName(
          args['appearance'] is String
              ? args['appearance']! as String
              : 'solid',
        ),
        icon: _PreviewPlusIcon(key: _partKey('icon')),
        intent: intent,
        label: switch (locale) {
          'ko' => '랙 추가',
          'ja' => 'ラックを追加',
          _ => 'Add rack',
        },
        loading: args['loading'] == true,
        loadingLabel: args['loadingLabel'] is String
            ? args['loadingLabel']! as String
            : null,
        onPressed: args['disabled'] == true
            ? null
            : () => onStateChanged({'pressed': true}),
        uiSize: size,
        key: measureKey,
      ),
      'text-field' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRTextField(
          controller: textFieldController,
          enabled: args['disabled'] != true,
          errorText: args['errorText'] is String
              ? args['errorText']! as String
              : null,
          label: switch (locale) {
            'ko' => '랙 이름',
            'ja' => 'ラック名',
            _ => 'Rack name',
          },
          placeholder: args['placeholder'] is String
              ? args['placeholder']! as String
              : 'Rack alpha',
          readOnly: args['readOnly'] == true,
          onChanged: (value) => onStateChanged({
            'args': {'value': value},
          }),
          uiSize: size,
          appearance: TRFieldAppearance.values.byName(
            args['appearance'] is String
                ? args['appearance']! as String
                : 'solid',
          ),
        ),
      ),
      'card' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRCard(
          focused: args['focused'] == true,
          padding: TRCardPadding.values.byName(
            args['padding'] is String ? args['padding']! as String : 'md',
          ),
          variant: switch (args['variant']) {
            'outlined' => TRCardVariant.outlined,
            'elevated' => TRCardVariant.elevated,
            _ => TRCardVariant.defaultVariant,
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: TRSpacing.medium,
            children: [
              TRCardHeader(
                key: _partKey('header'),
                children: [
                  TRCardTitle(
                    key: _partKey('title'),
                    child: const Text('Rack alpha'),
                  ),
                  TRCardDescription(
                    key: _partKey('description'),
                    child: const Text('4 services are healthy.'),
                  ),
                ],
              ),
              TRCardContent(
                key: _partKey('content'),
                child: const TRText(
                  'Latency 18 ms',
                  variant: TRTextVariant.bodySm,
                ),
              ),
              TRCardFooter(
                key: _partKey('footer'),
                children: [
                  const TRText(
                    'Updated now',
                    color: TRTextColor.muted,
                    variant: TRTextVariant.bodySm,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
      'focus-ring' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRFocusRing(
          focused: args['focused'] == true,
          child: const SizedBox(
            height: 88,
            child: Center(child: Text('Composite control')),
          ),
        ),
      ),
      'drop-overlay' => SizedBox(
        key: measureKey,
        width: 320,
        height: 200,
        child: TRDropOverlay(
          visible: args['visible'] != false,
          label: switch (locale) {
            'ko' => '여기에 파일을 놓으세요',
            'ja' => 'ここにファイルをドロップ',
            _ => 'Drop files here',
          },
          child: const Center(child: Text('Conversation pane')),
        ),
      ),
      'menu' => _PreviewMenu(
        args: args,
        locale: locale,
        measureKey: measureKey,
        onStateChanged: onStateChanged,
        partKeys: partKeys,
      ),
      'select' => SizedBox(
        key: measureKey,
        child: _PreviewSelect(
          args: args,
          key: ValueKey(
            '${args['uiSize']}:${args['open']}:${args['value']}:${args['disabled']}:${args['readOnly']}:${args['appearance']}',
          ),
          locale: locale,
          onStateChanged: onStateChanged,
          partKeys: partKeys,
          size: size,
        ),
      ),
      'dialog' => _PreviewDialog(
        args: args,
        key: measureKey,
        locale: locale,
        onStateChanged: onStateChanged,
        partKeys: partKeys,
      ),
      'alert-dialog' => _PreviewAlertDialog(
        args: args,
        key: measureKey,
        locale: locale,
        onStateChanged: onStateChanged,
      ),
      'app-shell' => _PreviewAppShell(
        args: args,
        key: measureKey,
        locale: locale,
        onStateChanged: onStateChanged,
        partKeys: partKeys,
      ),
      'autocomplete' => _PreviewAutocomplete(
        args: args,
        key: measureKey,
        locale: locale,
      ),
      'combobox' => _PreviewCombobox(
        args: args,
        key: measureKey,
        locale: locale,
      ),
      'context-menu' => _PreviewContextMenu(
        args: args,
        key: measureKey,
        locale: locale,
      ),
      'inline-suggestions' => _PreviewInlineSuggestions(
        args: args,
        key: measureKey,
        locale: locale,
      ),
      'drawer' => _PreviewDrawer(args: args, key: measureKey, locale: locale),
      'file-tree' => SizedBox(
        key: measureKey,
        width: 320,
        child: const TRFileTree(
          nodes: [
            TRFileTreeDirectory(
              name: 'lib',
              path: '/lib',
              initiallyExpanded: true,
              children: [
                TRFileTreeFile(name: 'main.dart', path: '/lib/main.dart'),
                TRFileTreeFile(name: 'theme.dart', path: '/lib/theme.dart'),
              ],
            ),
            TRFileTreeFile(name: 'pubspec.yaml', path: '/pubspec.yaml'),
          ],
        ),
      ),
      'form' => _PreviewForm(args: args, key: measureKey, locale: locale),
      'menubar' => _PreviewMenubar(
        args: args,
        key: measureKey,
        onStateChanged: onStateChanged,
      ),
      'navigation-menu' => _PreviewNavigationMenu(args: args, key: measureKey),
      'number-field' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRNumberField(
          appearance: _fieldAppearance(args),
          defaultValue: 12,
          label: 'Replicas',
          min: 0,
          max: 100,
        ),
      ),
      'otp-field' => TROtpField(
        key: measureKey,
        controller: otpFieldController,
        enabled: args['disabled'] != true,
        errorText: args['errorText'] is String && args['errorText'] != ''
            ? args['errorText']! as String
            : null,
        helperText: args['helperText'] is String && args['helperText'] != ''
            ? args['helperText']! as String
            : null,
        label: _otpLabel,
        length: _intArg('length', 6),
        obscureText: args['obscureText'] == true,
        readOnly: args['readOnly'] == true,
        uiSize: size,
        onValueChange: (next) => onStateChanged({
          'args': {'value': next},
        }),
        separatorBuilder: _otpSeparatorBuilder(size, _intArg('length', 6)),
      ),
      'pagination' => TRPagination(
        key: measureKey,
        currentPage: _intArg('currentPage', 3),
        totalPages: _intArg('totalPages', 12),
        boundaryCount: _intArg('boundaryCount', 1),
        siblingCount: _intArg('siblingCount', 1),
        previousLabel: switch (locale) {
          'ko' => '이전',
          'ja' => '前へ',
          _ => 'Previous',
        },
        nextLabel: switch (locale) {
          'ko' => '다음',
          'ja' => '次へ',
          _ => 'Next',
        },
        onPageChanged: (page) => onStateChanged({
          'args': {'currentPage': page},
        }),
      ),
      'popover' => _PreviewPopover(args: args, key: measureKey),
      'preview-card' => _PreviewPreviewCard(args: args, key: measureKey),
      'scroll-area' => SizedBox(
        key: measureKey,
        width: 320,
        height: 160,
        child: TRScrollArea(
          autoHide: args['autoHide'] == true,
          semanticLabel: 'Rack activity',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              for (var index = 1; index <= 12; index += 1)
                Padding(
                  padding: const EdgeInsets.all(8),
                  child: Text('Deployment $index'),
                ),
            ],
          ),
        ),
      ),
      'slider' => SizedBox(
        key: measureKey,
        height: args['orientation'] == 'vertical' ? 240 : null,
        width: args['orientation'] == 'vertical' ? null : 320,
        child: TRSlider(
          defaultValue: 40,
          enabled: args['disabled'] != true,
          label: args['label'] is String
              ? args['label']! as String
              : switch (locale) {
                  'ko' => '트래픽',
                  'ja' => 'トラフィック',
                  _ => 'Traffic',
                },
          uiSize: size,
          vertical: args['orientation'] == 'vertical',
        ),
      ),
      'toast' => SizedBox(
        width: 416,
        height: 220,
        child: _PreviewToast(
          locale: locale,
          measureKey: measureKey,
          open: args['open'] == true,
        ),
      ),
      'toolbar' => TRToolbar(
        key: measureKey,
        semanticLabel: 'Formatting',
        children: [
          TRToolbarButton(
            onPressed: () {},
            child: const Icon(Icons.format_bold, size: 16),
          ),
          TRToolbarButton(
            onPressed: () {},
            child: const Icon(Icons.format_italic, size: 16),
          ),
          const TRToolbarSeparator(),
          const TRToolbarInput(placeholder: 'Search'),
        ],
      ),
      'tooltip' => _PreviewTooltip(args: args, key: measureKey, locale: locale),
      'tree-nav' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRTreeNav<String>(
          key: ValueKey(
            'tree-nav-${args['collapsed'] == true}-${args['selected'] != false}',
          ),
          defaultValue: args['selected'] == false ? null : 'theming',
          items: [
            TRTreeNavGroup(
              value: 'getting-started',
              label: Text(switch (locale) {
                'ko' => '시작하기',
                'ja' => 'はじめに',
                _ => 'GETTING STARTED',
              }, key: _partKey('group0Label')),
              initiallyExpanded: args['collapsed'] != true,
              children: [
                TRTreeNavLeaf(
                  value: 'install',
                  label: Text(switch (locale) {
                    'ko' => '설치',
                    'ja' => 'インストール',
                    _ => 'Install',
                  }, key: _partKey('leaf0Label')),
                ),
                TRTreeNavGroup(
                  value: 'advanced',
                  label: Text(switch (locale) {
                    'ko' => '고급',
                    'ja' => '高度な設定',
                    _ => 'ADVANCED',
                  }, key: _partKey('group1Label')),
                  initiallyExpanded: true,
                  children: [
                    TRTreeNavLeaf(
                      value: 'plugins',
                      label: Text(switch (locale) {
                        'ko' => '플러그인',
                        'ja' => 'プラグイン',
                        _ => 'Plugins',
                      }, key: _partKey('leaf1Label')),
                    ),
                    TRTreeNavLeaf(
                      value: 'theming',
                      label: Text(switch (locale) {
                        'ko' => '테마',
                        'ja' => 'テーマ',
                        _ => 'Theming',
                      }, key: _partKey('leaf2Label')),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
      'table' => TRTable(
        key: measureKey,
        caption: Text(switch (locale) {
          'ko' => '랙 상태',
          'ja' => 'ラックの状態',
          _ => 'Rack status',
        }),
        density: TRTableDensity.values.byName(
          args['density'] as String? ?? 'comfortable',
        ),
        striped: args['striped'] == true,
        columns: const [
          TRTableColumn(label: Text('Rack')),
          TRTableColumn(label: Text('Status')),
        ],
        rows: const [
          TRTableRow(cells: [Text('Rack A'), Text('Healthy')]),
          TRTableRow(cells: [Text('Rack B'), Text('Degraded')]),
        ],
      ),
      'window-frame' => SizedBox(
        key: measureKey,
        width: 400,
        child: TRWindowFrame(
          variant: args['variant'] == 'browser'
              ? TRWindowFrameVariant.browser
              : TRWindowFrameVariant.macos,
          padding: TRWindowFramePadding.values.byName(
            args['padding'] as String? ?? 'md',
          ),
          title: const Text('zsh — tinyrack'),
          address: const Text('https://tinyrack.net'),
          body: const SizedBox(
            height: 39.796875,
            child: Text('❯ tinyrack status\n✓ Ready'),
          ),
        ),
      ),
      'alert' => SizedBox(
        key: measureKey,
        width: 360,
        child: TRAlert(
          actions: args['showActions'] == true
              ? [
                  TRText(
                    'Review',
                    key: _partKey('actions'),
                    variant: TRTextVariant.bodySm,
                    weight: TRTextWeight.medium,
                  ),
                ]
              : const [],
          variant: statusVariant,
          icon: args['showIcon'] == true
              ? _PreviewStatusIcon(key: _partKey('icon'))
              : null,
          title: Text(switch (locale) {
            'ko' => '변경 사항을 저장했어요',
            'ja' => '変更を保存しました',
            _ => 'Changes saved',
          }, key: _partKey('title')),
          description: args['showDescription'] == true
              ? Text(switch (locale) {
                  'ko' => '랙 구성이 최신 상태예요.',
                  'ja' => 'ラック構成は最新です。',
                  _ => 'The rack configuration is up to date.',
                }, key: _partKey('description'))
              : null,
        ),
      ),
      'badge' => TRBadge(
        key: measureKey,
        variant: statusVariant,
        uiSize: size,
        child: Text(switch (locale) {
          'ko' => '정상',
          'ja' => '正常',
          _ => 'Healthy',
        }, key: _partKey('label')),
      ),
      'spinner' => TRSpinner(
        key: measureKey,
        label: switch (locale) {
          'ko' => '불러오는 중',
          'ja' => '読み込み中',
          _ => 'Loading',
        },
        uiSize: size,
        variant: TRSpinnerVariant.values.byName(
          args['variant'] is String ? args['variant']! as String : 'current',
        ),
      ),
      'text' => TRText(
        switch (locale) {
          'ko' => '랙 상태',
          'ja' => 'ラックの状態',
          _ => 'Rack status',
        },
        align: args['align'] is String
            ? TRTextAlign.values.byName(args['align']! as String)
            : null,
        color: args['color'] is String
            ? switch (args['color']) {
                'default' => TRTextColor.defaultColor,
                final String color => TRTextColor.values.byName(color),
                _ => null,
              }
            : null,
        truncate: args['truncate'] == true,
        variant: TRTextVariant.values.byName(
          args['variant'] is String ? args['variant']! as String : 'headingMd',
        ),
        weight: args['weight'] is String
            ? TRTextWeight.values.byName(args['weight']! as String)
            : null,
        key: measureKey,
      ),
      // Even-sized wrappers keep the 1px separator on whole device pixels;
      // centering the bare line would land it on a half pixel, which Flutter
      // antialiases while Chromium snaps.
      'separator' =>
        args['orientation'] == 'vertical'
            ? SizedBox(
                key: measureKey,
                width: 32,
                height: 64,
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: TRSeparator(
                    orientation: TRSeparatorOrientation.vertical,
                    variant: TRSeparatorVariant.values.byName(
                      args['variant'] is String
                          ? args['variant']! as String
                          : 'defaultVariant',
                    ),
                  ),
                ),
              )
            : SizedBox(
                key: measureKey,
                width: 320,
                height: 32,
                child: Align(
                  alignment: Alignment.topCenter,
                  child: TRSeparator(
                    variant: TRSeparatorVariant.values.byName(
                      args['variant'] is String
                          ? args['variant']! as String
                          : 'defaultVariant',
                    ),
                  ),
                ),
              ),
      'skeleton' =>
        args['shape'] == 'circle'
            ? TRSkeleton(
                key: measureKey,
                animate: args['animate'] == true,
                shape: TRSkeletonShape.circle,
              )
            : SizedBox(
                key: measureKey,
                width: 320,
                child: TRSkeleton(
                  animate: args['animate'] == true,
                  shape: args['shape'] == 'rectangle'
                      ? TRSkeletonShape.rectangle
                      : TRSkeletonShape.text,
                ),
              ),
      'code' => TRCode(
        args['data'] is String ? args['data']! as String : 'rack.deploy()',
        key: measureKey,
      ),
      'code-block' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRCodeBlock(
          code: args['code'] is String
              ? args['code']! as String
              : 'tinyrack deploy --env prod',
          language: switch (args['language']) {
            'dart' => 'dart',
            'json' => 'json',
            _ => null,
          },
          wrap: args['wrap'] == true,
        ),
      ),
      'avatar' => TRAvatar(
        key: measureKey,
        fallback: 'AB',
        shape: args['shape'] == 'square'
            ? TRAvatarShape.square
            : TRAvatarShape.circle,
        uiSize: size,
      ),
      'breadcrumbs' => TRBreadcrumbs(
        key: measureKey,
        items: [
          TRBreadcrumbsItem(
            label: switch (locale) {
              'ko' => '홈',
              'ja' => 'ホーム',
              _ => 'Home',
            },
            onTap: () {},
          ),
          TRBreadcrumbsItem(
            label: switch (locale) {
              'ko' => '컴포넌트',
              'ja' => 'コンポーネント',
              _ => 'Components',
            },
            onTap: () {},
          ),
          TRBreadcrumbsItem(
            label: switch (locale) {
              'ko' => '브레드크럼',
              'ja' => 'パンくず',
              _ => 'Breadcrumbs',
            },
          ),
        ],
      ),
      'steps' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRStepsRoot(
          children: [
            TRStepsItem(
              child: TRText(switch (locale) {
                'ko' => '계정 만들기',
                'ja' => 'アカウント作成',
                _ => 'Create account',
              }),
            ),
            TRStepsItem(
              child: TRText(switch (locale) {
                'ko' => '이메일 인증',
                'ja' => 'メール認証',
                _ => 'Verify email',
              }),
            ),
          ],
        ),
      ),
      'fieldset' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRFieldset(
          disabled: args['disabled'] == true,
          legend: args['legend'] is String
              ? args['legend']! as String
              : switch (locale) {
                  'ko' => '연락처',
                  'ja' => '連絡先',
                  _ => 'Contact',
                },
          children: [
            TRText(switch (locale) {
              'ko' => '랙 상태',
              'ja' => 'ラックの状態',
              _ => 'Rack status',
            }, variant: TRTextVariant.bodySm),
          ],
        ),
      ),
      'field' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRField(
          disabled: args['disabled'] == true,
          errorText:
              args['errorText'] is String &&
                  (args['errorText']! as String).isNotEmpty
              ? args['errorText']! as String
              : null,
          label: switch (locale) {
            'ko' => '랙 이름',
            'ja' => 'ラック名',
            _ => 'Rack name',
          },
          description: args['helper'] == 'description'
              ? switch (locale) {
                  'ko' => '랙 목록에 표시돼요.',
                  'ja' => 'ラック一覧に表示されます。',
                  _ => 'Shown on the rack list.',
                }
              : null,
          control: const TRTextField(placeholder: 'Rack alpha'),
        ),
      ),
      'meter' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRMeter(
          label: switch (locale) {
            'ko' => '저장 공간',
            'ja' => 'ストレージ',
            _ => 'Storage',
          },
          value: (args['value'] as num?)?.toDouble() ?? 75,
          valueText: '${((args['value'] as num?)?.toDouble() ?? 75).round()}%',
          variant: statusVariant,
        ),
      ),
      'progress' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRProgress(
          uiSize: size,
          value: args['value'] == 'indeterminate'
              ? null
              : (args['value'] as num?)?.toDouble() ?? 60,
          variant: statusVariant,
        ),
      ),
      'qr-code' => TRQrCode(
        key: measureKey,
        data: args['data'] is String && (args['data']! as String).isNotEmpty
            ? args['data']! as String
            : 'https://tinyrack.net',
        semanticLabel: switch (locale) {
          'ko' => '미리보기 QR 코드',
          'ja' => 'プレビュー QR コード',
          _ => 'Preview QR code',
        },
        uiSize: size,
      ),
      'radial-meter' => TRRadialMeter(
        key: measureKey,
        value: (args['value'] as num?)?.toDouble() ?? 72,
        semanticLabel: switch (locale) {
          'ko' => '컨텍스트 사용량',
          'ja' => 'コンテキスト使用量',
          _ => 'Context usage',
        },
        variant: statusVariant,
        uiSize: size,
      ),
      'link' => TRLink(
        key: measureKey,
        disabled: args['disabled'] == true,
        underline: switch (args['underline']) {
          'always' => TRLinkUnderline.always,
          'none' => TRLinkUnderline.none,
          _ => TRLinkUnderline.hover,
        },
        variant: switch (args['variant']) {
          'muted' => TRLinkVariant.muted,
          'danger' => TRLinkVariant.danger,
          _ => TRLinkVariant.defaultVariant,
        },
        onTap: args['disabled'] == true
            ? null
            : () => onStateChanged({'pressed': true}),
        // Chromium sizes the inline anchor box from the primary latin font's
        // metrics regardless of which fallback renders the glyphs.
        child: Text(
          switch (locale) {
            'ko' => '문서',
            'ja' => 'ドキュメント',
            _ => 'Docs',
          },
          key: _partKey('label'),
          style: const TextStyle(
            fontSize: TRGeneratedTypographySizes.md,
            height:
                TRGeneratedFlutterRendering.normalLineMd /
                TRGeneratedTypographySizes.md,
          ),
        ),
      ),
      'toggle' => TRToggle(
        key: measureKey,
        disabled: args['disabled'] == true,
        pressed: args['pressed'] == true,
        uiSize: size,
        onPressedChange: (next) => onStateChanged({
          'pressed': true,
          'args': {'pressed': next},
        }),
        child: Text(switch (locale) {
          'ko' => '굵게',
          'ja' => '太字',
          _ => 'Bold',
        }, key: _partKey('label')),
      ),
      'checkbox' => TRCheckbox(
        key: measureKey,
        checked: args['mark'] is String
            ? args['mark'] == 'checked'
            : args['checked'] == true,
        indeterminate: args['mark'] is String
            ? args['mark'] == 'indeterminate'
            : args['indeterminate'] == true,
        disabled: args['disabled'] == true,
        uiSize: size,
        onCheckedChange: (checked) => onStateChanged({
          'pressed': true,
          'args': {'checked': checked, 'indeterminate': false},
        }),
      ),
      'radio' => TRRadioGroup(
        key: measureKey,
        value: args['checked'] == true ? 'on' : '',
        onValueChange: (next) => onStateChanged({
          'pressed': true,
          'args': {'checked': next == 'on'},
        }),
        children: [
          TRRadio(
            value: 'on',
            disabled: args['disabled'] == true,
            readOnly: args['readOnly'] == true,
            uiSize: size,
          ),
        ],
      ),
      'switch' => TRSwitch(
        key: measureKey,
        thumbKey: _partKey('thumb'),
        checked: args['checked'] == true,
        disabled: args['disabled'] == true,
        invalid: args['invalid'] == true,
        readOnly: args['readOnly'] == true,
        semanticLabel: switch (locale) {
          'ko' => '자동 백업',
          'ja' => '自動バックアップ',
          _ => 'Automatic backups',
        },
        onCheckedChange: (next) => onStateChanged({
          'pressed': true,
          'args': {'checked': next},
        }),
      ),
      'collapsible' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRCollapsible(
          disabled: args['disabled'] == true,
          open: args['open'] == true,
          onOpenChange: (_) => onStateChanged({'pressed': true}),
          trigger: Text(switch (locale) {
            'ko' => '상세 정보',
            'ja' => '詳細',
            _ => 'Details',
          }),
          content: TRText(
            switch (locale) {
              'ko' => '랙 구성이 최신 상태예요.',
              'ja' => 'ラック構成は最新です。',
              _ => 'The rack configuration is up to date.',
            },
            variant: TRTextVariant.bodySm,
            color: TRTextColor.muted,
          ),
        ),
      ),
      // The web accordion keeps content-box sizing: 320px of content plus
      // the 1px side borders.
      'accordion' => SizedBox(
        key: measureKey,
        width: 322,
        child: _PreviewAccordion(
          key: ValueKey(contentRevision),
          disabledItem: args['disabledItem'] == true,
          installTriggerKey: _partKey('trigger'),
          configureContentKey: _partKey('configureContent'),
          configureTriggerKey: _partKey('configureTrigger'),
          locale: locale,
          multiple: args['multiple'] == true,
          open: args['open'] == true,
          onStateChanged: onStateChanged,
        ),
      ),
      'animated-number' => _PreviewAnimatedNumber(
        args: args,
        measureKey: measureKey,
      ),
      'copy-button' => TRCopyButton(
        key: measureKey,
        appearance: TRAppearance.values.byName(
          args['appearance'] is String
              ? args['appearance']! as String
              : 'solid',
        ),
        // The shared `intent` fallback is `primary`; the copy button defaults
        // to `neutral` like the widget itself.
        intent: TRIntent.values.byName(
          args['intent'] is String ? args['intent']! as String : 'neutral',
        ),
        uiSize: size,
        onStatusChange: (status) {
          if (status == TRCopyButtonStatus.copied) {
            onStateChanged({'pressed': true});
          }
        },
        resetDelay: switch (args['resetDelay']) {
          final num value => Duration(milliseconds: value.round()),
          _ => const Duration(seconds: 2),
        },
        value: args['value'] is String
            ? args['value']! as String
            : 'tinyrack.net',
        idleLabel: args['idleLabel'] is String
            ? args['idleLabel']! as String
            : switch (locale) {
                'ko' => '복사',
                'ja' => 'コピー',
                _ => 'Copy',
              },
        copiedLabel: args['copiedLabel'] is String
            ? args['copiedLabel']! as String
            : switch (locale) {
                'ko' => '복사됨',
                'ja' => 'コピー済み',
                _ => 'Copied',
              },
      ),
      'toggle-group' => TRToggleGroup(
        key: measureKey,
        disabled: args['disabled'] == true,
        loopFocus: args['loopFocus'] != false,
        multiple: args['multiple'] == true,
        onValueChange: (selectedValues) => onStateChanged({
          'pressed': true,
          'args': {'selectedValues': selectedValues},
        }),
        orientation: args['orientation'] == 'vertical'
            ? Axis.vertical
            : Axis.horizontal,
        value: args['selectedValues'] is List
            ? List<String>.from(args['selectedValues']! as List)
            : const ['start'],
        children: [
          TRToggle(
            value: 'start',
            child: Text(switch (locale) {
              'ko' => '시작',
              'ja' => '先頭',
              _ => 'Start',
            }, key: _partKey('start')),
          ),
          TRToggle(
            value: 'center',
            child: Text(switch (locale) {
              'ko' => '가운데',
              'ja' => '中央',
              _ => 'Center',
            }, key: _partKey('center')),
          ),
          TRToggle(
            disabled: args['disabledItem'] == true,
            value: 'end',
            child: Text(switch (locale) {
              'ko' => '끝',
              'ja' => '末尾',
              _ => 'End',
            }, key: _partKey('end')),
          ),
        ],
      ),
      'checkbox-group' => Column(
        key: measureKey,
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: TRSpacing.small,
        children: [
          TRText(
            args['label'] is String
                ? args['label']! as String
                : switch (locale) {
                    'ko' => '랙 기능',
                    'ja' => 'ラック機能',
                    _ => 'Rack features',
                  },
            variant: TRTextVariant.label,
          ),
          TRCheckboxGroup(
            disabled: args['disabled'] == true,
            onValueChange: (selectedValues) => onStateChanged({
              'args': {'selectedValues': selectedValues},
            }),
            value: args['selectedValues'] is List
                ? List<String>.from(args['selectedValues']! as List)
                : const ['metrics', 'backups'],
            children: [
              for (final (index, value, label) in [
                (
                  0,
                  'metrics',
                  switch (locale) {
                    'ko' => '지표',
                    'ja' => 'メトリクス',
                    _ => 'Metrics',
                  },
                ),
                (
                  1,
                  'alerts',
                  switch (locale) {
                    'ko' => '알림',
                    'ja' => 'アラート',
                    _ => 'Alerts',
                  },
                ),
                (
                  2,
                  'backups',
                  switch (locale) {
                    'ko' => '자동 백업',
                    'ja' => '自動バックアップ',
                    _ => 'Automated backups',
                  },
                ),
              ])
                MergeSemantics(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    spacing: TRSpacing.small,
                    children: [
                      TRCheckbox(
                        key: index == 0 ? _partKey('first') : null,
                        readOnly: args['readOnly'] == true,
                        value: value,
                      ),
                      TRText(label, variant: TRTextVariant.bodySm),
                    ],
                  ),
                ),
            ],
          ),
        ],
      ),
      'radio-group' => TRRadioGroup(
        key: measureKey,
        disabled: args['disabled'] == true,
        readOnly: args['readOnly'] == true,
        onValueChange: (next) => onStateChanged({
          'pressed': true,
          'args': {'selectedValue': next},
        }),
        value: args['selectedValue'] is String
            ? args['selectedValue']! as String
            : 'start',
        children: [
          TRRadio(
            key: _partKey('first'),
            value: 'start',
            label: TRText(switch (locale) {
              'ko' => '시작',
              'ja' => '先頭',
              _ => 'Start',
            }, variant: TRTextVariant.bodySm),
          ),
          TRRadio(
            value: 'end',
            label: TRText(switch (locale) {
              'ko' => '끝',
              'ja' => '末尾',
              _ => 'End',
            }, variant: TRTextVariant.bodySm),
          ),
        ],
      ),
      'textarea' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRTextarea(
          enabled: args['disabled'] != true,
          initialValue: args['value'] is String
              ? args['value']! as String
              : null,
          placeholder: args['placeholder'] is String
              ? args['placeholder']! as String
              : null,
          readOnly: args['readOnly'] == true,
          uiSize: size,
          appearance: TRFieldAppearance.values.byName(
            args['appearance'] is String
                ? args['appearance']! as String
                : 'solid',
          ),
        ),
      ),
      'tabs' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRTabs(
          defaultValue: 'overview',
          onValueChange: (_) => onStateChanged({'pressed': true}),
          uiSize: size,
          panelBuilder: (_) => TRText(switch (locale) {
            'ko' => '랙 구성이 최신 상태예요.',
            'ja' => 'ラック構成は最新です。',
            _ => 'The rack configuration is up to date.',
          }, variant: TRTextVariant.bodySm),
          tabs: [
            TRTabsTab(
              value: 'overview',
              label: switch (locale) {
                'ko' => '개요',
                'ja' => '概要',
                _ => 'Overview',
              },
            ),
            TRTabsTab(
              value: 'settings',
              label: switch (locale) {
                'ko' => '설정',
                'ja' => '設定',
                _ => 'Settings',
              },
            ),
          ],
        ),
      ),
      _ => const Text('Unsupported preview'),
    };
  }
}

class _PreviewAccordion extends StatefulWidget {
  const _PreviewAccordion({
    required this.configureContentKey,
    required this.configureTriggerKey,
    required this.disabledItem,
    required this.installTriggerKey,
    required this.locale,
    required this.multiple,
    required this.open,
    required this.onStateChanged,
    super.key,
  });

  final Key configureContentKey;
  final Key configureTriggerKey;
  final bool disabledItem;
  final Key installTriggerKey;
  final String locale;
  final bool multiple;
  final bool open;
  final ValueChanged<Map<String, Object?>> onStateChanged;

  @override
  State<_PreviewAccordion> createState() => _PreviewAccordionState();
}

class _PreviewAccordionState extends State<_PreviewAccordion> {
  List<String> _value = const ['install'];

  @override
  void didUpdateWidget(_PreviewAccordion oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.open != widget.open) {
      _value = widget.open ? const ['install'] : const [];
    }
    final next = widget.disabledItem
        ? _value.where((value) => value != 'configure').toList()
        : [..._value];
    if (!widget.multiple && next.length > 1) next.removeRange(1, next.length);
    if (next.length != _value.length) _value = next;
  }

  String _pick(String en, String ko, String ja) => switch (widget.locale) {
    'ko' => ko,
    'ja' => ja,
    _ => en,
  };

  void _handleValueChange(List<String> value) {
    setState(() => _value = value);
    widget.onStateChanged({'pressed': true, 'value': value.join(',')});
  }

  @override
  Widget build(BuildContext context) => TRAccordion(
    multiple: widget.multiple,
    onValueChange: _handleValueChange,
    value: _value,
    items: [
      TRAccordionItem(
        value: 'install',
        trigger: Text(
          _pick('Install', '설치', 'インストール'),
          key: widget.installTriggerKey,
        ),
        content: TRText(
          _pick('Add the package.', '패키지를 추가하세요.', 'パッケージを追加してください。'),
          variant: TRTextVariant.bodySm,
        ),
      ),
      TRAccordionItem(
        value: 'configure',
        disabled: widget.disabledItem,
        trigger: Text(
          _pick('Configure', '설정', '設定'),
          key: widget.configureTriggerKey,
        ),
        content: TRText(
          _pick('Wire up the theme.', '테마를 연결하세요.', 'テーマを接続してください。'),
          key: widget.configureContentKey,
          variant: TRTextVariant.bodySm,
        ),
      ),
    ],
  );
}

class _PreviewAlertDialog extends StatefulWidget {
  const _PreviewAlertDialog({
    required this.args,
    required this.locale,
    required this.onStateChanged,
    super.key,
  });

  final Map<String, Object?> args;
  final String locale;
  final ValueChanged<Map<String, Object?>> onStateChanged;

  @override
  State<_PreviewAlertDialog> createState() => _PreviewAlertDialogState();
}

class _PreviewAlertDialogState extends State<_PreviewAlertDialog> {
  bool _routeOpen = false;
  NavigatorState? _rootNavigator;

  @override
  void initState() {
    super.initState();
    if (widget.args['open'] == true) _scheduleShow();
  }

  @override
  void didUpdateWidget(_PreviewAlertDialog oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.args['open'] != true && widget.args['open'] == true) {
      _scheduleShow();
    } else if (oldWidget.args['open'] == true &&
        widget.args['open'] != true &&
        _routeOpen) {
      Navigator.of(context, rootNavigator: true).maybePop();
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _rootNavigator = Navigator.of(context, rootNavigator: true);
  }

  @override
  void dispose() {
    final navigator = _rootNavigator;
    if (_routeOpen && navigator != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (navigator.mounted && navigator.canPop()) navigator.pop();
      });
    }
    super.dispose();
  }

  void _scheduleShow() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted && !_routeOpen) _show(ignoreDisabled: true);
    });
  }

  String _pick(String en, String ko, String ja) => switch (widget.locale) {
    'ko' => ko,
    'ja' => ja,
    _ => en,
  };

  Future<void> _show({bool ignoreDisabled = false}) async {
    if (_routeOpen || (!ignoreDisabled && widget.args['disabled'] == true)) {
      return;
    }
    setState(() => _routeOpen = true);
    widget.onStateChanged({'open': true});
    await showTRAlertDialog<bool>(
      context: context,
      builder: (context) => Center(
        child: SizedBox(
          width: TRGeneratedMeasurements.overlayWidthSm,
          child: TRAlertDialog(
            title: Text(_pick('Delete rack?', '랙을 삭제할까요?', 'ラックを削除しますか？')),
            description: Text(
              _pick(
                'This action cannot be undone.',
                '이 작업은 되돌릴 수 없어요.',
                'この操作は取り消せません。',
              ),
            ),
            actions: [
              TRButton(
                appearance: TRAppearance.outline,
                onPressed: () => Navigator.pop(context, false),
                child: TRLayerPartBoundary(
                  name: 'cancelLabel',
                  child: Text(_pick('Cancel', '취소', 'キャンセル')),
                ),
              ),
              TRButton(
                intent: TRIntent.danger,
                onPressed: () => Navigator.pop(context, true),
                child: TRLayerPartBoundary(
                  name: 'actionLabel',
                  child: Text(_pick('Delete rack', '랙 삭제', 'ラックを削除')),
                ),
              ),
            ],
          ),
        ),
      ),
    );
    if (!mounted) return;
    setState(() => _routeOpen = false);
    widget.onStateChanged({'open': false});
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 128,
    child: TRButton(
      intent: TRIntent.danger,
      onPressed: widget.args['disabled'] == true ? null : _show,
      child: Text(
        widget.args['label'] is String
            ? widget.args['label']! as String
            : _pick('Delete rack', '랙 삭제', 'ラックを削除'),
      ),
    ),
  );
}

class _PreviewAppShell extends StatefulWidget {
  const _PreviewAppShell({
    required this.args,
    required this.locale,
    required this.onStateChanged,
    required this.partKeys,
    super.key,
  });

  final Map<String, Object?> args;
  final String locale;
  final ValueChanged<Map<String, Object?>> onStateChanged;
  final Map<String, GlobalKey> partKeys;

  @override
  State<_PreviewAppShell> createState() => _PreviewAppShellState();
}

class _PreviewAppShellState extends State<_PreviewAppShell> {
  late final TRAppShellController _controller = TRAppShellController();
  bool _syncing = false;

  @override
  void initState() {
    super.initState();
    _sync();
  }

  @override
  void didUpdateWidget(_PreviewAppShell oldWidget) {
    super.didUpdateWidget(oldWidget);
    _sync();
  }

  void _sync() {
    _syncing = true;
    _controller.setMobileOpen(widget.args['open'] == true);
    _controller.setSidebarMode(
      widget.args['sidebarMode'] == 'rail'
          ? TRAppShellSidebarMode.rail
          : TRAppShellSidebarMode.expanded,
    );
    _syncing = false;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _pick(String en, String ko, String ja) => switch (widget.locale) {
    'ko' => ko,
    'ja' => ja,
    _ => en,
  };

  GlobalKey _partKey(String name) =>
      widget.partKeys.putIfAbsent(name, GlobalKey.new);

  @override
  Widget build(BuildContext context) {
    final viewport = MediaQuery.sizeOf(context);
    final appearance = TRAppearance.values.byName(
      widget.args['controlAppearance'] is String
          ? widget.args['controlAppearance']! as String
          : 'ghost',
    );
    final navigation = [
      (Icons.speed_outlined, _pick('Overview', '개요', '概要')),
      (Icons.rocket_launch_outlined, _pick('Deployments', '배포', 'デプロイ')),
      (Icons.widgets_outlined, _pick('Services', '서비스', 'サービス')),
      (Icons.storage_outlined, _pick('Data stores', '데이터 저장소', 'データストア')),
    ];
    return SizedBox(
      width: math.min(720, viewport.width),
      height: math.min(360, viewport.height),
      child: TRAppShell(
        breakpoint: widget.args['breakpoint'] == 'sm'
            ? TRAppShellBreakpoint.sm
            : TRAppShellBreakpoint.lg,
        controller: _controller,
        layout: widget.args['layout'] == 'header-first'
            ? TRAppShellLayout.headerFirst
            : TRAppShellLayout.sidebarFirst,
        mobileSidebar: widget.args['mobileSidebar'] == 'rail'
            ? TRAppShellMobileSidebar.rail
            : TRAppShellMobileSidebar.drawer,
        onMobileOpenChanged: (open) {
          if (!_syncing) {
            widget.onStateChanged({
              'args': {'open': open},
            });
          }
        },
        onSidebarModeChanged: (mode) {
          if (!_syncing) {
            widget.onStateChanged({
              'args': {'sidebarMode': mode.name},
            });
          }
        },
        header: TRAppShellHeader(
          borderBottom: true,
          key: _partKey('header'),
          height: 52,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          children: [
            TRAppShellTrigger(
              appearance: appearance,
              icon: const Icon(Icons.menu),
              label: _pick('Open navigation', '탐색 열기', 'ナビゲーションを開く'),
            ),
            TRAppShellBrand(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Orbit Ops',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      height: 20 / 14,
                    ),
                  ),
                  Text(
                    _pick('Production environment', '프로덕션 환경', '本番環境'),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: context.tinyrackTheme.textMuted,
                      fontSize: 12,
                      height: 16 / 12,
                    ),
                  ),
                ],
              ),
            ),
            TRAppShellActions(
              children: [
                DecoratedBox(
                  decoration: BoxDecoration(
                    color: context.tinyrackTheme.surfaceMuted,
                    borderRadius: BorderRadius.circular(TRGeneratedRadii.full),
                  ),
                  child: const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    child: Text(
                      'us-east',
                      style: TextStyle(fontSize: 12, height: 16 / 12),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
        sidebar: TRAppShellSidebar(
          key: _partKey('sidebar'),
          collapsed: widget.args['sidebarCollapsed'] == true,
          padding: const EdgeInsets.all(12),
          scroll: false,
          semanticLabel: _pick('Example navigation', '예제 탐색', 'サンプルナビゲーション'),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(
                height: 32,
                child: Row(
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: context.tinyrackTheme.primary,
                        borderRadius: BorderRadius.circular(
                          TRGeneratedRadii.md,
                        ),
                      ),
                      child: Icon(
                        Icons.widgets_outlined,
                        color: context.tinyrackTheme.onPrimary,
                        size: 16,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TRAppShellSidebarLabel(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Orbit Ops',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              _pick(
                                'Production workspace',
                                '프로덕션 워크스페이스',
                                '本番ワークスペース',
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                color: context.tinyrackTheme.textMuted,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    TRAppShellSidebarToggle(
                      appearance: appearance,
                      icon: const Icon(Icons.view_sidebar_outlined),
                      label: _pick('Toggle sidebar', '사이드바 전환', 'サイドバーを切り替える'),
                    ),
                    TRAppShellClose(
                      appearance: appearance,
                      icon: const Icon(Icons.close),
                      label: _pick('Close navigation', '탐색 닫기', 'ナビゲーションを閉じる'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              for (var index = 0; index < navigation.length; index++) ...[
                TRLayerPartBoundary(
                  name: 'navigationRow${index}Surface',
                  child: Container(
                    height: 36,
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    decoration: BoxDecoration(
                      color: index == 0
                          ? context.tinyrackTheme.surfaceMuted
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          navigation[index].$1,
                          color: index == 0
                              ? context.tinyrackTheme.text
                              : context.tinyrackTheme.textMuted,
                          size: 16,
                        ),
                        const SizedBox(width: 12),
                        TRAppShellSidebarLabel(
                          child: Text(
                            navigation[index].$2,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: index == 0
                                  ? context.tinyrackTheme.text
                                  : context.tinyrackTheme.textMuted,
                              fontSize: 14,
                              height: 20 / 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if (index != navigation.length - 1) const SizedBox(height: 4),
              ],
              const Spacer(),
              TRLayerPartBoundary(
                name: 'profileSurface',
                child: Container(
                  height: 46,
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    border: Border.all(color: context.tinyrackTheme.border),
                    borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 28,
                        height: 28,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: context.tinyrackTheme.surfaceMuted,
                          shape: BoxShape.circle,
                        ),
                        child: const Text(
                          'AK',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TRAppShellSidebarLabel(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Avery Kim',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              Text(
                                _pick('Platform team', '플랫폼 팀', 'プラットフォームチーム'),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  color: context.tinyrackTheme.textMuted,
                                  fontSize: 12,
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
            ],
          ),
        ),
        main: TRAppShellMain(
          key: _partKey('main'),
          child: _PreviewAppShellContent(locale: widget.locale),
        ),
      ),
    );
  }
}

class _PreviewAppShellContent extends StatelessWidget {
  const _PreviewAppShellContent({required this.locale});

  final String locale;

  String _pick(String en, String ko, String ja) => switch (locale) {
    'ko' => ko,
    'ja' => ja,
    _ => en,
  };

  @override
  Widget build(BuildContext context) {
    final metrics = [
      (_pick('Healthy services', '정상 서비스', '正常なサービス'), '24 / 24'),
      (_pick('Deployments today', '오늘 배포', '本日のデプロイ'), '18'),
      (_pick('P95 response', 'P95 응답', 'P95 応答'), '128 ms'),
    ];
    final border = context.tinyrackTheme.border;
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(
            height: 44,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'PRODUCTION / US-EAST',
                        style: TextStyle(
                          color: context.tinyrackTheme.textMuted,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          height: 16 / 12,
                          letterSpacing: .4,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _pick('System overview', '시스템 개요', 'システム概要'),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          height: 24 / 18,
                        ),
                      ),
                    ],
                  ),
                ),
                TRLayerPartBoundary(
                  name: 'statusSurface',
                  child: Container(
                    width: 169,
                    height: 26,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      border: Border.all(color: border),
                      borderRadius: BorderRadius.circular(
                        TRGeneratedRadii.full,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: context.tinyrackTheme.success,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _pick(
                              'All systems operational',
                              '모든 시스템이 정상이에요',
                              'すべてのシステムが正常です',
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              for (var index = 0; index < metrics.length; index++) ...[
                Expanded(
                  child: TRLayerPartBoundary(
                    name: 'metric${index}Surface',
                    child: Container(
                      height: 62,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        border: Border.all(color: border),
                        borderRadius: BorderRadius.circular(
                          TRGeneratedRadii.md,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            metrics[index].$1,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: context.tinyrackTheme.textMuted,
                              fontSize: 12,
                              height: 14 / 12,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            metrics[index].$2,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              height: 18 / 16,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                if (index != metrics.length - 1) const SizedBox(width: 8),
              ],
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: TRLayerPartBoundary(
              name: 'activitySurface',
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  border: Border.all(color: border),
                  borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            _pick('Recent activity', '최근 활동', '最近のアクティビティ'),
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Icon(
                          Icons.monitor_heart_outlined,
                          color: context.tinyrackTheme.textMuted,
                          size: 12,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          _pick('Live', '실시간', 'ライブ'),
                          style: TextStyle(
                            color: context.tinyrackTheme.textMuted,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    const Spacer(),
                    Text(
                      _pick(
                        'api-gateway deployed successfully    4m',
                        'api-gateway 배포에 성공했어요    4m',
                        'api-gateway のデプロイに成功しました    4m',
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 12),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _pick(
                        'Database backup completed    18m',
                        '데이터베이스 백업을 마쳤어요    18m',
                        'データベースのバックアップが完了しました    18m',
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PreviewAutocomplete extends StatefulWidget {
  const _PreviewAutocomplete({
    required this.args,
    required this.locale,
    super.key,
  });

  final Map<String, Object?> args;
  final String locale;

  @override
  State<_PreviewAutocomplete> createState() => _PreviewAutocompleteState();
}

class _PreviewAutocompleteState extends State<_PreviewAutocomplete> {
  late final TRAutocompleteController<String> _controller =
      TRAutocompleteController<String>();

  @override
  void initState() {
    super.initState();
    _sync();
  }

  @override
  void didUpdateWidget(_PreviewAutocomplete oldWidget) {
    super.didUpdateWidget(oldWidget);
    _sync();
  }

  void _sync() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      widget.args['open'] == true
          ? _controller.focusNode.requestFocus()
          : _controller.focusNode.unfocus();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 320,
    child: TRAutocomplete<String>(
      appearance: _fieldAppearance(widget.args),
      completionMode: TRAutocompleteCompletionMode.values.byName(
        widget.args['completionMode'] is String
            ? widget.args['completionMode']! as String
            : 'list',
      ),
      controller: _controller,
      enabled: widget.args['disabled'] != true,
      errorText: switch (widget.args['errorText']) {
        final String errorText when errorText.isNotEmpty => errorText,
        _ => null,
      },
      label: switch (widget.locale) {
        'ko' => '지역',
        'ja' => '地域',
        _ => 'Region',
      },
      placeholder: widget.args['placeholder'] is String
          ? widget.args['placeholder']! as String
          : switch (widget.locale) {
              'ko' => '지역 검색',
              'ja' => '地域を検索',
              _ => 'Search regions',
            },
      readOnly: widget.args['readOnly'] == true,
      uiSize: TRUiSize.values.byName(
        widget.args['uiSize'] is String
            ? widget.args['uiSize']! as String
            : 'md',
      ),
      items: const [
        TRAutocompleteItem(value: 'seoul', label: 'Seoul'),
        TRAutocompleteItem(value: 'tokyo', label: 'Tokyo'),
        TRAutocompleteItem(value: 'virginia', label: 'Virginia'),
      ],
    ),
  );
}

class _PreviewInlineSuggestions extends StatefulWidget {
  const _PreviewInlineSuggestions({
    required this.args,
    required this.locale,
    super.key,
  });

  final Map<String, Object?> args;
  final String locale;

  @override
  State<_PreviewInlineSuggestions> createState() =>
      _PreviewInlineSuggestionsState();
}

class _PreviewInlineSuggestionsState extends State<_PreviewInlineSuggestions> {
  final TRInlineSuggestionsController<String> _suggestions =
      TRInlineSuggestionsController<String>();
  final TextEditingController _text = TextEditingController(text: '@lib/');
  final FocusNode _focus = FocusNode();

  @override
  void dispose() {
    _suggestions.dispose();
    _text.dispose();
    _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final args = widget.args;
    final disabledOption = args['disabledOption'] == true;
    final status = args['status'] is String
        ? TRInlineSuggestionsStatus.values.byName(args['status']! as String)
        : TRInlineSuggestionsStatus.ready;
    final descriptions = switch (widget.locale) {
      'ko' => <String>['앱 진입점', '컴포저 위젯', '라우터 설정', '테마 설정'],
      'ja' => <String>['アプリのエントリポイント', 'コンポーザーウィジェット', 'ルーター設定', 'テーマ設定'],
      _ => <String>[
        'Application entry point',
        'Composer widget',
        'Router configuration',
        'Theme configuration',
      ],
    };
    return SizedBox(
      width: 320,
      child: TRInlineSuggestions<String>(
        open: args['open'] == true,
        status: status,
        controller: _suggestions,
        maxVisibleItems: 2,
        emptyLabel: switch (widget.locale) {
          'ko' => '일치하는 항목 없음',
          'ja' => '一致する項目がありません',
          _ => 'No matches',
        },
        loadingLabel: switch (widget.locale) {
          'ko' => '검색 중',
          'ja' => '検索中',
          _ => 'Loading',
        },
        errorLabel: switch (widget.locale) {
          'ko' => '제안을 불러오지 못했습니다',
          'ja' => '候補を読み込めませんでした',
          _ => 'Could not load suggestions',
        },
        items: status == TRInlineSuggestionsStatus.ready
            ? <TRInlineSuggestionItem<String>>[
                TRInlineSuggestionItem<String>(
                  value: 'lib/app.dart',
                  label: 'lib/app.dart',
                  description: descriptions.first,
                  matchedIndices: const <int>[0, 1, 2],
                ),
                TRInlineSuggestionItem<String>(
                  value: 'lib/composer.dart',
                  label: 'lib/composer.dart',
                  description: descriptions[1],
                  hint: '<path>',
                  tag: 'lib',
                  enabled: !disabledOption,
                ),
                TRInlineSuggestionItem<String>(
                  value: 'lib/router.dart',
                  label: 'lib/router.dart',
                  description: descriptions[2],
                  tag: 'lib',
                ),
                TRInlineSuggestionItem<String>(
                  value: 'lib/theme.dart',
                  label: 'lib/theme.dart',
                  description: descriptions[3],
                  tag: 'lib',
                ),
              ]
            : const <TRInlineSuggestionItem<String>>[],
        onSelected: (item) => _text.text = item.value,
        child: Focus(
          onKeyEvent: (node, event) => _suggestions.handleKeyEvent(event),
          child: TRTextField(
            controller: _text,
            focusNode: _focus,
            maxLines: 3,
            minLines: 1,
          ),
        ),
      ),
    );
  }
}

class _PreviewCombobox extends StatefulWidget {
  const _PreviewCombobox({required this.args, required this.locale, super.key});

  final Map<String, Object?> args;
  final String locale;

  @override
  State<_PreviewCombobox> createState() => _PreviewComboboxState();
}

class _PreviewComboboxState extends State<_PreviewCombobox> {
  late final TRComboboxController<String> _controller =
      TRComboboxController<String>(value: 'stable');

  @override
  void initState() {
    super.initState();
    _sync();
  }

  @override
  void didUpdateWidget(_PreviewCombobox oldWidget) {
    super.didUpdateWidget(oldWidget);
    _sync();
  }

  void _sync() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      widget.args['open'] == true
          ? _controller.focusNode.requestFocus()
          : _controller.focusNode.unfocus();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final args = widget.args;
    final disabledOption = args['disabledOption'] == true;
    return SizedBox(
      width: 320,
      child: TRCombobox<String>(
        appearance: _fieldAppearance(widget.args),
        controller: _controller,
        autoHighlight: args['autoHighlight'] == true,
        clearable: args['clearable'] == true,
        enabled: args['disabled'] != true,
        filterMode: args['filterMode'] is String
            ? TRComboboxFilterMode.values.byName(args['filterMode']! as String)
            : TRComboboxFilterMode.contains,
        label: switch (widget.locale) {
          'ko' => '채널',
          'ja' => 'チャンネル',
          _ => 'Channel',
        },
        layout: args['layout'] is String
            ? TRComboboxLayout.values.byName(args['layout']! as String)
            : TRComboboxLayout.list,
        placeholder: args['placeholder'] is String
            ? args['placeholder']! as String
            : switch (widget.locale) {
                'ko' => '채널 선택',
                'ja' => 'チャンネルを選択',
                _ => 'Choose a channel',
              },
        readOnly: args['readOnly'] == true,
        uiSize: args['uiSize'] is String
            ? TRUiSize.values.byName(args['uiSize']! as String)
            : TRUiSize.md,
        items: [
          const TRComboboxItem(value: 'stable', label: 'Stable'),
          TRComboboxItem(
            value: 'beta',
            label: 'Beta',
            enabled: !disabledOption,
          ),
        ],
      ),
    );
  }
}

class _PreviewContextMenu extends StatefulWidget {
  const _PreviewContextMenu({
    required this.args,
    required this.locale,
    super.key,
  });

  final Map<String, Object?> args;
  final String locale;

  @override
  State<_PreviewContextMenu> createState() => _PreviewContextMenuState();
}

class _PreviewContextMenuState extends State<_PreviewContextMenu> {
  final MenuController _controller = MenuController();

  @override
  void initState() {
    super.initState();
    _sync();
  }

  @override
  void didUpdateWidget(_PreviewContextMenu oldWidget) {
    super.didUpdateWidget(oldWidget);
    _sync();
  }

  void _sync() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      if (widget.args['open'] == true && !_controller.isOpen) {
        _controller.open(position: const Offset(120, 60));
      } else if (widget.args['open'] != true && _controller.isOpen) {
        _controller.close();
      }
    });
  }

  @override
  Widget build(BuildContext context) => TRContextMenu(
    controller: _controller,
    menuChildren: [
      TRMenuItem(onPressed: () {}, child: const Text('Open')),
      TRMenuItem(onPressed: () {}, child: const Text('Duplicate')),
      const TRMenuSeparator(),
      TRMenuItem(onPressed: () {}, child: const Text('Delete')),
    ],
    child: Container(
      width: 240,
      height: 120,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        border: Border.all(color: context.tinyrackTheme.border),
        borderRadius: BorderRadius.circular(TRGeneratedRadii.md),
      ),
      child: Text(switch (widget.locale) {
        'ko' => '길게 누르거나 우클릭하세요',
        'ja' => '長押しまたは右クリック',
        _ => 'Long press or right-click',
      }),
    ),
  );
}

class _PreviewDrawer extends StatefulWidget {
  const _PreviewDrawer({required this.args, required this.locale, super.key});

  final Map<String, Object?> args;
  final String locale;

  @override
  State<_PreviewDrawer> createState() => _PreviewDrawerState();
}

class _PreviewDrawerState extends State<_PreviewDrawer> {
  bool _showing = false;

  TRDrawerPlacement get _placement => switch (widget.args['swipeDirection']) {
    'up' => TRDrawerPlacement.top,
    'left' => TRDrawerPlacement.start,
    'right' => TRDrawerPlacement.end,
    _ => TRDrawerPlacement.bottom,
  };

  @override
  void initState() {
    super.initState();
    _sync();
  }

  @override
  void didUpdateWidget(_PreviewDrawer oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.args != widget.args) _sync();
  }

  void _sync() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      if (widget.args['open'] == true && !_showing) {
        _show();
      } else if (widget.args['open'] != true && _showing) {
        Navigator.of(context, rootNavigator: true).maybePop();
      }
    });
  }

  Future<void> _show() async {
    _showing = true;
    await showTRDrawer<void>(
      context: context,
      placement: _placement,
      builder: (context) => TRDrawer(
        placement: _placement,
        snapPoints: switch (_placement) {
          TRDrawerPlacement.top || TRDrawerPlacement.bottom => null,
          TRDrawerPlacement.start || TRDrawerPlacement.end => const [1],
        },
        title: const Text('Deploy settings'),
        description: const Text('Review the target before deploying.'),
        content: const Text('Channel: Stable\nRegion: Seoul'),
      ),
    );
    _showing = false;
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 128,
    child: TRButton(onPressed: _show, child: const Text('Open drawer')),
  );
}

class _PreviewForm extends StatefulWidget {
  const _PreviewForm({required this.args, required this.locale, super.key});

  final Map<String, Object?> args;
  final String locale;

  @override
  State<_PreviewForm> createState() => _PreviewFormState();
}

class _PreviewFormState extends State<_PreviewForm> {
  final GlobalKey<TRFormState> _formKey = GlobalKey<TRFormState>();
  String _submitted = '';

  String _pick(String en, String ko, String ja) => switch (widget.locale) {
    'ko' => ko,
    'ja' => ja,
    _ => en,
  };

  String? _validateRack(String? value) {
    if ((value ?? '').trim().isEmpty) {
      return _pick('Enter a rack name.', '랙 이름을 입력하세요.', 'ラック名を入力してください。');
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final required = widget.args['required'] != false;
    final label = widget.args['label'] is String
        ? widget.args['label']! as String
        : _pick('Rack name', '랙 이름', 'ラック名');
    final submitLabel = widget.args['submitLabel'] is String
        ? widget.args['submitLabel']! as String
        : _pick('Save', '저장', '保存');
    return SizedBox(
      width: 320,
      child: TRForm(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          spacing: TRSpacing.medium,
          children: [
            TRTextField(
              name: 'rack',
              label: label,
              validator: required ? _validateRack : null,
            ),
            TRButton(
              onPressed: () {
                final state = _formKey.currentState;
                if (state == null || !state.validate()) {
                  setState(() => _submitted = '');
                  return;
                }
                setState(() => _submitted = '${state.save()['rack'] ?? ''}');
              },
              child: Text(submitLabel),
            ),
            if (_submitted.isNotEmpty)
              TRText(
                '${_pick('Submitted', '제출한 값', '送信値')}: $_submitted',
                variant: TRTextVariant.bodySm,
              ),
          ],
        ),
      ),
    );
  }
}

class _PreviewNavigationMenu extends StatelessWidget {
  const _PreviewNavigationMenu({required this.args, super.key});

  final Map<String, Object?> args;

  @override
  Widget build(BuildContext context) => TRNavigationMenu<String>.controlled(
    value: args['open'] == true ? 'products' : null,
    panelWidth: 322,
    items: const [
      TRNavigationMenuItem(
        value: 'products',
        trigger: SizedBox(
          width: 70,
          child: Text('Products', maxLines: 1, softWrap: false),
        ),
        content: Text('Compute\nStorage\nNetworking'),
      ),
      TRNavigationMenuItem(
        value: 'resources',
        trigger: SizedBox(
          width: 81,
          child: Text('Resources', maxLines: 1, softWrap: false),
        ),
        content: Text('Documentation\nExamples\nSupport'),
      ),
    ],
  );
}

class _PreviewPopover extends StatelessWidget {
  const _PreviewPopover({required this.args, super.key});

  final Map<String, Object?> args;

  @override
  Widget build(BuildContext context) => TRPopover.controlled(
    open: args['open'] == true,
    trigger: SizedBox(
      width: 128,
      child: TRButton(onPressed: () {}, child: const Text('Rack details')),
    ),
    title: const Text('Rack alpha'),
    description: const Text('4 services are healthy.'),
    content: const Text('Latency 18 ms'),
    width: 165,
  );
}

class _PreviewPreviewCard extends StatelessWidget {
  const _PreviewPreviewCard({required this.args, super.key});

  final Map<String, Object?> args;

  @override
  Widget build(BuildContext context) => TRPreviewCard.controlled(
    open: args['open'] == true,
    trigger: SizedBox(
      width: 105,
      child: TRButton(onPressed: () {}, child: const Text('Rack alpha')),
    ),
    content: const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        TRLayerPartBoundary(name: 'title', child: Text('Rack alpha')),
        TRLayerPartBoundary(
          name: 'description',
          child: Text('4 services are healthy.'),
        ),
      ],
    ),
    width: 165,
  );
}

class _PreviewTooltip extends StatelessWidget {
  const _PreviewTooltip({required this.args, required this.locale, super.key});

  final Map<String, Object?> args;
  final String locale;

  @override
  Widget build(BuildContext context) => TRTooltip.controlled(
    open: args['open'] == true,
    message: switch (locale) {
      'ko' => '랙 새로고침',
      'ja' => 'ラックを更新',
      _ => 'Refresh rack',
    },
    width: 95,
    child: TRIconButton(
      icon: const Icon(Icons.refresh),
      label: 'Refresh rack',
      onPressed: () {},
    ),
  );
}

class _PreviewToast extends StatefulWidget {
  const _PreviewToast({
    required this.locale,
    required this.measureKey,
    required this.open,
  });

  final String locale;
  final Key measureKey;
  final bool open;

  @override
  State<_PreviewToast> createState() => _PreviewToastState();
}

class _PreviewToastState extends State<_PreviewToast> {
  late final TRToastController _controller = TRToastController();

  @override
  void initState() {
    super.initState();
    _sync();
  }

  @override
  void didUpdateWidget(_PreviewToast oldWidget) {
    super.didUpdateWidget(oldWidget);
    _sync();
  }

  void _sync() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      if (widget.open && _controller.toasts.isEmpty) {
        _controller.show(
          TRToastData(
            title: Text(switch (widget.locale) {
              'ko' => '변경 사항을 저장했어요',
              'ja' => '変更を保存しました',
              _ => 'Changes saved',
            }),
            description: const Text('Rack alpha is up to date.'),
            duration: Duration.zero,
            variant: TRStatusVariant.success,
          ),
        );
      } else if (!widget.open) {
        _controller.dismissAll();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => TRToastRegion(
    controller: _controller,
    child: Center(
      child: SizedBox(
        key: widget.measureKey,
        width: 128,
        child: TRButton(
          onPressed: () => _controller.show(
            const TRToastData(
              title: Text('Deployment started'),
              description: Text('Stable channel is updating.'),
            ),
          ),
          child: const Text('Show toast'),
        ),
      ),
    ),
  );
}

class _PreviewMenubar extends StatefulWidget {
  const _PreviewMenubar({
    required this.args,
    required this.onStateChanged,
    super.key,
  });

  final Map<String, Object?> args;
  final ValueChanged<Map<String, Object?>> onStateChanged;

  @override
  State<_PreviewMenubar> createState() => _PreviewMenubarState();
}

class _PreviewMenubarState extends State<_PreviewMenubar> {
  final MenuController _fileController = MenuController();

  @override
  void initState() {
    super.initState();
    _syncOpenState();
  }

  @override
  void didUpdateWidget(_PreviewMenubar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.args['open'] != widget.args['open']) _syncOpenState();
  }

  void _syncOpenState() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final shouldOpen = widget.args['open'] == true;
      if (shouldOpen && !_fileController.isOpen) _fileController.open();
      if (!shouldOpen && _fileController.isOpen) _fileController.close();
    });
  }

  @override
  Widget build(BuildContext context) => TRMenubar(
    semanticLabel: 'Application',
    menus: [
      TRMenubarMenu(
        controller: _fileController,
        onClose: () => widget.onStateChanged({'open': false}),
        onOpen: () => widget.onStateChanged({'open': true}),
        trigger: const SizedBox(width: 27, child: Center(child: Text('File'))),
        menuChildren: [
          TRMenuItem(onPressed: () {}, child: const Text('New rack')),
          TRMenuItem(onPressed: () {}, child: const Text('Open')),
        ],
      ),
      TRMenubarMenu(
        trigger: const SizedBox(width: 37, child: Center(child: Text('View'))),
        menuChildren: [
          TRMenuItem(onPressed: () {}, child: const Text('Refresh')),
        ],
      ),
    ],
  );
}

class _PreviewMenu extends StatefulWidget {
  const _PreviewMenu({
    required this.args,
    required this.locale,
    required this.measureKey,
    required this.onStateChanged,
    required this.partKeys,
  });

  final Map<String, Object?> args;
  final String locale;
  final Key measureKey;
  final ValueChanged<Map<String, Object?>> onStateChanged;
  final Map<String, GlobalKey> partKeys;

  @override
  State<_PreviewMenu> createState() => _PreviewMenuState();
}

class _PreviewMenuState extends State<_PreviewMenu> {
  final MenuController _controller = MenuController();
  bool _grid = true;
  String _density = 'compact';

  @override
  void initState() {
    super.initState();
    _syncOpenState();
  }

  @override
  void didUpdateWidget(_PreviewMenu oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.args['open'] != widget.args['open']) _syncOpenState();
  }

  void _syncOpenState() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final shouldOpen = widget.args['open'] == true;
      if (shouldOpen && !_controller.isOpen) _controller.open();
      if (!shouldOpen) {
        if (_controller.isOpen) _controller.close();
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted && widget.args['open'] != true) {
            FocusManager.instance.primaryFocus?.unfocus();
          }
        });
      }
    });
  }

  String _pick(String en, String ko, String ja) => switch (widget.locale) {
    'ko' => ko,
    'ja' => ja,
    _ => en,
  };

  @override
  Widget build(BuildContext context) {
    final popupKey = widget.partKeys.putIfAbsent('popup', GlobalKey.new);
    return SizedBox(
      key: widget.measureKey,
      width: TRGeneratedMeasurements.measureXs,
      child: TRMenu(
        controller: _controller,
        enabled: widget.args['disabled'] != true,
        onClose: () => widget.onStateChanged({'open': false}),
        onOpen: () => widget.onStateChanged({'open': true}),
        trigger: Text(
          _pick('View', '보기', '表示'),
          key: widget.partKeys.putIfAbsent('triggerLabel', GlobalKey.new),
        ),
        menuChildren: [
          KeyedSubtree(
            key: popupKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisSize: MainAxisSize.min,
              children: [
                TRMenuGroupLabel(
                  child: Text(
                    _pick('Layout', '레이아웃', 'レイアウト'),
                    key: widget.partKeys.putIfAbsent(
                      'groupLabel',
                      GlobalKey.new,
                    ),
                  ),
                ),
                TRMenuCheckboxItem(
                  value: _grid,
                  onChanged: (value) => setState(() => _grid = value ?? false),
                  child: Text(
                    _pick('Show grid', '격자 표시', 'グリッドを表示'),
                    key: widget.partKeys.putIfAbsent(
                      'checkboxLabel',
                      GlobalKey.new,
                    ),
                  ),
                ),
                TRMenuRadioItem<String>(
                  value: 'compact',
                  groupValue: _density,
                  onChanged: (value) => setState(() => _density = value!),
                  child: Text(
                    _pick('Compact', '좁게', 'コンパクト'),
                    key: widget.partKeys.putIfAbsent(
                      'radioLabel',
                      GlobalKey.new,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _PreviewSelect extends StatefulWidget {
  const _PreviewSelect({
    required this.args,
    required this.locale,
    required this.onStateChanged,
    required this.partKeys,
    required this.size,
    super.key,
  });

  final Map<String, Object?> args;
  final String locale;
  final ValueChanged<Map<String, Object?>> onStateChanged;
  final Map<String, GlobalKey> partKeys;
  final TRUiSize size;

  @override
  State<_PreviewSelect> createState() => _PreviewSelectState();
}

class _PreviewSelectState extends State<_PreviewSelect> {
  final MenuController _controller = MenuController();
  String? _value;

  @override
  void initState() {
    super.initState();
    final value = widget.args['value'];
    _value = value is String ? (value.isEmpty ? null : value) : 'stable';
    _syncOpenState();
  }

  @override
  void didUpdateWidget(_PreviewSelect oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.args['value'] != widget.args['value']) {
      final value = widget.args['value'];
      _value = value is String ? (value.isEmpty ? null : value) : 'stable';
    }
    if (oldWidget.args['open'] != widget.args['open']) _syncOpenState();
  }

  void _syncOpenState() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final shouldOpen = widget.args['open'] == true;
      if (shouldOpen && !_controller.isOpen) _controller.open();
      if (!shouldOpen) {
        if (_controller.isOpen) _controller.close();
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted && widget.args['open'] != true) {
            FocusManager.instance.primaryFocus?.unfocus();
          }
        });
      }
    });
  }

  String _pick(String en, String ko, String ja) => switch (widget.locale) {
    'ko' => ko,
    'ja' => ja,
    _ => en,
  };

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 320,
    child: TRSelect<String>.controlled(
      appearance: _fieldAppearance(widget.args),
      items: [
        TRSelectItem(
          value: 'stable',
          label: _pick('Stable', '안정', '安定版'),
          trailing: KeyedSubtree(
            key: widget.partKeys.putIfAbsent('popup', GlobalKey.new),
            child: const Icon(Icons.check, size: TRGeneratedSpacing.lg),
          ),
        ),
        TRSelectItem(value: 'beta', label: _pick('Beta', '베타', 'ベータ')),
      ],
      value: _value,
      enabled: widget.args['disabled'] != true,
      errorText:
          widget.args['errorText'] is String &&
              (widget.args['errorText']! as String).isNotEmpty
          ? widget.args['errorText']! as String
          : null,
      menuController: _controller,
      onClose: () => widget.onStateChanged({'open': false}),
      onOpen: () => widget.onStateChanged({'open': true}),
      onValueChange: (value) {
        setState(() => _value = value);
        widget.onStateChanged({
          'args': {'value': value ?? ''},
        });
      },
      placeholder: _pick('Choose a channel', '채널 선택', 'チャンネルを選択'),
      readOnly: widget.args['readOnly'] == true,
      uiSize: widget.size,
      width: 320,
    ),
  );
}

class _PreviewDialog extends StatefulWidget {
  const _PreviewDialog({
    required this.args,
    required this.locale,
    required this.onStateChanged,
    required this.partKeys,
    super.key,
  });

  final Map<String, Object?> args;
  final String locale;
  final ValueChanged<Map<String, Object?>> onStateChanged;
  final Map<String, GlobalKey> partKeys;

  @override
  State<_PreviewDialog> createState() => _PreviewDialogState();
}

class _PreviewDialogState extends State<_PreviewDialog> {
  bool _routeOpen = false;
  NavigatorState? _rootNavigator;

  @override
  void initState() {
    super.initState();
    if (widget.args['open'] == true) _scheduleShow();
  }

  @override
  void didUpdateWidget(_PreviewDialog oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.args['open'] != true && widget.args['open'] == true) {
      _scheduleShow();
    } else if (oldWidget.args['open'] == true &&
        widget.args['open'] != true &&
        _routeOpen) {
      Navigator.of(context, rootNavigator: true).maybePop();
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _rootNavigator = Navigator.of(context, rootNavigator: true);
  }

  @override
  void dispose() {
    final navigator = _rootNavigator;
    if (_routeOpen && navigator != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (navigator.mounted && navigator.canPop()) navigator.pop();
      });
    }
    super.dispose();
  }

  void _scheduleShow() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted && !_routeOpen) _show();
    });
  }

  String _pick(String en, String ko, String ja) => switch (widget.locale) {
    'ko' => ko,
    'ja' => ja,
    _ => en,
  };

  Future<void> _show() async {
    if (_routeOpen) return;
    setState(() => _routeOpen = true);
    widget.onStateChanged({'open': true});
    final placement = TRDialogPlacement.values.byName(
      widget.args['placement'] is String
          ? widget.args['placement']! as String
          : 'middle',
    );
    await showTRDialog<void>(
      context: context,
      builder: (dialogContext) => TRDialog(
        placement: placement,
        title: Text(
          _pick('Deploy rack?', '랙을 배포할까요?', 'ラックをデプロイしますか？'),
          key: widget.partKeys.putIfAbsent('popup', GlobalKey.new),
        ),
        description: Text(
          _pick(
            'The stable channel will be updated.',
            '안정 채널이 업데이트돼요.',
            '安定版チャンネルが更新されます。',
          ),
        ),
        content: Text(_pick('Stable', '안정', '安定版')),
        actions: Wrap(
          spacing: TRSpacing.small,
          children: [
            TRButton(
              appearance: TRAppearance.ghost,
              onPressed: () => Navigator.pop(dialogContext),
              child: SizedBox(
                width: TRGeneratedMeasurements.measureXs,
                height: TRGeneratedControlMetrics.mdLineHeight,
                key: widget.partKeys.putIfAbsent('cancelLabel', GlobalKey.new),
                child: Center(child: Text(_pick('Cancel', '취소', 'キャンセル'))),
              ),
            ),
            TRButton(
              intent: TRIntent.primary,
              onPressed: () => Navigator.pop(dialogContext),
              child: SizedBox(
                width: TRGeneratedMeasurements.measureXs,
                height: TRGeneratedControlMetrics.mdLineHeight,
                key: widget.partKeys.putIfAbsent('actionLabel', GlobalKey.new),
                child: Center(child: Text(_pick('Deploy', '배포', 'デプロイ'))),
              ),
            ),
          ],
        ),
      ),
    );
    if (!mounted) return;
    setState(() => _routeOpen = false);
    widget.onStateChanged({'open': false});
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    width: TRGeneratedMeasurements.measureSm,
    child: TRButton(
      onPressed: _show,
      child: SizedBox(
        width: TRGeneratedMeasurements.measureXs + TRGeneratedSpacing.lg,
        height: TRGeneratedControlMetrics.mdLineHeight,
        key: widget.partKeys.putIfAbsent('triggerLabel', GlobalKey.new),
        child: Center(
          child: Text(_pick('Open dialog', '다이얼로그 열기', 'ダイアログを開く')),
        ),
      ),
    ),
  );
}

class _PreviewPlusIcon extends StatelessWidget {
  const _PreviewPlusIcon({super.key});

  @override
  Widget build(BuildContext context) {
    final color = IconTheme.of(context).color;
    return SizedBox.square(
      dimension: 16,
      child: Stack(
        alignment: Alignment.center,
        children: [
          SizedBox(width: 8, height: 2, child: ColoredBox(color: color!)),
          SizedBox(width: 2, height: 8, child: ColoredBox(color: color)),
        ],
      ),
    );
  }
}

class _PreviewStatusIcon extends StatelessWidget {
  const _PreviewStatusIcon({super.key});

  @override
  Widget build(BuildContext context) => SizedBox.square(
    dimension: 16,
    child: DecoratedBox(
      decoration: BoxDecoration(
        border: Border.all(color: IconTheme.of(context).color!, width: 2),
        shape: BoxShape.circle,
      ),
    ),
  );
}
