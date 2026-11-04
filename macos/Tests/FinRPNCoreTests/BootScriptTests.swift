import Foundation
import JavaScriptCore
import Testing
@testable import FinRPNCore

// Executa o script de partida num JSContext e lê de volta o que a página receberia em window.__HP12C_BOOT__.
private func bootValue(_ state: String?) throws -> JSValue {
  let ctx = try #require(JSContext())
  ctx.evaluateScript("var window = this;")
  ctx.evaluateScript(try BootScript.source(state: state))
  #expect(ctx.exception == nil, "exceção: \(String(describing: ctx.exception))")
  return ctx.evaluateScript("window.__HP12C_BOOT__")
}

@Test func estadoComCaracteresEspeciaisChegaIntacto() throws {
  let state = "{\"t\":\"aspas \\\" barra \\\\ </script> \u{2028} linha\nnova\"}"
  let boot = try bootValue(state)
  #expect(boot.forProperty(Contract.stateKey).toString() == state)
}

@Test func semEstadoChegaNull() throws {
  let boot = try bootValue(nil)
  #expect(boot.hasProperty(Contract.stateKey))
  #expect(boot.forProperty(Contract.stateKey).isNull)
}
