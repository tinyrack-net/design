import 'dart:js_interop';

import 'package:web/web.dart' as web;

typedef PreviewMessageHandler = void Function(Map<String, Object?> message);

final class PreviewBridge {
  PreviewBridge(this._handler) {
    _listener = _onMessage.toJS;
    web.window.addEventListener('message', _listener);
  }

  final PreviewMessageHandler _handler;
  late final JSFunction _listener;

  void _onMessage(web.Event rawEvent) {
    final event = rawEvent as web.MessageEvent;
    if (event.origin != web.window.location.origin ||
        event.source != web.window.parent) {
      return;
    }
    final value = event.data.dartify();
    if (value case final Map<Object?, Object?> map) {
      final message = <String, Object?>{};
      for (final MapEntry(:key, :value) in map.entries) {
        if (key is String) message[key] = value;
      }
      _handler(message);
    }
  }

  void dispose() {
    web.window.removeEventListener('message', _listener);
  }

  void send(
    String type,
    String component, [
    Map<String, Object?> payload = const {},
  ]) {
    web.window.parent!.postMessage(
      <String, Object?>{
        'channel': 'tinyrack.flutter-preview.v1',
        'type': type,
        'component': component,
        'payload': payload,
      }.jsify(),
      web.window.location.origin.toJS,
    );
  }
}
