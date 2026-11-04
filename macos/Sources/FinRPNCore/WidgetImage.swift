import Foundation

// Leitura das imagens do widget (PRD-04, DEC-018), gravadas pelo app a partir do desenho da página.
// Ausente ou ilegível vira estado explícito; o widget nunca inventa uma calculadora.
public enum WidgetImage: Equatable {
  case ready(Data)
  case missing
  case unreadable(String)

  private static let signature = Data([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])

  public static func isPNG(_ data: Data) -> Bool { data.starts(with: signature) && data.count > signature.count }

  public static func load(_ file: String, from directory: URL) -> WidgetImage {
    let url = directory.appendingPathComponent(file)
    guard FileManager.default.fileExists(atPath: url.path) else { return .missing }
    do {
      let data = try Data(contentsOf: url)
      return isPNG(data) ? .ready(data) : .unreadable("\(file) não é PNG")
    } catch {
      return .unreadable("\(file): \(error.localizedDescription)")
    }
  }
}
