import Foundation

public struct SchemeError: Error, CustomStringConvertible {
  public let description: String
  public init(description: String) { self.description = description }
}

// Converte finrpn-app://app/<caminho> no arquivo correspondente dentro da raiz web/ do pacote do app.
public enum SchemeResolver {
  static let mimeTypes = [
    "html": "text/html", "js": "text/javascript", "mjs": "text/javascript", "css": "text/css",
    "svg": "image/svg+xml", "json": "application/json", "png": "image/png",
  ]

  public static func resolve(_ url: URL, root: URL) throws -> (file: URL, mimeType: String) {
    guard url.scheme == Contract.scheme, url.host == Contract.host else {
      throw SchemeError(description: "URL fora do esquema do app: \(url)")
    }
    let base = root.standardizedFileURL.resolvingSymlinksInPath()
    let file = base.appendingPathComponent(url.path).standardizedFileURL.resolvingSymlinksInPath()
    guard file.path.hasPrefix(base.path + "/") else { throw SchemeError(description: "caminho fora da raiz: \(url.path)") }
    var isDir: ObjCBool = false
    guard FileManager.default.fileExists(atPath: file.path, isDirectory: &isDir), !isDir.boolValue else {
      throw SchemeError(description: "arquivo inexistente: \(url.path)")
    }
    guard let mime = mimeTypes[file.pathExtension.lowercased()] else {
      throw SchemeError(description: "tipo de arquivo não servido: \(url.path)")
    }
    return (file, mime)
  }
}
