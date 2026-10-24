import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import AdminForm from "@/components/admin/AdminForm";

export default function DailyActivitiesAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  /* -------- FETCH -------- */
  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("daily_activities")
      .select("*")
      .order("activity_date", { ascending: false });

    setData(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* -------- SAVE -------- */
  const handleSave = async (formData: any) => {
    const { error } = editing
      ? await supabase
          .from("daily_activities")
          .update(formData)
          .eq("id", editing.id)
      : await supabase
          .from("daily_activities")
          .insert(formData);

    if (error) {
      alert("A report for this date already exists.");
      return;
    }

    setShowForm(false);
    setEditing(null);
    fetchData();
  };

  /* -------- DELETE -------- */
  const handleDelete = async (row: any) => {
    if (!confirm("Delete this daily report?")) return;
    await supabase.from("daily_activities").delete().eq("id", row.id);
    fetchData();
  };

  const fields = [
    { name: "activity_date", label: "Date", type: "date", required: true },
    { name: "highlights", label: "Today's Highlights", type: "textarea" },
    { name: "meetings", label: "Meetings / Collaborations", type: "textarea" },
    { name: "work_done", label: "Work Done Today", type: "textarea" },
    { name: "remarks", label: "Remarks", type: "textarea" },
  ];

  const columns = [
    { key: "activity_date", label: "Date" },
    { key: "highlights", label: "Highlights" },
    { key: "meetings", label: "Meetings" },
    { key: "work_done", label: "Work Done" },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0B132B] font-serif tracking-tight">Daily Activities</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Log administrative operations, institutional events, and meetings</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          + Add Today's Report
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 bg-white p-6 border border-[#E7E2D8] rounded-2xl shadow-sm animate-fade-in-up">
          <AdminForm
            fields={fields}
            initialData={
              editing
                ? editing
                : {
                    activity_date: new Date().toISOString().split("T")[0],
                  }
            }
            submitLabel={editing ? "Update Report" : "Save Report"}
            onCancel={() => setShowForm(false)}
            onSubmit={handleSave}
          />
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-sm text-[#64748B]">Loading daily activities…</div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E7E2D8] shadow-sm overflow-hidden">
          <AdminTable
            columns={columns}
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