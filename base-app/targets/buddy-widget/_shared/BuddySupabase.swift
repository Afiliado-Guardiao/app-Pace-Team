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

// Colega online com o Buddy do jeito que ele configurou no app dele
struct BuddyMate: Codable, Equatable {
  var name: String
  var color: String
  var accessories: [String]
}

enum BuddySupabase {
  private static let maxRoutePoints = 400
  // Internet ruim: desiste em 8 s em vez de deixar o botão travado
  private static let requestTimeout: TimeInterval = 8

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
    request.timeoutInterval = requestTimeout
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
    request.timeoutInterval = requestTimeout
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
    guard let data = await post("/rest/v1/runs?select=id", json: body, prefer: "return=representation") else {
      return false
    }
    // Colegas recebem a notificação "fulano concluiu uma corrida"
    if let rows = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]],
       let id = rows.first?["id"] as? String {
      _ = await post("/functions/v1/team-run-push", json: ["runId": id])
    }
    return true
  }

  // Meta cumprida: soma no servidor e devolve o acessório liberado
  static func completeGoal() async -> (goals: Int, unlocked: String?)? {
    guard let data = await post("/rest/v1/rpc/buddy_complete_goal", json: [String: Any]()),
          let object = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
          let goals = object["goals"] as? Int else { return nil }
    return (goals, object["unlocked"] as? String)
  }

  // Correndo com a equipe: a posição ao vivo (os colegas veem a foto no mapa)
  // Também manda quanto já correu: quem vai na frente deixa o rastro
  static func setLivePosition(lat: Double, lng: Double, meters: Double) async {
    _ = await post(
      "/rest/v1/rpc/set_live_position", json: ["p_lat": lat, "p_lng": lng, "p_meters": meters.rounded()])
  }

  // Terminou: ninguém mais vê onde o atleta está
  static func clearLivePosition() async {
    _ = await post("/rest/v1/rpc/clear_live_position", json: [String: Any]())
  }

  // Avisa a equipe que este atleta está online (push com limite de 2 h)
  static func pingOnline() async {
    _ = await post("/functions/v1/buddy-team-online", json: ["notify": true])
  }

  // Começou a correr com a equipe: "Sua equipe está correndo, só falta você!"
  static func notifyTeamRunStart() async {
    _ = await post("/functions/v1/team-run-start", json: [String: Any]())
  }

  // Colegas da equipe online agora (RPC get_team_online), com a
  // cor e os acessórios do Buddy de cada um
  static func teamOnline() async -> [BuddyMate]? {
    guard let data = await post("/rest/v1/rpc/get_team_online", json: [String: Any]()),
          let list = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] else { return nil }
    return list.map { item in
      // A coroa do 1º da equipe vem à parte e vai por cima dos acessórios
      let equipped = (item["equipped"] as? [String] ?? []).filter { $0 != "coroa" }
      let crown = (item["crown"] as? Bool) == true ? ["coroa"] : []
      return BuddyMate(
        name: item["name"] as? String ?? "",
        color: item["color"] as? String ?? "branco",
        accessories: equipped + crown)
    }
  }

  private static let onlineCacheKey = "buddyTeamMates"
  private static let onlineCacheAtKey = "buddyTeamMatesAt"
  // Lista buscada há menos que isso: o cartão usa direto, sem esperar
  private static let onlineFreshFor: TimeInterval = 20

  // Para o cartão, que não pode ficar carregando: com a lista recente, usa na
  // hora; senão espera no máximo 0,4 s pela internet e, se demorar, mostra a
  // última conhecida. A busca continua por trás e deixa a lista pronta para o
  // próximo toque.
  // Sem TaskGroup de propósito: ele só termina quando TODAS as tarefas acabam,
  // então o cartão (e cada toque nos botões) ficava preso até a internet
  // responder, até 16 s com a renovação do login.
  static func teamOnlineQuick() async -> [BuddyMate] {
    let cached = BuddyStore.defaults?.data(forKey: onlineCacheKey)
      .flatMap { try? JSONDecoder().decode([BuddyMate].self, from: $0) } ?? []
    let cachedAt = BuddyStore.defaults?.double(forKey: onlineCacheAtKey) ?? 0
    if Date().timeIntervalSince1970 - cachedAt < onlineFreshFor { return cached }
    let refresh = Task { () -> [BuddyMate]? in
      guard let fresh = await teamOnline() else { return nil }
      BuddyStore.defaults?.set(try? JSONEncoder().encode(fresh), forKey: onlineCacheKey)
      BuddyStore.defaults?.set(Date().timeIntervalSince1970, forKey: onlineCacheAtKey)
      return fresh
    }
    return await withCheckedContinuation { continuation in
      let first = BuddyFirstAnswer(continuation)
      Task { first.resume(await refresh.value ?? cached) }
      Task {
        try? await Task.sleep(nanoseconds: 400_000_000)
        first.resume(cached)
      }
    }
  }
}

// Entrega só a primeira resposta (internet ou o limite de tempo) e ignora a outra
final class BuddyFirstAnswer<Value>: @unchecked Sendable {
  private let lock = NSLock()
  private var continuation: CheckedContinuation<Value, Never>?

  init(_ continuation: CheckedContinuation<Value, Never>) {
    self.continuation = continuation
  }

  func resume(_ value: Value) {
    lock.lock()
    let pending = continuation
    continuation = nil
    lock.unlock()
    pending?.resume(returning: value)
  }
}
