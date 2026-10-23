import { Platform } from "react-native";

import { requireOptionalNativeModule } from "expo";

import { ExtensionStorage } from "@bacons/apple-targets";

// Ponte do Pace Buddy com o iPhone:
// - App Group (ExtensionStorage): o estado que o widget e o atalho leem, a
//   meta escolhida fora do app, a fila de corridas e o login compartilhado;
// - módulo PaceBuddy (modules/pace-buddy): despertador do iOS 26 (AlarmKit).
// Na prévia web e no Expo Go nada disso existe e as chamadas não fazem nada.
export const BUDDY_APP_GROUP = "group.com.paceteam.app";

// Mesmas chaves de targets/buddy-widget/_shared/BuddyStore.swift
export const BUDDY_KEYS = {
	state: "buddyState",
	kmIdx: "buddyKmIdx",
	config: "buddyConfig",
	pendingRuns: "buddyPendingRuns",
	goals: "buddyGoals",
} as const;

interface IPaceBuddyModule {
	isAlarmKitAvailable: () => boolean;
	scheduleAlarm: (json: string) => void;
	cancelAlarm: () => void;
}

const alarmModule = requireOptionalNativeModule<IPaceBuddyModule>("PaceBuddy");
const isIos = Platform.OS === "ios";
const storage = isIos ? new ExtensionStorage(BUDDY_APP_GROUP) : null;

export const buddyNative = {
	// true no app instalado no iPhone (development/production build)
	isAvailable: isIos && alarmModule !== null,
	get: (key: string): string | null => storage?.get(key) ?? null,
	set: (key: string, value: string): void => {
		storage?.set(key, value);
	},
	remove: (key: string): void => {
		storage?.remove(key);
	},
	reloadWidgets: (): void => {
		if (isIos) ExtensionStorage.reloadWidget();
	},
	isAlarmKitAvailable: (): boolean => alarmModule?.isAlarmKitAvailable() ?? false,
	scheduleAlarm: (json: string): void => {
		alarmModule?.scheduleAlarm(json);
	},
	cancelAlarm: (): void => {
		alarmModule?.cancelAlarm();
	},
};
