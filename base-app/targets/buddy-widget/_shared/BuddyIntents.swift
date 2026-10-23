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
