// Atalho "Chamar Pace Buddy": é ele que o usuário liga no Toque Traseiro
// (Ajustes › Acessibilidade › Toque › Tocar Atrás). Roda sem abrir o app:
// o Buddy pergunta como você vai correr, começa a corrida e vai para a
// Dynamic Island.
import AppIntents
import SwiftUI

@available(iOS 17.0, *)
enum BuddyChoice: String, AppEnum {
  case solo, team, goal, later

  static let typeDisplayRepresentation: TypeDisplayRepresentation = "Escolha"
  static let caseDisplayRepresentations: [BuddyChoice: DisplayRepresentation] = [
    .solo: DisplayRepresentation(title: "Correr sozinho", image: .init(systemName: "figure.run")),
    .team: DisplayRepresentation(title: "Correr com a equipe", image: .init(systemName: "person.3.fill")),
    .goal: DisplayRepresentation(title: "Mudar a meta", image: .init(systemName: "flag.checkered")),
    .later: DisplayRepresentation(title: "Agora não", image: .init(systemName: "hand.wave")),
  ]
}

// Metas do seletor do design (1 a 42 km)
@available(iOS 17.0, *)
enum BuddyGoalOption: String, AppEnum {
  case k1, k2, k3, k5, k8, k10, k12, k15, k21, k42

  static let typeDisplayRepresentation: TypeDisplayRepresentation = "Meta"
  static let caseDisplayRepresentations: [BuddyGoalOption: DisplayRepresentation] = [
    .k1: "1 km", .k2: "2 km", .k3: "3 km", .k5: "5 km", .k8: "8 km",
    .k10: "10 km", .k12: "12 km", .k15: "15 km", .k21: "21 km", .k42: "42 km",
  ]

  var index: Int {
    [.k1, .k2, .k3, .k5, .k8, .k10, .k12, .k15, .k21, .k42].firstIndex(of: self) ?? 3
  }
}

// Cartão que aparece por cima da tela: o Buddy e a fala dele
@available(iOS 17.0, *)
struct BuddyCardView: View {
  let state: BuddyState
  let speech: BuddySpeech

  var body: some View {
    HStack(spacing: 12) {
      BuddyView(color: state.color, accessories: state.accessories, pose: speech.pose)
        .scaleEffect(0.6)
        .frame(width: 84, height: 81)
      VStack(alignment: .leading, spacing: 4) {
        Text(speech.title).font(.system(size: 17, weight: .heavy)).foregroundStyle(.white)
        Text(speech.subtitle).font(.system(size: 13, weight: .medium)).foregroundStyle(.white.opacity(0.74))
      }
      Spacer(minLength: 0)
    }
    .padding(14)
    .background(LinearGradient(colors: [Color(hex: 0x1B2733), Color(hex: 0x0A1220)], startPoint: .top, endPoint: .bottom))
  }
}

@available(iOS 17.0, *)
struct ShowBuddyIntent: LiveActivityIntent {
  static let title: LocalizedStringResource = "Chamar Pace Buddy"
  static let description = IntentDescription("Dois toques atrás do celular e o Pace Buddy aparece para correr, sem abrir o app.")
  static let openAppWhenRun = false

  @Parameter(title: "O que fazer")
  var choice: BuddyChoice?

  @Parameter(title: "Meta")
  var goal: BuddyGoalOption?

  init() {}

  func perform() async throws -> some IntentResult & ProvidesDialog & ShowsSnippetView {
    let state = BuddyStore.state()
    let tracker = BuddyRunTracker.shared
    if tracker.isRunning { return card(state, BuddySpeech.now(state)) }
    guard let choice else {
      let speech = BuddySpeech.now(state)
      throw $choice.needsValueError(IntentDialog(stringLiteral: "\(speech.title) \(speech.subtitle)"))
    }
    switch choice {
    case .later:
      return card(state, BuddySpeech(title: "Tchau!", subtitle: "Dois toques atrás e eu volto.", pose: .wave))
    case .goal:
      guard let goal else { throw $goal.needsValueError("Quantos km hoje?") }
      BuddyStore.setKmIdx(goal.index)
      BuddyStore.reloadWidgets()
      let next = BuddyStore.state()
      let label = buddyGoalLabel(next.goalKm)
      return card(next, BuddySpeech(title: "Meta: \(label) km", subtitle: "Dois toques atrás de novo e saia correndo.", pose: .excited))
    case .solo, .team:
      guard BuddyRunTracker.hasAlwaysPermission else {
        return card(state, BuddySpeech(
          title: "Falta uma permissão",
          subtitle: "Abra o PACE TEAM › Seu Buddy e permita a localização \"Sempre\".", pose: .idle))
      }
      let withTeam = choice == .team && state.hasTeam
      await tracker.start(withTeam: withTeam)
      let who = withTeam ? " com a equipe" : ""
      return card(state, BuddySpeech(
        title: "Bora!", subtitle: "Meta de \(buddyGoalLabel(state.goalKm)) km\(who). Tô na Dynamic Island.", pose: .run))
    }
  }

  private func card(_ state: BuddyState, _ speech: BuddySpeech) -> some IntentResult & ProvidesDialog & ShowsSnippetView {
    .result(dialog: IntentDialog(stringLiteral: speech.title), view: BuddyCardView(state: state, speech: speech))
  }
}

@available(iOS 17.0, *)
struct BuddyShortcuts: AppShortcutsProvider {
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: ShowBuddyIntent(),
      phrases: ["Chamar Pace Buddy no \(.applicationName)", "Pace Buddy no \(.applicationName)"],
      shortTitle: "Chamar Pace Buddy",
      systemImageName: "figure.run"
    )
  }
}
