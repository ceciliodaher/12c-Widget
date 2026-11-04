import Foundation
import Testing
@testable import FinRPNCore

private let validSnapshot: [String: Any] = [
  "type": "snapshot", "text": " 0,00", "ann": ["f": false, "g": false], "x": "0",
  "fin": ["n": "0", "i": "0", "pv": "0", "pmt": "0", "fv": "0"],
]

@Test func saveValido() throws {
  let msg = try BridgeMessage.parse(["type": "save", "key": Contract.stateKey, "value": "{}"])
  #expect(msg == .save(key: Contract.stateKey, value: "{}"))
  #expect(try BridgeMessage.parse(["type": "save", "key": Contract.badKey, "value": ""]) == .save(key: Contract.badKey, value: ""))
}

@Test func saveInvalidoERecusado() {
  for body: Any in [
    ["type": "save", "key": "outra", "value": "{}"],
    ["type": "save", "key": Contract.stateKey, "value": 1],
    ["type": "save", "key": Contract.stateKey],
    ["type": "apagar"], ["key": Contract.stateKey], "save", NSNull(),
  ] as [Any] {
    #expect(throws: BridgeError.self, "deveria recusar \(body)") { try BridgeMessage.parse(body) }
  }
}

@Test func snapshotValidoViraJSON() throws {
  guard case .snapshot(let data) = try BridgeMessage.parse(validSnapshot) else { Issue.record("não é snapshot"); return }
  let back = try #require(try JSONSerialization.jsonObject(with: data) as? [String: Any])
  #expect(back["x"] as? String == "0")
  #expect((back["fin"] as? [String: Any])?["pmt"] as? String == "0")
}

@Test func snapshotComNumeroOuCampoFaltandoERecusado() {
  var numero = validSnapshot; numero["x"] = 0
  var semFin = validSnapshot; semFin["fin"] = nil
  var finIncompleto = validSnapshot; finIncompleto["fin"] = ["n": "0"]
  var finNumero = validSnapshot; finNumero["fin"] = ["n": "0", "i": "0", "pv": "0", "pmt": 0, "fv": "0"]
  var semAnn = validSnapshot; semAnn["ann"] = nil
  for body in [numero, semFin, finIncompleto, finNumero, semAnn] {
    #expect(throws: BridgeError.self) { try BridgeMessage.parse(body) }
  }
}
