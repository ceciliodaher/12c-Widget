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

  // Fechar o painel encerra o app (PRD-04, a pedido do Professor): o clique no widget abre o app de novo, e a partida
  // mostra o painel. O estado já está gravado, porque cada tecla é gravada na hora.
  func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }

  // Clique no widget com o app aberto e o painel minimizado: a ativação traz o painel de volta.
  func applicationDidBecomeActive(_ notification: Notification) {
    panel?.show()
  }

  func applicationShouldHandleReopen(_ sender: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
    panel?.show()
    return true
  }
}
