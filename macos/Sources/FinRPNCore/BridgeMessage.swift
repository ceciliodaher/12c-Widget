import Foundation

public struct BridgeError: Error, CustomStringConvertible {
  public let description: String
  public init(description: String) { self.description = description }
}

// Mensagens que a página envia por webkit.messageHandlers.finrpn (contrato em web/mac/native-bridge.js).
public enum BridgeMessage: Equatable {
  case save(key: String, value: String)
  case snapshot(Data)

  public static func parse(_ body: Any) throws -> BridgeMessage {
    guard let dict = body as? [String: Any] else { throw BridgeError(description: "mensagem não é objeto: \(body)") }
    switch dict["type"] as? String {
    case "save":
      guard let key = dict["key"] as? String, Contract.saveKeys.contains(key) else {
        throw BridgeError(description: "save com chave inválida: \(String(describing: dict["key"]))")
      }
      guard let value = dict["value"] as? String else { throw BridgeError(description: "save sem valor em texto") }
      return .save(key: key, value: value)
    case "snapshot":
      try requireStrings(dict, ["text", "x"], context: "snapshot")
      guard dict["ann"] is [String: Any] else { throw BridgeError(description: "snapshot sem ann") }
      guard let fin = dict["fin"] as? [String: Any] else { throw BridgeError(description: "snapshot sem fin") }
      try requireStrings(fin, ["n", "i", "pv", "pmt", "fv"], context: "snapshot.fin")
      return .snapshot(try JSONSerialization.data(withJSONObject: dict, options: [.sortedKeys]))
    default:
      throw BridgeError(description: "tipo de mensagem desconhecido: \(String(describing: dict["type"]))")
    }
  }

  // Números trafegam como texto decimal (CLAUDE.md §6); um Number aqui é violação do contrato.
  private static func requireStrings(_ dict: [String: Any], _ keys: [String], context: String) throws {
    for k in keys where !(dict[k] is String) {
      throw BridgeError(description: "\(context).\(k) ausente ou não é texto")
    }
  }
}
