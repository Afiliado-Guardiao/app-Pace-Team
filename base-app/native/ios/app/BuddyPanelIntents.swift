// Modo do cartão do Pace Buddy (App Group), as intents que começam e
// encerram a corrida pelo cartão (rodam no app, onde ficam o GPS e o contador
// da Dynamic Island) e o aviso de que o app está aberto na tela.
import AppIntents
import Foundation

// Momento do cartão, guardado no App Group entre um toque e outro
enum BuddyPanelMode: String {
  case choose, team, bye, permission
  // App aberto: o Buddy vivo aparece dentro do app
  case inApp

  private static let key = "buddyPanelMode"

  static var current: BuddyPanelMode {
    BuddyPanelMode(rawValue: BuddyStore.defaults?.string(forKey: key) ?? "") ?? .choose
  }

  static func set(_ mode: BuddyPanelMode) {
    BuddyStore.defaults?.set(mode.rawValue, forKey: key)
  }
}

// Correr sozinho / com a equipe (o 1º toque na equipe mostra quem está online)
@available(iOS 26.0, *)
struct BuddyPanelRunIntent: LiveActivityIntent {
  static let title: LocalizedStringResource = "Correr com o Pace Buddy"
  static let isDiscoverable = false

  @Parameter(title: "Com a equipe", default: false)
  var withTeam: Bool

  init() {}

  init(withTeam: Bool) {
    self.withTeam = withTeam
  }

  func perform() async throws -> some IntentResult {
    let state = BuddyStore.state()
    if withTeam && state.hasTeam && BuddyPanelMode.current != .team {
      BuddyPanelMode.set(.team)
      BuddyPoke.show(.armsUp)
      return .result()
    }
    guard BuddyRunTracker.hasAlwaysPermission else {
      BuddyPanelMode.set(.permission)
      return .result()
    }
    BuddyPanelMode.set(.choose)
    await BuddyRunTracker.shared.start(withTeam: withTeam && state.hasTeam)
    return .result()
  }
}

@available(iOS 26.0, *)
struct BuddyPanelFinishIntent: LiveActivityIntent {
  static let title: LocalizedStringResource = "Encerrar a corrida do Pace Buddy"
  static let isDiscoverable = false

  init() {}

  func perform() async throws -> some IntentResult {
    await BuddyRunTracker.shared.finish(goalReached: false)
    BuddyPanelMode.set(.choose)
    return .result()
  }
}

// O app avisa no App Group que está aberto na tela (a cada 2 s). Com ele
// aberto, o "Chamar Pace Buddy" pede ao app o Buddy vivo em vez do cartão.
enum BuddyAppPresence {
  private static let activeKey = "buddyAppActiveAt"
  private static let panelKey = "buddyOpenPanelAt"
  // Sem aviso há mais que isso: o app foi para o fundo ou fechou
  private static let staleAfter: TimeInterval = 5

  static var isActive: Bool {
    guard let text = BuddyStore.defaults?.string(forKey: activeKey), let ms = Double(text) else { return false }
    return Date().timeIntervalSince1970 - ms / 1000 < staleAfter
  }

  // O app vê este pedido e abre o Buddy vivo por cima da tela
  static func requestPanel() {
    BuddyStore.defaults?.set(String(Int(Date().timeIntervalSince1970 * 1000)), forKey: panelKey)
  }
}
