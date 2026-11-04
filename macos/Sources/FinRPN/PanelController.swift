import AppKit

// NSPanel aceita o teclado; por padrão some quando o app perde o foco, o que aqui se desliga.
final class CalculatorPanel: NSPanel {
  override var canBecomeKey: Bool { true }
  override var canBecomeMain: Bool { true }
}

final class PanelController {
  private let panel: CalculatorPanel
  private let content: NSView

  init(content: NSView) {
    self.content = content
    panel = CalculatorPanel(contentRect: NSRect(x: 0, y: 0, width: 640, height: 395),
                            styleMask: [.titled, .closable, .miniaturizable, .resizable],
                            backing: .buffered, defer: false)
    panel.title = "FinRPN"
    panel.titlebarAppearsTransparent = true
    panel.isFloatingPanel = true
    panel.level = .floating
    panel.hidesOnDeactivate = false
    panel.isReleasedWhenClosed = false
    panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
    panel.contentAspectRatio = NSSize(width: 1280, height: 790)
    panel.contentView = content
    panel.center()
    panel.setFrameAutosaveName("FinRPNPanel")   // posição e tamanho lembrados entre aberturas
  }

  func show() {
    NSApp.activate(ignoringOtherApps: true)
    panel.makeKeyAndOrderFront(nil)
    panel.makeFirstResponder(content)
  }
}
