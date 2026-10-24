import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import AdminForm from "@/components/admin/AdminForm";

type Journal = {
  id: string;
  authors: string;
  title: string;
  journal: string;
  details: string;
  year: number;
  link: string;
};

export default function JournalsAdmin() {
  const [data, setData] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Journal | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("journals")
      .select("*")
      .order("created_at", { ascending: false });

    setData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (formData: any) => {
    const payload = {
      ...formData,
      year: formData.year ? Number(formData.year) : null,
    };

    if (editing) {
      await supabase.from("journals").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("journals").insert(payload);
    }

    setShowForm(false);
    setEditing(null);
    fetchData();
  };

  const handleDelete = async (row: Journal) => {
    if (!confirm("Remove this journal entry?")) return;

    await supabase.from("journals").delete().eq("id", row.id);
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0B132B] font-serif tracking-tight">Journal Publications</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Manage international journals, IEEE/ACM papers, and SCI/Scopus records</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          + Add Journal
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 border border-[#E7E2D8] rounded-2xl shadow-sm animate-fade-in-up">
          <AdminForm
            fields={[
              { name: "title", label: "Paper Title", type: "text", required: true },
              { name: "authors", label: "Authors", type: "text", required: true },
              { name: "journal", label: "Journal Name", type: "text", required: true },
              { name: "year", label: "Year", type: "text" },
              { name: "link", label: "Publication Link", type: "text" },
              { name: "details", label: "Indexing / Details", type: "textarea" },
            ]}
            initialData={editing || {}}
            submitLabel={editing ? "Update Journal" : "Add Journal"}
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
              { key: "journal", label: "Journal" },
              { key: "year", label: "Year" },
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
