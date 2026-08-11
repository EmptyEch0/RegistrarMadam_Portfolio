import AdminLayout from "@/components/admin/AdminLayout";
import QLearnPage from "@/pages/QLearnPage";

export default function AdminQLearn() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="bg-white/80 backdrop-blur-md border border-white/40 p-5 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-serif">QLearn Content Management</h1>
            <p className="text-xs text-gray-600 mt-1">
              Upload and manage video seminars, lecture notes, and PPT Drive presentation links for all course modules.
            </p>
          </div>
        </div>
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
          <QLearnPage isAdminPortal={true} />
        </div>
      </div>
    </AdminLayout>
  );
}
