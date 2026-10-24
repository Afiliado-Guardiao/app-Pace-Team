// Assinatura PACE TEAM via RevenueCat (compra, restaurar, status e planos).
export {
	getPlans,
	getSubscriptionStatus,
	openManageSubscriptions,
	purchasePlan,
	restorePurchases,
} from "./client";
export { IS_PURCHASES_ENABLED, PREMIUM_ENTITLEMENT } from "./config";
export { PurchasesBridge } from "./PurchasesBridge";
export type { IPlan, IPlanPeriod, IPurchaseResult, ISubscriptionStatus } from "./types";
export { usePaywallGate } from "./usePaywallGate";
export { usePlans } from "./usePlans";
export { SUBSCRIPTION_KEY, useSubscription } from "./useSubscription";
