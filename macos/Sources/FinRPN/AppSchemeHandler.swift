import FinRPNCore
import WebKit
import os

// Serve finrpn-app://app/<caminho> a partir de Contents/Resources/web/ (DEC-005, DEC-014).
final class AppSchemeHandler: NSObject, WKURLSchemeHandler {
  private let root: URL
  private let log = Logger(subsystem: logSubsystem, category: "scheme")

  init(root: URL) { self.root = root }

  func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
    do {
      guard let url = task.request.url else { throw SchemeError(description: "pedido sem URL") }
      let (file, mime) = try SchemeResolver.resolve(url, root: root)
      let data = try Data(contentsOf: file)
      task.didReceive(URLResponse(url: url, mimeType: mime, expectedContentLength: data.count, textEncodingName: "utf-8"))
      task.didReceive(data)
      task.didFinish()
    } catch {
      log.error("recusado: \(String(describing: error), privacy: .public)")
      task.didFailWithError(error)
    }
  }

  func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) {}
}
