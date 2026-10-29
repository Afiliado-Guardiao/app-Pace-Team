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
    if km >= 42 { return BuddySpeech(title: "Uma maratona inteira?!", subtitle: "Respeito total. Hidrata e bora.", pose: .celebrate) }
    if km >= 21 { return BuddySpeech(title: "Meia maratona?!", subtitle: "Meta de atleta. Vai com calma no ritmo.", pose: .celebrate) }
    if km >= 15 {
      return BuddySpeech(title: "Uau, \(buddyGoalLabel(km)) km?!", subtitle: "Meta alta. O time vai sentir esse treino.", pose: .excited)
    }
    return byHour(date)
  }

  // Sem meta especial, o Buddy muda com a hora do dia
  private static func byHour(_ date: Date) -> BuddySpeech {
    let hour = Calendar.current.component(.hour, from: date)
    if hour >= 22 || hour < 5 {
      return BuddySpeech(title: "Zzz… correr agora?", subtitle: "Eu acordo rapidinho. Escolhe a meta.", pose: .sleep)
    }
    if hour < 11 {
      return BuddySpeech(title: "Bom dia! Bora correr?", subtitle: "Treino cedo deixa o dia mais leve.", pose: .wave)
    }
    if hour < 17 {
      return BuddySpeech(title: "Bora correr?", subtitle: "Escolhe a meta e como você vai.", pose: .wink)
    }
    return BuddySpeech(title: "Corrida no fim do dia?", subtitle: "Solta o estresse e soma km pro time.", pose: .armsUp)
  }

  // "Meta batida!" (painel de comemoração)
  static func celebrate(km: Double, withTeam: Bool, teamName: String) -> BuddySpeech {
    let team = teamName.trimmingCharacters(in: .whitespaces)
    let who = withTeam ? "com \(team.isEmpty ? "a equipe" : team)" : "sozinho"
    return BuddySpeech(title: "Meta batida!", subtitle: "\(buddyKm(km)) km \(who). Cada km conta.", pose: .celebrate)
  }
}
