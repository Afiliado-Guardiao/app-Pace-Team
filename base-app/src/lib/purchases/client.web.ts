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

export async function getPlans(): Promise<IPlan[]> {
	return Promise.resolve([]);
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
