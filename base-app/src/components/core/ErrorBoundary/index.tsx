import React, { Component, ReactNode } from "react";

import { ErrorFallback } from "./ErrorFallback";
import { IErrorBoundaryProps, IErrorBoundaryState } from "./types";

// Error Boundaries exigem class components até que o React ofereça alternativa funcional
export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
	constructor(props: IErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
		};
	}

	static getDerivedStateFromError(error: Error): IErrorBoundaryState {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
		// TODO(fase-2): integrar serviço de error tracking
	}

	resetError = () => {
		this.setState({
			hasError: false,
			error: null,
		});
	};

	render(): ReactNode {
		if (this.state.hasError && this.state.error) {
			return <ErrorFallback error={this.state.error} resetError={this.resetError} />;
		}

		return this.props.children;
	}
}

export * from "./types";
