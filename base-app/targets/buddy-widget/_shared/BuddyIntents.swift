// Ações do Buddy usadas pelo widget, pela Dynamic Island e pelo despertador.
// Ficam no app e no widget (pasta _shared); a corrida roda no processo do app.
import AppIntents
import Foundation

@available(iOS 17.0, *)
struct StartBuddyRunIntent: LiveActivityIntent {
  static let title: LocalizedStringResource = "Correr com o Pace Buddy"
  static let description = IntentDescription("Começa uma corrida com o Pace Buddy sem abrir o app.")
  static let isDiscoverable = false

  @Parameter(title: "Com a equipe", default: false)
  var withTeam: Bool

  init() {}

  init(withTeam: Bool) {
    self.withTeam = withTeam
  }

  func perform() async throws -> some IntentResult {
    guard BuddyRunTracker.hasAlwaysPermission else {
      BuddyNotifier.show("Falta uma permissão", "Abra o PACE TEAM › Seu Buddy e permita a localização \"Sempre\" para correr pelo atalho.")
      return .result()
    }
    await BuddyRunTracker.shared.start(withTeam: withTeam)
    return .result()
  }
}

@available(iOS 17.0, *)
struct FinishBuddyRunIntent: LiveActivityIntent {
  static let title: LocalizedStringResource = "Encerrar corrida do Pace Buddy"
  static let isDiscoverable = false

  init() {}

  func perform() async throws -> some IntentResult {
    await BuddyRunTracker.shared.finish(goalReached: false)
    return .result()
  }
}

// Setinhas da meta de km no widget
@available(iOS 17.0, *)
struct ChangeBuddyKmIntent: AppIntent {
  static let title: LocalizedStringResource = "Mudar a meta do Pace Buddy"
  static let isDiscoverable = false

  @Parameter(title: "Mudança", default: 1)
  var delta: Int

  init() {}

  init(delta: Int) {
    self.delta = delta
  }

  func perform() async throws -> some IntentResult {
    BuddyStore.setKmIdx(BuddyStore.state().kmIdx + delta)
    BuddyStore.reloadWidgets()
    return .result()
  }
}

// Toques no Buddy (widget e cartão do Toque Traseiro): cada toque troca o
// gesto, que fica um pouco na tela e depois ele volta ao normal
enum BuddyPoke {
  private static let countKey = "buddyPokeCount"
  private static let atKey = "buddyPokeAt"
  static let gestures: [BuddyPose] = [.wave, .wink, .armsUp, .excited, .tilt, .celebrate]
  static let showFor: TimeInterval = 90

  static func next() {
    let count = (BuddyStore.defaults?.integer(forKey: countKey) ?? 0) + 1
    BuddyStore.defaults?.set(count, forKey: countKey)
    BuddyStore.defaults?.set(Date().timeIntervalSince1970, forKey: atKey)
  }

  // Quando o gesto do último toque some
  static var endsAt: Date? {
    guard let at = BuddyStore.defaults?.double(forKey: atKey), at > 0 else { return nil }
    return Date(timeIntervalSince1970: at + showFor)
  }

  // Gesto do último toque, se ainda está na tela
  static func pose(at date: Date) -> BuddyPose? {
    guard let end = endsAt, date < end else { return nil }
    let count = BuddyStore.defaults?.integer(forKey: countKey) ?? 0
    return gestures[count % gestures.count]
  }
}

@available(iOS 17.0, *)
struct PokeBuddyIntent: AppIntent {
  static let title: LocalizedStringResource = "Cutucar o Pace Buddy"
  static let isDiscoverable = false

  init() {}

  func perform() async throws -> some IntentResult {
    BuddyPoke.next()
    BuddyStore.reloadWidgets()
    return .result()
  }
}
