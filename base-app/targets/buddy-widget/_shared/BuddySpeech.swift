// O que o Buddy fala (mesmos textos do painel do design).
import Foundation

struct BuddySpeech {
  let title: String
  let subtitle: String
  let pose: BuddyPose

  static func now(_ state: BuddyState, date: Date = Date()) -> BuddySpeech {
    if let run = BuddyStore.activeRun() {
      let km = buddyKm(run.meters / 1000)
      return BuddySpeech(title: "Correndo", subtitle: "\(km) de \(buddyGoalLabel(run.goalKm)) km", pose: .run)
    }
    if state.isSick(at: date) {
      return BuddySpeech(title: "Tô com febre…", subtitle: "Faz 7 dias sem correr. Um trote leve já me cura.", pose: .sick)
    }
    let km = state.goalKm
    if km >= 42 { return BuddySpeech(title: "Uma maratona inteira?!", subtitle: "Respeito total. Hidrata e bora.", pose: .excited) }
    if km >= 21 { return BuddySpeech(title: "Meia maratona?!", subtitle: "Meta de atleta. Vai com calma no ritmo.", pose: .excited) }
    if km >= 15 {
      return BuddySpeech(title: "Uau, \(buddyGoalLabel(km)) km?!", subtitle: "Meta alta. O time vai sentir esse treino.", pose: .excited)
    }
    return BuddySpeech(title: "Bora correr?", subtitle: "Escolhe a meta e como você vai.", pose: .wave)
  }

  // "Meta batida!" (painel de comemoração)
  static func celebrate(km: Double, withTeam: Bool, teamName: String) -> BuddySpeech {
    let team = teamName.trimmingCharacters(in: .whitespaces)
    let who = withTeam ? "com \(team.isEmpty ? "a equipe" : team)" : "sozinho"
    return BuddySpeech(title: "Meta batida!", subtitle: "\(buddyKm(km)) km \(who). Cada km conta.", pose: .celebrate)
  }
}
