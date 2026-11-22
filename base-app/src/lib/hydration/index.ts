// PACE HYDRATION (4º pilar do Team Pro): estimativas, registro de água no
// celular, lembretes e o que vai para o cartão do Bud e para a Siri.
export * from "./day";
export * from "./estimate";
export type { IHydroNotice } from "./notice";
export { toHydroNotice, useHydroNotice } from "./notice";
export { HYDRATION_PUSH } from "./notifications";
export type { IHydroKind, IHydroLog, IHydroReminders } from "./store";
export { DEFAULT_REMINDERS, useHydrationStore } from "./store";
export type { IRunWithHydration, IUseHydrationReturn } from "./useHydration";
export { ageOf, useHydration } from "./useHydration";
export { useHydrationSync } from "./useHydrationSync";
