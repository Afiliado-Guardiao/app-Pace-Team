import React, { createContext } from "react";

import { IModalContextValue } from "../types";

export const ModalContext = createContext<IModalContextValue | null>(null);

interface IModalContextProviderProps {
	children: React.ReactNode;
	value: IModalContextValue;
}

export const ModalContextProvider: React.FC<IModalContextProviderProps> = ({
	children,
	value,
}) => {
	return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
