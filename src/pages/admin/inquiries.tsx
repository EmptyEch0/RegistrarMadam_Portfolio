import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  affiliation: string | null;
  request_type: string;
  reference_title: string | null;
  subject: string;
  message: string;
  status: "new" | "replied" | "closed";
  created_at: string;
};

const TYPE_LABELS: Record<string, string> = {
  paper: "Paper request",
  thesis: "Thesis / Ph.D.",
  collaboration: "Collaboration",
  talk: "Talk / event",
  general: "General",
};

// Key lives only for this browser tab; it never ships in the site bundle.
const KEY_STORAGE = "inquiries_key";
const readKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORAGE) || "";
  } catch {
    return "";
  }
};

export default function InquiriesAdmin() {
  const [accessKey, setAccessKey] = useState(readKey);
  const [keyInput, setKeyInput] = useState("");
  const [data, setData] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState<Inquiry | null>(null);

  const fetchData = async (key = accessKey) => {
    if (!key) return;
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_inquiries", { p_key: key });
    setLoading(false);
    if (error) {
      setError(error.message.includes("invalid access key") ? "Wrong access key." : error.message);
      setData([]);
      return false;
    }
    setError("");
    setData((data as Inquiry[]) || []);
    return true;
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await fetchData(keyInput)) {
      setAccessKey(keyInput);
      try {
        sessionStorage.setItem(KEY_STORAGE, keyInput);
      } catch {
        /* storage blocked: key just won't persist across reloads */
      }
    }
  };

  const toggleReplied = async (row: Inquiry) => {
    const next = row.status === "new" ? "replied" : "new";
    const { error } = await supabase.rpc("admin_set_inquiry_status", { p_key: accessKey, p_id: row.id, p_status: next });
    if (error) return setError(error.message);
    fetchData();
  };

  const remove = async (row: Inquiry) => {
    const { error } = await supabase.rpc("admin_delete_inquiry", { p_key: accessKey, p_id: row.id });
    if (error) return setError(error.message);
    if (open?.id === row.id) setOpen(null);
    fetchData();
  };

  const newCount = data.filter((d) => d.status === "new").length;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0B132B] font-serif tracking-tight">
          Requests Inbox {newCount > 0 && <span className="ml-2 text-sm align-middle px-2 py-0.5 rounded-full bg-[#C59B27] text-[#0B132B]">{newCount} new</span>}
        </h2>
        <p className="text-sm text-[#64748B] mt-0.5">Paper requests, thesis guidance, and collaboration messages from the Contact page</p>
      </div>

      {!accessKey || (error && !data.length) ? (
        <form onSubmit={unlock} className="max-w-md bg-white p-6 border border-[#E7E2D8] rounded-2xl shadow-sm space-y-3">
          <label htmlFor="inq-key" className="block text-sm font-semibold text-[#0B132B]">Inbox access key</label>
          <input
            id="inq-key"
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="w-full px-3 py-2 border border-[#E7E2D8] rounded-xl text-sm"
            placeholder="Set in Supabase → admin_secrets"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] font-bold px-4 py-2 rounded-xl">
            Unlock inbox
          </button>
        </form>
      ) : (
        <>
          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          {open && (
            <div className="mb-6 bg-white p-6 border border-[#E7E2D8] rounded-2xl shadow-sm space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <h3 className="font-bold text-lg text-[#0B132B]">{open.subject}</h3>
                <button onClick={() => setOpen(null)} className="text-[#64748B] hover:text-[#0B132B]">Close</button>
              </div>
              <p className="text-[#64748B]">
                {open.name} · <a className="text-[#B58C1F] underline" href={`mailto:${open.email}?subject=${encodeURIComponent("Re: " + open.subject)}`}>{open.email}</a>
                {open.affiliation && <> · {open.affiliation}</>} · {new Date(open.created_at).toLocaleString()}
              </p>
              <p><strong>{TYPE_LABELS[open.request_type] ?? open.request_type}</strong>{open.reference_title && <>: {open.reference_title}</>}</p>
              <p className="whitespace-pre-wrap text-[#0B132B]">{open.message}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#E7E2D8] shadow-sm overflow-hidden">
            <AdminTable<Inquiry>
              loading={loading}
              columns={[
                { key: "created_at", label: "Date", render: (v) => new Date(v).toLocaleDateString() },
                { key: "name", label: "From" },
                { key: "request_type", label: "Type", render: (v) => TYPE_LABELS[v] ?? v },
                { key: "subject", label: "Subject" },
                { key: "status", label: "Status", render: (v) => (v === "new" ? "🟡 New" : v === "replied" ? "✅ Replied" : "Closed") },
              ]}
              data={data}
              onView={setOpen}
              onEdit={toggleReplied}
              onDelete={remove}
            />
          </div>
          <p className="mt-3 text-xs text-[#64748B]">👁 view message · ✏️ toggle New / Replied · 🗑 delete</p>
        </>
      )}
    </AdminLayout>
  );
}
