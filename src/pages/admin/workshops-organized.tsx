import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import AdminForm from "@/components/admin/AdminForm";

type WorkshopOrganized = {
  id: string;
  description: string;
  year: number;
};

export default function WorkshopsOrganizedAdmin() {
  const [data, setData] = useState<WorkshopOrganized[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<WorkshopOrganized | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("workshops_organized")
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
      description: formData.description,
      year: formData.year ? Number(formData.year) : null,
    };

    if (editing) {
      await supabase
        .from("workshops_organized")
        .update(payload)
        .eq("id", editing.id);
    } else {
      await supabase.from("workshops_organized").insert(payload);
    }

    setShowForm(false);
    setEditing(null);
    fetchData();
  };

  const handleDelete = async (row: WorkshopOrganized) => {
    if (!confirm("Remove this organized workshop?")) return;

    await supabase
      .from("workshops_organized")
      .delete()
      .eq("id", row.id);

    fetchData();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0B132B] font-serif tracking-tight">Workshops Organized</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Manage conferences, hackathons, and national workshops coordinated</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          + Add Workshop
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 border border-[#E7E2D8] rounded-2xl shadow-sm animate-fade-in-up">
          <AdminForm
            fields={[
              {
                name: "description",
                label: "Workshop Description",
                type: "textarea",
                required: true,
              },
              { name: "year", label: "Year", type: "text" },
            ]}
            initialData={editing || {}}
            submitLabel={editing ? "Update Workshop" : "Add Workshop"}
            onCancel={() => setShowForm(false)}
            onSubmit={handleSave}
          />
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-2xl border border-[#E7E2D8] shadow-sm overflow-hidden">
          <AdminTable
            columns={[
              { key: "description", label: "Workshop" },
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
