// Sons do cartão do Pace Buddy (escolhidos pelo Wesley): "boing" subindo
// quando o cartão aparece e descendo quando um botão o fecha. Som curto de
// sistema: respeita a chave de silencioso e não precisa do modo de áudio em
// segundo plano. Com o app aberto na tela não toca (lá o app não tem som).
import AudioToolbox
import Foundation

enum BuddySound {
  case appear
  case close

  private var file: String {
    switch self {
    case .appear: return "buddy_in"
    case .close: return "buddy_out"
    }
  }

  func play() {
    guard let url = Bundle.main.url(forResource: file, withExtension: "wav") else { return }
    var id: SystemSoundID = 0
    guard AudioServicesCreateSystemSoundID(url as CFURL, &id) == noErr else { return }
    AudioServicesPlaySystemSoundWithCompletion(id) {
      AudioServicesDisposeSystemSoundID(id)
    }
  }
}
