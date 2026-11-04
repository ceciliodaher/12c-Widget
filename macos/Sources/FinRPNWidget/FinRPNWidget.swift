import FinRPNCore
import SwiftUI
import WidgetKit
import os

// Widget somente leitura (DEC-003, DEC-018): exibe a imagem que a página gerou do próprio desenho e o app gravou.
// Pequeno: o visor (lcd.png). Médio e grande: a calculadora inteira (calc.png). O clique abre o app que o contém.

struct CalcEntry: TimelineEntry {
  let date: Date
  let image: WidgetImage
}

struct CalcProvider: TimelineProvider {
  private let log = Logger(subsystem: "com.ceciliodaher.finrpn.widget", category: "timeline")

  func placeholder(in context: Context) -> CalcEntry { entry(for: context.family) }
  func getSnapshot(in context: Context, completion: @escaping (CalcEntry) -> Void) { completion(entry(for: context.family)) }
  func getTimeline(in context: Context, completion: @escaping (Timeline<CalcEntry>) -> Void) {
    let e = entry(for: context.family)
    log.notice("linha do tempo \(String(describing: context.family), privacy: .public): \(String(describing: e.image).prefix(40), privacy: .public)")
    completion(Timeline(entries: [e], policy: .never))   // a recarga vem do app
  }

  private func entry(for family: WidgetFamily) -> CalcEntry {
    let file = family == .systemSmall ? Contract.lcdImageFile : Contract.calcImageFile
    do { return CalcEntry(date: .now, image: WidgetImage.load(file, from: try StateStore.defaultDirectory())) } catch {
      return CalcEntry(date: .now, image: .unreadable(String(describing: error)))
    }
  }
}

struct CalcView: View {
  let entry: CalcEntry

  var body: some View {
    Group {
      switch entry.image {
      case .ready(let data):
        if let img = NSImage(data: data) {
          Image(nsImage: img).resizable().interpolation(.high).aspectRatio(contentMode: .fit)
        } else {
          notice("Imagem ilegível: o PNG não foi decodificado")
        }
      case .missing: notice("Abra o FinRPN para ver a calculadora")
      case .unreadable(let why): notice("Imagem ilegível: \(why)")
      }
    }
    .containerBackground(for: .widget) { Color.black }
  }

  private func notice(_ text: String) -> some View {
    Text(text).font(.caption).foregroundStyle(.white).multilineTextAlignment(.center)
  }
}

@main
struct FinRPNWidget: Widget {
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: "FinRPN", provider: CalcProvider()) { CalcView(entry: $0) }
      .configurationDisplayName("FinRPN")
      .description("O visor ou a calculadora, como estão no painel. Clique para abrir.")
      .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
  }
}
