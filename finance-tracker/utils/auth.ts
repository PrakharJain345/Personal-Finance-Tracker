import { createClient } from "./supabase/client";

export interface UserSession {
  id: string;
  email: string;
  isDemo: boolean;
  offlineFallback?: boolean;
}

const SESSION_COOKIE_NAME = "fintrack-session";
const SESSION_STORAGE_KEY = "fintrack_active_user";

export function getLocalSession(): UserSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Fallback: check cookie
    const cookies = document.cookie.split("; ");
    const sessionCookie = cookies.find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
    if (sessionCookie) {
      const val = decodeURIComponent(sessionCookie.split("=")[1]);
      const parsed = JSON.parse(val);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(parsed));
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function setLocalSession(email: string, isDemo = false, offlineFallback = false, id?: string): UserSession {
  const existing = getLocalSession();
  const session: UserSession = {
    id: id || (existing?.email === email ? existing.id : isDemo ? "demo-user-id" : `local-${Date.now()}`),
    email,
    isDemo,
    offlineFallback,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      // Set cookie for 30 days so Next.js proxy/middleware recognizes it
      const cookieVal = encodeURIComponent(JSON.stringify(session));
      document.cookie = `${SESSION_COOKIE_NAME}=${cookieVal}; path=/; max-age=2592000; SameSite=Lax`;
    } catch (e) {
      console.error("Failed to save session", e);
    }
  }

  return session;
}

export function clearLocalSession(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    } catch {
      // ignore
    }
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const local = getLocalSession();
  if (local) return local;

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      return setLocalSession(user.email, false, false);
    }
  } catch {
    // Supabase unreachable or network failure
  }

  return null;
}

export async function isSupabaseOnline(): Promise<boolean> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("placeholder")) return false;

    // Fast probe with 2.5s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      method: "GET",
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);
    return !!res && res.status < 500;
  } catch {
    return false;
  }
}
