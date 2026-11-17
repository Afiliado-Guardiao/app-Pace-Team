// Ditado do PACE AI: junta os pedaços da fala. No iPhone, depois de uma
// pausa (o atleta respira, pensa, procura a palavra), o reconhecimento fecha
// o trecho e começa um novo do zero; sem guardar os trechos fechados, a fala
// nova apagava a anterior. Aqui nada some: só o teclado apaga.
export interface IDictation {
	done: readonly string[];
	live: string;
}

export const EMPTY_DICTATION: IDictation = { done: [], live: "" };

const norm = (s: string): string => s.toLowerCase().replace(/\s+/g, " ").trim();

// O trecho ao vivo recomeçou do zero (sem aviso de fim): bem mais curto e com
// outro começo. Correção normal do iPhone mantém o começo e o tamanho.
const restarted = (prev: string, next: string): boolean => {
	if (!prev || next.length >= prev.length * 0.5) return false;
	const head = Math.min(5, next.length);
	return norm(prev).slice(0, head) !== norm(next).slice(0, head);
};

export const addResult = (d: IDictation, raw: string, isFinal: boolean): IDictation => {
	const text = raw.trim();
	if (isFinal) {
		const piece = text || d.live;
		const last = d.done[d.done.length - 1];
		// O fim de verdade (ao parar) pode repetir o último trecho já fechado
		if (!piece || (last && norm(last) === norm(piece))) return { done: d.done, live: "" };
		return { done: [...d.done, piece], live: "" };
	}
	if (!text) return d;
	if (restarted(d.live, text)) return { done: [...d.done, d.live], live: text };
	return { done: d.done, live: text };
};

export const dictationText = (d: IDictation): string =>
	[...d.done, d.live].filter(Boolean).join(" ").trim();
