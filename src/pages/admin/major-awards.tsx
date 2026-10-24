import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import AdminForm from "@/components/admin/AdminForm";

type MajorAward = {
  id: string;
  title: string;
  institution: string;
  badge: string;
  years: string;
  description: string;
};

export default function MajorAwardsAdmin() {
  const [data, setData] = useState<MajorAward[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MajorAward | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("major_awards")
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
        .from("major_awards")
        .update(formData)
        .eq("id", editing.id);
    } else {
      await supabase.from("major_awards").insert(formData);
    }

    setShowForm(false);
    setEditing(null);
    fetchData();
  };

  const handleDelete = async (row: MajorAward) => {
    const ok = confirm("Are you sure you want to remove this award?");
    if (!ok) return;

    await supabase.from("major_awards").delete().eq("id", row.id);
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0B132B] font-serif tracking-tight">Major Awards & Honours</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Manage national, state, and academic recognitions and awards</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          + Add Award
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 border border-[#E7E2D8] rounded-2xl shadow-sm animate-fade-in-up">
          <AdminForm
            fields={[
              { name: "title", label: "Award Title", type: "text", required: true },
              {
                name: "institution",
                label: "Institution",
                type: "text",
              },
              { name: "badge", label: "Badge / Category", type: "text" },
              { name: "years", label: "Year(s)", type: "text" },
              {
                name: "description",
                label: "Description",
                type: "textarea",
              },
            ]}
            initialData={editing || {}}
            submitLabel={editing ? "Update Award" : "Add Award"}
            onCancel={() => setShowForm(false)}
            onSubmit={handleSave}
          />
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#64748B]">Loading...</p>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E7E2D8] shadow-sm overflow-hidden">
          <AdminTable
            columns={[
              { key: "title", label: "Title" },
              { key: "institution", label: "Institution" },
              { key: "years", label: "Year(s)" },
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
