// Gera o .iconset do app a partir de um PNG quadrado de 1024 px (o icon.svg do upstream renderizado por build-app.sh):
// aplica a grade de ícone do macOS (conteúdo de 824 px, cantos de 185 px, centrado) e grava os tamanhos que o iconutil pede.
// Uso: swift make-iconset.swift <entrada-1024.png> <saida.iconset>
import AppKit

let args = CommandLine.arguments
guard args.count == 3 else { fatalError("uso: make-iconset.swift <entrada-1024.png> <saida.iconset>") }
guard let src = NSImage(contentsOfFile: args[1]), let cg = src.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
  fatalError("PNG de entrada ilegível: \(args[1])")
}
let out = URL(fileURLWithPath: args[2], isDirectory: true)
try FileManager.default.createDirectory(at: out, withIntermediateDirectories: true)

func render(_ px: Int) -> Data {
  let s = CGFloat(px) / 1024
  guard let ctx = CGContext(data: nil, width: px, height: px, bitsPerComponent: 8, bytesPerRow: 0,
                            space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)
  else { fatalError("contexto gráfico indisponível") }
  let box = CGRect(x: 100 * s, y: 100 * s, width: 824 * s, height: 824 * s)
  ctx.addPath(CGPath(roundedRect: box, cornerWidth: 185 * s, cornerHeight: 185 * s, transform: nil))
  ctx.clip()
  ctx.interpolationQuality = .high
  ctx.draw(cg, in: box)
  guard let img = ctx.makeImage(), let png = NSBitmapImageRep(cgImage: img).representation(using: .png, properties: [:])
  else { fatalError("falha ao gerar PNG de \(px) px") }
  return png
}

for base in [16, 32, 128, 256, 512] {
  try render(base).write(to: out.appendingPathComponent("icon_\(base)x\(base).png"))
  try render(base * 2).write(to: out.appendingPathComponent("icon_\(base)x\(base)@2x.png"))
}
