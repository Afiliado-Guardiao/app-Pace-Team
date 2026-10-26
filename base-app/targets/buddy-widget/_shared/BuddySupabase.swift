// Salva no Supabase o que acontece fora do app (corrida, meta, "online").
// A sessão é a MESMA do app: o supabase-js do app guarda o login no App
// Group (src/lib/supabase/sharedAuthStorage.ts). Se o token venceu, o Buddy
// renova e grava de volta no mesmo lugar; o app lê a versão nova ao abrir.
// Assim os dois nunca usam um token antigo (o que faria o servidor derrubar
// o login).
import Foundation

// Gravado pelo app: endereço do Supabase, chave pública e a chave do login
struct BuddyConfig: Codable {
  var url: String
  var anonKey: String
  var storageKey: String
}

enum BuddySupabase {
  private static let maxRoutePoints = 400

  private static func loadConfig() -> BuddyConfig? { BuddyStore.read(BuddyKeys.config, as: BuddyConfig.self) }

  private static func storedSession(_ config: BuddyConfig) -> [String: Any]? {
    guard let text = BuddyStore.defaults?.string(forKey: config.storageKey),
          let data = text.data(using: .utf8) else { return nil }
    return try? JSONSerialization.jsonObject(with: data) as? [String: Any]
  }

  // Token válido (renova se faltar menos de 1 min)
  static func accessToken() async -> (BuddyConfig, String)? {
    guard let config = loadConfig(), let session = storedSession(config),
          let access = session["access_token"] as? String else { return nil }
    let expiresAt = (session["expires_at"] as? Double) ?? 0
    if expiresAt - Date().timeIntervalSince1970 > 60 { return (config, access) }
    guard let fresh = await refresh(config, session) else { return nil }
    return (config, fresh)
  }

  private static func refresh(_ config: BuddyConfig, _ session: [String: Any]) async -> String? {
    guard let refreshToken = session["refresh_token"] as? String,
          let url = URL(string: "\(config.url)/auth/v1/token?grant_type=refresh_token") else { return nil }
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue(config.anonKey, forHTTPHeaderField: "apikey")
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = try? JSONSerialization.data(withJSONObject: ["refresh_token": refreshToken])
    guard let result = try? await URLSession.shared.data(for: request),
          (result.1 as? HTTPURLResponse)?.statusCode == 200,
          let fresh = try? JSONSerialization.jsonObject(with: result.0) as? [String: Any],
          let access = fresh["access_token"] as? String else { return nil }
    // Mesmo formato que o supabase-js grava (sessão inteira com o usuário)
    var next = session
    for key in ["access_token", "refresh_token", "expires_in", "expires_at", "token_type", "user"] {
      if let value = fresh[key] { next[key] = value }
    }
    if next["expires_at"] == nil, let expiresIn = fresh["expires_in"] as? Double {
      next["expires_at"] = Date().timeIntervalSince1970 + expiresIn
    }
    if let data = try? JSONSerialization.data(withJSONObject: next), let text = String(data: data, encoding: .utf8) {
      BuddyStore.defaults?.set(text, forKey: config.storageKey)
    }
    return access
  }

  private static func post(_ path: String, json: Any, prefer: String? = nil) async -> Data? {
    guard let auth = await accessToken(),
          let url = URL(string: "\(auth.0.url)\(path)"),
          let body = try? JSONSerialization.data(withJSONObject: json) else { return nil }
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue(auth.0.anonKey, forHTTPHeaderField: "apikey")
    request.setValue("Bearer \(auth.1)", forHTTPHeaderField: "Authorization")
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    if let prefer { request.setValue(prefer, forHTTPHeaderField: "Prefer") }
    request.httpBody = body
    guard let result = try? await URLSession.shared.data(for: request),
          let status = (result.1 as? HTTPURLResponse)?.statusCode, (200..<300).contains(status) else { return nil }
    return result.0
  }

  // Mesmo formato do saveRun do app (src/lib/supabase/runs.ts)
  static func saveRun(_ run: BuddyPendingRun) async -> Bool {
    let iso = ISO8601DateFormatter()
    iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    let finished = Date(timeIntervalSince1970: run.finishedAt / 1000)
    let started = finished.addingTimeInterval(-run.seconds)
    let step = max(1, Int((Double(run.route.count) / Double(maxRoutePoints)).rounded(.up)))
    let route = run.route.enumerated()
      .filter { $0.offset % step == 0 || $0.offset == run.route.count - 1 }
      .map { pair in pair.element.map { ($0 * 100_000).rounded() / 100_000 } }
    let body: [String: Any] = [
      "mode": run.mode,
      "started_at": iso.string(from: started),
      "finished_at": iso.string(from: finished),
      "duration_s": Int(run.seconds.rounded()),
      "distance_m": (run.km * 10_000).rounded() / 10,
      "route": route,
    ]
    return await post("/rest/v1/runs", json: body, prefer: "return=minimal") != nil
  }

  // Meta cumprida: soma no servidor e devolve o acessório liberado
  static func completeGoal() async -> (goals: Int, unlocked: String?)? {
    guard let data = await post("/rest/v1/rpc/buddy_complete_goal", json: [String: Any]()),
          let object = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
          let goals = object["goals"] as? Int else { return nil }
    return (goals, object["unlocked"] as? String)
  }

  // Avisa a equipe que este atleta está online (push com limite de 2 h)
  static func pingOnline() async {
    _ = await post("/functions/v1/buddy-team-online", json: [String: Any]())
  }

  // Colegas da equipe online nos últimos 15 min (RPC get_team_online)
  static func teamOnline() async -> [String]? {
    guard let data = await post("/rest/v1/rpc/get_team_online", json: [String: Any]()),
          let list = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] else { return nil }
    return list.compactMap { $0["name"] as? String }
  }

  private static let onlineCacheKey = "buddyTeamOnline"

  // Para o cartão: espera no máximo ~1 s pela internet; se demorar, usa a
  // última lista conhecida (o cartão não pode ficar carregando).
  static func teamOnlineQuick() async -> [String] {
    let cached = BuddyStore.defaults?.stringArray(forKey: onlineCacheKey) ?? []
    let fresh: [String]? = await withTaskGroup(of: [String]?.self) { group in
      group.addTask { await teamOnline() }
      group.addTask {
        try? await Task.sleep(nanoseconds: 1_000_000_000)
        return nil
      }
      let first = await group.next() ?? nil
      group.cancelAll()
      return first
    }
    guard let fresh else { return cached }
    BuddyStore.defaults?.set(fresh, forKey: onlineCacheKey)
    return fresh
  }
}
