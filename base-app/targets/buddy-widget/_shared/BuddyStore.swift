// Pace Buddy — memória compartilhada entre o app, o widget e o atalho
// (App Group). O app grava "buddyState" (src/lib/buddy/sharedState.ts);
// o lado nativo grava a corrida em andamento, a fila de corridas e a meta.
import Foundation
import WidgetKit

enum BuddyKeys {
  static let group = "group.com.paceteam.app"
  static let state = "buddyState"
  static let kmIdx = "buddyKmIdx"
  static let config = "buddyConfig"
  static let pendingRuns = "buddyPendingRuns"
  static let activeRun = "buddyActiveRun"
  static let goals = "buddyGoals"
}

struct BuddyAlarm: Codable, Hashable {
  var isOn: Bool
  var hour: Int
  var minute: Int
  var days: [Int]
}

struct BuddyNext: Codable, Hashable {
  var name: String
  var need: Int
}

// Mesmo formato de IBuddySharedState (app). Mudou lá, muda aqui.
struct BuddyState: Codable, Hashable {
  var version: Int
  var userName: String
  var teamName: String
  var isLeader: Bool
  var rank: String
  var color: String
  var accessories: [String]
  var goals: Int
  var next: BuddyNext?
  var kms: [Double]
  var kmIdx: Int
  var lastRunAt: Double?
  var sickAt: Double?
  var alarm: BuddyAlarm

  static let empty = BuddyState(
    version: 1, userName: "", teamName: "", isLeader: false, rank: "none",
    color: "branco", accessories: [], goals: 0, next: BuddyNext(name: "Faixa", need: 3),
    kms: [1, 2, 3, 5, 8, 10, 12, 15, 21, 42], kmIdx: 3, lastRunAt: nil, sickAt: nil,
    alarm: BuddyAlarm(isOn: false, hour: 6, minute: 0, days: [1, 2, 3, 4, 5])
  )

  var hasTeam: Bool { !teamName.trimmingCharacters(in: .whitespaces).isEmpty }
  var goalKm: Double { kms.indices.contains(kmIdx) ? kms[kmIdx] : 5 }

  func isSick(at date: Date) -> Bool {
    guard let sickAt else { return false }
    return date.timeIntervalSince1970 * 1000 >= sickAt
  }
}

// Corrida que ainda não chegou ao servidor (o app envia ao abrir)
struct BuddyPendingRun: Codable {
  var mode: String
  var seconds: Double
  var km: Double
  // ms desde 1970
  var finishedAt: Double
  var route: [[Double]]
  var goalReached: Bool
}

// Corrida em andamento pelo Buddy (sobrevive ao widget recarregar)
struct BuddyActiveRun: Codable {
  var startedAt: Double
  var goalKm: Double
  var withTeam: Bool
  var meters: Double
  var route: [[Double]]
}

enum BuddyStore {
  static var defaults: UserDefaults? { UserDefaults(suiteName: BuddyKeys.group) }

  static func read<T: Decodable>(_ key: String, as type: T.Type) -> T? {
    guard let text = defaults?.string(forKey: key), let data = text.data(using: .utf8) else { return nil }
    return try? JSONDecoder().decode(type, from: data)
  }

  static func write<T: Encodable>(_ value: T, key: String) {
    guard let data = try? JSONEncoder().encode(value), let text = String(data: data, encoding: .utf8) else { return }
    defaults?.set(text, forKey: key)
  }

  static func state() -> BuddyState {
    var state = read(BuddyKeys.state, as: BuddyState.self) ?? .empty
    // Meta trocada no widget/atalho depois da última gravação do app
    if let text = defaults?.string(forKey: BuddyKeys.kmIdx), let idx = Int(text), state.kms.indices.contains(idx) {
      state.kmIdx = idx
    }
    return state
  }

  static func setKmIdx(_ idx: Int) {
    let state = state()
    let clamped = max(0, min(state.kms.count - 1, idx))
    defaults?.set(String(clamped), forKey: BuddyKeys.kmIdx)
  }

  static func activeRun() -> BuddyActiveRun? { read(BuddyKeys.activeRun, as: BuddyActiveRun.self) }
  static func saveActiveRun(_ run: BuddyActiveRun?) {
    guard let run else {
      defaults?.removeObject(forKey: BuddyKeys.activeRun)
      return
    }
    write(run, key: BuddyKeys.activeRun)
  }

  static func appendPending(_ run: BuddyPendingRun) {
    var list = read(BuddyKeys.pendingRuns, as: [BuddyPendingRun].self) ?? []
    list.append(run)
    write(list, key: BuddyKeys.pendingRuns)
  }

  static func setGoals(_ goals: Int) {
    defaults?.set(String(goals), forKey: BuddyKeys.goals)
  }

  static func reloadWidgets() {
    WidgetCenter.shared.reloadAllTimelines()
  }
}

// "5,0" — km com vírgula, como no app
func buddyKm(_ value: Double) -> String {
  String(format: "%.1f", value).replacingOccurrences(of: ".", with: ",")
}

func buddyGoalLabel(_ value: Double) -> String {
  value.rounded() == value ? String(Int(value)) : buddyKm(value)
}
