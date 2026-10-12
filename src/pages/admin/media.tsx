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
          <h2 className="text-2xl font-bold text-white drop-shadow">
            Media / Press Coverage
          </h2>
          <p className="text-white/80 text-sm">
            Manage portfolio media items
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          disabled={isOpen}
          className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2
                     text-sm font-semibold text-gray-800 shadow-lg
                     hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="h-40 animate-pulse rounded-2xl bg-white/40 backdrop-blur"
            />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-2xl bg-white/60 p-6 text-center text-gray-700">
          No media added yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl
                         bg-white/70 backdrop-blur-xl border border-white/40
                         shadow-lg transition-all"
            >
              {/* IMAGE */}
              <div className="relative aspect-[4/5] bg-gray-100 flex items-center justify-center">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              </div>

              {/* INFO */}
              <div className="p-4">
                <p className="text-xs text-gray-500">
                  {item.source} • {item.year}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-gray-800 line-clamp-2">
                  {item.title}
                </h3>
              </div>

              {/* ACTIONS */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(item)}
                  className="rounded-full bg-white/90 p-2 shadow hover:bg-white"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-full bg-red-500/90 p-2 text-white shadow hover:bg-red-600"
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