import Purchases, {
	CustomerInfo,
	PACKAGE_TYPE,
	PurchasesEntitlementInfo,
	PurchasesIntroPrice,
	PurchasesPackage,
} from "react-native-purchases";

import { IS_PURCHASES_ENABLED, PREMIUM_ENTITLEMENT, REVENUECAT_IOS_KEY } from "./config";
import { IPlan, IPurchaseResult, ISubscriptionStatus } from "./types";

// Tudo o que fala com o RevenueCat (StoreKit 2 por baixo). O RevenueCat é a
// fonte da verdade da assinatura; o Supabase recebe uma cópia pelo webhook.

const FREE: ISubscriptionStatus = {
	isActive: false,
	willRenew: false,
	expiresAt: null,
	productId: null,
};
// Assinatura desligada (sem chave / prévia): o app abre liberado
const UNLOCKED: ISubscriptionStatus = {
	isActive: true,
	willRenew: false,
	expiresAt: null,
	productId: null,
};

let configured = false;

// Conta já ligada ao RevenueCat (undefined = ainda não). O status da
// assinatura só é lido depois disso, para um assinante não ver o paywall piscar.
let syncedUser: string | null | undefined;
const syncListeners = new Set<() => void>();

export const isPurchasesSynced = (): boolean => !IS_PURCHASES_ENABLED || syncedUser !== undefined;

export function subscribeToSync(listener: () => void): () => void {
	syncListeners.add(listener);
	return () => {
		syncListeners.delete(listener);
	};
}

const markSynced = (userId: string | null): void => {
	syncedUser = userId;
	syncListeners.forEach((l) => {
		l();
	});
};

export function configurePurchases(): void {
	if (!IS_PURCHASES_ENABLED || configured) return;
	Purchases.configure({ apiKey: REVENUECAT_IOS_KEY });
	configured = true;
}

// Liga as compras ao atleta: o id do Supabase vira o "App User ID" do
// RevenueCat, e é por ele que o webhook acha o perfil.
export async function syncPurchasesUser(userId: string | null): Promise<void> {
	if (!IS_PURCHASES_ENABLED) return;
	configurePurchases();
	try {
		if (userId) await Purchases.logIn(userId);
		else if (!(await Purchases.isAnonymous())) await Purchases.logOut();
	} finally {
		markSynced(userId);
	}
}

const toStatus = (info: CustomerInfo): ISubscriptionStatus => {
	// Ausente quando o atleta não tem a assinatura ativa
	const premium = info.entitlements.active[PREMIUM_ENTITLEMENT] as
		| PurchasesEntitlementInfo
		| undefined;
	if (!premium) return FREE;
	return {
		isActive: premium.isActive,
		willRenew: premium.willRenew,
		expiresAt: premium.expirationDate,
		productId: premium.productIdentifier,
	};
};

export async function getSubscriptionStatus(): Promise<ISubscriptionStatus> {
	if (!IS_PURCHASES_ENABLED) return UNLOCKED;
	configurePurchases();
	return toStatus(await Purchases.getCustomerInfo());
}

// "7 dias", "1 mês"
const trialLabel = (intro: PurchasesIntroPrice | null): string | null => {
	if (!intro || intro.price > 0) return null;
	const units: Record<string, [string, string]> = {
		DAY: ["dia", "dias"],
		WEEK: ["semana", "semanas"],
		MONTH: ["mês", "meses"],
		YEAR: ["ano", "anos"],
	};
	const [one, many] = units[intro.periodUnit] ?? ["", ""];
	return `${String(intro.periodNumberOfUnits)} ${intro.periodNumberOfUnits === 1 ? one : many}`;
};

const toPlan = (pkg: PurchasesPackage): IPlan => {
	const isAnnual = pkg.packageType === PACKAGE_TYPE.ANNUAL;
	const { product } = pkg;
	const perMonth = isAnnual ? product.pricePerMonthString : product.priceString;
	return {
		id: pkg.identifier,
		period: isAnnual ? "annual" : "monthly",
		price: product.priceString,
		priceValue: product.price,
		perMonth: perMonth ?? product.priceString,
		trial: trialLabel(product.introPrice),
	};
};

let packages: PurchasesPackage[] = [];

// Planos da oferta atual (RevenueCat › Offerings › default): mensal e anual
export async function getPlans(): Promise<IPlan[]> {
	if (!IS_PURCHASES_ENABLED) return [];
	configurePurchases();
	const offerings = await Purchases.getOfferings();
	const current = offerings.current?.availablePackages ?? [];
	packages = current.filter(
		(p) => p.packageType === PACKAGE_TYPE.MONTHLY || p.packageType === PACKAGE_TYPE.ANNUAL,
	);
	return packages.map(toPlan);
}

const isCancelled = (error: unknown): boolean =>
	typeof error === "object" &&
	error !== null &&
	"userCancelled" in error &&
	error.userCancelled === true;

export async function purchasePlan(planId: string): Promise<IPurchaseResult> {
	const pkg = packages.find((p) => p.identifier === planId);
	if (!pkg) throw new Error("plan_not_found");
	try {
		await Purchases.purchasePackage(pkg);
		return "purchased";
	} catch (error) {
		if (isCancelled(error)) return "cancelled";
		throw error;
	}
}

// "Restaurar compras" (exigido pela Apple): devolve se ficou assinante
export async function restorePurchases(): Promise<ISubscriptionStatus> {
	if (!IS_PURCHASES_ENABLED) return UNLOCKED;
	return toStatus(await Purchases.restorePurchases());
}

// Abre a tela de assinaturas do iPhone (trocar plano ou cancelar)
export async function openManageSubscriptions(): Promise<void> {
	if (!IS_PURCHASES_ENABLED) return;
	await Purchases.showManageSubscriptions();
}

// Avisa quando a assinatura muda (compra, renovação, fim) com o app aberto
export function onSubscriptionChange(listener: (status: ISubscriptionStatus) => void): () => void {
	if (!IS_PURCHASES_ENABLED) return () => undefined;
	configurePurchases();
	const handler = (info: CustomerInfo): void => {
		listener(toStatus(info));
	};
	Purchases.addCustomerInfoUpdateListener(handler);
	return () => {
		Purchases.removeCustomerInfoUpdateListener(handler);
	};
}
