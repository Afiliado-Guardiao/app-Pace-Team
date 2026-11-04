import { saveBuddyTimings } from "@/lib/supabase";

import { BUDDY_KEYS, buddyNative } from "./native";

interface ITiming {
	at: number;
	event: string;
}

const isTiming = (value: unknown): value is ITiming =>
	typeof value === "object" &&
	value !== null &&
	"at" in value &&
	typeof value.at === "number" &&
	"event" in value &&
	typeof value.event === "string";

const MAX_EVENTS = 200;

// Manda ao servidor os tempos que o cartão do Buddy anotou (chamou, desenhou,
// apertou um botão, redesenhou) e limpa a lista. Sem lista, não faz nada.
export async function flushBuddyTimings(): Promise<void> {
	const raw = buddyNative.get(BUDDY_KEYS.timings);
	if (!raw) return;
	let events: ITiming[] = [];
	try {
		const parsed: unknown = JSON.parse(raw);
		events = Array.isArray(parsed) ? parsed.filter(isTiming).slice(-MAX_EVENTS) : [];
	} catch {
		events = [];
	}
	if (events.length > 0) await saveBuddyTimings(events);
	buddyNative.remove(BUDDY_KEYS.timings);
}
