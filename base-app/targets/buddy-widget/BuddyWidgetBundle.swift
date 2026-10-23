// Tudo o que o alvo do widget mostra fora do app.
import SwiftUI
import WidgetKit

@main
struct BuddyWidgetBundle: WidgetBundle {
  var body: some Widget {
    BuddyWidget()
    BuddyRunLiveActivity()
  }
}
