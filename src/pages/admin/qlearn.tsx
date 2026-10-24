import AdminLayout from "@/components/admin/AdminLayout";
import QLearnPage from "@/pages/QLearnPage";

export default function AdminQLearn() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="bg-white border border-[#E7E2D8] p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0B132B] font-serif tracking-tight">QLearn Content Management</h1>
            <p className="text-sm text-[#64748B] mt-1">
              Upload and manage video seminars, lecture notes, and PPT Drive presentation links for all course modules.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#E7E2D8]">
          <QLearnPage isAdminPortal={true} />
        </div>
      </div>
    </AdminLayout>
  );
}
