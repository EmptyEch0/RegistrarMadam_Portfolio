import { supabase, supabaseAdmin } from "@/lib/supabase";

export interface VisitorProfile {
  name: string;
  email: string;
  savedAt: string;
}

export interface VisitorLog {
  id: string;
  visitor_name: string;
  visitor_email: string;
  accessed_item: string;
  access_type: "course" | "puzzle" | "general";
  created_at: string;
}

const VISITOR_PROFILE_KEY = "qlearn_visitor_profile";
const VISITOR_LOGS_LOCAL_KEY = "admin_visitor_access_logs";
const LAST_LOG_CACHE_KEY = "qlearn_last_logged_action";

/**
 * Get current visitor profile from localStorage
 */
export function getSavedVisitor(): VisitorProfile | null {
  try {
    const raw = localStorage.getItem(VISITOR_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === "string" && typeof parsed.email === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save visitor profile to localStorage (and pre-fill puzzle player name)
 */
export function saveVisitorProfile(name: string, email: string): VisitorProfile {
  const profile: VisitorProfile = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(VISITOR_PROFILE_KEY, JSON.stringify(profile));
    // Also sync with puzzle leaderboard player name
    localStorage.setItem("qlearn_puzzle_player_name", profile.name);
  } catch (err) {
    console.error("Failed saving visitor profile locally:", err);
  }

  return profile;
}

/**
 * Clear visitor profile
 */
export function clearVisitorProfile(): void {
  try {
    localStorage.removeItem(VISITOR_PROFILE_KEY);
  } catch (err) {
    console.error("Failed clearing visitor profile:", err);
  }
}

/**
 * Log a course or puzzle visit.
 * Stores in both localStorage and Supabase (if table exists).
 * Deduplicates rapid identical triggers (within 30 seconds).
 */
export async function logVisitorAccess(
  item: string,
  type: "course" | "puzzle" | "general" = "course"
): Promise<VisitorLog | null> {
  const visitor = getSavedVisitor();
  if (!visitor) return null;

  const now = Date.now();
  const cacheKey = `${visitor.email}_${item}_${type}`;

  // Debounce check: don't log the exact same item for the same visitor within 30s
  try {
    const lastLogsRaw = sessionStorage.getItem(LAST_LOG_CACHE_KEY);
    const lastLogs: Record<string, number> = lastLogsRaw ? JSON.parse(lastLogsRaw) : {};
    if (lastLogs[cacheKey] && now - lastLogs[cacheKey] < 30000) {
      return null;
    }
    lastLogs[cacheKey] = now;
    sessionStorage.setItem(LAST_LOG_CACHE_KEY, JSON.stringify(lastLogs));
  } catch {
    // sessionStorage failure is non-blocking
  }

  const logEntry: VisitorLog = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    visitor_name: visitor.name,
    visitor_email: visitor.email,
    accessed_item: item,
    access_type: type,
    created_at: new Date().toISOString(),
  };

  // 1. Save locally to admin logs cache
  try {
    const rawLocal = localStorage.getItem(VISITOR_LOGS_LOCAL_KEY);
    const existing: VisitorLog[] = rawLocal ? JSON.parse(rawLocal) : [];
    const updated = [logEntry, ...existing].slice(0, 500); // keep up to 500 logs
    localStorage.setItem(VISITOR_LOGS_LOCAL_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not save log entry to localStorage:", err);
  }

  // 2. Try inserting into Supabase visitor_logs table
  try {
    const client = supabaseAdmin || supabase;
    if (client) {
      const { error } = await client.from("visitor_logs").insert({
        id: logEntry.id,
        visitor_name: logEntry.visitor_name,
        visitor_email: logEntry.visitor_email,
        accessed_item: logEntry.accessed_item,
        access_type: logEntry.access_type,
        created_at: logEntry.created_at,
      });

      if (error) {
        // Table may not exist yet in Supabase schema cache; local copy is safe
        console.info("Supabase visitor_logs notice:", error.message);
      }
    }
  } catch (err) {
    console.info("Supabase sync notice:", err);
  }

  return logEntry;
}

/**
 * Fetch all visitor logs for the admin dashboard.
 * Merges Supabase records with local records.
 */
export async function getVisitorLogs(): Promise<{ logs: VisitorLog[]; isCloudSynced: boolean }> {
  let cloudLogs: VisitorLog[] = [];
  let isCloudSynced = false;

  // 1. Try fetching from Supabase
  try {
    const client = supabaseAdmin || supabase;
    if (client) {
      const { data, error } = await client
        .from("visitor_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);

      if (!error && data && Array.isArray(data)) {
        cloudLogs = data as VisitorLog[];
        isCloudSynced = true;
      }
    }
  } catch (err) {
    console.warn("Could not fetch cloud visitor logs:", err);
  }

  // 2. Read local logs
  let localLogs: VisitorLog[] = [];
  try {
    const rawLocal = localStorage.getItem(VISITOR_LOGS_LOCAL_KEY);
    if (rawLocal) {
      localLogs = JSON.parse(rawLocal);
    }
  } catch (err) {
    console.warn("Could not read local visitor logs:", err);
  }

  // 3. Merge & Deduplicate by id or (email + item + created_at)
  const map = new Map<string, VisitorLog>();

  // Add cloud logs first
  cloudLogs.forEach((l) => map.set(l.id, l));

  // Add local logs, syncing any un-synced to map
  localLogs.forEach((l) => {
    if (!map.has(l.id)) {
      map.set(l.id, l);
    }
  });

  const merged = Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return { logs: merged, isCloudSynced };
}

/**
 * Clear all visitor logs
 */
export async function clearAllVisitorLogs(): Promise<void> {
  try {
    localStorage.removeItem(VISITOR_LOGS_LOCAL_KEY);
  } catch (err) {
    console.warn("Failed clearing local logs:", err);
  }

  try {
    const client = supabaseAdmin || supabase;
    if (client) {
      await client.from("visitor_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    }
  } catch (err) {
    console.warn("Failed clearing cloud logs:", err);
  }
}

/**
 * Export logs as a CSV file
 */
export function exportVisitorLogsToCSV(logs: VisitorLog[]): void {
  if (!logs || logs.length === 0) return;

  const headers = ["ID", "Visitor Name", "Visitor Email", "Accessed Item", "Type", "Date and Time (UTC)"];
  const rows = logs.map((l) => [
    `"${l.id}"`,
    `"${l.visitor_name.replace(/"/g, '""')}"`,
    `"${l.visitor_email.replace(/"/g, '""')}"`,
    `"${l.accessed_item.replace(/"/g, '""')}"`,
    `"${l.access_type}"`,
    `"${new Date(l.created_at).toLocaleString()}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `visitor_access_logs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
