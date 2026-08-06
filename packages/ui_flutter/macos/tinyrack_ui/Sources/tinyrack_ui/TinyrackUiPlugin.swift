import Cocoa
import FlutterMacOS

/// Draws a Tinyrack context menu with AppKit.
///
/// `NSMenu.popUp` runs a nested modal loop, so the reply is sent once that loop
/// has returned and the user has either chosen an entry or dismissed the menu.
public class TinyrackUiPlugin: NSObject, FlutterPlugin {
  public static func register(with registrar: FlutterPluginRegistrar) {
    let channel = FlutterMethodChannel(
      name: "net.tinyrack.ui/native_menu",
      binaryMessenger: registrar.messenger)
    let instance = TinyrackUiPlugin(registrar: registrar)
    registrar.addMethodCallDelegate(instance, channel: channel)
  }

  init(registrar: FlutterPluginRegistrar) {
    self.registrar = registrar
  }

  private let registrar: FlutterPluginRegistrar

  /// The entry the user chose, recorded by the action AppKit sends.
  private var selected: String?

  public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    guard call.method == "showContextMenu" else {
      result(FlutterMethodNotImplemented)
      return
    }
    guard let arguments = call.arguments as? [String: Any],
      let items = arguments["items"] as? [[String: Any]]
    else {
      result(
        FlutterError(
          code: "bad-arguments", message: "showContextMenu wants a map",
          details: nil))
      return
    }
    guard let view = registrar.view else {
      result(
        FlutterError(
          code: "no-view", message: "this engine has no view to anchor a menu to",
          details: nil))
      return
    }

    selected = nil
    let menu = buildMenu(items)
    let x = arguments["x"] as? Double ?? 0
    let y = arguments["y"] as? Double ?? 0
    // AppKit measures a view in points, which is what Flutter reports, but it
    // puts the origin at the bottom unless the view says otherwise.
    let point = NSPoint(x: x, y: view.isFlipped ? y : view.bounds.height - y)
    menu.popUp(positioning: nil, at: point, in: view)
    result(selected)
  }

  private func buildMenu(_ items: [[String: Any]]) -> NSMenu {
    let menu = NSMenu()
    menu.autoenablesItems = false
    for item in items {
      guard let entry = buildItem(item) else { continue }
      menu.addItem(entry)
    }
    return menu
  }

  private func buildItem(_ item: [String: Any]) -> NSMenuItem? {
    switch item["type"] as? String {
    case "separator":
      return NSMenuItem.separator()
    case "submenu":
      guard let title = item["title"] as? String else { return nil }
      let parent = NSMenuItem(title: title, action: nil, keyEquivalent: "")
      parent.submenu = buildMenu(item["children"] as? [[String: Any]] ?? [])
      return parent
    case "action":
      guard let title = item["title"] as? String, let id = item["id"] as? String
      else { return nil }
      let entry = NSMenuItem(
        title: title, action: #selector(entrySelected(_:)), keyEquivalent: "")
      entry.target = self
      entry.representedObject = id
      entry.isEnabled = item["enabled"] as? Bool ?? true
      if let checked = item["checked"] as? Bool {
        entry.state = checked ? .on : .off
      }
      applyShortcut(item["shortcut"] as? [String: Any], to: entry)
      return entry
    default:
      return nil
    }
  }

  private func applyShortcut(_ shortcut: [String: Any]?, to entry: NSMenuItem) {
    guard let shortcut, let character = shortcut["character"] as? String,
      !character.isEmpty
    else { return }
    entry.keyEquivalent = character.lowercased()
    var modifiers: NSEvent.ModifierFlags = []
    if shortcut["control"] as? Bool ?? false { modifiers.insert(.control) }
    if shortcut["shift"] as? Bool ?? false { modifiers.insert(.shift) }
    if shortcut["alt"] as? Bool ?? false { modifiers.insert(.option) }
    if shortcut["meta"] as? Bool ?? false { modifiers.insert(.command) }
    entry.keyEquivalentModifierMask = modifiers
  }

  @objc private func entrySelected(_ sender: NSMenuItem) {
    selected = sender.representedObject as? String
  }
}
