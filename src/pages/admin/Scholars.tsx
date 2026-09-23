import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import AdminForm, { AdminField } from "@/components/admin/AdminForm";
import scholarsJSON from "@/data/scholars.json";
import { CheckCircle2, AlertCircle, Plus } from "lucide-react";

export type ScholarType = "btech" | "mtech" | "mca" | "phd";

const TABLE_MAP: Record<ScholarType, string> = {
  btech: "btech_scholars",
  mtech: "mtech_scholars",
  mca: "mca_scholars",
  phd: "phd_scholars_awarded",
};

const TYPE_LABELS: Record<ScholarType, string> = {
  btech: "B.Tech Scholars",
  mtech: "M.Tech Scholars",
  mca: "MCA Scholars",
  phd: "Ph.D Scholars",
};

const TAB_BUTTONS: { key: ScholarType; label: string }[] = [
  { key: "phd", label: "Ph.D Scholars" },
  { key: "mca", label: "MCA Scholars" },
  { key: "mtech", label: "M.Tech Scholars" },
  { key: "btech", label: "B.Tech Scholars" },
];

export default function ScholarsAdmin() {
  const [type, setType] = useState<ScholarType>("phd");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (msg: string, isError = false) => {
    setFeedback({ type: isError ? "error" : "success", message: msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Helper to get all scholars stored in localStorage
  const getStoredScholars = (): any[] => {
    try {
      const stored = localStorage.getItem("portfolio_scholars_data");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Failed to parse local scholars cache", e);
    }
    return (scholarsJSON as any[]).map((item, idx) => ({
      id: item.id || `${item.type}-${idx + 1}`,
      ...item,
      student_name: item.name,
      scholar_name: item.name,
      roll_number: item.roll,
      project_title: item.title,
      thesis_title: item.title,
      department: item.dept,
      academic_year: item.year,
      awarded_year: item.year,
      university: item.university || "",
    }));
  };

  // Helper to save all scholars to localStorage
  const saveStoredScholars = (list: any[]) => {
    try {
      localStorage.setItem("portfolio_scholars_data", JSON.stringify(list));
    } catch (e) {
      console.error("Failed to update local storage", e);
    }
  };

  /* ---------------- FETCH ---------------- */
  const fetchData = useCallback(async () => {
    setLoading(true);
    let itemsForType: any[] = [];
    let fetchedFromCloud = false;

    // 1. Try Supabase
    try {
      if (supabase && import.meta.env.VITE_SUPABASE_URL) {
        const orderColumn = type === "phd" ? "awarded_year" : "academic_year";
        const { data: tableData, error: tableError } = await supabase
          .from(TABLE_MAP[type])
          .select("*")
          .order(orderColumn, { ascending: false });

        if (!tableError && tableData && tableData.length > 0) {
          itemsForType = tableData;
          fetchedFromCloud = true;

          // Update local cache for this category so everything is synced
          const allStored = getStoredScholars();
          const otherTypes = allStored.filter((item) => (item.type || "").toLowerCase() !== type.toLowerCase());
          saveStoredScholars([...tableData.map((d: any) => ({ ...d, type })), ...otherTypes]);
        }
      }
    } catch (err) {
      console.warn("Supabase fetch failed, loading from local cache:", err);
    }

    // 2. Fallback to local cache & JSON
    if (!fetchedFromCloud) {
      const allLocal = getStoredScholars();
      itemsForType = allLocal.filter((item) => (item.type || "").toLowerCase() === type.toLowerCase());
    }

    // Normalize all items so columns always display cleanly
    const normalized = itemsForType.map((item, index) => ({
      id: item.id || `${type}-${index + 1}`,
      ...item,
      student_name: item.student_name || item.scholar_name || item.name || "Scholar",
      scholar_name: item.scholar_name || item.student_name || item.name || "Scholar",
      name: item.name || item.student_name || item.scholar_name || "Scholar",
      roll_number: item.roll_number || item.roll || "-",
      roll: item.roll || item.roll_number || "-",
      project_title: item.project_title || item.thesis_title || item.title || "-",
      thesis_title: item.thesis_title || item.project_title || item.title || "-",
      title: item.title || item.project_title || item.thesis_title || "-",
      department: item.department || item.dept || (type === "mca" ? "MCA" : type === "btech" ? "Information Technology" : "CSE"),
      dept: item.dept || item.department || (type === "mca" ? "MCA" : type === "btech" ? "Information Technology" : "CSE"),
      academic_year: item.academic_year || item.awarded_year || item.year || "-",
      awarded_year: item.awarded_year || item.academic_year || item.year || "-",
      year: item.year || item.academic_year || item.awarded_year || "-",
      university: item.university || "",
      type: type,
    }));

    setData(normalized);
    setLoading(false);
  }, [type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------------- SAVE (ADD / UPDATE) ---------------- */
  const handleSave = async (formData: any) => {
    const studentName = (formData.student_name || formData.scholar_name || formData.name || "").trim();
    const titleVal = (formData.project_title || formData.thesis_title || formData.title || "").trim();
    const yearVal = (formData.academic_year || formData.awarded_year || formData.year || "").trim();
    const rollVal = (formData.roll_number || formData.roll || "").trim();
    const deptVal = (formData.department || formData.dept || (type === "mca" ? "MCA" : type === "btech" ? "Information Technology" : "CSE")).trim();
    const univVal = formData.university ? formData.university.trim() : null;
    const guideVal = formData.guide_name ? formData.guide_name.trim() : "Dr. G. Jaya Suma";

    let cloudSaved = false;
    let errorMessage = "";

    // 1. Build precise schema payload for Supabase
    let dbPayload: Record<string, any> = {};
    if (type === "phd") {
      dbPayload = {
        scholar_name: studentName,
        roll_number: rollVal || null,
        thesis_title: titleVal,
        department: deptVal,
        university: univVal,
        awarded_year: !isNaN(Number(yearVal)) ? Number(yearVal) : parseInt(yearVal, 10) || 2024,
      };
    } else if (type === "mtech") {
      dbPayload = {
        student_name: studentName,
        roll_number: rollVal || null,
        thesis_title: titleVal,
        department: deptVal,
        academic_year: yearVal,
        university: univVal,
        guide_name: guideVal,
      };
    } else {
      // btech and mca share the same schema
      dbPayload = {
        student_name: studentName,
        roll_number: rollVal || null,
        project_title: titleVal,
        department: deptVal,
        academic_year: yearVal,
        university: univVal,
        guide_name: guideVal,
      };
    }

    // 2. Save to Supabase
    try {
      if (supabase && import.meta.env.VITE_SUPABASE_URL) {
        const table = TABLE_MAP[type];
        const isUUID = editing?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(editing.id);

        if (isUUID) {
          const { error } = await supabase.from(table).update(dbPayload).eq("id", editing.id);
          if (!error) {
            cloudSaved = true;
          } else {
            console.error("Supabase update error:", error);
            errorMessage = error.message;
          }
        } else {
          const { error } = await supabase.from(table).insert(dbPayload);
          if (!error) {
            cloudSaved = true;
          } else {
            console.error("Supabase insert error:", error);
            errorMessage = error.message;
          }
        }
      }
    } catch (sbErr: any) {
      console.warn("Supabase save exception:", sbErr);
      errorMessage = sbErr?.message || "Failed to reach database";
    }

    // 3. Fallback sync to localStorage for offline cache
    const newItemId = editing?.id || `scholar-${Date.now()}`;
    const normalizedRecord = {
      id: newItemId,
      name: studentName,
      student_name: studentName,
      scholar_name: studentName,
      roll: rollVal,
      roll_number: rollVal,
      title: titleVal,
      project_title: titleVal,
      thesis_title: titleVal,
      dept: deptVal,
      department: deptVal,
      year: yearVal,
      academic_year: yearVal,
      awarded_year: type === "phd" && !isNaN(Number(yearVal)) ? Number(yearVal) : yearVal,
      guide_name: guideVal,
      university: univVal,
      type: type,
      created_at: editing?.created_at || new Date().toISOString(),
      ...formData,
    };

    const allStored = getStoredScholars();
    const existingIndex = allStored.findIndex((item) => item.id === newItemId);
    if (existingIndex >= 0) {
      allStored[existingIndex] = { ...allStored[existingIndex], ...normalizedRecord };
    } else {
      allStored.unshift(normalizedRecord);
    }
    saveStoredScholars(allStored);

    if (cloudSaved) {
      showNotification(
        editing
          ? `${TYPE_LABELS[type]} updated in Cloud! (Synced across all devices)`
          : `${TYPE_LABELS[type]} added to Cloud! (Synced across all devices)`
      );
    } else {
      showNotification(
        `${TYPE_LABELS[type]} saved to local cache. (Cloud error: ${errorMessage || "Check database table"})`,
        true
      );
    }

    setShowForm(false);
    setEditing(null);
    fetchData();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (row: any) => {
    const scholarDisplayName = row.name || row.student_name || row.scholar_name || "this scholar";
    if (!confirm(`Delete scholar "${scholarDisplayName}"?`)) return;

    try {
      if (supabase && import.meta.env.VITE_SUPABASE_URL) {
        const table = TABLE_MAP[type];
        const isUUID = row.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(row.id);

        if (isUUID) {
          await supabase.from(table).delete().eq("id", row.id);
        } else {
          const colName = type === "phd" ? "scholar_name" : "student_name";
          const nameVal = row.scholar_name || row.student_name || row.name;
          if (nameVal && nameVal !== "Scholar") {
            await supabase.from(table).delete().eq(colName, nameVal);
          }
        }
      }
    } catch (e) {
      console.warn("Could not delete from cloud:", e);
    }

    // Remove from local storage
    const allStored = getStoredScholars();
    const updated = allStored.filter((item) => item.id !== row.id);
    saveStoredScholars(updated);

    showNotification("Scholar removed successfully.");
    fetchData();
  };

  /* ---------------- FORM FIELDS BY TYPE ---------------- */
  const fieldsByType: Record<ScholarType, AdminField[]> = {
    phd: [
      { name: "scholar_name", label: "Ph.D Scholar Name", type: "text", required: true, placeholder: "e.g. Dr. RVS Lalitha" },
      { name: "roll_number", label: "Roll Number", type: "text", placeholder: "e.g. 09022P0544" },
      { name: "thesis_title", label: "Ph.D Thesis Title", type: "text", required: true, placeholder: "e.g. Vehicular Ad Hoc Networks..." },
      { name: "department", label: "Department", type: "text", placeholder: "CSE" },
      { name: "university", label: "University / Institution", type: "text", placeholder: "e.g. JNTU-GV, JNTUK, etc." },
      { name: "awarded_year", label: "Awarded Year", type: "text", required: true, placeholder: "e.g. 2023" },
    ],
    mca: [
      { name: "student_name", label: "Student Name / Team", type: "text", required: true, placeholder: "e.g. K. Sravani" },
      { name: "roll_number", label: "Roll Number", type: "text", placeholder: "e.g. 18021F0012" },
      { name: "project_title", label: "MCA Project / Thesis Title", type: "text", required: true, placeholder: "e.g. Cloud-Based Intelligent Healthcare..." },
      { name: "department", label: "Department", type: "text", placeholder: "MCA / CSE" },
      { name: "academic_year", label: "Academic Year", type: "text", required: true, placeholder: "e.g. 2023-2024" },
      { name: "university", label: "College / University (Optional)", type: "text", placeholder: "Leave empty or enter institution" },
      { name: "guide_name", label: "Guide / Coordinator Name", type: "text", placeholder: "Dr. G. Jaya Suma" },
    ],
    mtech: [
      { name: "student_name", label: "Student Name", type: "text", required: true, placeholder: "e.g. G. Rajesh" },
      { name: "roll_number", label: "Roll Number", type: "text", placeholder: "e.g. 17022D5804" },
      { name: "thesis_title", label: "M.Tech Thesis Title", type: "text", required: true, placeholder: "e.g. Optimized Resource Allocation..." },
      { name: "department", label: "Department", type: "text", placeholder: "CSE / IT" },
      { name: "academic_year", label: "Academic Year", type: "text", required: true, placeholder: "e.g. 2022-2023" },
      { name: "university", label: "College / University (Optional)", type: "text", placeholder: "Leave empty or enter institution" },
      { name: "guide_name", label: "Guide Name", type: "text", placeholder: "Dr. G. Jaya Suma" },
    ],
    btech: [
      { name: "student_name", label: "Student Name(s) / Team", type: "text", required: true, placeholder: "e.g. Rishitha Reddy | B. Sowmya | ..." },
      { name: "roll_number", label: "Roll Number(s)", type: "text", placeholder: "e.g. 22VV1A1257 | 22VV1A1208 | ..." },
      { name: "project_title", label: "B.Tech Project Title", type: "text", required: true, placeholder: "e.g. Care Connect: Automated Patient..." },
      { name: "department", label: "Department", type: "text", placeholder: "Information Technology" },
      { name: "academic_year", label: "Academic Year", type: "text", required: true, placeholder: "e.g. 2026" },
      { name: "university", label: "College / University (Optional)", type: "text", placeholder: "Leave empty or enter institution" },
      { name: "guide_name", label: "Guide Name", type: "text", placeholder: "Dr. G. Jaya Suma" },
    ],
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columnsByType: Record<ScholarType, any[]> = {
    phd: [
      { key: "scholar_name", label: "Scholar Name" },
      { key: "roll_number", label: "Roll No" },
      { key: "thesis_title", label: "Thesis Title" },
      { key: "awarded_year", label: "Awarded Year" },
      { key: "university", label: "University" },
    ],
    mca: [
      { key: "student_name", label: "Student Name" },
      { key: "roll_number", label: "Roll No" },
      { key: "project_title", label: "Project Title" },
      { key: "academic_year", label: "Year" },
      { key: "department", label: "Department" },
    ],
    mtech: [
      { key: "student_name", label: "Student Name" },
      { key: "roll_number", label: "Roll No" },
      { key: "thesis_title", label: "Thesis Title" },
      { key: "academic_year", label: "Year" },
      { key: "department", label: "Department" },
    ],
    btech: [
      { key: "student_name", label: "Student Name" },
      { key: "roll_number", label: "Roll No" },
      { key: "project_title", label: "Project Title" },
      { key: "academic_year", label: "Year" },
      { key: "department", label: "Department" },
    ],
  };

  // Pre-fill data for form when editing
  const getEditingInitialData = () => {
    if (!editing) {
      return {
        department: type === "mca" ? "MCA" : type === "btech" ? "Information Technology" : "CSE",
        guide_name: "Dr. G. Jaya Suma",
        university: "",
      };
    }
    return {
      ...editing,
      student_name: editing.student_name || editing.scholar_name || editing.name || "",
      scholar_name: editing.scholar_name || editing.student_name || editing.name || "",
      roll_number: editing.roll_number || editing.roll || "",
      project_title: editing.project_title || editing.thesis_title || editing.title || "",
      thesis_title: editing.thesis_title || editing.project_title || editing.title || "",
      department: editing.department || editing.dept || (type === "mca" ? "MCA" : type === "btech" ? "Information Technology" : "CSE"),
      academic_year: editing.academic_year || editing.awarded_year || editing.year || "",
      awarded_year: editing.awarded_year || editing.academic_year || editing.year || "",
      guide_name: editing.guide_name || "Dr. G. Jaya Suma",
      university: editing.university || "",
    };
  };

  return (
    <AdminLayout>
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-md transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Scholars Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage Ph.D., MCA, M.Tech, and B.Tech scholars and mentorship records
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add {TYPE_LABELS[type].replace(" Scholars", "")} Scholar
        </button>
      </div>

      {/* ---------- TABS ---------- */}
      <div className="flex flex-wrap gap-2.5 mb-6 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/60 max-w-fit">
        {TAB_BUTTONS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setType(t.key);
              setShowForm(false);
              setEditing(null);
            }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              type === t.key
                ? "bg-white text-blue-700 shadow-sm border border-gray-200/80 scale-[1.02]"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ---------- FORM (MODAL / INLINE) ---------- */}
      {showForm && (
        <div className="mb-8 bg-white/90 backdrop-blur-md p-6 border border-blue-100 rounded-2xl shadow-xl animate-fade-in-up">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">
              {editing ? `Edit ${TYPE_LABELS[type]}` : `Add New ${TYPE_LABELS[type]}`}
            </h3>
            <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-full uppercase">
              {type}
            </span>
          </div>

          <AdminForm
            fields={fieldsByType[type]}
            initialData={getEditingInitialData()}
            submitLabel={editing ? "Update Scholar" : "Save Scholar"}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onSubmit={handleSave}
          />
        </div>
      )}

      {/* ---------- TABLE ---------- */}
      {!loading && (
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden">
          <AdminTable
            columns={columnsByType[type]}
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
