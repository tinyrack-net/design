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
    final popupKey = _partKeys['popup'];
    final popupRenderObject = _args['open'] == true && popupKey != null
        ? _layerBoundary(popupKey, switch (_component) {
            'dialog' => TRLayerBoundaryKind.dialog,
            'select' => TRLayerBoundaryKind.select,
            _ => TRLayerBoundaryKind.menu,
          })
        : null;
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
    void visit(RenderObject node) {
      if (node is RenderTRLayerPartBoundary) {
        final measurement = _measureBox(node);
        if (measurement != null) {
          parts.putIfAbsent(node.name, () => measurement);
        }
      }
      node.visitChildren(visit);
    }

    visit(root);
    return parts;
  }

  Map<String, Object?>? _measure(GlobalKey key) =>
      _measureBox(key.currentContext?.findRenderObject());

  RenderObject? _layerBoundary(
    GlobalKey key,
    TRLayerBoundaryKind expectedKind,
  ) {
    RenderObject? current = key.currentContext?.findRenderObject();
    while (current != null) {
      if (current is RenderTRLayerBoundary && current.kind == expectedKind) {
        return current;
      }
      current = current.parent;
    }
    return null;
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
  'checkbox-group' => ['disabled'],
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
      'orientation' =>
        value is String && const {'horizontal', 'vertical'}.contains(value),
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
    required this.partKeys,
    required this.textFieldController,
    required this.onStateChanged,
    super.key,
  });

  final Map<String, Object?> args;
  final String component;
  final String locale;
  final Key measureKey;
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
      'checkbox-group' => TRCheckboxGroup(
        key: measureKey,
        disabled: args['disabled'] == true,
        onValueChange: (_) => onStateChanged({'pressed': true}),
        value: const ['terms'],
        children: [
          TRCheckbox(key: _partKey('first'), value: 'terms'),
          const TRCheckbox(value: 'newsletter'),
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
