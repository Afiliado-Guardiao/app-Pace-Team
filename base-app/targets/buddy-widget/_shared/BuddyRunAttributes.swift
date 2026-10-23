// Dados da corrida na Dynamic Island / tela bloqueada (Live Activity).
import ActivityKit
import Foundation

@available(iOS 16.2, *)
struct BuddyRunAttributes: ActivityAttributes {
  struct ContentState: Codable, Hashable {
    var km: Double
    var isDone: Bool
    // Acessório liberado ao bater a meta (nome), se houver
    var unlocked: String?
  }

  var goalKm: Double
  var withTeam: Bool
  var teamName: String
  var color: String
  var accessories: [String]
  var startedAt: Date
}
