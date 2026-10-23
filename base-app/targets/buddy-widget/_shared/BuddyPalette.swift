// Cores do Pace Buddy — as mesmas do design (BUDDY_COLORS no app).
import SwiftUI

extension Color {
  init(hex: UInt32, alpha: Double = 1) {
    self.init(
      .sRGB,
      red: Double((hex >> 16) & 0xFF) / 255,
      green: Double((hex >> 8) & 0xFF) / 255,
      blue: Double(hex & 0xFF) / 255,
      opacity: alpha
    )
  }

  static let buddyOrange = Color(hex: 0xFD5A0C)
  static let buddyOrange300 = Color(hex: 0xFF9A5C)
  static let buddyOrange400 = Color(hex: 0xFF7A2E)
  static let buddyOrange200 = Color(hex: 0xFFC29E)
  static let buddyInk = Color(hex: 0x0B1520)
  static let buddyNavy = Color(hex: 0x1B2733)
  static let buddyNavyDeep = Color(hex: 0x0A1220)
  static let buddyOnline = Color(hex: 0x3BE27E)
}

struct BuddyPalette {
  let name: String
  // Degradê do corpo: brilho → sombra
  let body: [Color]
  let shade: Color
  var metal: [Color]? = nil
  var glow: Color? = nil
  var ink: Color? = nil
  var spark = false
  var isTier = false

  static func of(_ id: String) -> BuddyPalette { all[id] ?? all["branco"]! }

  static let all: [String: BuddyPalette] = [
    "branco": BuddyPalette(
      name: "Branco", body: [Color(hex: 0xFFFFFF), Color(hex: 0xF8F9FB), Color(hex: 0xE4E8EE), Color(hex: 0xC7CED8)],
      shade: Color(red: 128 / 255, green: 140 / 255, blue: 160 / 255, opacity: 0.32)),
    "lilas": BuddyPalette(
      name: "Lilás", body: [Color(hex: 0xD6D0FF), Color(hex: 0xB3A8FF), Color(hex: 0x8F80F2), Color(hex: 0x6E5CD9)],
      shade: Color(red: 70 / 255, green: 50 / 255, blue: 170 / 255, opacity: 0.35)),
    "azul": BuddyPalette(
      name: "Azul", body: [Color(hex: 0xBDE6FF), Color(hex: 0x7FCBFF), Color(hex: 0x4AAEF5), Color(hex: 0x2589D6)],
      shade: Color(red: 20 / 255, green: 80 / 255, blue: 160 / 255, opacity: 0.35)),
    "verde": BuddyPalette(
      name: "Verde", body: [Color(hex: 0xB5F5D3), Color(hex: 0x73E0A6), Color(hex: 0x45C786), Color(hex: 0x2BA067)],
      shade: Color(red: 20 / 255, green: 110 / 255, blue: 60 / 255, opacity: 0.35)),
    "amarelo": BuddyPalette(
      name: "Amarelo", body: [Color(hex: 0xFFE3A3), Color(hex: 0xFFCB5C), Color(hex: 0xF7B031), Color(hex: 0xD98E14)],
      shade: Color(red: 150 / 255, green: 90 / 255, blue: 0, opacity: 0.35)),
    "bronze": BuddyPalette(
      name: "Bronze", body: [Color(hex: 0xF8D2AE), Color(hex: 0xD9884E), Color(hex: 0xA9602E), Color(hex: 0x6E3A18)],
      shade: Color(red: 80 / 255, green: 35 / 255, blue: 10 / 255, opacity: 0.5),
      metal: [Color(hex: 0xFFE6CC), Color(hex: 0xF0A86A), Color(hex: 0x7A3A12), Color(hex: 0x52250A), Color(hex: 0xF09A5C), Color(hex: 0xA2552A)],
      glow: Color(red: 217 / 255, green: 136 / 255, blue: 78 / 255, opacity: 0.6), ink: Color(hex: 0xF2B98A), isTier: true),
    "prata": BuddyPalette(
      name: "Prata", body: [Color(hex: 0xFFFFFF), Color(hex: 0xDDE4EC), Color(hex: 0xA9B6C4), Color(hex: 0x6F7D8C)],
      shade: Color(red: 60 / 255, green: 72 / 255, blue: 88 / 255, opacity: 0.5),
      metal: [Color(hex: 0xFFFFFF), Color(hex: 0xE9EEF3), Color(hex: 0x6C7885), Color(hex: 0x3A4450), Color(hex: 0xEEF2F6), Color(hex: 0x9FAAB5)],
      glow: Color(red: 201 / 255, green: 211 / 255, blue: 222 / 255, opacity: 0.6), ink: Color(hex: 0xDDE4EC), isTier: true),
    "ouro": BuddyPalette(
      name: "Ouro", body: [Color(hex: 0xFFF6CC), Color(hex: 0xFFD45C), Color(hex: 0xE0A526), Color(hex: 0x9A6410)],
      shade: Color(red: 110 / 255, green: 70 / 255, blue: 0, opacity: 0.5),
      metal: [Color(hex: 0xFFFCE8), Color(hex: 0xFFE27A), Color(hex: 0x9A6400), Color(hex: 0x6E4300), Color(hex: 0xFFD23F), Color(hex: 0xC98A0B)],
      glow: Color(red: 1, green: 201 / 255, blue: 77 / 255, opacity: 0.75), ink: Color(hex: 0xFFD45C), spark: true, isTier: true),
  ]

  // Corpo: radial-gradient(130% 110% at 30% 12%, c0 0%, c1 38%, c2 68%, c3 100%)
  var bodyFill: AnyShapeStyle {
    if let metal {
      // Cromado: faixas metálicas (linear 178°) com brilho por cima
      return AnyShapeStyle(LinearGradient(
        stops: [
          .init(color: metal[0], location: 0), .init(color: metal[1], location: 0.3),
          .init(color: metal[2], location: 0.46), .init(color: metal[3], location: 0.53),
          .init(color: metal[4], location: 0.72), .init(color: metal[5], location: 1),
        ],
        startPoint: .top, endPoint: .bottom))
    }
    return AnyShapeStyle(EllipticalGradient(
      stops: [
        .init(color: body[0], location: 0), .init(color: body[1], location: 0.38),
        .init(color: body[2], location: 0.68), .init(color: body[3], location: 1),
      ],
      center: UnitPoint(x: 0.3, y: 0.12), startRadiusFraction: 0, endRadiusFraction: 1.25))
  }

  // Mãos: radial-gradient(90% 70% at 34% 24%, …)
  var handFill: AnyShapeStyle {
    if let metal {
      return AnyShapeStyle(LinearGradient(colors: [metal[0], metal[1], metal[3], metal[5]], startPoint: .top, endPoint: .bottom))
    }
    return AnyShapeStyle(EllipticalGradient(
      stops: [
        .init(color: body[0], location: 0), .init(color: body[1], location: 0.45),
        .init(color: body[2], location: 0.85), .init(color: body[3], location: 1),
      ],
      center: UnitPoint(x: 0.34, y: 0.24), startRadiusFraction: 0, endRadiusFraction: 0.9))
  }
}

let buddyOrangeFill = LinearGradient(
  colors: [Color.buddyOrange300, Color.buddyOrange, Color(hex: 0xCD3600)],
  startPoint: .top, endPoint: .bottom)
