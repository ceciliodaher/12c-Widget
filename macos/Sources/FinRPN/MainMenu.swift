import AppKit

// Menu do app e menu Editar padrão: Copiar e Colar seguem a cadeia de respondedores até o WKWebView,
// que dispara os eventos copy e paste do documento, tratados em web/mac/main-mac.js.
enum MainMenu {
  static func make() -> NSMenu {
    let main = NSMenu()
    let appMenu = NSMenu()
    appMenu.addItem(withTitle: "Ocultar FinRPN", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
    appMenu.addItem(.separator())
    appMenu.addItem(withTitle: "Encerrar FinRPN", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
    let edit = NSMenu(title: "Editar")
    edit.addItem(withTitle: "Copiar", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
    edit.addItem(withTitle: "Colar", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
    let window = NSMenu(title: "Janela")
    window.addItem(withTitle: "Fechar", action: #selector(NSWindow.performClose(_:)), keyEquivalent: "w")
    window.addItem(withTitle: "Minimizar", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
    for submenu in [appMenu, edit, window] {
      let item = NSMenuItem()
      item.submenu = submenu
      main.addItem(item)
    }
    NSApplication.shared.windowsMenu = window
    return main
  }
}
