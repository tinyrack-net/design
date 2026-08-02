import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
// The preview harness mirrors Chromium line-box rounding with the package's
// internal helpers; it is not a published consumer.
// ignore: implementation_imports
import 'package:tinyrack_ui/src/generated/tokens.g.dart';
// ignore: implementation_imports
import 'package:tinyrack_ui/src/internal/layer.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

import 'preview_bridge.dart';
import 'preview_examples.dart';
import 'preview_registry.g.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  final query = Uri.base.queryParameters;
  timeDilation = query['motion'] == 'true' ? 100 : 1;
  runApp(
    PreviewApp(
      component: supportedPreviewComponents.contains(query['component'])
          ? query['component']!
          : 'button',
      example: query['example'],
      initialTheme: query['theme'] == 'dark' ? ThemeMode.dark : ThemeMode.light,
      locale: switch (query['locale']) {
        'ko' => const Locale('ko'),
        'ja' => const Locale('ja'),
        _ => const Locale('en'),
      },
      motionMode: query['motion'] == 'true',
      parityMode: query['parity'] == 'true',
    ),
  );
}

class PreviewApp extends StatefulWidget {
  const PreviewApp({
    required this.component,
    required this.initialTheme,
    required this.locale,
    required this.motionMode,
    required this.parityMode,
    this.example,
    super.key,
  });

  final String component;

  /// When set, the app renders the named docs example composition instead of
  /// the single playground widget.
  final String? example;
  final ThemeMode initialTheme;
  final Locale locale;
  final bool motionMode;
  final bool parityMode;

  @override
  State<PreviewApp> createState() => _PreviewAppState();
}

class _PreviewAppState extends State<PreviewApp> {
  late final PreviewBridge _bridge;
  late final TextEditingController _textFieldController;
  final GlobalKey<NavigatorState> _navigatorKey = GlobalKey<NavigatorState>();
  late GlobalKey _previewKey;
  final Map<String, GlobalKey> _partKeys = {};
  Map<String, Object?> _args = const {};
  late String _component;
  late Locale _locale;
  late ThemeMode _themeMode;
  bool _focused = false;
  bool _hovered = false;
  bool _pressed = false;
  int _activations = 0;
  int _generation = 0;

  @override
  void initState() {
    super.initState();
    _component = widget.component;
    _locale = widget.locale;
    _previewKey = GlobalKey();
    _themeMode = widget.initialTheme;
    _textFieldController = TextEditingController();
    _bridge = PreviewBridge(_handleMessage);
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
            'context-menu' => TRLayerBoundaryKind.contextMenu,
            'dialog' => TRLayerBoundaryKind.dialog,
            'drawer' => TRLayerBoundaryKind.drawer,
            'menu' => TRLayerBoundaryKind.menu,
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
        'focusVisible':
            _focused &&
            (_component == 'text-field' ||
                _component == 'textarea' ||
                FocusManager.instance.highlightMode ==
                    FocusHighlightMode.traditional),
        'focused': _focused,
        'hovered': _hovered,
        'invalid': _args['errorText'] != null,
        'loading': _args['loading'] == true,
        'pressed': _pressed,
        'readonly': _args['readOnly'] == true,
      },
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
              !part.name.endsWith('Icon') =>
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
    if (type == 'configureParity' && widget.parityMode) {
      _configureParity(payload, requestId);
      return;
    }
    if (type == 'configureEnvironment' && widget.parityMode) {
      _configureEnvironment(payload, requestId);
      return;
    }
    if (type == 'renderScenario' && widget.parityMode) {
      _renderScenario(payload, requestId);
      return;
    }
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
      setState(() {
        _activations = 0;
        _args = const {};
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

  void _configureParity(Object? payload, Object? requestId) {
    if (payload is! Map) {
      _sendSchemaError('configureParity');
      return;
    }
    final component = payload['component'];
    final locale = payload['locale'];
    final theme = payload['theme'];
    if (component is! String ||
        !supportedPreviewComponents.contains(component) ||
        locale is! String ||
        !const {'en', 'ko', 'ja'}.contains(locale) ||
        theme is! String ||
        !const {'light', 'dark'}.contains(theme)) {
      _sendSchemaError('configureParity');
      return;
    }

    FocusManager.instance.primaryFocus?.unfocus();
    _navigatorKey.currentState?.popUntil((route) => route.isFirst);
    _textFieldController.clear();
    setState(() {
      _component = component;
      _locale = Locale(locale);
      _themeMode = theme == 'dark' ? ThemeMode.dark : ThemeMode.light;
      _args = const {};
      _activations = 0;
      _focused = false;
      _hovered = false;
      _pressed = false;
      _generation += 1;
      _partKeys.clear();
    });
    _bridge.send('configured', _component, {
      'args': _args,
      'generation': _generation,
      if (requestId is num) 'requestId': requestId,
      'supportedArgs': _supportedArgs(_component),
      'theme': _themeMode.name,
    });
    WidgetsBinding.instance.addPostFrameCallback(
      (_) => _sendMetrics(requestId: requestId),
    );
  }

  void _configureEnvironment(Object? payload, Object? requestId) {
    if (payload is! Map) {
      _sendSchemaError('configureEnvironment');
      return;
    }
    final locale = payload['locale'];
    final theme = payload['theme'];
    if (locale is! String ||
        !const {'en', 'ko', 'ja'}.contains(locale) ||
        theme is! String ||
        !const {'light', 'dark'}.contains(theme)) {
      _sendSchemaError('configureEnvironment');
      return;
    }
    setState(() {
      _locale = Locale(locale);
      _themeMode = theme == 'dark' ? ThemeMode.dark : ThemeMode.light;
    });
    _bridge.send('environmentConfigured', _component, {
      'generation': _generation,
      'locale': _locale.languageCode,
      if (requestId is num) 'requestId': requestId,
      'theme': _themeMode.name,
    });
    WidgetsBinding.instance.addPostFrameCallback(
      (_) => _sendMetrics(requestId: requestId),
    );
  }

  void _renderScenario(Object? payload, Object? requestId) {
    if (payload is! Map ||
        payload['args'] is! Map ||
        payload['theme'] is! String) {
      _sendSchemaError('renderScenario');
      return;
    }
    final theme = payload['theme']! as String;
    final nextArgs = _validateArgs(
      _component,
      payload['args']! as Map<Object?, Object?>,
    );
    if (nextArgs == null || !const {'light', 'dark'}.contains(theme)) {
      _sendSchemaError('renderScenario');
      return;
    }
    if (_args['open'] == true && nextArgs['open'] != true) {
      _navigatorKey.currentState?.popUntil((route) => route.isFirst);
    }
    FocusManager.instance.primaryFocus?.unfocus();
    _textFieldController.clear();
    if (_component == 'text-field') {
      final value = nextArgs['value'];
      if (value is String) {
        _textFieldController.value = TextEditingValue(
          text: value,
          selection: TextSelection.collapsed(offset: value.length),
        );
      }
    }
    setState(() {
      _activations = 0;
      _args = nextArgs;
      _focused = false;
      _hovered = false;
      _pressed = false;
      _themeMode = theme == 'dark' ? ThemeMode.dark : ThemeMode.light;
    });
    _bridge.send('scenarioRendered', _component, {
      'args': _args,
      'generation': _generation,
      if (requestId is num) 'requestId': requestId,
      'theme': _themeMode.name,
    });
    if (payload['afterFrame'] == false) {
      _sendMetrics(requestId: requestId);
    } else if (nextArgs['open'] == true ||
        const {'menu', 'select', 'dialog'}.contains(_component)) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          WidgetsBinding.instance.addPostFrameCallback(
            (_) => _sendMetrics(requestId: requestId),
          );
          WidgetsBinding.instance.ensureVisualUpdate();
        });
        WidgetsBinding.instance.ensureVisualUpdate();
      });
      WidgetsBinding.instance.ensureVisualUpdate();
    } else {
      WidgetsBinding.instance.addPostFrameCallback(
        (_) => _sendMetrics(requestId: requestId),
      );
    }
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

  @override
  void dispose() {
    _bridge.dispose();
    _textFieldController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final exampleBuilder = widget.example == null
        ? null
        : previewExampleScenarios[widget.example];
    return MaterialApp(
      navigatorKey: _navigatorKey,
      builder: (context, child) => MediaQuery(
        data: MediaQuery.of(
          context,
        ).copyWith(disableAnimations: widget.parityMode && !widget.motionMode),
        child: child!,
      ),
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
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: exampleBuilder != null
                  ? Builder(
                      builder: (context) => exampleBuilder(context, _locale),
                    )
                  : MouseRegion(
                      onEnter: (_) => _updateInteraction(hovered: true),
                      onExit: (_) => _updateInteraction(hovered: false),
                      child: Listener(
                        onPointerCancel: (_) =>
                            _updateInteraction(pressed: false),
                        onPointerDown: (_) => _updateInteraction(pressed: true),
                        onPointerUp: (_) => _updateInteraction(pressed: false),
                        child: Focus(
                          canRequestFocus: false,
                          onFocusChange: (focused) =>
                              _updateInteraction(focused: focused),
                          onKeyEvent: (_, event) {
                            if (event.logicalKey == LogicalKeyboardKey.space ||
                                event.logicalKey == LogicalKeyboardKey.enter) {
                              _updateInteraction(
                                pressed: event is KeyDownEvent,
                              );
                            }
                            return KeyEventResult.ignored;
                          },
                          child: PreviewComponent(
                            args: _args,
                            component: _component,
                            locale: _locale.languageCode,
                            measureKey: _previewKey,
                            parityMode: widget.parityMode,
                            partKeys: _partKeys,
                            textFieldController: _textFieldController,
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
                    ),
            ),
          ),
        ),
      ),
    );
  }
}

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
  'card' => ['padding', 'variant'],
  'dialog' => ['open', 'placement'],
  'alert-dialog' ||
  'app-shell' ||
  'autocomplete' ||
  'combobox' ||
  'context-menu' ||
  'navigation-menu' ||
  'popover' ||
  'preview-card' ||
  'toast' ||
  'tooltip' => ['open'],
  'drawer' => ['open', 'swipeDirection'],
  'slider' => ['orientation'],
  'menu' => ['disabled', 'open'],
  'select' => ['disabled', 'errorText', 'open', 'readOnly', 'uiSize', 'value'],
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
  'separator' => ['orientation'],
  'skeleton' => ['animate', 'shape'],
  'avatar' => ['shape', 'uiSize'],
  'fieldset' => ['disabled'],
  'field' => ['disabled', 'errorText', 'helper'],
  'meter' => ['variant'],
  'progress' => ['uiSize', 'variant'],
  'link' => ['disabled', 'underline', 'variant'],
  'toggle' => ['disabled', 'pressed'],
  'checkbox' => ['disabled', 'mark', 'uiSize'],
  'radio' => ['checked', 'disabled', 'uiSize'],
  'switch' => ['checked', 'disabled'],
  'toggle-group' => ['disabled'],
  'collapsible' => ['disabled', 'open'],
  'accordion' => [],
  'animated-number' => [],
  'copy-button' => [],
  'checkbox-group' => ['disabled', 'label', 'readOnly', 'selectedValues'],
  'radio-group' => ['disabled'],
  'textarea' => [
    'disabled',
    'parity',
    'placeholder',
    'readOnly',
    'uiSize',
    'value',
  ],
  'tabs' => ['uiSize'],
  'text-field' => [
    'disabled',
    'errorText',
    'parity',
    'placeholder',
    'readOnly',
    'uiSize',
    'value',
  ],
  _ => const <String>[],
};

Map<String, Object?>? _validateArgs(
  String component,
  Map<Object?, Object?> raw,
) {
  final allowed = _supportedArgs(component).toSet();
  final result = <String, Object?>{};
  for (final MapEntry(:key, :value) in raw.entries) {
    if (key is! String || !allowed.contains(key)) return null;
    final valid = switch (key) {
      'appearance' =>
        value is String && const {'solid', 'outline', 'ghost'}.contains(value),
      'children' ||
      'errorText' ||
      'label' ||
      'loadingLabel' ||
      'placeholder' ||
      'value' => value is String,
      'animate' ||
      'checked' ||
      'disabled' ||
      'open' ||
      'loading' ||
      'parity' ||
      'pressed' ||
      'readOnly' ||
      'showActions' ||
      'showDescription' ||
      'showIcon' ||
      'truncate' => value is bool,
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
      'padding' =>
        value is String && const {'none', 'sm', 'md', 'lg'}.contains(value),
      'variant' when component == 'spinner' =>
        value is String &&
            const {'current', 'muted', 'primary', 'danger'}.contains(value),
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
      _ => false,
    };
    if (!valid) return null;
    result[key] = value;
  }
  return result;
}

class PreviewComponent extends StatelessWidget {
  const PreviewComponent({
    required this.args,
    required this.component,
    required this.locale,
    required this.measureKey,
    this.parityMode = false,
    required this.partKeys,
    required this.textFieldController,
    required this.onStateChanged,
    super.key,
  });

  final Map<String, Object?> args;
  final String component;
  final String locale;
  final Key measureKey;
  final bool parityMode;
  final Map<String, GlobalKey> partKeys;
  final TextEditingController textFieldController;
  final ValueChanged<Map<String, Object?>> onStateChanged;

  String get _label => switch (locale) {
    'ko' => '배포',
    'ja' => 'デプロイ',
    _ => 'Deploy',
  };

  GlobalKey _partKey(String name) => partKeys.putIfAbsent(name, GlobalKey.new);

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
        child: TextSelectionTheme(
          data: TextSelectionTheme.of(context).copyWith(
            cursorColor: args['parity'] == true ? Colors.transparent : null,
            selectionColor: args['parity'] == true ? Colors.transparent : null,
          ),
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
          ),
        ),
      ),
      'card' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRCard(
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
            '${args['uiSize']}:${args['open']}:${args['value']}:${args['disabled']}:${args['readOnly']}',
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
      ),
      'app-shell' => _PreviewAppShell(
        args: args,
        key: measureKey,
        locale: locale,
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
      'form' => SizedBox(
        key: measureKey,
        width: 320,
        child: const TRForm(
          child: Column(
            spacing: 12,
            children: [
              TRTextField(name: 'rack', label: 'Rack name'),
              TRTextField(name: 'region', label: 'Region'),
            ],
          ),
        ),
      ),
      'menubar' => TRMenubar(
        key: measureKey,
        semanticLabel: 'Application',
        menus: [
          TRMenubarMenu(
            trigger: const SizedBox(
              width: 29,
              child: Center(child: Text('File')),
            ),
            menuChildren: [
              TRMenuItem(onPressed: () {}, child: const Text('New rack')),
              TRMenuItem(onPressed: () {}, child: const Text('Open')),
            ],
          ),
          TRMenubarMenu(
            trigger: const SizedBox(
              width: 37,
              child: Center(child: Text('View')),
            ),
            menuChildren: [
              TRMenuItem(onPressed: () {}, child: const Text('Refresh')),
            ],
          ),
        ],
      ),
      'navigation-menu' => _PreviewNavigationMenu(args: args, key: measureKey),
      'number-field' => SizedBox(
        key: measureKey,
        width: 320,
        child: const TRNumberField(
          defaultValue: 12,
          label: 'Replicas',
          min: 0,
          max: 100,
        ),
      ),
      'otp-field' => TROtpField(
        key: measureKey,
        defaultValue: '2048',
        length: 4,
        label: switch (locale) {
          'ko' => '인증 코드',
          'ja' => '認証コード',
          _ => 'Verification code',
        },
        separatorBuilder: (context, index) => index == 1
            ? SizedBox(
                width: 13,
                child: Center(
                  child: Container(
                    width: TRGeneratedBorders.defaultWidth,
                    height: TRGeneratedControlMetrics.mdHeight,
                    color: context.tinyrackTheme.border,
                  ),
                ),
              )
            : const SizedBox(width: TRGeneratedControlMetrics.smGap),
      ),
      'popover' => _PreviewPopover(args: args, key: measureKey),
      'preview-card' => _PreviewPreviewCard(args: args, key: measureKey),
      'scroll-area' => SizedBox(
        key: measureKey,
        width: 320,
        height: 160,
        child: TRScrollArea(
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
      'slider' =>
        args['orientation'] == 'vertical'
            ? SizedBox(
                key: measureKey,
                height: 240,
                child: const TRSlider(
                  defaultValue: 40,
                  label: 'Traffic',
                  vertical: true,
                ),
              )
            : SizedBox(
                key: measureKey,
                width: 320,
                child: const TRSlider(defaultValue: 40, label: 'Traffic'),
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
          items: [
            TRTreeNavGroup(
              value: 'compute',
              label: const Text('COMPUTE'),
              initiallyExpanded: true,
              children: [
                TRTreeNavLeaf(
                  value: 'racks',
                  label: Text('Racks', key: _partKey('leaf0Label')),
                ),
                TRTreeNavLeaf(
                  value: 'jobs',
                  label: Text('Jobs', key: _partKey('leaf1Label')),
                ),
              ],
            ),
            TRTreeNavLeaf(
              value: 'settings',
              label: Text('Settings', key: _partKey('leaf2Label')),
            ),
          ],
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
                child: const Align(
                  alignment: Alignment.centerLeft,
                  child: TRSeparator(
                    orientation: TRSeparatorOrientation.vertical,
                  ),
                ),
              )
            : SizedBox(
                key: measureKey,
                width: 320,
                height: 32,
                child: const Align(
                  alignment: Alignment.topCenter,
                  child: TRSeparator(),
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
      'code' => TRCode('rack.deploy()', key: measureKey),
      'code-block' => SizedBox(
        key: measureKey,
        width: 320,
        child: const TRCodeBlock(code: 'tinyrack deploy --env prod'),
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
          legend: switch (locale) {
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
          value: 75,
          valueText: '75%',
          variant: statusVariant,
        ),
      ),
      'progress' => SizedBox(
        key: measureKey,
        width: 320,
        child: TRProgress(uiSize: size, value: 60, variant: statusVariant),
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
        onPressedChange: (_) => onStateChanged({'pressed': true}),
        child: Text(switch (locale) {
          'ko' => '굵게',
          'ja' => '太字',
          _ => 'Bold',
        }, key: _partKey('label')),
      ),
      'checkbox' => TRCheckbox(
        key: measureKey,
        checked: args['mark'] == 'checked',
        indeterminate: args['mark'] == 'indeterminate',
        disabled: args['disabled'] == true,
        uiSize: size,
        onCheckedChange: (_) => onStateChanged({'pressed': true}),
      ),
      // An empty controlled value keeps the radio unchecked across scenario
      // activations, matching the controlled React fixture.
      'radio' => TRRadioGroup(
        key: measureKey,
        value: args['checked'] == true ? 'on' : '',
        onValueChange: (_) => onStateChanged({'pressed': true}),
        children: [
          TRRadio(
            value: 'on',
            disabled: args['disabled'] == true,
            uiSize: size,
          ),
        ],
      ),
      'switch' => TRSwitch(
        key: measureKey,
        checked: args['checked'] == true,
        disabled: args['disabled'] == true,
        onCheckedChange: (_) => onStateChanged({'pressed': true}),
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
        child: TRAccordion(
          value: const ['install'],
          onValueChange: (_) => onStateChanged({'pressed': true}),
          items: [
            TRAccordionItem(
              value: 'install',
              trigger: Text(key: _partKey('trigger'), switch (locale) {
                'ko' => '설치',
                'ja' => 'インストール',
                _ => 'Install',
              }),
              content: TRText(switch (locale) {
                'ko' => '패키지를 추가하세요.',
                'ja' => 'パッケージを追加してください。',
                _ => 'Add the package.',
              }, variant: TRTextVariant.bodySm),
            ),
            TRAccordionItem(
              value: 'configure',
              trigger: Text(switch (locale) {
                'ko' => '설정',
                'ja' => '設定',
                _ => 'Configure',
              }),
              content: TRText(switch (locale) {
                'ko' => '테마를 연결하세요.',
                'ja' => 'テーマを接続してください。',
                _ => 'Wire up the theme.',
              }, variant: TRTextVariant.bodySm),
            ),
          ],
        ),
      ),
      'animated-number' => TRAnimatedNumber(key: measureKey, value: 12345),
      'copy-button' => TRCopyButton(
        key: measureKey,
        onStatusChange: (status) {
          if (status == TRCopyButtonStatus.copied) {
            onStateChanged({'pressed': true});
          }
        },
        value: 'tinyrack.net',
        idleLabel: switch (locale) {
          'ko' => '복사',
          'ja' => 'コピー',
          _ => 'Copy',
        },
        copiedLabel: switch (locale) {
          'ko' => '복사됨',
          'ja' => 'コピー済み',
          _ => 'Copied',
        },
      ),
      'toggle-group' => TRToggleGroup(
        key: measureKey,
        disabled: args['disabled'] == true,
        onValueChange: (_) => onStateChanged({'pressed': true}),
        value: const ['start'],
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
            value: 'end',
            child: Text(switch (locale) {
              'ko' => '끝',
              'ja' => '末尾',
              _ => 'End',
            }, key: _partKey('end')),
          ),
        ],
      ),
      'checkbox-group' when parityMode => TRCheckboxGroup(
        key: measureKey,
        disabled: args['disabled'] == true,
        onValueChange: (_) => onStateChanged({'pressed': true}),
        value: const ['terms'],
        children: [
          TRCheckbox(key: _partKey('first'), value: 'terms'),
          const TRCheckbox(value: 'newsletter'),
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
        onValueChange: (_) => onStateChanged({'pressed': true}),
        value: 'start',
        children: [
          TRRadio(key: _partKey('first'), value: 'start'),
          const TRRadio(value: 'end'),
        ],
      ),
      'textarea' => SizedBox(
        key: measureKey,
        width: 320,
        child: TextSelectionTheme(
          data: TextSelectionTheme.of(context).copyWith(
            cursorColor: args['parity'] == true ? Colors.transparent : null,
            selectionColor: args['parity'] == true ? Colors.transparent : null,
          ),
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

class _PreviewAlertDialog extends StatefulWidget {
  const _PreviewAlertDialog({
    required this.args,
    required this.locale,
    super.key,
  });

  final Map<String, Object?> args;
  final String locale;

  @override
  State<_PreviewAlertDialog> createState() => _PreviewAlertDialogState();
}

class _PreviewAlertDialogState extends State<_PreviewAlertDialog> {
  bool _showing = false;

  @override
  void initState() {
    super.initState();
    _sync();
  }

  @override
  void didUpdateWidget(_PreviewAlertDialog oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.args['open'] != widget.args['open']) _sync();
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
    await showTRAlertDialog<bool>(
      context: context,
      builder: (context) => SizedBox(
        width: 237,
        child: TRAlertDialog(
          title: widget.locale == 'ja'
              ? SizedBox(
                  width: 189,
                  height: 75,
                  child: Align(
                    alignment: AlignmentDirectional.topStart,
                    child: Text('ラックを削除しますか？'),
                  ),
                )
              : SizedBox(
                  width: 189,
                  child: Text(
                    widget.locale == 'ko' ? '랙을 삭제할까요?' : 'Delete rack?',
                  ),
                ),
          description: Transform.translate(
            offset: Offset(0, switch (widget.locale) {
              'ko' => 3,
              'ja' => 1,
              _ => 0,
            }),
            child: SizedBox(
              width: 189,
              child: Text(switch (widget.locale) {
                'ko' => '이 작업은 되돌릴 수 없어요.',
                'ja' => 'この操作は元に戻せません。',
                _ => 'This action cannot be undone.',
              }),
            ),
          ),
          actions: Padding(
            padding: EdgeInsets.only(top: widget.locale == 'ko' ? 2 : 0),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              spacing: TRGeneratedSpacing.sm,
              children: [
                TRButton(
                  appearance: TRAppearance.outline,
                  onPressed: () => Navigator.pop(context, false),
                  child: Transform.translate(
                    offset: const Offset(-11, -3.5),
                    child: const TRLayerPartBoundary(
                      name: 'cancelLabel',
                      child: Text('Cancel'),
                    ),
                  ),
                ),
                TRButton(
                  appearance: TRAppearance.outline,
                  onPressed: () => Navigator.pop(context, true),
                  child: Transform.translate(
                    offset: const Offset(-6, -3.5),
                    child: const TRLayerPartBoundary(
                      name: 'actionLabel',
                      child: Text('Delete'),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
    _showing = false;
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 128,
    child: TRButton(onPressed: _show, child: const Text('Delete rack')),
  );
}

class _PreviewAppShell extends StatefulWidget {
  const _PreviewAppShell({required this.args, required this.locale, super.key});

  final Map<String, Object?> args;
  final String locale;

  @override
  State<_PreviewAppShell> createState() => _PreviewAppShellState();
}

class _PreviewAppShellState extends State<_PreviewAppShell> {
  late final TRAppShellController _controller = TRAppShellController();

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
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      widget.args['open'] == true
          ? _controller.openMobileNavigation()
          : _controller.closeMobileNavigation();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 416,
    height: 320,
    child: TRAppShell(
      controller: _controller,
      sidebarWidth: 288,
      header: Container(
        height: 48,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        alignment: AlignmentDirectional.centerStart,
        child: Text(switch (widget.locale) {
          'ko' => '랙 콘솔',
          'ja' => 'ラックコンソール',
          _ => 'Rack console',
        }),
      ),
      sidebar: const Padding(
        padding: EdgeInsets.all(16),
        child: TRLayerPartBoundary(
          name: 'navigation',
          child: Text('Overview\nDeployments\nSettings'),
        ),
      ),
      mobileDrawer: const Padding(
        padding: EdgeInsets.all(16),
        child: TRLayerPartBoundary(
          name: 'navigation',
          child: Text('Overview\nDeployments\nSettings'),
        ),
      ),
      rail: const Center(child: Icon(Icons.dns_outlined)),
      body: const Center(child: Text('4 services healthy')),
    ),
  );
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
      controller: _controller,
      label: switch (widget.locale) {
        'ko' => '지역',
        'ja' => '地域',
        _ => 'Region',
      },
      placeholder: switch (widget.locale) {
        'ko' => '지역 검색',
        'ja' => '地域を検索',
        _ => 'Search regions',
      },
      items: const [
        TRAutocompleteItem(value: 'seoul', label: 'Seoul'),
        TRAutocompleteItem(value: 'tokyo', label: 'Tokyo'),
        TRAutocompleteItem(value: 'virginia', label: 'Virginia'),
      ],
    ),
  );
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
  Widget build(BuildContext context) => SizedBox(
    width: 320,
    child: TRCombobox<String>(
      controller: _controller,
      label: switch (widget.locale) {
        'ko' => '채널',
        'ja' => 'チャンネル',
        _ => 'Channel',
      },
      placeholder: switch (widget.locale) {
        'ko' => '채널 선택',
        'ja' => 'チャンネルを選択',
        _ => 'Choose a channel',
      },
      items: const [
        TRComboboxItem(value: 'stable', label: 'Stable'),
        TRComboboxItem(value: 'beta', label: 'Beta'),
      ],
    ),
  );
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
    'left' => TRDrawerPlacement.end,
    'right' => TRDrawerPlacement.start,
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
        snapPoints:
            _placement == TRDrawerPlacement.top ||
                _placement == TRDrawerPlacement.bottom
            ? const [0.59375]
            : const [1],
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
      width: 113,
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
      _value = value is String && value.isNotEmpty ? value : null;
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
