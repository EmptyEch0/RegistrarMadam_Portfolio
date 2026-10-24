import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import PortalModal from "@/components/ui/PortalModal";
import AdminForm, { AdminField } from "@/components/admin/AdminForm";

/* ===================== TYPES ===================== */
type MediaItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  year: number;
  source: string;
  created_at: string;
};

/* ===================== FORM FIELDS ===================== */
const mediaFields: AdminField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "source", label: "Source", type: "text", required: true },
  {
    name: "year",
    label: "Year",
    type: "number",
    required: true,
    min: 2000,
    max: 2100,
  },
  {
    name: "image_url",
    label: "Media Image",
    type: "image",
    required: true,
  },
  { name: "description", label: "Description", type: "textarea" },
];

/* ===================== PAGE ===================== */
export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /* ===================== HELPER ===================== */
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /* ===================== FETCH MEDIA ===================== */
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const client = supabaseAdmin || supabase;
      const { data, error } = await client
        .from("media")
        .select("*")
        .order("year", { ascending: false });

      if (!error && data) {
        setMedia(data);
        try {
          localStorage.setItem("cached_media_items", JSON.stringify(data));
        } catch {}
      } else {
        const cached = localStorage.getItem("cached_media_items");
        if (cached) setMedia(JSON.parse(cached));
      }
    } catch (err) {
      console.warn("Failed fetching media, checking cache:", err);
      const cached = localStorage.getItem("cached_media_items");
      if (cached) setMedia(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  /* ===================== CREATE / UPDATE ===================== */
  const handleSubmit = async (data: Record<string, any>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    console.log("📤 SUBMIT MEDIA DATA:", data);

    try {
      let imageUrl = data.image_url;

      // Handle image file upload
      if (data.image_url instanceof File) {
        const file = data.image_url;
        const ext = file.name.split(".").pop() || "jpg";
        const cleanName = `${Date.now()}_${crypto.randomUUID().slice(0, 8)}.${ext}`;

        console.log("⬆️ Uploading media image:", cleanName);

        try {
          const client = supabaseAdmin || supabase;
          const { error: uploadError } = await client.storage
            .from("media")
            .upload(cleanName, file, {
              contentType: file.type || "image/jpeg",
              upsert: true,
            });

          if (uploadError) {
            console.warn("Storage upload failed, falling back to Data URL:", uploadError);
            imageUrl = await fileToDataUrl(file);
          } else {
            const { data: urlData } = client.storage
              .from("media")
              .getPublicUrl(cleanName);
            imageUrl = urlData.publicUrl;
            console.log("✅ Image uploaded to storage:", imageUrl);
          }
        } catch (uploadErr) {
          console.warn("Storage exception, falling back to Data URL:", uploadErr);
          imageUrl = await fileToDataUrl(file);
        }
      } else if (typeof data.image_url === "string") {
        imageUrl = data.image_url.trim();
      }

      if (!imageUrl) {
        toast.error("Please provide an image file or image URL");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title: (data.title || "").trim(),
        source: (data.source || "").trim(),
        year: Number(data.year) || new Date().getFullYear(),
        description: data.description ? data.description.trim() : null,
        image_url: imageUrl,
      };

      console.log("💾 Saving media payload:", payload);

      const client = supabaseAdmin || supabase;
      if (editing) {
        const { error } = await client.from("media").update(payload).eq("id", editing.id);
        if (error) {
          console.error("Update error with admin, trying standard client:", error);
          const { error: fallbackErr } = await supabase.from("media").update(payload).eq("id", editing.id);
          if (fallbackErr) throw fallbackErr;
        }
        toast.success("Media clipping updated successfully!");
      } else {
        const { error } = await client.from("media").insert(payload);
        if (error) {
          console.error("Insert error with admin, trying standard client:", error);
          const { error: fallbackErr } = await supabase.from("media").insert(payload);
          if (fallbackErr) throw fallbackErr;
        }
        toast.success("News clipping published successfully!");
      }

      handleClose();
      await fetchMedia();
    } catch (err: any) {
      console.error("❌ Error saving media:", err);
      toast.error(`Failed to save media: ${err?.message || "Please check details"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===================== DELETE ===================== */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    try {
      const item = media.find((m) => m.id === id);
      const client = supabaseAdmin || supabase;

      const { error } = await client.from("media").delete().eq("id", id);
      if (error) {
        await supabase.from("media").delete().eq("id", id);
      }

      if (item?.image_url && !item.image_url.startsWith("data:")) {
        try {
          const urlParts = item.image_url.split("/");
          const fileName = urlParts[urlParts.length - 1];
          if (fileName) {
            await client.storage.from("media").remove([fileName]);
          }
        } catch (storageCleanupErr) {
          console.warn("Storage cleanup notice:", storageCleanupErr);
        }
      }

      toast.success("Media item deleted");
      fetchMedia();
    } catch (err: any) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete media item");
    }
  };

  /* ===================== MODAL HANDLERS ===================== */
  const handleClose = useCallback(() => {
    console.log("❌ Closing modal");
    setEditing(null);
    setIsOpen(false);
  }, []);

  const handleEdit = useCallback((item: MediaItem) => {
    console.log("✏️ Edit:", item.title);
    setEditing(item);
    setIsOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    console.log("➕ Add new media");
    setEditing(null);
    setIsOpen(true);
  }, []);

  return (
    <AdminLayout>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-[#0B132B] font-serif">
            Media / Press Coverage
          </h2>
          <p className="text-[#64748B] text-sm">
            Manage portfolio media items and newspaper press features
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          disabled={isOpen}
          className="flex items-center gap-2 rounded-xl bg-[#C59B27] px-4 py-2.5
                     text-sm font-semibold text-[#0B132B] shadow-sm
                     hover:bg-[#B58C1F] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Plus size={18} /> Add Media
        </motion.button>
      </motion.div>

      {/* CONTENT */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl bg-white border border-[#E7E2D8]"
            />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E7E2D8] p-8 text-center text-[#64748B]">
          No media added yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden rounded-2xl
                         bg-white border border-[#E7E2D8]
                         shadow-xs transition-all hover:border-[#C59B27]"
            >
              {/* IMAGE */}
              <div className="relative aspect-[4/5] bg-[#FAF8F5] border-b border-[#E7E2D8] flex items-center justify-center p-2">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
                <div className="absolute inset-0 bg-[#0B132B]/0 group-hover:bg-[#0B132B]/10 transition" />
              </div>

              {/* INFO */}
              <div className="p-4">
                <p className="text-xs text-[#64748B] font-medium">
                  {item.source} • {item.year}
                </p>
                <h3 className="mt-1 text-sm font-bold text-[#0B132B] line-clamp-2">
                  {item.title}
                </h3>
              </div>

              {/* ACTIONS */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(item)}
                  className="rounded-lg bg-white border border-[#C59B27] p-2 text-[#0B132B] shadow-sm hover:bg-[#FAF8F5] transition-colors"
                  title="Edit Media"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg bg-[#B42318] p-2 text-white shadow-sm hover:bg-[#991B1B] transition-colors"
                  title="Delete Media"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ✅ PORTAL MODAL - Renders outside main DOM to prevent blur */}
      <PortalModal
        open={isOpen}
        onClose={handleClose}
        title={editing ? "Edit Media" : "Add Media"}
      >
        <AdminForm
          fields={mediaFields}
          initialData={editing || {}}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          submitLabel={editing ? "Update" : "Create"}
          isModal={false} // Not using modal wrapper since PortalModal handles it
        />
      </PortalModal>
    </AdminLayout>
  );
}