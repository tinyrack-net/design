import 'package:flutter/material.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

import 'preview_bridge.dart';
import 'preview_registry.g.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  final query = Uri.base.queryParameters;
  runApp(
    PreviewApp(
      component: supportedPreviewComponents.contains(query['component'])
          ? query['component']!
          : 'button',
      locale: switch (query['locale']) {
        'ko' => const Locale('ko'),
        'ja' => const Locale('ja'),
        _ => const Locale('en'),
      },
    ),
  );
}

class PreviewApp extends StatefulWidget {
  const PreviewApp({required this.component, required this.locale, super.key});

  final String component;
  final Locale locale;

  @override
  State<PreviewApp> createState() => _PreviewAppState();
}

class _PreviewAppState extends State<PreviewApp> {
  late final PreviewBridge _bridge;
  Map<String, Object?> _args = const {};
  ThemeMode _themeMode = ThemeMode.light;

  @override
  void initState() {
    super.initState();
    _bridge = PreviewBridge(_handleMessage);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _bridge.send('ready', widget.component, {
        'supportedArgs': _supportedArgs(widget.component),
      });
    });
  }

  void _handleMessage(Map<String, Object?> message) {
    if (message['channel'] != 'tinyrack.flutter-preview.v1' ||
        message['component'] != widget.component) {
      return;
    }
    final type = message['type'];
    final payload = message['payload'];
    if (type == 'reset') {
      setState(() => _args = const {});
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
      setState(() {
        _args = {..._args, ...nextArgs};
      });
    } else {
      _sendSchemaError(type);
      return;
    }
    _bridge.send('stateChanged', widget.component, {
      'args': _args,
      'theme': _themeMode.name,
    });
  }

  void _sendSchemaError(Object? type) {
    _bridge.send('error', widget.component, {
      'code': 'invalid-message',
      'messageType': type is String ? type : 'unknown',
    });
  }

  @override
  void dispose() {
    _bridge.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      locale: widget.locale,
      theme: TinyrackTheme.light(),
      darkTheme: TinyrackTheme.dark(),
      themeMode: _themeMode,
      home: Scaffold(
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: PreviewComponent(
                args: _args,
                component: widget.component,
                locale: widget.locale.languageCode,
                onStateChanged: (payload) {
                  _bridge.send('stateChanged', widget.component, payload);
                },
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
    'uiSize',
  ],
  'alert' => ['intent'],
  'badge' => ['intent', 'uiSize'],
  'icon-button' => ['intent', 'uiSize'],
  'spinner' => ['uiSize'],
  'text' => ['role'],
  'text-field' => ['disabled', 'uiSize', 'value'],
  _ => const [],
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
      'children' || 'value' => value is String,
      'disabled' || 'loading' => value is bool,
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
      'role' =>
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
    required this.onStateChanged,
    super.key,
  });

  final Map<String, Object?> args;
  final String component;
  final String locale;
  final ValueChanged<Map<String, Object?>> onStateChanged;

  String get _label => switch (locale) {
    'ko' => '배포',
    'ja' => 'デプロイ',
    _ => 'Deploy',
  };

  @override
  Widget build(BuildContext context) {
    final intent = TRIntent.values.byName(
      args['intent'] is String ? args['intent']! as String : 'primary',
    );
    final size = TRUiSize.values.byName(
      args['uiSize'] is String ? args['uiSize']! as String : 'md',
    );
    return switch (component) {
      'button' => TRButton(
        appearance: TRAppearance.values.byName(
          args['appearance'] is String
              ? args['appearance']! as String
              : 'solid',
        ),
        intent: intent,
        loading: args['loading'] == true,
        loadingLabel: switch (locale) {
          'ko' => '배포 중',
          'ja' => 'デプロイ中',
          _ => 'Deploying',
        },
        onPressed: args['disabled'] == true
            ? null
            : () => onStateChanged({'pressed': true}),
        uiSize: size,
        child: Text(
          args['children'] is String ? args['children']! as String : _label,
        ),
      ),
      'icon-button' => TRIconButton(
        icon: const Icon(Icons.add),
        intent: intent,
        label: switch (locale) {
          'ko' => '랙 추가',
          'ja' => 'ラックを追加',
          _ => 'Add rack',
        },
        onPressed: () => onStateChanged({'pressed': true}),
        uiSize: size,
      ),
      'text-field' => SizedBox(
        width: 320,
        child: TRTextField(
          enabled: args['disabled'] != true,
          initialValue: args['value'] is String ? args['value']! as String : '',
          key: ValueKey(args['value']),
          label: switch (locale) {
            'ko' => '랙 이름',
            'ja' => 'ラック名',
            _ => 'Rack name',
          },
          placeholder: 'Rack alpha',
          onChanged: (value) => onStateChanged({
            'args': {'value': value},
          }),
          uiSize: size,
        ),
      ),
      'card' => const SizedBox(
        width: 320,
        child: TRCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TRText('Rack alpha', role: TRTextStyle.headingSm),
              SizedBox(height: 8),
              TRText('4 services are healthy.', role: TRTextStyle.bodySm),
            ],
          ),
        ),
      ),
      'alert' => SizedBox(
        width: 360,
        child: TRAlert(
          intent: intent,
          title: Text(switch (locale) {
            'ko' => '변경 사항을 저장했어요',
            'ja' => '変更を保存しました',
            _ => 'Changes saved',
          }),
          description: Text(switch (locale) {
            'ko' => '랙 구성이 최신 상태예요.',
            'ja' => 'ラック構成は最新です。',
            _ => 'The rack configuration is up to date.',
          }),
        ),
      ),
      'badge' => TRBadge(
        intent: intent,
        uiSize: size,
        child: const Text('Healthy'),
      ),
      'spinner' => TRSpinner(
        label: switch (locale) {
          'ko' => '불러오는 중',
          'ja' => '読み込み中',
          _ => 'Loading',
        },
        uiSize: size,
      ),
      'text' => TRText(
        switch (locale) {
          'ko' => '랙 상태',
          'ja' => 'ラックの状態',
          _ => 'Rack status',
        },
        role: TRTextStyle.values.byName(
          args['role'] is String ? args['role']! as String : 'headingMd',
        ),
      ),
      _ => const Text('Unsupported preview'),
    };
  }
}
