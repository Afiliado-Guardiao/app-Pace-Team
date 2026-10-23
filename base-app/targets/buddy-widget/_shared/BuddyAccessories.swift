// Acessórios de cabeça/olhos do Buddy, nas coordenadas do corpo (88 × 70)
// do design. A capa fica atrás do corpo (BuddyCape em BuddyView).
import SwiftUI

enum BuddyAccessoryOrder {
  static let order = ["oculos", "grau", "faixa", "bone", "boneTras", "coroa", "aureola"]
  static func sorted(_ ids: [String]) -> [String] {
    ids.sorted { (order.firstIndex(of: $0) ?? 99) < (order.firstIndex(of: $1) ?? 99) }
  }
}

// Retângulo com cantos elípticos diferentes em cima e embaixo
struct BuddyRoundedShape: Shape {
  var tx: CGFloat, ty: CGFloat, bx: CGFloat, by: CGFloat

  func path(in r: CGRect) -> Path {
    let k: CGFloat = 0.5523
    var p = Path()
    p.move(to: CGPoint(x: r.minX + tx, y: r.minY))
    p.addLine(to: CGPoint(x: r.maxX - tx, y: r.minY))
    p.addCurve(to: CGPoint(x: r.maxX, y: r.minY + ty),
               control1: CGPoint(x: r.maxX - tx * (1 - k), y: r.minY), control2: CGPoint(x: r.maxX, y: r.minY + ty * (1 - k)))
    p.addLine(to: CGPoint(x: r.maxX, y: r.maxY - by))
    p.addCurve(to: CGPoint(x: r.maxX - bx, y: r.maxY),
               control1: CGPoint(x: r.maxX, y: r.maxY - by * (1 - k)), control2: CGPoint(x: r.maxX - bx * (1 - k), y: r.maxY))
    p.addLine(to: CGPoint(x: r.minX + bx, y: r.maxY))
    p.addCurve(to: CGPoint(x: r.minX, y: r.maxY - by),
               control1: CGPoint(x: r.minX + bx * (1 - k), y: r.maxY), control2: CGPoint(x: r.minX, y: r.maxY - by * (1 - k)))
    p.addLine(to: CGPoint(x: r.minX, y: r.minY + ty))
    p.addCurve(to: CGPoint(x: r.minX + tx, y: r.minY),
               control1: CGPoint(x: r.minX, y: r.minY + ty * (1 - k)), control2: CGPoint(x: r.minX + tx * (1 - k), y: r.minY))
    p.closeSubpath()
    return p
  }
}

// Caminho SVG simples (M, L, Q, Z absolutos) desenhado numa caixa de viewBox
struct BuddySVGPath: Shape {
  let d: String
  var viewBox = CGSize(width: 100, height: 32)

  func path(in r: CGRect) -> Path {
    let sx = r.width / viewBox.width
    let sy = r.height / viewBox.height
    let pt = { (x: Double, y: Double) in CGPoint(x: r.minX + CGFloat(x) * sx, y: r.minY + CGFloat(y) * sy) }
    var p = Path()
    // "M1 8" → "M", "1", "8": separa as letras dos números
    var tokens = d.replacingOccurrences(of: ",", with: " ")
      .replacingOccurrences(of: "([A-Za-z])", with: " $1 ", options: .regularExpression)
      .split(whereSeparator: { $0 == " " }).map(String.init)[...]
    var command = "M"
    func number() -> Double { Double(tokens.popFirst() ?? "0") ?? 0 }
    while let token = tokens.first {
      if let ch = token.first, ch.isLetter {
        command = String(ch)
        tokens.removeFirst()
        if command == "Z" { p.closeSubpath() }
        continue
      }
      switch command {
      case "M": p.move(to: pt(number(), number()))
      case "L": p.addLine(to: pt(number(), number()))
      case "Q":
        let c = pt(number(), number())
        p.addQuadCurve(to: pt(number(), number()), control: c)
      default: tokens.removeFirst()
      }
    }
    return p
  }
}

struct BuddyHeadAccessory: View {
  let id: String
  let pal: BuddyPalette

  var body: some View {
    ZStack(alignment: .topLeading) {
      switch id {
      case "faixa": BuddyHeadband()
      case "oculos": BuddySunglasses()
      case "grau": BuddyReadingGlasses()
      case "bone": BuddyCap()
      case "boneTras": BuddyBackCap(fill: pal.metal?[1] ?? pal.body[1])
      case "coroa": BuddyCrown()
      case "aureola": BuddyHalo()
      default: EmptyView()
      }
    }
    .frame(width: 88, height: 70, alignment: .topLeading)
  }
}

private struct BuddyHeadband: View {
  var body: some View {
    ZStack(alignment: .topLeading) {
      RoundedRectangle(cornerRadius: 7).fill(buddyOrangeFill)
        .shadow(color: Color(hex: 0xCD3600, alpha: 0.6), radius: 3, y: 3)
        .buddyAt(-3, 6, 94, 13)
      RoundedRectangle(cornerRadius: 3).fill(buddyOrangeFill).rotationEffect(.degrees(28)).buddyAt(82, 13, 14, 6)
      RoundedRectangle(cornerRadius: 3).fill(Color(hex: 0xE84A00)).rotationEffect(.degrees(58)).buddyAt(80, 18, 12, 5)
    }
  }
}

private struct BuddySunglasses: View {
  private let frame = Color(hex: 0x0E1218)
  private let lens = LinearGradient(
    stops: [.init(color: Color(hex: 0xFFD27A), location: 0), .init(color: Color(hex: 0xFD7A1E), location: 0.35),
            .init(color: Color(hex: 0xE84A00), location: 0.7), .init(color: Color(hex: 0x8A2400), location: 1)],
    startPoint: .top, endPoint: .bottom)
  private let shine = LinearGradient(colors: [.white.opacity(0), .white.opacity(0.75), .white.opacity(0)], startPoint: .leading, endPoint: .trailing)

  var body: some View {
    ZStack(alignment: .topLeading) {
      BuddySVGPath(d: "M1 8 Q0 14 3 19 L6 18 Q4 13 5 9 Z").fill(frame)
      BuddySVGPath(d: "M99 8 Q100 14 97 19 L94 18 Q96 13 95 9 Z").fill(frame)
      BuddySVGPath(d: "M5 6 Q50 1 95 6 L96 12 Q95 24 84 27 Q70 29 60 26 Q55 17 50 16 Q45 17 40 26 Q30 29 16 27 Q5 24 4 12 Z").fill(lens)
      BuddySVGPath(d: "M12 9 Q22 7 30 8 L20 24 Q13 23 11 18 Z").fill(shine).opacity(0.55)
      BuddySVGPath(d: "M66 8 Q72 8 76 9 L70 25 Q66 25 63 24 Z").fill(shine).opacity(0.35)
      BuddySVGPath(d: "M3 7 Q50 -1 97 7 L97 11 Q50 4 3 11 Z").fill(frame)
      BuddySVGPath(d: "M44 8 Q50 6 56 8 L57.5 19 Q54 15.5 50 15.5 Q46 15.5 42.5 19 Z").fill(frame)
    }
    .shadow(color: .black.opacity(0.45), radius: 3, y: 4)
    .buddyAt(-8, 11, 104, 33)
  }
}

private struct BuddyReadingGlasses: View {
  private let frame = Color(hex: 0x0B0E12)

  var body: some View {
    ZStack(alignment: .topLeading) {
      RoundedRectangle(cornerRadius: 2).fill(frame).buddyAt(-2, 23, 19, 3.5)
      RoundedRectangle(cornerRadius: 2).fill(frame).buddyAt(71, 23, 19, 3.5)
      RoundedRectangle(cornerRadius: 2).fill(frame).buddyAt(41, 25, 6, 3.5)
      lens.buddyAt(16, 19, 26, 21)
      lens.buddyAt(46, 19, 26, 21)
    }
  }

  private var lens: some View {
    RoundedRectangle(cornerRadius: 10)
      .fill(Color(red: 214 / 255, green: 236 / 255, blue: 1, opacity: 0.16))
      .overlay(Rectangle().fill(Color.white.opacity(0.55)).frame(width: 5).rotationEffect(.degrees(32)).offset(x: -3))
      .clipShape(RoundedRectangle(cornerRadius: 10))
      .overlay(RoundedRectangle(cornerRadius: 10).strokeBorder(frame, lineWidth: 3.5))
      .shadow(color: .black.opacity(0.45), radius: 2.5, y: 3)
  }
}

private struct BuddyCap: View {
  var body: some View {
    ZStack(alignment: .topLeading) {
      BuddyRoundedShape(tx: 38, ty: 32, bx: 10, by: 8)
        .fill(EllipticalGradient(colors: [Color(hex: 0x4F6B84), Color.buddyNavy, Color.buddyNavyDeep],
                                 center: UnitPoint(x: 0.3, y: 0.18), endRadiusFraction: 1.2))
        .overlay(alignment: .bottom) { Rectangle().fill(Color.buddyOrange.opacity(0.85)).frame(height: 3) }
        .clipShape(BuddyRoundedShape(tx: 38, ty: 32, bx: 10, by: 8))
        .buddyAt(6, -17, 76, 32)
      Ellipse().fill(LinearGradient(colors: [Color(hex: 0x2D3E4F), Color(hex: 0x141E28)], startPoint: .top, endPoint: .bottom))
        .rotationEffect(.degrees(-5)).shadow(color: .black.opacity(0.5), radius: 3, y: 4)
        .buddyAt(44, 7, 56, 11)
      Circle().fill(buddyOrangeFill).shadow(color: Color.buddyOrange.opacity(0.7), radius: 3).buddyAt(37, -7, 13, 13)
    }
  }
}

private struct BuddyBackCap: View {
  let fill: Color

  var body: some View {
    ZStack(alignment: .topLeading) {
      Ellipse().fill(LinearGradient(colors: [Color(hex: 0x2D3E4F), Color(hex: 0x0F1822)], startPoint: .top, endPoint: .bottom))
        .rotationEffect(.degrees(-24)).buddyAt(54, -16, 46, 11)
      BuddyRoundedShape(tx: 38, ty: 32, bx: 10, by: 8)
        .fill(EllipticalGradient(colors: [Color.buddyOrange300, Color.buddyOrange, Color(hex: 0xB83000)],
                                 center: UnitPoint(x: 0.3, y: 0.18), endRadiusFraction: 1.2))
        .overlay(alignment: .bottom) { Rectangle().fill(Color.buddyNavy).frame(height: 3) }
        .clipShape(BuddyRoundedShape(tx: 38, ty: 32, bx: 10, by: 8))
        .buddyAt(6, -17, 76, 32)
      BuddyRoundedShape(tx: 11, ty: 11, bx: 0, by: 0).fill(fill)
        .overlay(BuddyRoundedShape(tx: 11, ty: 11, bx: 0, by: 0).stroke(Color.buddyNavy, lineWidth: 3))
        .buddyAt(33, 1, 22, 14)
      RoundedRectangle(cornerRadius: 2).fill(Color.buddyNavy).buddyAt(30, 12, 28, 3.5)
      BuddyRoundedShape(tx: 5, ty: 3, bx: 2, by: 2).fill(Color.buddyNavy).buddyAt(39, -20, 10, 6)
    }
  }
}

// polygon(0 100%, 0 28%, 24% 58%, 50% 0, 76% 58%, 100% 28%, 100% 100%)
private struct BuddyCrownShape: Shape {
  func path(in r: CGRect) -> Path {
    let pts: [(CGFloat, CGFloat)] = [(0, 1), (0, 0.28), (0.24, 0.58), (0.5, 0), (0.76, 0.58), (1, 0.28), (1, 1)]
    var p = Path()
    for (i, pt) in pts.enumerated() {
      let point = CGPoint(x: r.minX + r.width * pt.0, y: r.minY + r.height * pt.1)
      if i == 0 { p.move(to: point) } else { p.addLine(to: point) }
    }
    p.closeSubpath()
    return p
  }
}

private struct BuddyCrown: View {
  var body: some View {
    ZStack(alignment: .topLeading) {
      BuddyCrownShape()
        .fill(LinearGradient(colors: [Color(hex: 0xFFE7A3), Color(hex: 0xFFC94D), Color(hex: 0xD9952B)], startPoint: .top, endPoint: .bottom))
        .buddyAt(21, -28, 46, 30)
      ForEach(0..<3, id: \.self) { i in
        Circle().fill(Color.buddyOrange).shadow(color: Color.buddyOrange, radius: 2)
          .buddyAt(28 + CGFloat(i) * 13, -7, 6, 6)
      }
    }
  }
}

private struct BuddyHalo: View {
  var body: some View {
    Ellipse()
      .strokeBorder(Color.buddyOrange300, lineWidth: 3)
      .shadow(color: Color.buddyOrange, radius: 6)
      .buddyAt(17, -30, 54, 14)
  }
}
