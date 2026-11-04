import Foundation

// Fonte do WKUserScript injetado no início do documento (DEC-004): window.__HP12C_BOOT__ com o estado salvo.
// Montado por JSONSerialization, nunca por concatenação do texto do estado.
public enum BootScript {
  public static func source(state: String?) throws -> String {
    let payload: [String: Any] = [Contract.stateKey: state ?? NSNull()]
    let json = try JSONSerialization.data(withJSONObject: payload, options: [.sortedKeys])
    guard let text = String(data: json, encoding: .utf8) else { throw BridgeError(description: "JSON de partida não é UTF-8") }
    return "window.__HP12C_BOOT__ = \(text);"
  }
}
