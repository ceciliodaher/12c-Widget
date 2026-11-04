import Foundation
import Testing
@testable import FinRPNCore

private func tempDir() -> URL {
  FileManager.default.temporaryDirectory.appendingPathComponent("finrpn-test-\(UUID().uuidString)/estado")
}

@Test func semArquivoLoadDevolveNil() throws {
  let store = try StateStore(directory: tempDir())
  #expect(try store.load(key: Contract.stateKey) == nil)
}

@Test func gravaELeDeVolta() throws {
  let dir = tempDir()
  let store = try StateStore(directory: dir)   // cria a pasta, inclusive as intermediárias
  let value = #"{"x":"1.5","texto":"aspas \" e \\ barra\nlinha"}"#
  try store.save(key: Contract.stateKey, value: value)
  try store.save(key: Contract.badKey, value: "ilegível")
  #expect(try StateStore(directory: dir).load(key: Contract.stateKey) == value)
  #expect(try store.load(key: Contract.badKey) == "ilegível")
}

@Test func regravacaoSubstituiOConteudo() throws {
  let store = try StateStore(directory: tempDir())
  try store.save(key: Contract.stateKey, value: "primeiro conteúdo, mais longo")
  try store.save(key: Contract.stateKey, value: "2")
  #expect(try store.load(key: Contract.stateKey) == "2")
}

@Test func chaveDesconhecidaERecusada() throws {
  let store = try StateStore(directory: tempDir())
  #expect(throws: StateStoreError.self) { try store.save(key: "outra.chave", value: "x") }
  #expect(throws: StateStoreError.self) { try store.load(key: "../fora") }
}

@Test func fotografiaGravadaNoArquivoDoContrato() throws {
  let dir = tempDir()
  let store = try StateStore(directory: dir)
  try store.saveSnapshot(Data(#"{"x":"2"}"#.utf8))
  #expect(try Data(contentsOf: dir.appendingPathComponent(Contract.snapshotFile)) == Data(#"{"x":"2"}"#.utf8))
}


@Test func imagensGravadasNosArquivosDoContrato() throws {
  let dir = tempDir()
  let store = try StateStore(directory: dir)
  try store.saveImages(calc: pngBytes, lcd: Data(pngBytes.reversed()))
  #expect(try Data(contentsOf: dir.appendingPathComponent(Contract.calcImageFile)) == pngBytes)
  #expect(try Data(contentsOf: dir.appendingPathComponent(Contract.lcdImageFile)) == Data(pngBytes.reversed()))
}

// Dentro da sandbox do widget, o FileManager devolve o contêiner; a pasta vem do diretório real do usuário.
@Test func pastaPadraoVemDoDiretorioRealDoUsuario() throws {
  let home = String(cString: try #require(getpwuid(getuid())).pointee.pw_dir)
  #expect(try StateStore.defaultDirectory().path == home + "/Library/Application Support/" + Contract.appSupportFolder)
}
