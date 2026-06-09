import React from "react";

import { useSuperwallAuthSync } from "./hooks";

interface ISuperwallAuthBridgeProps {
	children: React.ReactNode;
}

export const SuperwallAuthBridge: React.FC<ISuperwallAuthBridgeProps> = ({ children }) => {
	useSuperwallAuthSync();
	return <>{children}</>;
};
