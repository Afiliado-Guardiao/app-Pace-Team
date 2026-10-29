// Pace Buddy: regras, memória no aparelho e ponte com o widget/atalho do iPhone.
export * from "./constants";
export type { IBuddyEvent } from "./liveStore";
export { useBuddyLive } from "./liveStore";
export { BUDDY_KEYS, buddyNative } from "./native";
export { ensureNotificationPermission, scheduleBuddyAlarm } from "./notifications";
export { useBuddyRankStore } from "./rankStore";
export * from "./rules";
export type { IBuddySharedState } from "./sharedState";
export { buildSharedState } from "./sharedState";
export type { IBuddyAlarm } from "./store";
export { DEFAULT_ALARM, useBuddyStore } from "./store";
export { useBuddyBridge } from "./useBuddyBridge";
export { useBuddyContext } from "./useBuddyContext";
export { useBuddyLook } from "./useBuddyLook";
export type { IBuddyMood } from "./useBuddyMood";
export { useBuddyMood } from "./useBuddyMood";
