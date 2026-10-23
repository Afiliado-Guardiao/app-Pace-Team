// letter-spacing em "em" (CSS) convertido para pontos do React Native.
export const tracking = (em: number, fontSize: number): number => em * fontSize;

// Iniciais do Avatar: até duas palavras, em maiúsculas.
export const initialsOf = (name: string): string =>
	name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase();
