import FinRPNCore
import WebKit
import os

// Recebe save e snapshot da página (web/mac/native-bridge.js) e grava pelo StateStore (DEC-004, DEC-016).
// Mensagem inválida é recusada e registrada, sem gravar nada.
final class BridgeController: NSObject, WKScriptMessageHandler {
  private let store: StateStore
  private let log = Logger(subsystem: logSubsystem, category: "bridge")

  init(store: StateStore) { self.store = store }

  func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
    let parsed: BridgeMessage
    do { parsed = try BridgeMessage.parse(message.body) } catch {
      log.error("mensagem recusada: \(String(describing: error), privacy: .public)")
      return
    }
    do {
      switch parsed {
      case let .save(key, value): try store.save(key: key, value: value)
      case let .snapshot(data): try store.saveSnapshot(data)
      }
    } catch {
      log.fault("gravação falhou em \(self.store.directory.path, privacy: .public): \(String(describing: error), privacy: .public)")
    }
  }
}
