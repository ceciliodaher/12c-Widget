import Foundation

// Ponto único, no Swift, dos nomes combinados com a camada web (DEC-005, DEC-014, DEC-016).
// stateKey, badKey e handler repetem constantes do JS; ContractTests confere que batem.
public enum Contract {
  public static let scheme = "finrpn-app"
  public static let host = "app"
  public static let startPage = "mac/index-mac.html"
  public static let handler = "finrpn"
  public static let stateKey = "hp12c.state.v1"     // STORAGE_KEY em web/upstream/src/storage.js
  public static let badKey = "hp12c.state.bad"      // BAD_KEY em web/upstream/src/storage.js
  public static let saveKeys: Set<String> = [stateKey, badKey]
  public static let snapshotFile = "snapshot.json"
  public static let calcImageFile = "calc.png"      // widget médio e grande (DEC-018)
  public static let lcdImageFile = "lcd.png"        // widget pequeno (DEC-018)
  public static let appSupportFolder = "FinRPN"
  public static var startURL: URL {
    guard let u = URL(string: "\(scheme)://\(host)/\(startPage)") else { fatalError("URL de partida inválida") }
    return u
  }
}
