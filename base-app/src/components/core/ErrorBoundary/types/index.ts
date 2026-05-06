export interface IErrorBoundaryProps {
	children: React.ReactNode;
}

export interface IErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}
