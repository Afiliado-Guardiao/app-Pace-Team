import { useCallback, useState } from "react";
import { LayoutChangeEvent } from "react-native";

export interface ILayoutSize {
	width: number;
	height: number;
}

interface IUseLayoutSizeReturn {
	size: ILayoutSize | null;
	onLayout: (event: LayoutChangeEvent) => void;
}

// Mede a superfície para desenhar gradientes e a borda "rim" no tamanho exato.
export const useLayoutSize = (): IUseLayoutSizeReturn => {
	const [size, setSize] = useState<ILayoutSize | null>(null);

	const onLayout = useCallback((event: LayoutChangeEvent) => {
		const { width, height } = event.nativeEvent.layout;
		setSize((prev) => (prev?.width === width && prev.height === height ? prev : { width, height }));
	}, []);

	return { size, onLayout };
};
