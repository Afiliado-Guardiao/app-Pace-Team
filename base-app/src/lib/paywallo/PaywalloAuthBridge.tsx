import React from "react";

import { usePaywalloAuthSync } from "./hooks";

interface IPaywalloAuthBridgeProps {
	children: React.ReactNode;
}

export const PaywalloAuthBridge: React.FC<IPaywalloAuthBridgeProps> = ({ children }) => {
	usePaywalloAuthSync();
	return <>{children}</>;
};
