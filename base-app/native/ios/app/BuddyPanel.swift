// Cartão interativo do Pace Buddy (iOS 26): o "Chamar Pace Buddy" do Toque
// Traseiro abre este cartão por cima da tela, igual ao painel do design
// (Pace Buddy.dc.html): o Buddy, os mini Buddies de quem está online, a fala,
// "Correr sozinho", "Correr com a equipe", a meta ‹ km › e "Agora não".
// Cada botão roda uma intent e o iOS redesenha o cartão em seguida.
import AppIntents
import SwiftUI

// Momento do cartão, guardado no App Group entre um toque e outro
enum BuddyPanelMode: String {
  case choose, team, bye, permission

  private static let key = "buddyPanelMode"

  static var current: BuddyPanelMode {
    BuddyPanelMode(rawValue: BuddyStore.defaults?.string(forKey: key) ?? "") ?? .choose
  }

  static func set(_ mode: BuddyPanelMode) {
    BuddyStore.defaults?.set(mode.rawValue, forKey: key)
  }
}

struct BuddyPanelModel {
  let state: BuddyState
  let mode: BuddyPanelMode
  let online: [String]
  let isRunning: Bool

  // Falas do painel do design (renderVals → spT / spS)
  var speech: BuddySpeech {
    let base = BuddySpeech.now(state)
    if isRunning { return base }
    switch mode {
    case .bye:
      return BuddySpeech(title: "Tchau!", subtitle: "Dois toques atrás e eu volto.", pose: .wave)
    case .permission:
      return BuddySpeech(
        title: "Falta uma permissão",
        subtitle: "Abra o PACE TEAM › Seu Buddy e permita a localização \"Sempre\".", pose: .idle)
    case .team where base.pose != .sick:
      let count = online.count
      let title = count == 0 ? "Ninguém online agora"
        : count == 1 ? "1 companheiro online" : "\(count) companheiros online"
      let subtitle = count == 0 ? "Toque de novo pra correr mesmo assim." : "Toque de novo pra sair correndo com eles."
      return BuddySpeech(title: title, subtitle: subtitle, pose: .excited)
    default:
      return base
    }
  }
}

// MARK: - Intents

@available(iOS 26.0, *)
struct BuddyPanelSnippetIntent: SnippetIntent {
  static let title: LocalizedStringResource = "Pace Buddy"
  static let isDiscoverable = false

  init() {}

  func perform() async throws -> some IntentResult & ShowsSnippetView {
    let mode = BuddyPanelMode.current
    let online = mode == .team ? await BuddySupabase.teamOnline() : []
    let model = BuddyPanelModel(
      state: BuddyStore.state(), mode: mode, online: online, isRunning: BuddyRunTracker.shared.isRunning)
    return .result(view: BuddyPanelView(model: model))
  }
}

// "Chamar Pace Buddy" — o atalho que o usuário liga no Toque Traseiro
@available(iOS 26.0, *)
struct CallBuddyIntent: AppIntent {
  static let title: LocalizedStringResource = "Chamar Pace Buddy"
  static let description = IntentDescription("Dois toques atrás do celular e o Pace Buddy aparece para correr, sem abrir o app.")
  static let openAppWhenRun = false

  init() {}

  func perform() async throws -> some IntentResult & ShowsSnippetIntent {
    BuddyPanelMode.set(.choose)
    return .result(snippetIntent: BuddyPanelSnippetIntent())
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
struct BuddyPanelKmIntent: AppIntent {
  static let title: LocalizedStringResource = "Mudar a meta do Pace Buddy"
  static let isDiscoverable = false

  @Parameter(title: "Mudança", default: 1)
  var delta: Int

  init() {}

  init(delta: Int) {
    self.delta = delta
  }

  func perform() async throws -> some IntentResult {
    if BuddyPanelMode.current != .team { BuddyPanelMode.set(.choose) }
    BuddyStore.setKmIdx(BuddyStore.state().kmIdx + delta)
    BuddyStore.reloadWidgets()
    return .result()
  }
}

@available(iOS 26.0, *)
struct BuddyPanelDismissIntent: AppIntent {
  static let title: LocalizedStringResource = "Dispensar o Pace Buddy"
  static let isDiscoverable = false

  init() {}

  func perform() async throws -> some IntentResult {
    BuddyPanelMode.set(.bye)
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

@available(iOS 26.0, *)
struct BuddyShortcuts: AppShortcutsProvider {
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: CallBuddyIntent(),
      phrases: ["Chamar Pace Buddy no \(.applicationName)", "Pace Buddy no \(.applicationName)"],
      shortTitle: "Chamar Pace Buddy",
      systemImageName: "figure.run"
    )
  }
}

// MARK: - Views

@available(iOS 26.0, *)
struct BuddyPanelView: View {
  let model: BuddyPanelModel

  private var speech: BuddySpeech { model.speech }
  private var palette: BuddyPalette { BuddyPalette.of(model.state.color) }

  var body: some View {
    VStack(spacing: -6) {
      ZStack(alignment: .topLeading) {
        BuddyView(color: model.state.color, accessories: model.state.accessories, pose: speech.pose)
          .scaleEffect(0.86)
          .frame(width: 140, height: 120)
        if model.mode == .team && !model.online.isEmpty {
          BuddyTeamRow(names: model.online).offset(x: 120, y: 92)
        }
      }
      .frame(maxWidth: .infinity)
      .zIndex(1)

      VStack(spacing: 10) {
        header
        VStack(spacing: 2) {
          Text(speech.title)
            .font(.system(size: 16, weight: .heavy))
            .foregroundStyle(.white)
          Text(speech.subtitle)
            .font(.system(size: 12.5, weight: .medium))
            .foregroundStyle(.white.opacity(0.72))
        }
        .multilineTextAlignment(.center)
        .padding(.top, 2)

        if model.isRunning {
          runningActions
        } else if model.mode == .bye {
          EmptyView()
        } else {
          chooseActions
        }
      }
      .padding(.horizontal, 12)
      .padding(.top, 12)
      .padding(.bottom, 8)
      .background(panelBackground)
    }
    .padding(.horizontal, 4)
    .padding(.bottom, 4)
  }

  private var header: some View {
    HStack(spacing: 6) {
      BuddyWordmark()
      Spacer(minLength: 0)
      if palette.isTier {
        HStack(spacing: 4) {
          Image(systemName: "medal.fill").font(.system(size: 9, weight: .bold))
          Text(palette.name.uppercased()).font(.system(size: 9, weight: .bold)).tracking(1.1)
        }
        .foregroundStyle(palette.ink ?? .white)
        .padding(.horizontal, 8)
        .frame(height: 18)
        .background(Capsule().fill(Color.buddyNavyDeep.opacity(0.55)))
        .overlay(Capsule().stroke(palette.ink ?? .white, lineWidth: 1))
      }
    }
  }

  private var chooseActions: some View {
    VStack(spacing: 4) {
      HStack(spacing: 6) {
        Button(intent: BuddyPanelRunIntent(withTeam: false)) {
          BuddyChoiceTile(icon: "figure.run", label: "Correr\nsozinho", isActive: false)
        }
        .buttonStyle(.plain)
        Button(intent: BuddyPanelRunIntent(withTeam: true)) {
          BuddyChoiceTile(
            icon: "person.3.fill",
            label: model.mode == .team ? "Toque de novo\npra sair" : "Correr com\na equipe",
            isActive: model.mode == .team)
        }
        .buttonStyle(.plain)
        BuddyGoalTile(km: model.state.goalKm)
          .frame(maxWidth: .infinity)
          .layoutPriority(1)
      }
      Button(intent: BuddyPanelDismissIntent()) {
        Text("Agora não")
          .font(.system(size: 11.5, weight: .semibold))
          .foregroundStyle(.white.opacity(0.72))
          .padding(.horizontal, 10)
          .padding(.vertical, 5)
      }
      .buttonStyle(.plain)
    }
  }

  private var runningActions: some View {
    Button(intent: BuddyPanelFinishIntent()) {
      Text("Encerrar corrida")
        .font(.system(size: 12.5, weight: .bold))
        .foregroundStyle(.white)
        .padding(.horizontal, 18)
        .frame(height: 34)
        .background(Capsule().fill(Color.white.opacity(0.12)))
        .overlay(Capsule().stroke(Color.white.opacity(0.18), lineWidth: 1))
    }
    .buttonStyle(.plain)
    .padding(.bottom, 4)
  }

  // Vidro escuro com borda clara (.pt-glass .pt-rim)
  private var panelBackground: some View {
    RoundedRectangle(cornerRadius: 26, style: .continuous)
      .fill(LinearGradient(
        colors: [Color.buddyNavy.opacity(0.92), Color.buddyNavyDeep.opacity(0.96)],
        startPoint: .top, endPoint: .bottom))
      .overlay(
        RoundedRectangle(cornerRadius: 26, style: .continuous)
          .stroke(LinearGradient(
            colors: [.white.opacity(0.55), .white.opacity(0.08), .white.opacity(0.3)],
            startPoint: .topLeading, endPoint: .bottomTrailing), lineWidth: 1.2))
  }
}

// "PACE TEAM" em texto (o logo em imagem só existe no alvo do widget)
@available(iOS 26.0, *)
private struct BuddyWordmark: View {
  var body: some View {
    HStack(spacing: 3) {
      Text("PACE").font(.system(size: 11, weight: .black)).italic().foregroundStyle(.white)
      Text("TEAM").font(.system(size: 11, weight: .black)).italic().foregroundStyle(Color.buddyOrange)
    }
  }
}

@available(iOS 26.0, *)
private struct BuddyChoiceTile: View {
  let icon: String
  let label: String
  let isActive: Bool

  var body: some View {
    VStack(spacing: 5) {
      ZStack {
        Circle().fill(LinearGradient(
          colors: [Color.buddyOrange400, Color.buddyOrange], startPoint: .top, endPoint: .bottom))
        Image(systemName: icon).font(.system(size: 12, weight: .bold)).foregroundStyle(.white)
      }
      .frame(width: 26, height: 26)
      .shadow(color: Color.buddyOrange.opacity(0.55), radius: 6)
      Text(label)
        .font(.system(size: 10, weight: .bold))
        .multilineTextAlignment(.center)
        .foregroundStyle(isActive ? Color.buddyOrange200 : .white)
        .lineLimit(2)
        .minimumScaleFactor(0.8)
    }
    .frame(maxWidth: .infinity)
    .frame(height: 66)
    .background(RoundedRectangle(cornerRadius: 16, style: .continuous)
      .fill(isActive ? Color.buddyOrange.opacity(0.2) : Color.white.opacity(0.08)))
    .overlay(RoundedRectangle(cornerRadius: 16, style: .continuous)
      .stroke(isActive ? Color.buddyOrange : Color.white.opacity(0.16), lineWidth: isActive ? 1.5 : 1))
  }
}

@available(iOS 26.0, *)
private struct BuddyGoalTile: View {
  let km: Double

  var body: some View {
    VStack(spacing: 8) {
      Text("META")
        .font(.system(size: 9, weight: .bold))
        .tracking(1.4)
        .foregroundStyle(.white.opacity(0.6))
      HStack(spacing: 0) {
        Button(intent: BuddyPanelKmIntent(delta: -1)) {
          Image(systemName: "chevron.left")
            .font(.system(size: 13, weight: .bold))
            .foregroundStyle(Color.buddyOrange400)
            .frame(width: 22, height: 26)
        }
        .buttonStyle(.plain)
        HStack(alignment: .firstTextBaseline, spacing: 2) {
          Text(buddyGoalLabel(km)).font(.system(size: 16, weight: .bold)).monospacedDigit()
          Text("km").font(.system(size: 11, weight: .semibold)).foregroundStyle(.white.opacity(0.6))
        }
        .foregroundStyle(.white)
        .frame(minWidth: 40)
        .lineLimit(1)
        Button(intent: BuddyPanelKmIntent(delta: 1)) {
          Image(systemName: "chevron.right")
            .font(.system(size: 13, weight: .bold))
            .foregroundStyle(Color.buddyOrange400)
            .frame(width: 22, height: 26)
        }
        .buttonStyle(.plain)
      }
    }
    .frame(height: 66)
    .frame(maxWidth: .infinity)
    .background(RoundedRectangle(cornerRadius: 16, style: .continuous).fill(Color.white.opacity(0.08)))
    .overlay(RoundedRectangle(cornerRadius: 16, style: .continuous).stroke(Color.white.opacity(0.16), lineWidth: 1))
  }
}

// Mini Buddies de quem está online, com o pontinho verde (teamRow do design)
@available(iOS 26.0, *)
private struct BuddyTeamRow: View {
  let names: [String]

  private static let colors = ["lilas", "azul", "verde", "amarelo", "branco"]

  var body: some View {
    HStack(spacing: 3) {
      ForEach(Array(names.prefix(5).enumerated()), id: \.offset) { index, _ in
        MiniTeamBuddy(color: Self.colors[index % Self.colors.count])
      }
    }
  }
}

@available(iOS 26.0, *)
private struct MiniTeamBuddy: View {
  let color: String

  var body: some View {
    let shades = BuddyPalette.of(color).body
    ZStack(alignment: .topLeading) {
      UnevenRoundedRectangle(
        topLeadingRadius: 10, bottomLeadingRadius: 8, bottomTrailingRadius: 8, topTrailingRadius: 10,
        style: .continuous)
        .fill(RadialGradient(colors: shades, center: UnitPoint(x: 0.3, y: 0.12), startRadius: 0, endRadius: 22))
        .frame(width: 20, height: 17)
        .offset(y: 2)
      HStack(spacing: 4) {
        Capsule().fill(Color.buddyInk).frame(width: 2.6, height: 4.2)
        Capsule().fill(Color.buddyInk).frame(width: 2.6, height: 4.2)
      }
      .frame(width: 20)
      .offset(y: 6)
      Circle()
        .fill(Color.buddyOnline)
        .frame(width: 6, height: 6)
        .overlay(Circle().stroke(Color.buddyNavyDeep, lineWidth: 1.5))
        .offset(x: -2)
    }
    .frame(width: 20, height: 19, alignment: .topLeading)
  }
}
