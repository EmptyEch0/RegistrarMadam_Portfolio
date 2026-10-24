import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import AdminForm from "@/components/admin/AdminForm";

type PublicationRecognition = {
  id: string;
  title: string;
  description: string;
  year: number;
  issued_by: string;
};

export default function PublicationsRecognitionAdmin() {
  const [data, setData] = useState<PublicationRecognition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PublicationRecognition | null>(null);

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("publications_recognition")
      .select("*")
      .order("created_at", { ascending: false });

    setData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= SAVE =================
  const handleSave = async (formData: any) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      issued_by: formData.issued_by,
      year: formData.year ? Number(formData.year) : null,
    };

    if (editing) {
      await supabase
        .from("publications_recognition")
        .update(payload)
        .eq("id", editing.id);
    } else {
      await supabase.from("publications_recognition").insert(payload);
    }

    setShowForm(false);
    setEditing(null);
    fetchData();
  };

  // ================= DELETE =================
  const handleDelete = async (row: PublicationRecognition) => {
    if (!confirm("Remove this publication / recognition?")) return;

    await supabase
      .from("publications_recognition")
      .delete()
      .eq("id", row.id);

    fetchData();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0B132B] font-serif tracking-tight">Publications & Recognition</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Manage special citations, book chapters, and research accolades</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          + Add Entry
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 border border-[#E7E2D8] rounded-2xl shadow-sm animate-fade-in-up">
          <AdminForm
            fields={[
              {
                name: "title",
                label: "Title",
                type: "text",
                required: true,
              },
              {
                name: "issued_by",
                label: "Issued By",
                type: "text",
              },
              {
                name: "year",
                label: "Year",
                type: "text",
              },
              {
                name: "description",
                label: "Description",
                type: "textarea",
              },
            ]}
            initialData={editing || {}}
            submitLabel={editing ? "Update Entry" : "Add Entry"}
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
              { key: "issued_by", label: "Issued By" },
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
