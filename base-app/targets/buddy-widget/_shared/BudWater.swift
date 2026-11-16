// PACE HYDRATION (Team Pro) fora do app: a água do dia que o app grava no
// App Group (IBuddyWater em sharedState.ts), a barrinha do cartão do Bud e a
// resposta da Siri ("E aí Siri, pergunte ao Bud quanto de água eu tenho que beber").
import SwiftUI

// Mesmo formato de IBuddyWater (app). Mudou lá, muda aqui.
struct BuddyWater: Codable, Hashable {
  // nil = orientação médica sobre líquidos (sem meta, só o registro)
  var goalMl: Double?
  var drankMl: Double
  // Início do dia (ms) em que esses números valem
  var day: Double
  var isThirsty: Bool

  var remainingMl: Double { max(0, (goalMl ?? 0) - drankMl) }
  var progress: Double {
    guard let goalMl, goalMl > 0 else { return 0 }
    return min(1, drankMl / goalMl)
  }
}

extension BuddyState {
  // Água de hoje: se o dia virou e o app ainda não abriu, o registro zera
  func waterToday(at date: Date) -> BuddyWater? {
    guard let water else { return nil }
    let start = Calendar.current.startOfDay(for: date).timeIntervalSince1970 * 1000
    if abs(water.day - start) < 60_000 { return water }
    return BuddyWater(goalMl: water.goalMl, drankMl: 0, day: start, isThirsty: false)
  }
}

enum BudWaterText {
  // "1,4 L" / "350 ml" (tela)
  static func short(_ ml: Double) -> String {
    ml >= 1000
      ? String(format: "%.1f L", ml / 1000).replacingOccurrences(of: ".", with: ",")
      : "\(Int(ml.rounded())) ml"
  }

  // "1,4 litro" / "2,6 litros" / "350 mililitros" (fala da Siri)
  static func spoken(_ ml: Double) -> String {
    if ml < 1000 { return "\(Int((ml / 50).rounded() * 50)) mililitros" }
    let liters = ml / 1000
    let text = String(format: "%.1f", liters).replacingOccurrences(of: ".", with: ",")
    return liters < 2 ? "\(text) litro" : "\(text) litros"
  }

  // Resposta da Siri (estimativa, nunca prescrição)
  static func answer(_ state: BuddyState, at date: Date) -> String {
    guard let w = state.waterToday(at: date) else {
      return "Isso é do PACE HYDRATION, do Team Pro. Abra o PACE TEAM para começar a acompanhar sua água."
    }
    guard let goal = w.goalMl else {
      return "Você marcou uma orientação médica sobre líquidos, então siga o que o seu médico indicou. Hoje você registrou \(spoken(w.drankMl))."
    }
    if w.remainingMl > 0 {
      return "Hoje a estimativa é de cerca de \(spoken(goal)). Você já registrou \(spoken(w.drankMl)). Faltam mais ou menos \(spoken(w.remainingMl)), aos poucos ao longo do dia."
    }
    return "Você já chegou na estimativa de hoje, cerca de \(spoken(goal)). Agora é beber conforme a sede."
  }

  // Linha da barrinha do cartão
  static func line(_ w: BuddyWater) -> String {
    guard let goal = w.goalMl else { return "Hoje: \(short(w.drankMl)) registrados" }
    if w.remainingMl <= 0 { return "\(short(w.drankMl)) de \(short(goal)) · estimativa batida" }
    return "\(short(w.drankMl)) de \(short(goal)) · faltam \(short(w.remainingMl))"
  }
}

// Barrinha de água do cartão do Bud (com o app fechado)
struct BudWaterBar: View {
  let water: BuddyWater
  private let tint = Color(hex: 0x8FD9FF)

  var body: some View {
    HStack(spacing: 8) {
      Image(systemName: water.isThirsty ? "drop.triangle.fill" : "drop.fill")
        .font(.system(size: 13, weight: .bold))
        .foregroundStyle(tint)
      VStack(alignment: .leading, spacing: 4) {
        GeometryReader { geo in
          ZStack(alignment: .leading) {
            Capsule().fill(Color.white.opacity(0.12))
            Capsule().fill(tint).frame(width: max(6, geo.size.width * water.progress))
          }
        }
        .frame(height: 6)
        Text(BudWaterText.line(water))
          .font(.system(size: 11, weight: .semibold))
          .foregroundStyle(.white.opacity(0.8))
      }
    }
    .padding(.horizontal, 4)
  }
}
