// Corrida pelo Buddy sem abrir o app: GPS em segundo plano (mesmo filtro do
// app: src/lib/run/geo.ts), "Correndo · x / y km" na Dynamic Island e, ao
// bater a meta, salva no servidor, conta a meta e o Buddy comemora.
// Compila também no widget, mas só roda no processo do app (LiveActivityIntent).
import ActivityKit
import CoreLocation
import Foundation
import UserNotifications

let buddyAccessoryNames: [String: String] = [
  "faixa": "Faixa", "grau": "Óculos de grau", "oculos": "Óculos", "bone": "Boné",
  "boneTras": "Boné p/ trás", "coroa": "Coroa", "aureola": "Auréola", "capa": "Capa",
]

enum BuddyNotifier {
  static func show(_ title: String, _ body: String) {
    let content = UNMutableNotificationContent()
    content.title = title
    content.body = body
    content.sound = .default
    let request = UNNotificationRequest(identifier: "buddy-\(UUID().uuidString)", content: content, trigger: nil)
    UNUserNotificationCenter.current().add(request)
  }
}

@available(iOS 17.0, *)
final class BuddyRunTracker: NSObject, CLLocationManagerDelegate {
  static let shared = BuddyRunTracker()

  // Filtro do GPS (GPS_FILTER do app)
  private let maxAccuracy: Double = 20
  private let maxSpeed: Double = 9
  private let minStep: Double = 3
  // Passo maior que metade do erro do GPS (evita bicos andando devagar)
  private let accuracyStep: Double = 0.5

  private var manager: CLLocationManager?
  private var run: BuddyActiveRun?
  private var last: CLLocation?
  private var activity: Activity<BuddyRunAttributes>?
  private var shownKm: Double = 0
  // Correndo com a equipe: última vez que a posição ao vivo foi enviada
  private var liveSentAt: Date = .distantPast
  private let liveEvery: TimeInterval = 5
  private var isFinishing = false

  static var hasAlwaysPermission: Bool { CLLocationManager().authorizationStatus == .authorizedAlways }
  // Também conta um contador que ficou na tela sem corrida salva, para o
  // cartão mostrar "Encerrar" e limpar.
  var isRunning: Bool {
    run != nil || BuddyStore.activeRun() != nil || !Activity<BuddyRunAttributes>.activities.isEmpty
  }

  func start(withTeam: Bool) async {
    guard run == nil else { return }
    let state = BuddyStore.state()
    let now = Date()
    let active = BuddyActiveRun(
      startedAt: now.timeIntervalSince1970 * 1000, goalKm: state.goalKm, withTeam: withTeam, meters: 0, route: [])
    run = active
    shownKm = 0
    isFinishing = false
    BuddyStore.saveActiveRun(active)
    // Fecha qualquer contador antigo antes de abrir o novo
    for item in Activity<BuddyRunAttributes>.activities {
      await item.end(nil, dismissalPolicy: .immediate)
    }
    await MainActor.run { self.startLocation() }
    startActivity(state: state, run: active, startedAt: now)
    BuddyStore.reloadWidgets()
    if withTeam {
      await BuddySupabase.pingOnline()
      await BuddySupabase.notifyTeamRunStart()
    }
  }

  private func startLocation() {
    let m = CLLocationManager()
    m.delegate = self
    m.activityType = .fitness
    m.desiredAccuracy = kCLLocationAccuracyBestForNavigation
    m.distanceFilter = 5
    m.pausesLocationUpdatesAutomatically = false
    m.allowsBackgroundLocationUpdates = true
    m.showsBackgroundLocationIndicator = true
    manager = m
    m.startUpdatingLocation()
  }

  private func startActivity(state: BuddyState, run: BuddyActiveRun, startedAt: Date) {
    guard ActivityAuthorizationInfo().areActivitiesEnabled else { return }
    let attributes = BuddyRunAttributes(
      goalKm: run.goalKm, withTeam: run.withTeam, teamName: state.teamName,
      color: state.color, accessories: state.accessories, startedAt: startedAt)
    let content = ActivityContent(state: BuddyRunAttributes.ContentState(km: 0, isDone: false, unlocked: nil), staleDate: nil)
    activity = try? Activity.request(attributes: attributes, content: content, pushType: nil)
  }

  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    guard var current = run, !isFinishing else { return }
    for location in locations {
      guard location.horizontalAccuracy >= 0, location.horizontalAccuracy <= maxAccuracy else { continue }
      if let last {
        let meters = location.distance(from: last)
        let seconds = max(0.5, location.timestamp.timeIntervalSince(last.timestamp))
        let step = max(minStep, location.horizontalAccuracy * accuracyStep)
        if meters < step || meters / seconds > maxSpeed { continue }
        current.meters += meters
      }
      last = location
      current.route.append([location.coordinate.latitude, location.coordinate.longitude])
    }
    run = current
    BuddyStore.saveActiveRun(current)
    if current.withTeam, let point = last, Date().timeIntervalSince(liveSentAt) >= liveEvery {
      liveSentAt = Date()
      let lat = point.coordinate.latitude
      let lng = point.coordinate.longitude
      Task { await BuddySupabase.setLivePosition(lat: lat, lng: lng) }
    }
    let km = current.meters / 1000
    if km >= current.goalKm {
      Task { await self.finish(goalReached: true) }
      return
    }
    // Atualiza a ilha a cada 50 m
    if km - shownKm >= 0.05 {
      shownKm = km
      let content = ActivityContent(state: BuddyRunAttributes.ContentState(km: km, isDone: false, unlocked: nil), staleDate: nil)
      Task { await self.activity?.update(content) }
    }
  }

  // Encerra: meta batida (automático) ou "Encerrar" na Dynamic Island
  func finish(goalReached: Bool) async {
    guard !isFinishing else { return }
    isFinishing = true
    await MainActor.run {
      self.manager?.stopUpdatingLocation()
      self.manager = nil
    }
    // Sem corrida salva (ex.: ficou de uma versão anterior do app): mesmo
    // assim desliga tudo — contador na tela, Dynamic Island e GPS.
    guard let current = run ?? BuddyStore.activeRun() else {
      run = nil
      last = nil
      BuddyStore.saveActiveRun(nil)
      await endActivities(km: 0, unlocked: nil, isDone: false, keepFor: nil)
      BuddyStore.reloadWidgets()
      isFinishing = false
      return
    }
    let finishedAt = Date().timeIntervalSince1970 * 1000
    let km = goalReached ? max(current.goalKm, current.meters / 1000) : current.meters / 1000
    let pending = BuddyPendingRun(
      mode: current.withTeam ? "team" : "dist", seconds: (finishedAt - current.startedAt) / 1000,
      km: current.meters / 1000, finishedAt: finishedAt, route: current.route, goalReached: goalReached)
    // Encerra na hora (contador, Dynamic Island e "Correndo" no cartão) e só
    // depois envia ao servidor — antes o envio segurava o fim da corrida.
    run = nil
    last = nil
    BuddyStore.saveActiveRun(nil)
    if current.withTeam { Task { await BuddySupabase.clearLivePosition() } }
    // "Encerrar" some na hora; meta batida comemora por 2 min e some
    await endActivities(km: km, unlocked: nil, isDone: goalReached, keepFor: goalReached ? 120 : nil)
    BuddyStore.reloadWidgets()
    isFinishing = false

    let saved = await BuddySupabase.saveRun(pending)
    var unlocked: String?
    if goalReached, saved, let result = await BuddySupabase.completeGoal() {
      BuddyStore.setGoals(result.goals)
      unlocked = result.unlocked.flatMap { buddyAccessoryNames[$0] }
    }
    // Sem internet ou sem sessão: o app envia quando abrir
    if !saved { BuddyStore.appendPending(pending) }
    if goalReached {
      let speech = BuddySpeech.celebrate(km: current.goalKm, withTeam: current.withTeam, teamName: BuddyStore.state().teamName)
      let extra = unlocked.map { " Novo acessório: \($0)." } ?? ""
      BuddyNotifier.show(speech.title, speech.subtitle + extra)
    }
  }

  private func endActivities(km: Double, unlocked: String?, isDone: Bool, keepFor seconds: TimeInterval?) async {
    let content = ActivityContent(state: BuddyRunAttributes.ContentState(km: km, isDone: isDone, unlocked: unlocked), staleDate: nil)
    var policy = ActivityUIDismissalPolicy.immediate
    if let seconds { policy = .after(Date().addingTimeInterval(seconds)) }
    for item in Activity<BuddyRunAttributes>.activities {
      await item.end(content, dismissalPolicy: policy)
    }
    activity = nil
  }
}
