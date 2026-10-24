import React from "react";

import { usePurchasesSync } from "./usePurchasesSync";

// Mantém o RevenueCat em dia com a conta logada (sem interface).
export const PurchasesBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	usePurchasesSync();
	return <>{children}</>;
};
