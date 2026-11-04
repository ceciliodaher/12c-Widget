import AppKit
import FinRPNCore
import WebKit
import os

// WKWebView com o esquema próprio, a ponte e o estado injetado na partida (DEC-004).
final class WebViewHost: NSObject, WKNavigationDelegate {
  let webView: WKWebView
  private let store: StateStore
  private let log = Logger(subsystem: logSubsystem, category: "webview")

  init(webRoot: URL, store: StateStore) throws {
    self.store = store
    let config = WKWebViewConfiguration()
    config.setURLSchemeHandler(AppSchemeHandler(root: webRoot), forURLScheme: Contract.scheme)
    config.userContentController.add(BridgeController(store: store), name: Contract.handler)
    webView = WKWebView(frame: .zero, configuration: config)
    super.init()
    webView.setValue(false, forKey: "drawsBackground")   // fundo transparente; o painel desenha a janela
    webView.isInspectable = true
    webView.navigationDelegate = self
    try loadWithSavedState()
  }

  // O estado da partida é relido do disco a cada carga, inclusive depois de queda do processo da página:
  // um script montado uma só vez reinjetaria o estado da abertura, e não o último gravado.
  private func loadWithSavedState() throws {
    let ucc = webView.configuration.userContentController
    ucc.removeAllUserScripts()
    let source = try BootScript.source(state: try store.load(key: Contract.stateKey))
    ucc.addUserScript(WKUserScript(source: source, injectionTime: .atDocumentStart, forMainFrameOnly: true))
    webView.load(URLRequest(url: Contract.startURL))
  }

  func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
    log.error("processo da página caiu; recarregando com o estado gravado")
    do { try loadWithSavedState() } catch { log.fault("recarga falhou: \(String(describing: error), privacy: .public)") }
  }

  func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
    log.error("navegação falhou: \(String(describing: error), privacy: .public)")
  }

  func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
    log.error("carga falhou: \(String(describing: error), privacy: .public)")
  }
}
