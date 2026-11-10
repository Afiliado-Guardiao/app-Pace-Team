import { IPlan, IPurchaseResult, ISubscriptionStatus } from "./types";

// Prévia web: o RevenueCat é nativo (StoreKit). Tudo fica liberado e sem compra.
const UNLOCKED: ISubscriptionStatus = {
	isActive: true,
	willRenew: false,
	expiresAt: null,
	productId: null,
};

export const isPurchasesSynced = (): boolean => true;

export function subscribeToSync(_listener: () => void): () => void {
	return () => undefined;
}

export function configurePurchases(): void {
	return undefined;
}

export async function syncPurchasesUser(_userId: string | null): Promise<void> {
	return Promise.resolve();
}

export async function getSubscriptionStatus(): Promise<ISubscriptionStatus> {
	return Promise.resolve(UNLOCKED);
}

// Prévia web: os planos do Team Pro como aparecem na App Store do Brasil
const PREVIEW_PLANS: IPlan[] = [
	{
		id: "$rc_monthly",
		period: "monthly",
		price: "R$ 39,90",
		priceValue: 39.9,
		perMonth: "R$ 39,90",
		trial: null,
	},
	{
		id: "$rc_annual",
		period: "annual",
		price: "R$ 399,90",
		priceValue: 399.9,
		perMonth: "R$ 33,33",
		trial: null,
	},
];

export async function getPlans(): Promise<IPlan[]> {
	return Promise.resolve(PREVIEW_PLANS);
}

export async function purchasePlan(_planId: string): Promise<IPurchaseResult> {
	return Promise.resolve("cancelled");
}

export async function restorePurchases(): Promise<ISubscriptionStatus> {
	return Promise.resolve(UNLOCKED);
}

export async function openManageSubscriptions(): Promise<void> {
	return Promise.resolve();
}

export function onSubscriptionChange(_listener: (status: ISubscriptionStatus) => void): () => void {
	return () => undefined;
}
