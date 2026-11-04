// Fechou o app (o iOS avisa quando consegue): o atleta sai do "online" da
// equipe na hora, em vez de esperar os 10 min sem sinal. Lê o endereço e o
// login do App Group (os mesmos que o Buddy usa fora do app).
import ExpoModulesCore
import Foundation
import UIKit

public class PaceBuddyAppDelegate: ExpoAppDelegateSubscriber {
  public func applicationWillTerminate(_ application: UIApplication) {
    PaceBuddyPresence.goOfflineNow()
  }
}

enum PaceBuddyPresence {
  private static let group = "group.com.paceteam.app"
  private static let configKey = "buddyConfig"
  // O iOS dá pouco tempo ao app fechando: espera a resposta no máximo isso
  private static let waitSeconds: Double = 2

  private static func json(_ text: String?) -> [String: Any]? {
    guard let data = text?.data(using: .utf8) else { return nil }
    return try? JSONSerialization.jsonObject(with: data) as? [String: Any]
  }

  static func goOfflineNow() {
    guard let defaults = UserDefaults(suiteName: group),
          let config = json(defaults.string(forKey: configKey)),
          let base = config["url"] as? String,
          let anonKey = config["anonKey"] as? String,
          let storageKey = config["storageKey"] as? String,
          let session = json(defaults.string(forKey: storageKey)),
          let token = session["access_token"] as? String,
          let url = URL(string: "\(base)/rest/v1/rpc/go_offline") else { return }
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.timeoutInterval = waitSeconds
    request.setValue(anonKey, forHTTPHeaderField: "apikey")
    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = Data("{}".utf8)
    let done = DispatchSemaphore(value: 0)
    URLSession.shared.dataTask(with: request) { _, _, _ in done.signal() }.resume()
    _ = done.wait(timeout: .now() + waitSeconds)
  }
}
