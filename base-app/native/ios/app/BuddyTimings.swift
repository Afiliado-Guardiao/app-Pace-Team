// Tempos do cartão do Pace Buddy: cada etapa (chamou, desenhou, apertou um
// botão, terminou) fica anotada no App Group. O app manda para o servidor
// quando abre (tabela buddy_timings), para medir a demora no iPhone de verdade.
import Foundation

enum BuddyTimings {
  private static let key = "buddyTimings"
  private static let maxEvents = 100

  static func mark(_ event: String) {
    guard let defaults = BuddyStore.defaults else { return }
    var list = (defaults.string(forKey: key)?.data(using: .utf8))
      .flatMap { try? JSONSerialization.jsonObject(with: $0) as? [[String: Any]] } ?? []
    list.append(["event": event, "at": Int(Date().timeIntervalSince1970 * 1000)])
    if list.count > maxEvents { list.removeFirst(list.count - maxEvents) }
    if let data = try? JSONSerialization.data(withJSONObject: list), let text = String(data: data, encoding: .utf8) {
      defaults.set(text, forKey: key)
    }
  }
}
