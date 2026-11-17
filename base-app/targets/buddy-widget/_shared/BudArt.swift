// Arte 3D do novo Bud (algodão) e dos itens do Buddy Studio, iguais às do app
// (assets/bud e assets/studio). No widget as imagens vêm do catálogo do alvo
// (expo-target.config.js); no app, de arquivos copiados pelo plugin
// withBuddyAppIntents. As medidas são as mesmas de budArt.ts e studioArt.ts.
import SwiftUI
import UIKit

enum BudArt {
  // Imagem por nome, do catálogo (widget) ou do pacote do app
  static func image(_ name: String) -> Image {
    if let ui = UIImage(named: name) { return Image(uiImage: ui) }
    return Image(name)
  }

  // Arte original: caixa do corpo em (125, 535) com 455 × 444 px
  private static let k: CGFloat = 88.0 / 455.0
  static let body = CGRect(x: 26, y: 16, width: 88, height: 86)
  // Rosto e acessórios usam o quadro antigo de 88 × 70, descido até os olhos
  static let faceTop: CGFloat = 9

  private static func box(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat) -> CGRect {
    CGRect(x: 26 + (x - 125) * k, y: 16 + (y - 535) * k, width: w * k, height: h * k)
  }

  // Mão parada (encaixada no corpo) e a esfera inteira (quando gesticula)
  static let handL = box(48, 737, 126, 159)
  static let handR = box(526, 737, 130, 159)
  static let handLFull = box(47, 738, 159, 159)
  static let handRFull = box(499, 738, 159, 159)

  // Cor do Buddy por cima do algodão (o branco é a arte pura)
  // Nome da camada da arte: o Bud preto usa a arte escura própria
  static func part(_ name: String, _ pal: BuddyPalette) -> String {
    pal.isDark ? name + "_dark" : name
  }

  static func tint(_ pal: BuddyPalette) -> Color? {
    if pal.name == "Branco" || pal.isDark { return nil }
    if let metal = pal.metal { return metal[1] }
    return pal.body[2]
  }

  struct StudioItem {
    let file: String
    let left: CGFloat
    let top: CGFloat
    let width: CGFloat
    let ratio: CGFloat
    var isStretch = false
  }

  // Na frente: coordenadas do rosto (88 × 70)
  static let studioFront: [String: StudioItem] = [
    "mago": StudioItem(file: "studio_mago", left: 15, top: -74, width: 58, ratio: 1.45),
    "samurai": StudioItem(file: "studio_samurai", left: -8, top: -50, width: 104, ratio: 0.695),
    "viking": StudioItem(file: "studio_viking", left: -8, top: -46, width: 104, ratio: 0.587),
    "astronauta": StudioItem(file: "studio_astronauta", left: -13, top: -24, width: 114, ratio: 0.949),
    "robo": StudioItem(file: "studio_robo", left: -6, top: -37, width: 100, ratio: 1.231),
    "espelhado": StudioItem(file: "studio_espelhado", left: -6, top: 4, width: 100, ratio: 0.516),
    "narigao": StudioItem(file: "studio_narigao", left: 10, top: 8, width: 68, ratio: 0.904),
    "oni": StudioItem(file: "studio_oni", left: -4, top: -4, width: 96, ratio: 0.879),
    "vampiro": StudioItem(file: "studio_vampiro", left: 23, top: 34, width: 42, ratio: 0.744),
    "faixaNinja": StudioItem(file: "studio_faixa_ninja", left: -4, top: -10, width: 96, ratio: 0.339),
    "palha": StudioItem(file: "studio_palha", left: -8, top: -40, width: 104, ratio: 0.49),
    "kitsune": StudioItem(file: "studio_kitsune", left: 4, top: -2, width: 84, ratio: 0.822),
    "ondas": StudioItem(file: "studio_ondas", left: 5, top: -2, width: 80, ratio: 1.1, isStretch: true),
    "tribal": StudioItem(file: "studio_tribal", left: 6, top: -1, width: 78, ratio: 1.0, isStretch: true),
    "hyottoko": StudioItem(file: "studio_hyottoko", left: 4, top: -10, width: 80, ratio: 1.05, isStretch: true),
    "sorriso": StudioItem(file: "studio_sorriso", left: 11, top: 34, width: 66, ratio: 0.62, isStretch: true),
  ]

  // Atrás do corpo: coordenadas da figura inteira (140 × 135)
  static let studioBack: [String: StudioItem] = [
    "fone": StudioItem(file: "studio_fone", left: 10, top: -15, width: 120, ratio: 0.979),
    "gato": StudioItem(file: "studio_gato", left: 24, top: 4, width: 92, ratio: 0.821),
    "paraquedas": StudioItem(file: "studio_paraquedas", left: 10, top: -52, width: 120, ratio: 1.047),
    "espadas": StudioItem(file: "studio_espadas", left: 5, top: -12, width: 130, ratio: 1.151),
  ]
}

// Um item do Studio no lugar certo (esticado quando a arte pede)
struct BudStudioArt: View {
  let item: BudArt.StudioItem

  var body: some View {
    Group {
      if item.isStretch {
        BudArt.image(item.file).resizable()
      } else {
        BudArt.image(item.file).resizable().aspectRatio(contentMode: .fit)
      }
    }
    .frame(width: item.width, height: item.width * item.ratio)
    .offset(x: item.left, y: item.top)
  }
}

// Camada da arte com a cor do Buddy por cima (luz e sombra da arte aparecem)
struct BudTinted: View {
  let name: String
  let tint: Color?
  var opacity: Double = 0.55

  var body: some View {
    ZStack {
      BudArt.image(name).resizable()
      if let tint {
        BudArt.image(name).resizable().renderingMode(.template).foregroundStyle(tint).opacity(opacity)
      }
    }
  }
}
