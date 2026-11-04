import Foundation
import Testing
@testable import FinRPNCore

// Menor conteúdo que passa pela assinatura PNG; a decodificação da imagem é do sistema, não do FinRPNCore.
let pngBytes = Data([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00])

private func tempDir() throws -> URL {
  let d = FileManager.default.temporaryDirectory.appendingPathComponent("finrpn-img-\(UUID().uuidString)")
  try FileManager.default.createDirectory(at: d, withIntermediateDirectories: true)
  return d
}

@Test func assinaturaPNG() {
  #expect(WidgetImage.isPNG(pngBytes))
  #expect(!WidgetImage.isPNG(Data("<svg/>".utf8)))
  #expect(!WidgetImage.isPNG(Data(pngBytes.prefix(7))))
  #expect(!WidgetImage.isPNG(Data()))
}

@Test func imagemAusenteIlegivelEPronta() throws {
  let dir = try tempDir()
  #expect(WidgetImage.load(Contract.calcImageFile, from: dir) == .missing)
  try Data("texto".utf8).write(to: dir.appendingPathComponent(Contract.calcImageFile))
  guard case .unreadable = WidgetImage.load(Contract.calcImageFile, from: dir) else { Issue.record("deveria ser ilegível"); return }
  try pngBytes.write(to: dir.appendingPathComponent(Contract.calcImageFile))
  #expect(WidgetImage.load(Contract.calcImageFile, from: dir) == .ready(pngBytes))
}

@Test func pastaSemPermissaoEIlegivelENaoAusente() throws {
  let dir = try tempDir()
  try pngBytes.write(to: dir.appendingPathComponent(Contract.lcdImageFile))
  try FileManager.default.setAttributes([.posixPermissions: 0o000], ofItemAtPath: dir.appendingPathComponent(Contract.lcdImageFile).path)
  defer { try? FileManager.default.setAttributes([.posixPermissions: 0o644], ofItemAtPath: dir.appendingPathComponent(Contract.lcdImageFile).path) }
  guard case .unreadable = WidgetImage.load(Contract.lcdImageFile, from: dir) else { Issue.record("deveria ser ilegível"); return }
}
