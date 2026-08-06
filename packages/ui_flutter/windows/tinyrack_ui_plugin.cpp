#include "tinyrack_ui_plugin.h"

// This must be included before many other Windows headers.
#include <windows.h>

#include <flutter/method_channel.h>
#include <flutter/plugin_registrar_windows.h>
#include <flutter/standard_method_codec.h>

#include <map>
#include <memory>
#include <string>
#include <vector>

namespace tinyrack_ui {

namespace {

using flutter::EncodableList;
using flutter::EncodableMap;
using flutter::EncodableValue;

// Win32 reports a chosen command as an integer, so the ids Dart declared are
// numbered here and translated back once the menu closes. Zero is reserved:
// TrackPopupMenuEx returns it for a dismissal.
class CommandTable {
 public:
  UINT Add(const std::string& id) {
    ids_.push_back(id);
    return static_cast<UINT>(ids_.size());
  }

  const std::string* Lookup(UINT command) const {
    if (command == 0 || command > ids_.size()) return nullptr;
    return &ids_[command - 1];
  }

 private:
  std::vector<std::string> ids_;
};

std::wstring Widen(const std::string& utf8) {
  if (utf8.empty()) return std::wstring();
  int size = MultiByteToWideChar(CP_UTF8, 0, utf8.data(),
                                 static_cast<int>(utf8.size()), nullptr, 0);
  std::wstring wide(size, L'\0');
  MultiByteToWideChar(CP_UTF8, 0, utf8.data(), static_cast<int>(utf8.size()),
                      wide.data(), size);
  return wide;
}

const EncodableValue* Find(const EncodableMap& map, const char* key) {
  auto it = map.find(EncodableValue(key));
  return it == map.end() ? nullptr : &it->second;
}

std::string LookupString(const EncodableMap& map, const char* key) {
  const EncodableValue* value = Find(map, key);
  if (value == nullptr) return std::string();
  const auto* text = std::get_if<std::string>(value);
  return text == nullptr ? std::string() : *text;
}

bool LookupBool(const EncodableMap& map, const char* key, bool fallback) {
  const EncodableValue* value = Find(map, key);
  if (value == nullptr) return fallback;
  const auto* flag = std::get_if<bool>(value);
  return flag == nullptr ? fallback : *flag;
}

double LookupDouble(const EncodableMap& map, const char* key) {
  const EncodableValue* value = Find(map, key);
  if (value == nullptr) return 0;
  const auto* number = std::get_if<double>(value);
  return number == nullptr ? 0 : *number;
}

// Win32 draws whatever follows a tab right-aligned, which is how every native
// menu shows its accelerator.
std::wstring ShortcutSuffix(const EncodableMap& item) {
  const EncodableValue* value = Find(item, "shortcut");
  if (value == nullptr) return std::wstring();
  const auto* shortcut = std::get_if<EncodableMap>(value);
  if (shortcut == nullptr) return std::wstring();
  std::string character = LookupString(*shortcut, "character");
  if (character.empty()) return std::wstring();

  std::wstring label = L"\t";
  if (LookupBool(*shortcut, "control", false)) label += L"Ctrl+";
  if (LookupBool(*shortcut, "alt", false)) label += L"Alt+";
  if (LookupBool(*shortcut, "shift", false)) label += L"Shift+";
  if (LookupBool(*shortcut, "meta", false)) label += L"Win+";
  return label + Widen(character);
}

HMENU BuildMenu(const EncodableList& items, CommandTable* commands);

void AppendItem(HMENU menu, const EncodableMap& item, CommandTable* commands) {
  const std::string type = LookupString(item, "type");
  MENUITEMINFOW info = {};
  info.cbSize = sizeof(MENUITEMINFOW);

  if (type == "separator") {
    info.fMask = MIIM_FTYPE;
    info.fType = MFT_SEPARATOR;
    InsertMenuItemW(menu, GetMenuItemCount(menu), TRUE, &info);
    return;
  }

  const std::string title = LookupString(item, "title");
  if (title.empty()) return;

  if (type == "submenu") {
    const EncodableValue* children = Find(item, "children");
    const auto* list =
        children == nullptr ? nullptr : std::get_if<EncodableList>(children);
    std::wstring label = Widen(title);
    info.fMask = MIIM_STRING | MIIM_SUBMENU;
    info.dwTypeData = label.data();
    info.hSubMenu = BuildMenu(list == nullptr ? EncodableList() : *list,
                              commands);
    InsertMenuItemW(menu, GetMenuItemCount(menu), TRUE, &info);
    return;
  }

  if (type != "action") return;
  const std::string id = LookupString(item, "id");
  if (id.empty()) return;

  std::wstring label = Widen(title) + ShortcutSuffix(item);
  info.fMask = MIIM_STRING | MIIM_ID | MIIM_STATE;
  info.dwTypeData = label.data();
  info.wID = commands->Add(id);
  info.fState = LookupBool(item, "enabled", true) ? MFS_ENABLED : MFS_DISABLED;
  const EncodableValue* checked = Find(item, "checked");
  if (checked != nullptr && std::get_if<bool>(checked) != nullptr &&
      std::get<bool>(*checked)) {
    info.fState |= MFS_CHECKED;
  }
  InsertMenuItemW(menu, GetMenuItemCount(menu), TRUE, &info);
}

HMENU BuildMenu(const EncodableList& items, CommandTable* commands) {
  HMENU menu = CreatePopupMenu();
  for (const EncodableValue& item : items) {
    const auto* map = std::get_if<EncodableMap>(&item);
    if (map == nullptr) continue;
    AppendItem(menu, *map, commands);
  }
  return menu;
}

}  // namespace

// static
void TinyrackUiPlugin::RegisterWithRegistrar(
    flutter::PluginRegistrarWindows* registrar) {
  auto channel =
      std::make_unique<flutter::MethodChannel<flutter::EncodableValue>>(
          registrar->messenger(), "net.tinyrack.ui/native_menu",
          &flutter::StandardMethodCodec::GetInstance());

  auto plugin = std::make_unique<TinyrackUiPlugin>(registrar);

  channel->SetMethodCallHandler(
      [plugin_pointer = plugin.get()](const auto& call, auto result) {
        plugin_pointer->HandleMethodCall(call, std::move(result));
      });

  registrar->AddPlugin(std::move(plugin));
}

TinyrackUiPlugin::TinyrackUiPlugin(flutter::PluginRegistrarWindows* registrar)
    : registrar_(registrar) {}

TinyrackUiPlugin::~TinyrackUiPlugin() {}

void TinyrackUiPlugin::HandleMethodCall(
    const flutter::MethodCall<flutter::EncodableValue>& method_call,
    std::unique_ptr<flutter::MethodResult<flutter::EncodableValue>> result) {
  if (method_call.method_name() != "showContextMenu") {
    result->NotImplemented();
    return;
  }

  const auto* arguments = std::get_if<EncodableMap>(method_call.arguments());
  if (arguments == nullptr) {
    result->Error("bad-arguments", "showContextMenu wants a map");
    return;
  }

  flutter::FlutterView* view = registrar_->GetView();
  HWND window = view == nullptr ? nullptr : view->GetNativeWindow();
  if (window == nullptr) {
    result->Error("no-view", "this engine has no window to anchor a menu to");
    return;
  }

  const EncodableValue* items_value = Find(*arguments, "items");
  const auto* items =
      items_value == nullptr ? nullptr : std::get_if<EncodableList>(items_value);
  if (items == nullptr) {
    result->Error("bad-arguments", "showContextMenu wants a list of items");
    return;
  }

  CommandTable commands;
  HMENU menu = BuildMenu(*items, &commands);

  // Flutter reports logical pixels; the client area is measured in physical
  // ones, which is exactly the ratio the caller sent along.
  const double ratio = LookupDouble(*arguments, "devicePixelRatio");
  const double scale = ratio <= 0 ? 1 : ratio;
  POINT point = {
      static_cast<LONG>(LookupDouble(*arguments, "x") * scale),
      static_cast<LONG>(LookupDouble(*arguments, "y") * scale),
  };
  ClientToScreen(window, &point);

  // Win32 keeps a popup alive only while its owner is foreground, and needs a
  // message afterwards before it will let the menu go.
  SetForegroundWindow(window);
  const UINT command = TrackPopupMenuEx(
      menu, TPM_RETURNCMD | TPM_NONOTIFY | TPM_RIGHTBUTTON | TPM_LEFTALIGN |
                TPM_TOPALIGN,
      point.x, point.y, window, nullptr);
  PostMessage(window, WM_NULL, 0, 0);
  DestroyMenu(menu);

  const std::string* id = commands.Lookup(command);
  result->Success(id == nullptr ? EncodableValue() : EncodableValue(*id));
}

}  // namespace tinyrack_ui
