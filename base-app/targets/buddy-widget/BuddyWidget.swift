// Widget do Pace Buddy na tela inicial: o Buddy com a cor, o nível e os
// acessórios do app, a fala do painel e (no médio) os botões de correr.
// Fica doente sozinho quando passam 7 dias sem correr.
import AppIntents
import SwiftUI
import WidgetKit

struct BuddyEntry: TimelineEntry {
  let date: Date
  let state: BuddyState
}

struct BuddyProvider: TimelineProvider {
  func placeholder(in context: Context) -> BuddyEntry {
    BuddyEntry(date: Date(), state: .empty)
  }

  func getSnapshot(in context: Context, completion: @escaping (BuddyEntry) -> Void) {
    completion(BuddyEntry(date: Date(), state: BuddyStore.state()))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<BuddyEntry>) -> Void) {
    let state = BuddyStore.state()
    let now = Date()
    var entries = [BuddyEntry(date: now, state: state)]
    // Vira "doente" na hora certa, mesmo sem o app abrir
    if let sickAt = state.sickAt {
      let date = Date(timeIntervalSince1970: sickAt / 1000)
      if date > now { entries.append(BuddyEntry(date: date, state: state)) }
    }
    completion(Timeline(entries: entries, policy: .after(now.addingTimeInterval(6 * 3600))))
  }
}

struct BuddyWidgetView: View {
  @Environment(\.widgetFamily) private var family
  let entry: BuddyEntry

  private var speech: BuddySpeech { BuddySpeech.now(entry.state, date: entry.date) }

  var body: some View {
    Group {
      if family == .systemMedium { medium } else { small }
    }
    .containerBackground(for: .widget) {
      LinearGradient(colors: [Color(hex: 0x1B2733), Color(hex: 0x0A1220)], startPoint: .top, endPoint: .bottom)
    }
  }

  private var figure: some View {
    BuddyView(color: entry.state.color, accessories: entry.state.accessories, pose: speech.pose)
  }

  private var small: some View {
    VStack(spacing: 2) {
      figure.scaleEffect(0.62).frame(width: 87, height: 84)
      Text(speech.title)
        .font(.system(size: 13, weight: .heavy))
        .foregroundStyle(.white)
        .lineLimit(1)
        .minimumScaleFactor(0.7)
      Text(speech.subtitle)
        .font(.system(size: 9.5, weight: .medium))
        .foregroundStyle(.white.opacity(0.74))
        .multilineTextAlignment(.center)
        .lineLimit(2)
    }
    .widgetURL(URL(string: "paceteam://buddy"))
  }

  private var medium: some View {
    HStack(spacing: 10) {
      figure.scaleEffect(0.78).frame(width: 109, height: 106)
      VStack(alignment: .leading, spacing: 6) {
        Image("paceLogo").resizable().scaledToFit().frame(height: 12)
        Text(speech.title).font(.system(size: 15, weight: .heavy)).foregroundStyle(.white).lineLimit(1)
        Text(speech.subtitle).font(.system(size: 10.5, weight: .medium)).foregroundStyle(.white.opacity(0.74)).lineLimit(2)
        if BuddyStore.activeRun() == nil { actions }
      }
    }
  }

  private var actions: some View {
    HStack(spacing: 6) {
      Button(intent: StartBuddyRunIntent(withTeam: false)) {
        Label("Sozinho", systemImage: "figure.run").font(.system(size: 10, weight: .bold))
      }
      .tint(Color.buddyOrange)
      if entry.state.hasTeam {
        Button(intent: StartBuddyRunIntent(withTeam: true)) {
          Label("Equipe", systemImage: "person.3.fill").font(.system(size: 10, weight: .bold))
        }
        .tint(Color.buddyOrange)
      }
      HStack(spacing: 0) {
        Button(intent: ChangeBuddyKmIntent(delta: -1)) { Image(systemName: "chevron.left") }
          .buttonStyle(.plain)
        Text("\(buddyGoalLabel(entry.state.goalKm)) km")
          .font(.system(size: 11, weight: .bold).monospacedDigit())
          .foregroundStyle(.white)
          .frame(minWidth: 34)
        Button(intent: ChangeBuddyKmIntent(delta: 1)) { Image(systemName: "chevron.right") }
          .buttonStyle(.plain)
      }
      .font(.system(size: 11, weight: .bold))
      .foregroundStyle(Color.buddyOrange400)
    }
  }
}

struct BuddyWidget: Widget {
  let kind = "PaceBuddyWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BuddyProvider()) { entry in
      BuddyWidgetView(entry: entry)
    }
    .configurationDisplayName("Pace Buddy")
    .description("Seu Buddy na tela inicial: toque e saia correndo.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
