// O Pace Buddy em SwiftUI, nas medidas do design (140 × 135): sombra,
// capa, corpo 88 × 70, olhos, boca, mãos e acessórios. Fora do app o iOS
// não deixa animar o tempo todo, então cada gesto do design vira uma pose.
import SwiftUI

enum BuddyPose: String, Codable, Hashable {
  case idle, wave, sleep, sick, celebrate, run, excited, wink, armsUp, tilt
}

// Corpo: cantos 36/34 em cima e 30/28 embaixo (border-radius elíptico do design)
struct BuddyBodyShape: Shape {
  func path(in r: CGRect) -> Path {
    let k: CGFloat = 0.5523
    let (tx, ty, bx, by): (CGFloat, CGFloat, CGFloat, CGFloat) = (36, 34, 30, 28)
    var p = Path()
    p.move(to: CGPoint(x: r.minX + tx, y: r.minY))
    p.addLine(to: CGPoint(x: r.maxX - tx, y: r.minY))
    p.addCurve(to: CGPoint(x: r.maxX, y: r.minY + ty),
               control1: CGPoint(x: r.maxX - tx + tx * k, y: r.minY),
               control2: CGPoint(x: r.maxX, y: r.minY + ty - ty * k))
    p.addLine(to: CGPoint(x: r.maxX, y: r.maxY - by))
    p.addCurve(to: CGPoint(x: r.maxX - bx, y: r.maxY),
               control1: CGPoint(x: r.maxX, y: r.maxY - by + by * k),
               control2: CGPoint(x: r.maxX - bx + bx * k, y: r.maxY))
    p.addLine(to: CGPoint(x: r.minX + bx, y: r.maxY))
    p.addCurve(to: CGPoint(x: r.minX, y: r.maxY - by),
               control1: CGPoint(x: r.minX + bx - bx * k, y: r.maxY),
               control2: CGPoint(x: r.minX, y: r.maxY - by + by * k))
    p.addLine(to: CGPoint(x: r.minX, y: r.minY + ty))
    p.addCurve(to: CGPoint(x: r.minX + tx, y: r.minY),
               control1: CGPoint(x: r.minX, y: r.minY + ty - ty * k),
               control2: CGPoint(x: r.minX + tx - tx * k, y: r.minY))
    p.closeSubpath()
    return p
  }
}

// Posiciona um elemento como no CSS (left/top) dentro do quadro do Buddy
extension View {
  func buddyAt(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat) -> some View {
    frame(width: w, height: h).offset(x: x, y: y)
  }
}

struct BuddyView: View {
  var color: String = "branco"
  var accessories: [String] = []
  var pose: BuddyPose = .idle

  private var pal: BuddyPalette { BuddyPalette.of(color) }

  // Inclinação do corpo (gT do design)
  private var tilt: Double {
    switch pose {
    case .run: return 7
    case .sick: return -4
    case .tilt: return -11
    default: return 0
    }
  }

  private var lift: CGFloat {
    switch pose {
    case .sleep: return 9
    case .sick: return 6
    case .run: return -8
    case .celebrate, .excited: return -6
    case .armsUp: return -5
    default: return 0
    }
  }

  var body: some View {
    ZStack(alignment: .topLeading) {
      Ellipse()
        .fill(RadialGradient(colors: [Color.buddyOrange.opacity(0.45), Color.buddyOrange.opacity(0)],
                             center: .center, startRadius: 0, endRadius: 40))
        .buddyAt(30, 112, 80, 14)
      ZStack(alignment: .topLeading) {
        if let glow = pal.glow {
          Ellipse().fill(RadialGradient(colors: [glow, .clear], center: .center, startRadius: 0, endRadius: 64))
            .buddyAt(6, 14, 128, 104)
        }
        if accessories.contains("capa") { BuddyCape().buddyAt(12, 62, 116, 64) }
        if pose == .run { BuddyRunRing().buddyAt(14, 92, 112, 34) }
        BuddyBody(pal: pal, pose: pose, accessories: accessories).buddyAt(26, 32, 88, 70)
        BuddyHand(pal: pal, pose: pose, isRight: false).buddyAt(12, 68, 24, 24)
        BuddyHand(pal: pal, pose: pose, isRight: true).buddyAt(104, 68, 24, 24)
        BuddyEffects(pose: pose, pal: pal)
      }
      .rotationEffect(.degrees(tilt), anchor: UnitPoint(x: 0.5, y: 0.75))
      .offset(y: lift)
    }
    .frame(width: 140, height: 135, alignment: .topLeading)
  }
}

private struct BuddyBody: View {
  let pal: BuddyPalette
  let pose: BuddyPose
  let accessories: [String]

  var body: some View {
    ZStack(alignment: .topLeading) {
      BuddyBodyShape().fill(pal.bodyFill)
      // Volume: brilho em cima à esquerda, sombra embaixo à direita
      BuddyBodyShape().fill(LinearGradient(
        colors: [Color.white.opacity(pal.metal == nil ? 0.55 : 0.3), .clear, pal.shade],
        startPoint: .topLeading, endPoint: .bottomTrailing))
      if pal.metal != nil {
        Ellipse().fill(RadialGradient(colors: [Color.white.opacity(0.98), .clear], center: .center, startRadius: 0, endRadius: 14))
          .buddyAt(14, 6, 28, 18)
      }
      if pose == .sick {
        BuddyBodyShape().fill(RadialGradient(colors: [Color(hex: 0xFF402C, alpha: 0.38), .clear],
                                             center: UnitPoint(x: 0.5, y: 0.38), startRadius: 0, endRadius: 40))
        Ellipse().fill(Color(hex: 0xFF483C, alpha: 0.6)).blur(radius: 2).buddyAt(10, 40, 16, 9)
        Ellipse().fill(Color(hex: 0xFF483C, alpha: 0.6)).blur(radius: 2).buddyAt(62, 40, 16, 9)
      }
      BuddyEyes(pose: pose).buddyAt(0, 22, 88, 18)
      BuddyMouth(pose: pose)
      ForEach(BuddyAccessoryOrder.sorted(accessories.filter { $0 != "capa" }), id: \.self) { id in
        BuddyHeadAccessory(id: id, pal: pal)
      }
    }
    .frame(width: 88, height: 70, alignment: .topLeading)
    .shadow(color: .black.opacity(0.45), radius: 8, x: 0, y: 10)
    .shadow(color: pal.glow ?? Color.buddyOrange.opacity(0.35), radius: 10, x: 0, y: 6)
    .scaleEffect(x: pose == .sleep ? 1.07 : 1, y: pose == .sleep ? 0.86 : 1, anchor: .bottom)
  }
}

private struct BuddyEyes: View {
  let pose: BuddyPose

  var body: some View {
    HStack(alignment: .top, spacing: 20) {
      eye(0)
      eye(1)
    }
    .frame(maxWidth: .infinity, alignment: .top)
    .offset(x: pose == .run ? 3 : 0, y: pose == .sick ? 2 : 0)
  }

  @ViewBuilder private func eye(_ i: Int) -> some View {
    switch pose {
    case .sleep:
      BuddyArc(isUp: false).stroke(Color.buddyInk, lineWidth: 2.6).frame(width: 13, height: 7).padding(.top, 6)
    case .celebrate:
      BuddyArc(isUp: true).stroke(Color.buddyInk, lineWidth: 3).frame(width: 13, height: 8).padding(.top, 4)
    case .wink where i == 1:
      // Piscadinha: o olho direito fecha
      BuddyArc(isUp: true).stroke(Color.buddyInk, lineWidth: 3).frame(width: 13, height: 8).padding(.top, 5)
    case .sick:
      BuddyArc(isUp: false).fill(Color.buddyInk).frame(width: 11, height: 9)
        .rotationEffect(.degrees(i == 1 ? 12 : -12)).padding(.top, 7)
    default:
      Ellipse().fill(Color.buddyInk).frame(width: 10, height: 16)
        .scaleEffect(y: pose == .run ? 0.75 : 1)
    }
  }
}

// Meia-elipse (olhos fechados, sorriso de comemoração)
struct BuddyArc: Shape {
  let isUp: Bool
  func path(in r: CGRect) -> Path {
    var p = Path()
    if isUp {
      p.move(to: CGPoint(x: r.minX, y: r.maxY))
      p.addQuadCurve(to: CGPoint(x: r.maxX, y: r.maxY), control: CGPoint(x: r.midX, y: r.minY - r.height * 0.6))
    } else {
      p.move(to: CGPoint(x: r.minX, y: r.minY))
      p.addQuadCurve(to: CGPoint(x: r.maxX, y: r.minY), control: CGPoint(x: r.midX, y: r.maxY + r.height * 0.6))
    }
    return p
  }
}

private struct BuddyMouth: View {
  let pose: BuddyPose

  var body: some View {
    switch pose {
    case .sleep:
      Capsule().fill(Color.buddyInk.opacity(0.8)).buddyAt(41, 46, 7, 2.5)
    case .sick:
      ZStack(alignment: .topLeading) {
        Ellipse().fill(Color.buddyInk).buddyAt(39, 45, 9, 7)
        // Termômetro
        ZStack(alignment: .leading) {
          Capsule().fill(LinearGradient(colors: [.white, Color(hex: 0xCFD9E2)], startPoint: .top, endPoint: .bottom))
          Capsule().fill(Color(hex: 0xE8322A)).frame(width: 22, height: 2)
        }
        .frame(width: 36, height: 6)
        .rotationEffect(.degrees(18), anchor: .leading)
        .offset(x: 45, y: 47)
      }
    default:
      EmptyView()
    }
  }
}

private struct BuddyHand: View {
  let pal: BuddyPalette
  let pose: BuddyPose
  let isRight: Bool

  // Posição das mãos [esquerda, direita] (HP do design)
  private var offset: CGSize {
    switch pose {
    case .wave: return isRight ? CGSize(width: 4, height: -30) : .zero
    case .sleep: return CGSize(width: isRight ? 8 : -8, height: 12)
    case .sick: return CGSize(width: isRight ? 3 : -3, height: 8)
    case .celebrate: return isRight ? CGSize(width: 10, height: -44) : CGSize(width: -4, height: -4)
    case .excited: return CGSize(width: isRight ? 7 : -7, height: -22)
    case .run: return isRight ? CGSize(width: 2, height: 2) : CGSize(width: -2, height: -4)
    case .armsUp: return CGSize(width: isRight ? 8 : -8, height: -36)
    case .wink: return isRight ? CGSize(width: 4, height: -24) : .zero
    case .idle, .tilt: return .zero
    }
  }

  // Braço esticado quando a mão sobe
  private var isRaised: Bool { offset.height < 0 && pose != .sleep }

  var body: some View {
    Capsule()
      .fill(pal.handFill)
      .frame(width: isRaised ? 17 : 24, height: isRaised ? 34 : 24)
      .offset(y: isRaised ? -5 : 0)
      .rotationEffect(.degrees(isRaised ? (isRight ? 30 : -30) : 0))
      .shadow(color: .black.opacity(0.4), radius: 4, x: 0, y: 4)
      .frame(width: 24, height: 24)
      .offset(offset)
  }
}

private struct BuddyCape: View {
  var body: some View {
    ZStack {
      BuddyTrapezoid().fill(LinearGradient(colors: [Color.buddyOrange400, Color(hex: 0xCD3600)], startPoint: .top, endPoint: .bottom))
      BuddyTrapezoid().fill(LinearGradient(colors: [Color(hex: 0x23313F), Color.buddyNavyDeep], startPoint: .top, endPoint: .bottom))
        .padding(.horizontal, 6).padding(.bottom, 4)
    }
  }
}

// polygon(20% 0, 80% 0, 100% 100%, 0 100%)
struct BuddyTrapezoid: Shape {
  func path(in r: CGRect) -> Path {
    var p = Path()
    p.move(to: CGPoint(x: r.minX + r.width * 0.2, y: r.minY))
    p.addLine(to: CGPoint(x: r.minX + r.width * 0.8, y: r.minY))
    p.addLine(to: CGPoint(x: r.maxX, y: r.maxY))
    p.addLine(to: CGPoint(x: r.minX, y: r.maxY))
    p.closeSubpath()
    return p
  }
}

// Anel laranja da largada ("Vira um círculo")
private struct BuddyRunRing: View {
  var body: some View {
    ZStack {
      Ellipse().fill(Color.buddyOrange.opacity(0.25)).padding(6)
      Ellipse().stroke(AngularGradient(colors: [Color.buddyOrange.opacity(0), Color.buddyOrange, Color(hex: 0xFFE3D1)], center: .center),
                       lineWidth: 6)
    }
    .shadow(color: Color.buddyOrange.opacity(0.9), radius: 6)
  }
}

// Efeitos: Z do sono, gotas de suor, brilhos de comemoração e do metálico
private struct BuddyEffects: View {
  let pose: BuddyPose
  let pal: BuddyPalette

  var body: some View {
    ZStack(alignment: .topLeading) {
      if pose == .sleep {
        ForEach(0..<3, id: \.self) { i in
          Text("Z").font(.system(size: [11, 14, 18][i], weight: .heavy))
            .foregroundStyle(Color.buddyOrange300).shadow(color: Color.buddyOrange.opacity(0.8), radius: 4)
            .offset(x: 108 + CGFloat(i * 7), y: 18 - CGFloat(i * 5))
        }
      }
      if pose == .sick {
        BuddyDrop().buddyAt(34, 30, 7, 10)
        BuddyDrop().buddyAt(104, 40, 7, 10)
      }
      if pose == .celebrate || pose == .excited || pose == .armsUp {
        sparks([(6, 18, 14), (118, 6, 16), (126, 74, 12), (2, 90, 12), (62, -6, 10)], color: Color.buddyOrange300)
      } else if let ink = pal.ink {
        sparks(pal.spark ? [(12, 28, 12), (116, 18, 9), (124, 88, 10), (2, 84, 8), (70, 4, 8)] : [(16, 30, 10), (116, 22, 8), (122, 90, 9)], color: ink)
      }
    }
  }

  private func sparks(_ list: [(CGFloat, CGFloat, CGFloat)], color: Color) -> some View {
    ForEach(Array(list.enumerated()), id: \.offset) { i, s in
      BuddyStar().fill(i % 2 == 1 ? Color.white : color).buddyAt(s.0, s.1, s.2, s.2)
    }
  }
}

private struct BuddyDrop: View {
  var body: some View {
    RoundedRectangle(cornerRadius: 3.5)
      .fill(LinearGradient(colors: [Color(hex: 0xE9F6FF), Color(hex: 0x8CCBF2)], startPoint: .topLeading, endPoint: .bottomTrailing))
      .frame(width: 7, height: 7)
      .rotationEffect(.degrees(45))
      .offset(y: 3)
  }
}

// Estrela de 4 pontas (clip-path do design)
struct BuddyStar: Shape {
  func path(in r: CGRect) -> Path {
    let pts: [(CGFloat, CGFloat)] = [(0.5, 0), (0.61, 0.39), (1, 0.5), (0.61, 0.61), (0.5, 1), (0.39, 0.61), (0, 0.5), (0.39, 0.39)]
    var p = Path()
    for (i, pt) in pts.enumerated() {
      let point = CGPoint(x: r.minX + r.width * pt.0, y: r.minY + r.height * pt.1)
      if i == 0 { p.move(to: point) } else { p.addLine(to: point) }
    }
    p.closeSubpath()
    return p
  }
}
