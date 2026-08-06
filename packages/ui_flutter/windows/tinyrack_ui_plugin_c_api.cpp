#include "include/tinyrack_ui/tinyrack_ui_plugin_c_api.h"

#include <flutter/plugin_registrar_windows.h>

#include "tinyrack_ui_plugin.h"

void TinyrackUiPluginCApiRegisterWithRegistrar(
    FlutterDesktopPluginRegistrarRef registrar) {
  tinyrack_ui::TinyrackUiPlugin::RegisterWithRegistrar(
      flutter::PluginRegistrarManager::GetInstance()
          ->GetRegistrar<flutter::PluginRegistrarWindows>(registrar));
}
