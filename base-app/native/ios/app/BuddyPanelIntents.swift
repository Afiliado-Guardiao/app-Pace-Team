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

// Correr sozinho / com a equipe: um toque e a corrida começa
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
    BuddyTimings.mark(withTeam ? "team" : "solo")
    BuddySound.close.play()
    let state = BuddyStore.state()
    // Um toque já começa (antes o 1º toque na equipe só mostrava quem estava
    // online, e ninguém tocava de novo). Quem está online aparece nos mini
    // Buddies em cima do cartão.
    guard BuddyRunTracker.hasAlwaysPermission else {
      BuddyPanelMode.set(.permission)
      BuddyPanelRefresh.now("permission.done")
      return .result()
    }
    BuddyPanelMode.set(.choose)
    await BuddyRunTracker.shared.start(withTeam: withTeam && state.hasTeam)
    BuddyPanelRefresh.now("run.done")
    return .result()
  }
}

// Pela voz ("E aí Siri, correr sozinho com o Bud"): começa direto e mostra o
// cartão já com a corrida (ou o pedido de permissão, se faltar)
@available(iOS 26.0, *)
struct StartSoloRunIntent: LiveActivityIntent {
  static let title: LocalizedStringResource = "Correr sozinho com o Bud"
  static let description = IntentDescription("Começa uma corrida sozinho, sem abrir o app.")
  static let openAppWhenRun = false

  init() {}

  func perform() async throws -> some IntentResult & ShowsSnippetIntent {
    BuddyPresencePing.now()
    _ = try await BuddyPanelRunIntent(withTeam: false).perform()
    return .result(snippetIntent: BuddyPanelSnippetIntent())
  }
}

@available(iOS 26.0, *)
struct StartTeamRunIntent: LiveActivityIntent {
  static let title: LocalizedStringResource = "Correr com a equipe"
  static let description = IntentDescription("Começa uma corrida com a equipe, sem abrir o app.")
  static let openAppWhenRun = false

  init() {}

  func perform() async throws -> some IntentResult & ShowsSnippetIntent {
    BuddyPresencePing.now()
    _ = try await BuddyPanelRunIntent(withTeam: true).perform()
    return .result(snippetIntent: BuddyPanelSnippetIntent())
  }
}

@available(iOS 26.0, *)
struct BuddyPanelFinishIntent: LiveActivityIntent {
  static let title: LocalizedStringResource = "Encerrar a corrida do Pace Buddy"
  static let isDiscoverable = false

  init() {}

  func perform() async throws -> some IntentResult {
    BuddyTimings.mark("finish")
    BuddySound.close.play()
    await BuddyRunTracker.shared.finish(goalReached: false)
    BuddyPanelMode.set(.choose)
    BuddyPanelRefresh.now("finish.done")
    return .result()
  }
}

// Chamou o Buddy ou tocou no cartão: a equipe vê que ele está online (no
// máximo 1 aviso por minuto; o push "fulano está online" tem limite de 2 h)
enum BuddyPresencePing {
  private static let key = "buddyPingAt"
  private static let every: TimeInterval = 60

  static func now() {
    let at = Date().timeIntervalSince1970
    let last = BuddyStore.defaults?.double(forKey: key) ?? 0
    if at - last < every { return }
    BuddyStore.defaults?.set(at, forKey: key)
    Task.detached { await BuddySupabase.pingOnline() }
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
