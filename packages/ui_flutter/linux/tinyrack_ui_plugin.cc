#include "include/tinyrack_ui/tinyrack_ui_plugin.h"

#include <flutter_linux/flutter_linux.h>
#include <gtk/gtk.h>

#include <cstring>

#define TINYRACK_UI_PLUGIN(obj)                                     \
  (G_TYPE_CHECK_INSTANCE_CAST((obj), tinyrack_ui_plugin_get_type(), \
                              TinyrackUiPlugin))

struct _TinyrackUiPlugin {
  GObject parent_instance;
  FlPluginRegistrar* registrar;
};

G_DEFINE_TYPE(TinyrackUiPlugin, tinyrack_ui_plugin, g_object_get_type())

namespace {

// One popup in flight.
//
// GTK reports the choice and the dismissal through separate signals and tears
// the menu down between them, so nothing here is released while a signal is
// being emitted. Everything ends in one idle callback that replies once, drops
// the menu, and frees this.
struct MenuRequest {
  FlMethodCall* method_call;
  GtkWidget* menu;
  gchar* chosen;
  gboolean finishing;
};

gboolean finish_cb(gpointer user_data) {
  MenuRequest* request = static_cast<MenuRequest*>(user_data);

  g_autoptr(FlValue) result = request->chosen == nullptr
                                  ? fl_value_new_null()
                                  : fl_value_new_string(request->chosen);
  g_autoptr(FlMethodResponse) response =
      FL_METHOD_RESPONSE(fl_method_success_response_new(result));
  fl_method_call_respond(request->method_call, response, nullptr);

  gtk_widget_destroy(request->menu);
  g_object_unref(request->menu);
  g_object_unref(request->method_call);
  g_free(request->chosen);
  g_free(request);
  return G_SOURCE_REMOVE;
}

/// Ends the request after every signal of this popup has been emitted.
void finish(MenuRequest* request) {
  if (request->finishing) return;
  request->finishing = TRUE;
  // A lower priority than the default, so an item activation that follows the
  // dismissal still lands before the reply is composed.
  g_idle_add_full(G_PRIORITY_DEFAULT_IDLE, finish_cb, request, nullptr);
}

void item_activated_cb(GtkMenuItem* item, gpointer user_data) {
  MenuRequest* request = static_cast<MenuRequest*>(user_data);
  if (request->chosen != nullptr) return;
  request->chosen = g_strdup(
      static_cast<const gchar*>(g_object_get_data(G_OBJECT(item), "tr-id")));
}

void menu_deactivated_cb(GtkMenuShell* shell, gpointer user_data) {
  finish(static_cast<MenuRequest*>(user_data));
}

const gchar* lookup_string(FlValue* map, const gchar* key) {
  FlValue* value = fl_value_lookup_string(map, key);
  if (value == nullptr || fl_value_get_type(value) != FL_VALUE_TYPE_STRING) {
    return nullptr;
  }
  return fl_value_get_string(value);
}

gboolean lookup_bool(FlValue* map, const gchar* key, gboolean fallback) {
  FlValue* value = fl_value_lookup_string(map, key);
  if (value == nullptr || fl_value_get_type(value) != FL_VALUE_TYPE_BOOL) {
    return fallback;
  }
  return fl_value_get_bool(value);
}

double lookup_double(FlValue* map, const gchar* key) {
  FlValue* value = fl_value_lookup_string(map, key);
  if (value == nullptr || fl_value_get_type(value) != FL_VALUE_TYPE_FLOAT) {
    return 0;
  }
  return fl_value_get_float(value);
}

// Shows the accelerator the way every other GTK menu does.
void apply_shortcut(GtkWidget* item, FlValue* shortcut) {
  if (shortcut == nullptr || fl_value_get_type(shortcut) != FL_VALUE_TYPE_MAP) {
    return;
  }
  const gchar* character = lookup_string(shortcut, "character");
  if (character == nullptr) return;

  g_autofree gchar* lowered = g_utf8_strdown(character, -1);
  guint key = gdk_keyval_from_name(lowered);
  if (key == GDK_KEY_VoidSymbol) return;

  GdkModifierType modifiers = static_cast<GdkModifierType>(0);
  if (lookup_bool(shortcut, "control", FALSE)) {
    modifiers = static_cast<GdkModifierType>(modifiers | GDK_CONTROL_MASK);
  }
  if (lookup_bool(shortcut, "shift", FALSE)) {
    modifiers = static_cast<GdkModifierType>(modifiers | GDK_SHIFT_MASK);
  }
  if (lookup_bool(shortcut, "alt", FALSE)) {
    modifiers = static_cast<GdkModifierType>(modifiers | GDK_MOD1_MASK);
  }
  if (lookup_bool(shortcut, "meta", FALSE)) {
    modifiers = static_cast<GdkModifierType>(modifiers | GDK_SUPER_MASK);
  }

  GtkWidget* label = gtk_bin_get_child(GTK_BIN(item));
  if (GTK_IS_ACCEL_LABEL(label)) {
    gtk_accel_label_set_accel(GTK_ACCEL_LABEL(label), key, modifiers);
  }
}

GtkWidget* build_menu(FlValue* items, MenuRequest* request);

GtkWidget* build_item(FlValue* item, MenuRequest* request) {
  const gchar* type = lookup_string(item, "type");
  if (type == nullptr) return nullptr;

  if (strcmp(type, "separator") == 0) {
    return gtk_separator_menu_item_new();
  }

  const gchar* title = lookup_string(item, "title");
  if (title == nullptr) return nullptr;

  if (strcmp(type, "submenu") == 0) {
    GtkWidget* parent = gtk_menu_item_new_with_label(title);
    gtk_menu_item_set_submenu(
        GTK_MENU_ITEM(parent),
        build_menu(fl_value_lookup_string(item, "children"), request));
    return parent;
  }

  if (strcmp(type, "action") != 0) return nullptr;
  const gchar* id = lookup_string(item, "id");
  if (id == nullptr) return nullptr;

  FlValue* checked = fl_value_lookup_string(item, "checked");
  const gboolean is_check =
      checked != nullptr && fl_value_get_type(checked) == FL_VALUE_TYPE_BOOL;

  GtkWidget* widget;
  if (is_check) {
    widget = gtk_check_menu_item_new_with_label(title);
    // Set before connecting, because toggling emits the activation signal.
    gtk_check_menu_item_set_active(GTK_CHECK_MENU_ITEM(widget),
                                   fl_value_get_bool(checked));
  } else {
    widget = gtk_menu_item_new_with_label(title);
  }

  g_object_set_data_full(G_OBJECT(widget), "tr-id", g_strdup(id), g_free);
  apply_shortcut(widget, fl_value_lookup_string(item, "shortcut"));
  gtk_widget_set_sensitive(widget, lookup_bool(item, "enabled", TRUE));
  g_signal_connect(widget, "activate", G_CALLBACK(item_activated_cb), request);
  return widget;
}

GtkWidget* build_menu(FlValue* items, MenuRequest* request) {
  GtkWidget* menu = gtk_menu_new();
  if (items == nullptr || fl_value_get_type(items) != FL_VALUE_TYPE_LIST) {
    return menu;
  }
  for (size_t i = 0; i < fl_value_get_length(items); i++) {
    FlValue* item = fl_value_get_list_value(items, i);
    if (fl_value_get_type(item) != FL_VALUE_TYPE_MAP) continue;
    GtkWidget* widget = build_item(item, request);
    if (widget == nullptr) continue;
    gtk_widget_show(widget);
    gtk_menu_shell_append(GTK_MENU_SHELL(menu), widget);
  }
  return menu;
}

void respond_error(FlMethodCall* method_call, const gchar* code,
                   const gchar* message) {
  g_autoptr(FlMethodResponse) response = FL_METHOD_RESPONSE(
      fl_method_error_response_new(code, message, nullptr));
  fl_method_call_respond(method_call, response, nullptr);
}

void show_context_menu(TinyrackUiPlugin* self, FlMethodCall* method_call) {
  FlValue* args = fl_method_call_get_args(method_call);
  if (args == nullptr || fl_value_get_type(args) != FL_VALUE_TYPE_MAP) {
    respond_error(method_call, "bad-arguments", "showContextMenu wants a map");
    return;
  }

  FlView* view = fl_plugin_registrar_get_view(self->registrar);
  if (view == nullptr) {
    respond_error(method_call, "no-view",
                  "this engine has no view to anchor a menu to");
    return;
  }

  GtkWidget* toplevel = gtk_widget_get_toplevel(GTK_WIDGET(view));
  GdkWindow* window = gtk_widget_get_window(toplevel);
  if (window == nullptr) {
    respond_error(method_call, "no-window",
                  "this window is not realized yet");
    return;
  }

  MenuRequest* request = g_new0(MenuRequest, 1);
  request->method_call = FL_METHOD_CALL(g_object_ref(method_call));

  GtkWidget* menu = build_menu(fl_value_lookup_string(args, "items"), request);
  // GTK hands out a floating reference, and nothing else here will sink it.
  request->menu = GTK_WIDGET(g_object_ref_sink(menu));
  g_signal_connect(menu, "deactivate", G_CALLBACK(menu_deactivated_cb),
                   request);

  // GTK coordinates are already the logical pixels Flutter reports, because
  // the Linux embedder takes its device pixel ratio from the GTK scale factor.
  gint x = 0;
  gint y = 0;
  gtk_widget_translate_coordinates(GTK_WIDGET(view), toplevel,
                                   static_cast<gint>(lookup_double(args, "x")),
                                   static_cast<gint>(lookup_double(args, "y")),
                                   &x, &y);

  // GTK derives the pointing device from the event that asked for the menu.
  // This one was asked for from Dart, which has no GTK event to hand over, so
  // the request is described as the secondary click it stands for.
  GdkEvent* trigger = gdk_event_new(GDK_BUTTON_PRESS);
  trigger->button.window = GDK_WINDOW(g_object_ref(window));
  trigger->button.send_event = TRUE;
  trigger->button.time = GDK_CURRENT_TIME;
  trigger->button.button = GDK_BUTTON_SECONDARY;
  gdk_event_set_device(
      trigger,
      gdk_seat_get_pointer(
          gdk_display_get_default_seat(gdk_window_get_display(window))));

  GdkRectangle anchor = {x, y, 1, 1};
  // Anchoring to a rectangle rather than to absolute coordinates is what keeps
  // this working under Wayland, which never tells a client where it is.
  gtk_menu_popup_at_rect(GTK_MENU(menu), window, &anchor, GDK_GRAVITY_SOUTH_EAST,
                         GDK_GRAVITY_NORTH_WEST, trigger);
  gdk_event_free(trigger);

  // A menu that never made it onto the screen emits no signal at all, and Dart
  // would wait on this call forever.
  if (!request->finishing && !gtk_widget_get_visible(menu)) finish(request);
}

}  // namespace

static void tinyrack_ui_plugin_handle_method_call(TinyrackUiPlugin* self,
                                                  FlMethodCall* method_call) {
  if (strcmp(fl_method_call_get_name(method_call), "showContextMenu") == 0) {
    show_context_menu(self, method_call);
    return;
  }
  g_autoptr(FlMethodResponse) response =
      FL_METHOD_RESPONSE(fl_method_not_implemented_response_new());
  fl_method_call_respond(method_call, response, nullptr);
}

static void tinyrack_ui_plugin_dispose(GObject* object) {
  TinyrackUiPlugin* self = TINYRACK_UI_PLUGIN(object);
  g_clear_object(&self->registrar);
  G_OBJECT_CLASS(tinyrack_ui_plugin_parent_class)->dispose(object);
}

static void tinyrack_ui_plugin_class_init(TinyrackUiPluginClass* klass) {
  G_OBJECT_CLASS(klass)->dispose = tinyrack_ui_plugin_dispose;
}

static void tinyrack_ui_plugin_init(TinyrackUiPlugin* self) {}

static void method_call_cb(FlMethodChannel* channel, FlMethodCall* method_call,
                           gpointer user_data) {
  tinyrack_ui_plugin_handle_method_call(TINYRACK_UI_PLUGIN(user_data),
                                        method_call);
}

void tinyrack_ui_plugin_register_with_registrar(FlPluginRegistrar* registrar) {
  TinyrackUiPlugin* plugin =
      TINYRACK_UI_PLUGIN(g_object_new(tinyrack_ui_plugin_get_type(), nullptr));
  plugin->registrar = FL_PLUGIN_REGISTRAR(g_object_ref(registrar));

  g_autoptr(FlStandardMethodCodec) codec = fl_standard_method_codec_new();
  g_autoptr(FlMethodChannel) channel = fl_method_channel_new(
      fl_plugin_registrar_get_messenger(registrar),
      "net.tinyrack.ui/native_menu", FL_METHOD_CODEC(codec));
  fl_method_channel_set_method_call_handler(
      channel, method_call_cb, g_object_ref(plugin), g_object_unref);

  g_object_unref(plugin);
}
