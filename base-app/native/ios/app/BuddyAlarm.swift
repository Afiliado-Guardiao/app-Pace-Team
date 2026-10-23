// Despertador de corrida do Buddy no iOS 26 (AlarmKit): toca como um alarme
// do sistema, mesmo no silencioso, com o botão "Correr agora" que começa a
// corrida pelo Buddy sem abrir o app. Em iOS mais antigo o app agenda uma
// notificação com som no lugar (src/lib/buddy/notifications.ts).
// O módulo PaceBuddy chama esta classe pelo nome (PaceBuddyAlarmBridge).
import Foundation
import SwiftUI
#if canImport(AlarmKit)
import AlarmKit
#endif

@objc(PaceBuddyAlarmBridge)
public final class PaceBuddyAlarmBridge: NSObject {
  @objc public static func schedule(_ json: String) {
    #if canImport(AlarmKit)
    if #available(iOS 26.0, *) {
      Task { await BuddyAlarmScheduler.schedule(json) }
    }
    #endif
  }

  @objc public static func cancel() {
    #if canImport(AlarmKit)
    if #available(iOS 26.0, *) {
      Task { await BuddyAlarmScheduler.cancelAll() }
    }
    #endif
  }
}

#if canImport(AlarmKit)
@available(iOS 26.0, *)
struct BuddyAlarmMetadata: AlarmMetadata {}

// Botão "Parar" do alarme
@available(iOS 26.0, *)
struct BuddyStopAlarmIntent: LiveActivityIntent {
  static let title: LocalizedStringResource = "Parar o despertador do Buddy"
  static let isDiscoverable = false

  @Parameter(title: "Alarme")
  var alarmID: String

  init() {
    alarmID = ""
  }

  init(alarmID: String) {
    self.alarmID = alarmID
  }

  func perform() async throws -> some IntentResult {
    if let id = UUID(uuidString: alarmID) { try? await AlarmManager.shared.stop(id: id) }
    return .result()
  }
}

@available(iOS 26.0, *)
enum BuddyAlarmScheduler {
  private static let idsKey = "buddyAlarmIds"
  private static let weekdays: [Locale.Weekday] = [.sunday, .monday, .tuesday, .wednesday, .thursday, .friday, .saturday]

  static func cancelAll() async {
    let ids = (BuddyStore.defaults?.stringArray(forKey: idsKey) ?? []).compactMap(UUID.init(uuidString:))
    for id in ids { try? await AlarmManager.shared.cancel(id: id) }
    BuddyStore.defaults?.removeObject(forKey: idsKey)
  }

  static func schedule(_ json: String) async {
    await cancelAll()
    guard let data = json.data(using: .utf8),
          let alarm = try? JSONDecoder().decode(BuddyAlarm.self, from: data),
          alarm.isOn, !alarm.days.isEmpty else { return }
    guard (try? await AlarmManager.shared.requestAuthorization()) == .authorized else { return }
    let days = alarm.days.compactMap { weekdays.indices.contains($0) ? weekdays[$0] : nil }
    let schedule = Alarm.Schedule.relative(.init(
      time: .init(hour: alarm.hour, minute: alarm.minute),
      repeats: .weekly(days)
    ))
    let alert = AlarmPresentation.Alert(
      title: "Hora de correr!",
      stopButton: AlarmButton(text: "Parar", textColor: .white, systemImageName: "stop.circle"),
      secondaryButton: AlarmButton(text: "Correr agora", textColor: .white, systemImageName: "figure.run"),
      secondaryButtonBehavior: .custom
    )
    let attributes = AlarmAttributes<BuddyAlarmMetadata>(
      presentation: AlarmPresentation(alert: alert),
      metadata: BuddyAlarmMetadata(),
      tintColor: Color.buddyOrange
    )
    let id = UUID()
    let configuration = AlarmManager.AlarmConfiguration(
      countdownDuration: nil,
      schedule: schedule,
      attributes: attributes,
      stopIntent: BuddyStopAlarmIntent(alarmID: id.uuidString),
      secondaryIntent: StartBuddyRunIntent(),
      sound: .default
    )
    do {
      _ = try await AlarmManager.shared.schedule(id: id, configuration: configuration)
      BuddyStore.defaults?.set([id.uuidString], forKey: idsKey)
    } catch {
      return
    }
  }
}
#endif
