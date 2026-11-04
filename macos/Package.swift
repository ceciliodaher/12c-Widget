// swift-tools-version:5.10
// FinRPN: app nativo do 12c Widget (DEC-014, DEC-015). Build completo do .app: macos/build-app.sh.
import PackageDescription

let package = Package(
  name: "FinRPN",
  platforms: [.macOS(.v14)],
  targets: [
    .target(name: "FinRPNCore"),
    .executableTarget(name: "FinRPN", dependencies: ["FinRPNCore"]),
    // Extensão WidgetKit (PRD-04). Sem _NSExtensionMain como ponto de entrada ela trava ao iniciar (DEC-015).
    .executableTarget(
      name: "FinRPNWidget", dependencies: ["FinRPNCore"],
      linkerSettings: [.unsafeFlags(["-Xlinker", "-e", "-Xlinker", "_NSExtensionMain"])]
    ),
    .testTarget(name: "FinRPNCoreTests", dependencies: ["FinRPNCore"]),
  ]
)
