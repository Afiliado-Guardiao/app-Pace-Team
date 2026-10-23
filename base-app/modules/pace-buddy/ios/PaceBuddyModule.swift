// Módulo "PaceBuddy": o app (JS) agenda e cancela o despertador do Buddy.
// O AlarmKit fica no alvo principal (PaceBuddyAlarmBridge, em
// native/ios/app/BuddyAlarm.swift); aqui só repassamos pelo nome da classe.
import ExpoModulesCore
import Foundation

public class PaceBuddyModule: Module {
  // Métodos de classe chamados pelo runtime do Objective-C
  private var bridge: AnyObject? { NSClassFromString("PaceBuddyAlarmBridge").map { $0 as AnyObject } }

  public func definition() -> ModuleDefinition {
    Name("PaceBuddy")

    // true no iOS 26+ (despertador de verdade); antes disso o app usa notificação
    Function("isAlarmKitAvailable") { () -> Bool in
      if #available(iOS 26.0, *) {
        return self.bridge != nil
      }
      return false
    }

    Function("scheduleAlarm") { (json: String) in
      _ = self.bridge?.perform(NSSelectorFromString("schedule:"), with: json)
    }

    Function("cancelAlarm") {
      _ = self.bridge?.perform(NSSelectorFromString("cancel"))
    }
  }
}
