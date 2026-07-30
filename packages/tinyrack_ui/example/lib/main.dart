import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

import 'preview_bridge.dart';
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
      initialTheme: query['theme'] == 'dark' ? ThemeMode.dark : ThemeMode.light,
      locale: switch (query['locale']) {
        'ko' => const Locale('ko'),
        'ja' => const Locale('ja'),
        _ => const Locale('en'),
      },
    ),
  );
}

class PreviewApp extends StatefulWidget {
  const PreviewApp({
    required this.component,
    required this.initialTheme,
    required this.locale,
    super.key,
  });

  final String component;
  final ThemeMode initialTheme;
  final Locale locale;

  @override
  State<PreviewApp> createState() => _PreviewAppState();
}

class _PreviewAppState extends State<PreviewApp> {
  late final PreviewBridge _bridge;
  late final TextEditingController _textFieldController;
  final GlobalKey _previewKey = GlobalKey();
  final Map<String, GlobalKey> _partKeys = {};
  Map<String, Object?> _args = const {};
  late ThemeMode _themeMode;
  bool _focused = false;
  bool _hovered = false;
  bool _pressed = false;
  int _activations = 0;

  @override
  void initState() {
    super.initState();
    _themeMode = widget.initialTheme;
    _textFieldController = TextEditingController();
    _bridge = PreviewBridge(_handleMessage);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _bridge.send('ready', widget.component, {
        'supportedArgs': _supportedArgs(widget.component),
      });
      _sendMetrics();
    });
  }

  void _sendMetrics() {
    final renderObject = _previewKey.currentContext?.findRenderObject();
    if (renderObject is! RenderBox || !renderObject.hasSize) return;
    final origin = renderObject.localToGlobal(Offset.zero);
    double? baseline;
    try {
      baseline = renderObject.getDistanceToBaseline(TextBaseline.alphabetic);
    } catch (_) {
      baseline = null;
    }
    final parts = {
      for (final MapEntry(:key, :value) in _partKeys.entries)
        key: _measure(value),
    }..removeWhere((_, value) => value == null);
    _bridge.send('metrics', widget.component, {
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
            (widget.component == 'text-field' ||
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
    });
  }

  Map<String, Object?>? _measure(GlobalKey key) {
    final renderObject = key.currentContext?.findRenderObject();
    if (renderObject is! RenderBox || !renderObject.hasSize) return null;
    final origin = renderObject.localToGlobal(Offset.zero);
    double? baseline;
    try {
      baseline = renderObject.getDistanceToBaseline(TextBaseline.alphabetic);
    } catch (_) {
      baseline = null;
    }
    return {
      'bounds': {
        'x': origin.dx,
        'y': origin.dy,
        'width': renderObject.size.width,
        'height': renderObject.size.height,
      },
      'baseline': baseline,
    };
  }

  void _handleMessage(Map<String, Object?> message) {
    if (message['channel'] != 'tinyrack.flutter-preview.v1' ||
        message['component'] != widget.component) {
      return;
    }
    final type = message['type'];
    final payload = message['payload'];
    final requestId = message['requestId'];
    if (type == 'ready' ||
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
      final nextArgs = _validateArgs(widget.component, payload);
      if (nextArgs == null) {
        _sendSchemaError(type);
        return;
      }
      if (widget.component == 'text-field') {
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
      // Measurement is read-only and may arrive while no new frame is
      // scheduled, so report the current RenderBox synchronously.
      _sendMetrics();
      return;
    } else {
      _sendSchemaError(type);
      return;
    }
    _bridge.send('stateChanged', widget.component, {
      'args': _args,
      'theme': _themeMode.name,
      if (requestId is num) 'requestId': requestId,
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _sendMetrics());
  }

  void _sendSchemaError(Object? type) {
    _bridge.send('error', widget.component, {
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
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      locale: widget.locale,
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
              child: MouseRegion(
                onEnter: (_) => _updateInteraction(hovered: true),
                onExit: (_) => _updateInteraction(hovered: false),
                child: Listener(
                  onPointerCancel: (_) => _updateInteraction(pressed: false),
                  onPointerDown: (_) => _updateInteraction(pressed: true),
                  onPointerUp: (_) => _updateInteraction(pressed: false),
                  child: Focus(
                    canRequestFocus: false,
                    onFocusChange: (focused) =>
                        _updateInteraction(focused: focused),
                    onKeyEvent: (_, event) {
                      if (event.logicalKey == LogicalKeyboardKey.space ||
                          event.logicalKey == LogicalKeyboardKey.enter) {
                        _updateInteraction(pressed: event is KeyDownEvent);
                      }
                      return KeyEventResult.ignored;
                    },
                    child: PreviewComponent(
                      args: _args,
                      component: widget.component,
                      locale: widget.locale.languageCode,
                      measureKey: _previewKey,
                      partKeys: _partKeys,
                      textFieldController: _textFieldController,
                      onStateChanged: (payload) {
                        if (payload['pressed'] == true) _activations += 1;
                        _bridge.send('stateChanged', widget.component, payload);
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
      'disabled' ||
      'loading' ||
      'parity' ||
      'readOnly' ||
      'showActions' ||
      'showDescription' ||
      'showIcon' ||
      'truncate' => value is bool,
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
      'variant' when component == 'alert' || component == 'badge' =>
        value is String &&
            const {
              'neutral',
              'info',
              'success',
              'warning',
              'danger',
            }.contains(value),
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
      'alert' || 'badge' => TRStatusVariant.values.byName(
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
      _ => const Text('Unsupported preview'),
    };
  }
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
