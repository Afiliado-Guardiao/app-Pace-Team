import React from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "../client";

interface IQueryProviderProps {
	children: React.ReactNode;
}

export const QueryProvider: React.FC<IQueryProviderProps> = ({ children }) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
