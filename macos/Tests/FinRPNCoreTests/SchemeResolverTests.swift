import Foundation
import Testing
@testable import FinRPNCore

private func makeRoot() throws -> URL {
  let root = FileManager.default.temporaryDirectory.appendingPathComponent("finrpn-web-\(UUID().uuidString)/web")
  try FileManager.default.createDirectory(at: root.appendingPathComponent("mac"), withIntermediateDirectories: true)
  for f in ["mac/index-mac.html", "mac/main-mac.js", "mac/mac.css", "a.svg", "b.json", "c.png", "d.mjs", "e.txt"] {
    try Data("x".utf8).write(to: root.appendingPathComponent(f))
  }
  try Data("segredo".utf8).write(to: root.deletingLastPathComponent().appendingPathComponent("fora.js"))
  return root
}
private func url(_ s: String) -> URL { URL(string: s)! }

@Test func resolveArquivosComTipoMIME() throws {
  let root = try makeRoot()
  let cases = [("mac/index-mac.html", "text/html"), ("mac/main-mac.js", "text/javascript"), ("mac/mac.css", "text/css"),
               ("a.svg", "image/svg+xml"), ("b.json", "application/json"), ("c.png", "image/png"), ("d.mjs", "text/javascript")]
  for (path, mime) in cases {
    let r = try SchemeResolver.resolve(url("\(Contract.scheme)://\(Contract.host)/\(path)"), root: root)
    #expect(r.mimeType == mime)
    #expect(r.file.standardizedFileURL == root.appendingPathComponent(path).standardizedFileURL)
  }
}

@Test func recusaEsquemaHostCaminhoForaDaRaizEInexistente() throws {
  let root = try makeRoot()
  let s = Contract.scheme, h = Contract.host
  for bad in ["https://\(h)/mac/main-mac.js", "\(s)://outro/mac/main-mac.js", "\(s)://\(h)/../fora.js",
              "\(s)://\(h)/mac/../../fora.js", "\(s)://\(h)/mac/%2E%2E/%2E%2E/fora.js", "\(s)://\(h)/nao-existe.js",
              "\(s)://\(h)/mac", "\(s)://\(h)/", "\(s)://\(h)/e.txt"] {
    #expect(throws: SchemeError.self, "deveria recusar \(bad)") { try SchemeResolver.resolve(url(bad), root: root) }
  }
}
