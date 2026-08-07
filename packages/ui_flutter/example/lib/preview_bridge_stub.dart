typedef PreviewMessageHandler = void Function(Map<String, Object?> message);

final class PreviewBridge {
  PreviewBridge(PreviewMessageHandler handler);

  void dispose() {}

  void syncPageBackground(String cssColor) {}

  void send(
    String type,
    String component, [
    Map<String, Object?> payload = const {},
  ]) {}
}
