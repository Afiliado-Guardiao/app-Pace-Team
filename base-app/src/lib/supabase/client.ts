import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/constants";

import { Database } from "./database.types";

// Cliente único do Supabase. A sessão é persistida no AsyncStorage e o token
// é renovado automaticamente — não há gestão manual de JWT no app.
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
