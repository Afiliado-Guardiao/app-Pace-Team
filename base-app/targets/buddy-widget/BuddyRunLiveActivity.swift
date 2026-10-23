// "Correndo · x / y km" na Dynamic Island e na tela bloqueada (a ilha do
// design). Ao bater a meta vira "Meta batida!" com o Buddy comemorando.
import ActivityKit
import AppIntents
import SwiftUI
import WidgetKit

private struct BuddyProgressBar: View {
  let value: Double

  var body: some View {
    GeometryReader { geo in
      ZStack(alignment: .leading) {
        Capsule().fill(Color.white.opacity(0.14))
        Capsule()
          .fill(LinearGradient(colors: [Color.buddyOrange, Color(hex: 0xFF8A45), Color(hex: 0xFFE3D1)], startPoint: .leading, endPoint: .trailing))
          .frame(width: geo.size.width * min(1, max(0, value)))
      }
    }
    .frame(height: 4)
  }
}

private struct BuddyMiniRing: View {
  var body: some View {
    Circle()
      .trim(from: 0, to: 0.78)
      .stroke(AngularGradient(colors: [Color.buddyOrange.opacity(0), Color.buddyOrange, Color(hex: 0xFFE3D1)], center: .center),
              style: StrokeStyle(lineWidth: 3, lineCap: .round))
      .frame(width: 16, height: 16)
  }
}

private struct BuddyRunLockScreen: View {
  let context: ActivityViewContext<BuddyRunAttributes>

  private var progress: Double { context.state.km / max(0.1, context.attributes.goalKm) }

  var body: some View {
    HStack(spacing: 12) {
      BuddyView(color: context.attributes.color, accessories: context.attributes.accessories,
                pose: context.state.isDone ? .celebrate : .run)
        .scaleEffect(0.5).frame(width: 70, height: 68)
      VStack(alignment: .leading, spacing: 6) {
        if context.state.isDone {
          let speech = BuddySpeech.celebrate(km: context.attributes.goalKm, withTeam: context.attributes.withTeam,
                                             teamName: context.attributes.teamName)
          Text(speech.title).font(.system(size: 16, weight: .heavy)).foregroundStyle(.white)
          Text(speech.subtitle).font(.system(size: 12, weight: .medium)).foregroundStyle(.white.opacity(0.74))
          if let unlocked = context.state.unlocked {
            Text("Novo: \(unlocked)").font(.system(size: 11, weight: .bold)).foregroundStyle(Color.buddyOrange300)
          }
        } else {
          HStack {
            Text(context.attributes.withTeam ? "Correndo com a equipe" : "Correndo")
              .font(.system(size: 13, weight: .semibold)).foregroundStyle(.white)
            Spacer()
            Text(context.attributes.startedAt, style: .timer)
              .font(.system(size: 12, weight: .semibold).monospacedDigit()).foregroundStyle(.white.opacity(0.62))
          }
          Text("\(buddyKm(context.state.km)) / \(buddyGoalLabel(context.attributes.goalKm)) km")
            .font(.system(size: 20, weight: .bold).monospacedDigit()).foregroundStyle(Color.buddyOrange400)
          BuddyProgressBar(value: progress)
        }
      }
    }
    .padding(14)
    .activityBackgroundTint(Color(hex: 0x0A1220))
    .activitySystemActionForegroundColor(Color.buddyOrange)
  }
}

struct BuddyRunLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: BuddyRunAttributes.self) { context in
      BuddyRunLockScreen(context: context)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          BuddyView(color: context.attributes.color, accessories: context.attributes.accessories,
                    pose: context.state.isDone ? .celebrate : .run)
            .scaleEffect(0.42).frame(width: 59, height: 57)
        }
        DynamicIslandExpandedRegion(.trailing) {
          VStack(alignment: .trailing, spacing: 2) {
            Text("\(buddyKm(context.state.km)) km")
              .font(.system(size: 18, weight: .bold).monospacedDigit()).foregroundStyle(Color.buddyOrange400)
            Text("meta \(buddyGoalLabel(context.attributes.goalKm)) km")
              .font(.system(size: 11, weight: .semibold)).foregroundStyle(.white.opacity(0.62))
          }
        }
        DynamicIslandExpandedRegion(.bottom) {
          if context.state.isDone {
            Text("Meta batida! Cada km conta.").font(.system(size: 13, weight: .bold)).foregroundStyle(.white)
          } else {
            VStack(spacing: 8) {
              BuddyProgressBar(value: context.state.km / max(0.1, context.attributes.goalKm))
              Button(intent: FinishBuddyRunIntent()) {
                Label("Encerrar", systemImage: "stop.fill").font(.system(size: 12, weight: .bold))
              }
              .tint(Color.buddyOrange)
            }
          }
        }
      } compactLeading: {
        HStack(spacing: 6) {
          BuddyMiniRing()
          Text("Correndo").font(.system(size: 11.5, weight: .semibold)).foregroundStyle(.white)
        }
      } compactTrailing: {
        Text("\(buddyKm(context.state.km))/\(buddyGoalLabel(context.attributes.goalKm)) km")
          .font(.system(size: 12, weight: .bold).monospacedDigit())
          .foregroundStyle(Color.buddyOrange400)
      } minimal: {
        BuddyMiniRing()
      }
      .keylineTint(Color.buddyOrange)
    }
  }
}
