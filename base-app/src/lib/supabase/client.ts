import { createClient } from "@supabase/supabase-js";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/constants";

import { Database } from "./database.types";
import { sharedAuthStorage } from "./sharedAuthStorage";

// Mesma chave que o supabase-js usa por padrão (sb-<projeto>-auth-token):
// fica explícita porque o atalho do Pace Buddy lê o login por ela.
const projectRef = SUPABASE_URL.replace(/^https?:\/\//, "").split(".")[0] ?? "";
export const AUTH_STORAGE_KEY = `sb-${projectRef}-auth-token`;

// Cliente único do Supabase. A sessão é persistida (App Group no iPhone,
// AsyncStorage nos outros) e o token é renovado automaticamente — não há
// gestão manual de JWT no app.
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: {
		storage: sharedAuthStorage,
		storageKey: AUTH_STORAGE_KEY,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
