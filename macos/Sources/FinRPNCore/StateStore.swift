import Foundation

public struct StateStoreError: Error, CustomStringConvertible {
  public let description: String
  public init(description: String) { self.description = description }
}

// Grava o estado do motor (texto do serialize()) e a fotografia do visor, cada um num arquivo, de forma atômica.
// O conteúdo não é interpretado aqui: estado ilegível é tratado pelo motor (Pr Error e cópia em badKey).
public struct StateStore {
  public let directory: URL

  public init(directory: URL) throws {
    try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
    self.directory = directory
  }

  // DEC-016: a pasta do app em Application Support, lida também pelo widget (PRD-04). O caminho sai do diretório
  // real do usuário porque, dentro da sandbox da extensão, o FileManager devolve o contêiner da própria extensão.
  public static func defaultDirectory() throws -> URL {
    guard let pw = getpwuid(getuid()) else { throw StateStoreError(description: "diretório do usuário não disponível (getpwuid)") }
    return URL(fileURLWithPath: String(cString: pw.pointee.pw_dir), isDirectory: true)
      .appendingPathComponent("Library/Application Support", isDirectory: true)
      .appendingPathComponent(Contract.appSupportFolder, isDirectory: true)
  }

  public func load(key: String) throws -> String? {
    let url = try file(for: key)
    guard FileManager.default.fileExists(atPath: url.path) else { return nil }
    return try String(contentsOf: url, encoding: .utf8)
  }

  public func save(key: String, value: String) throws {
    try Data(value.utf8).write(to: try file(for: key), options: .atomic)
  }

  public func saveSnapshot(_ data: Data) throws {
    try data.write(to: directory.appendingPathComponent(Contract.snapshotFile), options: .atomic)
  }

  public func saveImages(calc: Data, lcd: Data) throws {
    try calc.write(to: directory.appendingPathComponent(Contract.calcImageFile), options: .atomic)
    try lcd.write(to: directory.appendingPathComponent(Contract.lcdImageFile), options: .atomic)
  }

  private func file(for key: String) throws -> URL {
    guard Contract.saveKeys.contains(key) else { throw StateStoreError(description: "chave de estado desconhecida: \(key)") }
    return directory.appendingPathComponent(key)
  }
}
