import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import AdminForm from "@/components/admin/AdminForm";

type Textbook = {
  id: string;
  title: string;
  authors: string;
  publisher: string;
  isbn: string;
  edition: string;
  kind: "book" | "chapter";
  year: number;
  link: string;
};

export default function TextbooksAdmin() {
  const [data, setData] = useState<Textbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Textbook | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("textbooks")
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
      kind: String(formData.kind || "").toLowerCase().includes("chapter") ? "chapter" : "book",
    };

    if (editing) {
      await supabase.from("textbooks").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("textbooks").insert(payload);
    }

    setShowForm(false);
    setEditing(null);
    fetchData();
  };

  const handleDelete = async (row: Textbook) => {
    if (!confirm("Remove this textbook entry?")) return;

    await supabase.from("textbooks").delete().eq("id", row.id);
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0B132B] font-serif tracking-tight">Textbooks & Book Chapters</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Shown under the Textbooks tab on the Publications page</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          + Add Textbook
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 border border-[#E7E2D8] rounded-2xl shadow-sm animate-fade-in-up">
          <AdminForm
            fields={[
              { name: "title", label: "Book / Chapter Title", type: "text", required: true },
              { name: "authors", label: "Authors", type: "text", required: true },
              { name: "kind", label: "Type (book or chapter)", type: "text" },
              { name: "publisher", label: "Publisher", type: "text" },
              { name: "edition", label: "Edition", type: "text" },
              { name: "isbn", label: "ISBN", type: "text" },
              { name: "year", label: "Year", type: "number" },
              { name: "link", label: "Link (publisher / Google Books)", type: "text" },
            ]}
            initialData={editing || {}}
            submitLabel={editing ? "Update Textbook" : "Add Textbook"}
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
              { key: "publisher", label: "Publisher" },
              { key: "kind", label: "Type" },
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
