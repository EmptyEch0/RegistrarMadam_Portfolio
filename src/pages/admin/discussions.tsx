import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { categoryLabel } from "@/lib/sections";

type Status = "pending" | "approved" | "rejected";
type Thread = {
  id: string; title: string; body: string; category: string; author_name: string;
  status: Status; is_pinned: boolean; is_locked: boolean; created_at: string;
};
type Reply = { id: string; thread_id: string; body: string; author_name: string; status: Status; created_at: string };

// Same access key as the Requests Inbox (admin_secrets.inquiries_key), kept for this tab only
const KEY_STORAGE = "inquiries_key";
const readKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORAGE) || "";
  } catch {
    return "";
  }
};

const btn = "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors";
const btnApprove = `${btn} bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100`;
const btnPlain = `${btn} bg-white border-[#E7E2D8] text-[#0B132B] hover:bg-[#F6F3EC]`;
const btnDanger = `${btn} bg-white border-red-200 text-red-600 hover:bg-red-50`;

export default function DiscussionsAdmin() {
  const [accessKey, setAccessKey] = useState(readKey);
  const [keyInput, setKeyInput] = useState("");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const load = async (key = accessKey) => {
    if (!key) return false;
    const { data, error } = await supabase.rpc("admin_list_discussions", { p_key: key });
    if (error) {
      setError(error.message.includes("invalid access key") ? "Wrong access key." : error.message);
      setUnlocked(false);
      return false;
    }
    setError("");
    setThreads(data?.threads ?? []);
    setReplies(data?.replies ?? []);
    setUnlocked(true);
    return true;
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await load(keyInput)) {
      setAccessKey(keyInput);
      try {
        sessionStorage.setItem(KEY_STORAGE, keyInput);
      } catch {
        /* storage blocked: key won't persist across reloads */
      }
    }
  };

  const act = async (kind: "thread" | "reply", id: string, action: string) => {
    if (action === "delete" && !confirm(kind === "thread" ? "Delete this topic and all its replies?" : "Delete this reply?")) return;
    const { error } = await supabase.rpc("admin_moderate", { p_key: accessKey, p_kind: kind, p_id: id, p_action: action });
    if (error) return setError(error.message);
    load();
  };

  const threadTitle = (id: string) => threads.find((t) => t.id === id)?.title ?? "(deleted topic)";
  const pendingThreads = threads.filter((t) => t.status === "pending");
  const pendingReplies = replies.filter((r) => r.status === "pending");
  const liveThreads = threads.filter((t) => t.status === "approved");

  if (!unlocked)
    return (
      <AdminLayout>
        <h2 className="text-2xl font-bold text-[#0B132B] font-serif tracking-tight mb-6">Discussion Moderation</h2>
        <form onSubmit={unlock} className="max-w-md bg-white p-6 border border-[#E7E2D8] rounded-2xl shadow-sm space-y-3">
          <label htmlFor="disc-key" className="block text-sm font-semibold text-[#0B132B]">Access key (same as Requests Inbox)</label>
          <input
            id="disc-key"
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="w-full px-3 py-2 border border-[#E7E2D8] rounded-xl text-sm"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] font-bold px-4 py-2 rounded-xl">
            Unlock
          </button>
        </form>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0B132B] font-serif tracking-tight">Discussion Moderation</h2>
        <p className="text-sm text-[#64748B] mt-0.5">Nothing is public until you approve it.</p>
      </div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {/* ---------- Review queue ---------- */}
      <h3 className="font-bold text-[#0B132B] mb-3">
        Waiting for review <span className="text-[#B58C1F]">({pendingThreads.length + pendingReplies.length})</span>
      </h3>
      {pendingThreads.length + pendingReplies.length === 0 && (
        <p className="text-sm text-[#64748B] mb-8">All caught up.</p>
      )}
      <div className="space-y-3 mb-10">
        {pendingThreads.map((t) => (
          <div key={t.id} className="bg-white p-5 border border-[#E7E2D8] rounded-2xl shadow-sm">
            <p className="text-xs text-[#64748B] mb-1">
              NEW TOPIC · {categoryLabel(t.category)} · {t.author_name} · {new Date(t.created_at).toLocaleString()}
            </p>
            <p className="font-semibold text-[#0B132B]">{t.title}</p>
            <p className="text-sm text-[#0B132B]/80 whitespace-pre-wrap mt-1">{t.body}</p>
            <div className="flex gap-2 mt-3">
              <button className={btnApprove} onClick={() => act("thread", t.id, "approve")}>Approve</button>
              <button className={btnPlain} onClick={() => act("thread", t.id, "reject")}>Reject</button>
              <button className={btnDanger} onClick={() => act("thread", t.id, "delete")}>Delete</button>
            </div>
          </div>
        ))}
        {pendingReplies.map((r) => (
          <div key={r.id} className="bg-white p-5 border border-[#E7E2D8] rounded-2xl shadow-sm">
            <p className="text-xs text-[#64748B] mb-1">
              REPLY to "{threadTitle(r.thread_id)}" · {r.author_name} · {new Date(r.created_at).toLocaleString()}
            </p>
            <p className="text-sm text-[#0B132B]/80 whitespace-pre-wrap">{r.body}</p>
            <div className="flex gap-2 mt-3">
              <button className={btnApprove} onClick={() => act("reply", r.id, "approve")}>Approve</button>
              <button className={btnPlain} onClick={() => act("reply", r.id, "reject")}>Reject</button>
              <button className={btnDanger} onClick={() => act("reply", r.id, "delete")}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Live topics ---------- */}
      <h3 className="font-bold text-[#0B132B] mb-3">Live topics ({liveThreads.length})</h3>
      <div className="bg-white border border-[#E7E2D8] rounded-2xl shadow-sm divide-y divide-[#E7E2D8]">
        {liveThreads.length === 0 && <p className="p-5 text-sm text-[#64748B]">No approved topics yet.</p>}
        {liveThreads.map((t) => (
          <div key={t.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <Link to={`/discuss/${t.id}`} target="_blank" className="font-semibold text-[#0B132B] hover:text-[#B58C1F]">
                {t.is_pinned && "📌 "}{t.is_locked && "🔒 "}{t.title}
              </Link>
              <p className="text-xs text-[#64748B]">
                {categoryLabel(t.category)} · {t.author_name} · {replies.filter((r) => r.thread_id === t.id && r.status === "approved").length} replies
              </p>
            </div>
            <div className="flex gap-2">
              <button className={btnPlain} onClick={() => act("thread", t.id, t.is_pinned ? "unpin" : "pin")}>{t.is_pinned ? "Unpin" : "Pin"}</button>
              <button className={btnPlain} onClick={() => act("thread", t.id, t.is_locked ? "unlock" : "lock")}>{t.is_locked ? "Unlock" : "Lock"}</button>
              <button className={btnDanger} onClick={() => act("thread", t.id, "delete")}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
