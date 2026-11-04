import Foundation
import Testing
@testable import FinRPNCore

// Lista paralela travada: as chaves e o manipulador vivem no JS (storage.js do motor e native-bridge.js);
// o Swift os repete em Contract para validar a ponte. Este teste falha se os dois lados divergirem.
private let repoRoot = URL(fileURLWithPath: #filePath).deletingLastPathComponent()
  .deletingLastPathComponent().deletingLastPathComponent().deletingLastPathComponent()

private func jsConstant(_ name: String, in relativePath: String) throws -> String {
  let text = try String(contentsOf: repoRoot.appendingPathComponent(relativePath), encoding: .utf8)
  let regex = try NSRegularExpression(pattern: "export const \(name) = '([^']+)';")
  let matches = regex.matches(in: text, range: NSRange(text.startIndex..., in: text))
  #expect(matches.count == 1, "\(name) deve aparecer uma vez em \(relativePath) (achou \(matches.count))")
  let m = try #require(matches.first, "\(name) não encontrado em \(relativePath) - rode web/fetch-upstream.sh")
  return String(text[Range(m.range(at: 1), in: text)!])
}

@Test func chavesDeEstadoBatemComOStorageDoMotor() throws {
  #expect(Contract.stateKey == (try jsConstant("STORAGE_KEY", in: "web/upstream/src/storage.js")))
  #expect(Contract.badKey == (try jsConstant("BAD_KEY", in: "web/upstream/src/storage.js")))
  #expect(Contract.saveKeys == [Contract.stateKey, Contract.badKey])
}

@Test func manipuladorBateComANativeBridge() throws {
  #expect(Contract.handler == (try jsConstant("HANDLER", in: "web/mac/native-bridge.js")))
}

@Test func paginaInicialExisteNoRepositorio() {
  #expect(FileManager.default.fileExists(atPath: repoRoot.appendingPathComponent("web/" + Contract.startPage).path))
}
