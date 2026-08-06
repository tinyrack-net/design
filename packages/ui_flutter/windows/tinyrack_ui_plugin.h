#ifndef FLUTTER_PLUGIN_TINYRACK_UI_PLUGIN_H_
#define FLUTTER_PLUGIN_TINYRACK_UI_PLUGIN_H_

#include <flutter/method_channel.h>
#include <flutter/plugin_registrar_windows.h>

#include <memory>

namespace tinyrack_ui {

class TinyrackUiPlugin : public flutter::Plugin {
 public:
  static void RegisterWithRegistrar(flutter::PluginRegistrarWindows* registrar);

  explicit TinyrackUiPlugin(flutter::PluginRegistrarWindows* registrar);

  ~TinyrackUiPlugin() override;

  // Disallow copy and assign.
  TinyrackUiPlugin(const TinyrackUiPlugin&) = delete;
  TinyrackUiPlugin& operator=(const TinyrackUiPlugin&) = delete;

  void HandleMethodCall(
      const flutter::MethodCall<flutter::EncodableValue>& method_call,
      std::unique_ptr<flutter::MethodResult<flutter::EncodableValue>> result);

 private:
  flutter::PluginRegistrarWindows* registrar_;
};

}  // namespace tinyrack_ui

#endif  // FLUTTER_PLUGIN_TINYRACK_UI_PLUGIN_H_
