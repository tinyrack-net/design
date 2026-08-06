//
//  Generated file. Do not edit.
//

// clang-format off

#include "generated_plugin_registrant.h"

#include <tinyrack_ui/tinyrack_ui_plugin.h>

void fl_register_plugins(FlPluginRegistry* registry) {
  g_autoptr(FlPluginRegistrar) tinyrack_ui_registrar =
      fl_plugin_registry_get_registrar_for_plugin(registry, "TinyrackUiPlugin");
  tinyrack_ui_plugin_register_with_registrar(tinyrack_ui_registrar);
}
