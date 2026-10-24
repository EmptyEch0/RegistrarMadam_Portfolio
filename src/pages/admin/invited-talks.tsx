import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import AdminForm from "@/components/admin/AdminForm";

type InvitedTalk = {
  id: string;
  title: string;
  event: string;
  speaker: string;
  date: string;
};

export default function InvitedTalksAdmin() {
  const [data, setData] = useState<InvitedTalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<InvitedTalk | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("invited_talks")
      .select("*")
      .order("created_at", { ascending: false });

    setData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (formData: any) => {
    if (editing) {
      await supabase
        .from("invited_talks")
        .update(formData)
        .eq("id", editing.id);
    } else {
      await supabase.from("invited_talks").insert(formData);
    }

    setShowForm(false);
    setEditing(null);
    fetchData();
  };

  const handleDelete = async (row: InvitedTalk) => {
    if (!confirm("Remove this invited talk?")) return;

    await supabase.from("invited_talks").delete().eq("id", row.id);
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0B132B] font-serif tracking-tight">Invited Talks</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Manage keynote addresses, guest lectures, and invited sessions</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          + Add Talk
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 border border-[#E7E2D8] rounded-2xl shadow-sm animate-fade-in-up">
          <AdminForm
            fields={[
              { name: "title", label: "Talk Title", type: "text", required: true },
              { name: "event", label: "Event", type: "text", required: true },
              { name: "speaker", label: "Speaker", type: "text" },
              { name: "date", label: "Date", type: "text" },
            ]}
            initialData={editing || {}}
            submitLabel={editing ? "Update Talk" : "Add Talk"}
            onCancel={() => setShowForm(false)}
            onSubmit={handleSave}
          />
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-2xl border border-[#E7E2D8] shadow-sm overflow-hidden">
          <AdminTable
            columns={[
              { key: "title", label: "Title" },
              { key: "event", label: "Event" },
              { key: "date", label: "Date" },
            ]}
            data={data}
            onEdit={(row) => {
              setEditing(row);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      )}
    </AdminLayout>
  );
}
