import AppKit
import FinRPNCore
import os

// Subsistema do os.Logger = identificador do pacote (Info.plist). Fora do pacote o app não roda: falha explícita.
let logSubsystem: String = {
  guard let id = Bundle.main.bundleIdentifier else { fatalError("FinRPN fora do pacote .app - monte com macos/build-app.sh") }
  return id
}()

final class AppDelegate: NSObject, NSApplicationDelegate {
  private var panel: PanelController?

  func applicationDidFinishLaunching(_ notification: Notification) {
    do {
      guard let resources = Bundle.main.resourceURL else { fatalError("pacote sem Contents/Resources") }
      let store = try StateStore(directory: try StateStore.defaultDirectory())
      let host = try WebViewHost(webRoot: resources.appendingPathComponent("web", isDirectory: true), store: store)
      panel = PanelController(content: host.webView)
      panel?.show()
    } catch {
      Logger(subsystem: logSubsystem, category: "app").fault("partida falhou: \(String(describing: error), privacy: .public)")
      let alert = NSAlert()
      alert.messageText = "O FinRPN não conseguiu iniciar"
      alert.informativeText = String(describing: error)
      alert.runModal()
      NSApp.terminate(nil)
    }
  }

  // Fechar o painel não encerra o app; o clique no Dock o reabre.
  func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { false }

  func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
    panel?.show()
    return true
  }
}
