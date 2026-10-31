import { useEffect, useState } from "react";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  FolderGit2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Github,
  Linkedin,
  Sparkles,
  Users,
  CheckCircle2,
  X,
  Layers,
  Image as ImageIcon,
  CloudUpload,
  Download,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import defaultProjectsJSON from "@/data/projects.json";

interface Developer {
  name: string;
  role: string;
  photo_url?: string;
  linkedin_url?: string;
  github_url?: string;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: string;
  live_url?: string;
  github_url?: string;
  image_url?: string;
  tags?: string[];
  status?: string;
  featured?: boolean;
  developers?: Developer[];
  created_at?: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Educational Platform");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState("Live");
  const [featured, setFeatured] = useState(false);
  const [developers, setDevelopers] = useState<Developer[]>([]);

  // Developer subform state
  const [devName, setDevName] = useState("");
  const [devRole, setDevRole] = useState("");
  const [devPhoto, setDevPhoto] = useState("");
  const [devLinkedin, setDevLinkedin] = useState("");
  const [devGithub, setDevGithub] = useState("");

  const [saving, setSaving] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<"synced" | "local_only" | "checking">("checking");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Sync projects from local device up to Supabase Cloud so all devices & users can see them
  const syncProjectsToCloud = async (projectsToSync = projects) => {
    if (!projectsToSync || projectsToSync.length === 0) return;
    setSyncingCloud(true);
    const client = supabaseAdmin || supabase;

    try {
      let failedCount = 0;
      for (const p of projectsToSync) {
        const { error } = await client.from("projects").upsert(p);
        if (error) {
          failedCount++;
          console.warn("Sync error for project:", p.title, error.message);
        }
      }

      if (failedCount === 0) {
        setCloudStatus("synced");
        setMessage({
          text: `✅ All ${projectsToSync.length} projects successfully synchronized to Supabase Cloud! Visible on all desktops.`,
          type: "success",
        });
      } else {
        setCloudStatus("local_only");
        setMessage({
          text: `⚠️ Saved locally, but Supabase Cloud rejected sync (${failedCount} errors). Please run 'supabase/projects.sql' in Supabase SQL Editor.`,
          type: "error",
        });
      }
    } catch (err: any) {
      setCloudStatus("local_only");
      console.warn("Exception during cloud sync:", err);
      setMessage({
        text: `⚠️ Cloud sync notice: ${err?.message || "Storage table missing"}. Projects are safe locally on this machine.`,
        type: "error",
      });
    } finally {
      setSyncingCloud(false);
    }
  };

  const exportProjectsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `projects_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    navigator.clipboard?.writeText(JSON.stringify(projects, null, 2));
    setMessage({ text: "📋 Projects JSON copied to clipboard & downloaded as file!", type: "success" });
  };

  const fetchProjects = async () => {
    setLoading(true);
    setCloudStatus("checking");
    const client = supabaseAdmin || supabase;

    try {
      let cloudData: ProjectItem[] | null = null;

      // 1. First query Supabase Cloud (the true cross-device shared database)
      if (client && import.meta.env.VITE_SUPABASE_URL) {
        const { data, error } = await client
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          cloudData = data.filter(
            (p) =>
              p.id !== "2" &&
              p.id !== "3" &&
              !p.title.includes("Smart Campus IoT") &&
              !p.title.includes("VANETs")
          );
        }
      }

      // 2. Check local storage
      const local = localStorage.getItem("admin_projects_data");
      let localData: ProjectItem[] = [];

      if (local) {
        try {
          const parsed: ProjectItem[] = JSON.parse(local);
          if (Array.isArray(parsed)) {
            localData = parsed.filter(
              (p) =>
                p.id !== "2" &&
                p.id !== "3" &&
                !p.title.includes("Smart Campus IoT") &&
                !p.title.includes("VANETs")
            );
          }
        } catch {}
      }

      // 3. Resolve projects and auto-sync if this machine has local projects not yet in cloud!
      if (cloudData && cloudData.length > 0) {
        setProjects(cloudData);
        setCloudStatus("synced");
        localStorage.setItem("admin_projects_data", JSON.stringify(cloudData));
      } else if (localData.length > 0) {
        setProjects(localData);
        setCloudStatus("local_only");
        // Automatically attempt to sync local projects into Supabase Cloud
        syncProjectsToCloud(localData);
      } else {
        setProjects(defaultProjectsJSON as ProjectItem[]);
        setCloudStatus("local_only");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects(defaultProjectsJSON as ProjectItem[]);
      setCloudStatus("local_only");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setCategory("Educational Platform");
    setLiveUrl("");
    setGithubUrl("");
    setImageUrl("");
    setTagsInput("");
    setStatus("Live");
    setFeatured(false);
    setDevelopers([]);
    setShowModal(true);
  };

  const openEditModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setTitle(proj.title || "");
    setDescription(proj.description || "");
    setCategory(proj.category || "Educational Platform");
    setLiveUrl(proj.live_url || "");
    setGithubUrl(proj.github_url || "");
    setImageUrl(proj.image_url || "");
    setTagsInput(proj.tags ? proj.tags.join(", ") : "");
    setStatus(proj.status || "Live");
    setFeatured(proj.featured || false);
    setDevelopers(proj.developers || []);
    setShowModal(true);
  };

  const handleAddDeveloper = () => {
    if (!devName.trim()) return;
    const newDev: Developer = {
      name: devName.trim(),
      role: devRole.trim() || "Developer",
      photo_url: devPhoto.trim(),
      linkedin_url: devLinkedin.trim(),
      github_url: devGithub.trim(),
    };
    setDevelopers([...developers, newDev]);
    setDevName("");
    setDevRole("");
    setDevPhoto("");
    setDevLinkedin("");
    setDevGithub("");
  };

  const handleRemoveDeveloper = (index: number) => {
    setDevelopers(developers.filter((_, i) => i !== index));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setMessage({ text: "Please provide both a Title and Description.", type: "error" });
      return;
    }

    setSaving(true);
    setMessage(null);

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload: ProjectItem = {
      id: editingProject ? editingProject.id : Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      live_url: liveUrl.trim(),
      github_url: githubUrl.trim(),
      image_url:
        imageUrl.trim() ||
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
      tags: tagsArray,
      status: status,
      featured: featured,
      developers: developers,
      created_at: editingProject?.created_at || new Date().toISOString(),
    };

    let updatedList: ProjectItem[] = [];
    if (editingProject) {
      updatedList = projects.map((p) => (p.id === editingProject.id ? payload : p));
    } else {
      updatedList = [payload, ...projects];
    }

    // Save locally
    localStorage.setItem("admin_projects_data", JSON.stringify(updatedList));
    setProjects(updatedList);

    // Save to Supabase Cloud
    let cloudSynced = false;
    try {
      const client = supabaseAdmin || supabase;
      if (client && import.meta.env.VITE_SUPABASE_URL) {
        const { error: upsertErr } = await client.from("projects").upsert(payload);
        if (upsertErr) {
          console.warn("Supabase project sync notice:", upsertErr.message);
          setMessage({
            text: `Saved locally on this PC! (Note: run 'supabase/projects.sql' in Supabase to sync across all computers: ${upsertErr.message})`,
            type: "error",
          });
        } else {
          cloudSynced = true;
          setCloudStatus("synced");
        }
      }
    } catch (err: any) {
      console.warn("Supabase project sync note (saved locally):", err);
    }

    setSaving(false);
    if (cloudSynced) {
      setMessage({ text: "Project saved to Cloud successfully! Visible on all desktops.", type: "success" });
    }
    setTimeout(() => {
      setShowModal(false);
      setMessage(null);
    }, 1500);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const updated = projects.filter((p) => p.id !== id);
    localStorage.setItem("admin_projects_data", JSON.stringify(updated));
    setProjects(updated);

    try {
      const client = supabaseAdmin || supabase;
      if (client && import.meta.env.VITE_SUPABASE_URL) {
        await client.from("projects").delete().eq("id", id);
      }
    } catch (err) {
      console.warn("Deleted locally:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-[#0B132B] font-serif flex items-center gap-2.5">
              <FolderGit2 className="text-[#C59B27]" size={26} />
              Projects & Innovations Management
            </h2>
            {cloudStatus === "synced" ? (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 size={12} /> Cloud Synced
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/30 flex items-center gap-1">
                <AlertCircle size={12} /> Local Cache Only
              </span>
            )}
          </div>
          <p className="text-[#64748B] text-sm">
            Manage guided student projects, live platforms, and developer contributor profiles
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => syncProjectsToCloud()}
            disabled={syncingCloud}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-semibold shadow-xs transition-colors"
            title="Sync all projects to Supabase Cloud so all computers can see them"
          >
            <CloudUpload size={14} className={syncingCloud ? "animate-bounce text-accent" : "text-accent"} />
            <span>{syncingCloud ? "Syncing..." : "Sync with Cloud"}</span>
          </button>

          <button
            onClick={exportProjectsJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-semibold shadow-xs transition-colors"
            title="Export / Download JSON backup of all projects"
          >
            <Download size={14} className="text-blue-500" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] font-bold shadow-sm transition-all duration-200 transform hover:scale-[1.02] shrink-0 text-sm"
          >
            <Plus size={18} />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-xs ${
            message.type === "success"
              ? "bg-[#16845B]/10 text-[#16845B] border border-[#16845B]/30"
              : "bg-[#B42318]/10 text-[#B42318] border border-[#B42318]/30"
          }`}
        >
          <CheckCircle2 size={18} />
          <span>{message.text}</span>
        </div>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl bg-white border border-[#E7E2D8] p-6 shadow-xs flex flex-col justify-between hover:border-[#C59B27] transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF8F5] text-[#C59B27] border border-[#C59B27]/40">
                    {proj.category}
                  </span>
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#16845B]/10 text-[#16845B] border border-[#16845B]/30">
                    {proj.status || "Live"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(proj)}
                    className="p-2 rounded-lg bg-white border border-[#C59B27] text-[#0B132B] hover:bg-[#FAF8F5] transition-colors"
                    title="Edit Project"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-2 rounded-lg bg-white border border-[#B42318]/40 text-[#B42318] hover:bg-[#B42318] hover:text-white transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#0B132B] mb-2">{proj.title}</h3>
              <p className="text-sm text-[#334155] mb-4 line-clamp-3">{proj.description}</p>

              {proj.tags && proj.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 bg-[#FAF8F5] text-[#64748B] text-[11px] rounded border border-[#E7E2D8]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Developers list */}
              {proj.developers && proj.developers.length > 0 && (
                <div className="pt-3 border-t border-[#E7E2D8] mb-4">
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Users size={12} className="text-[#C59B27]" /> Developers ({proj.developers.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {proj.developers.map((dev, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-2.5 py-1 bg-[#FAF8F5] rounded-lg border border-[#E7E2D8] shadow-xs"
                      >
                        <img
                          src={
                            dev.photo_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              dev.name
                            )}&background=C59B27&color=0B132B`
                          }
                          alt={dev.name}
                          className="w-5 h-5 rounded-full object-cover border border-[#C59B27]/40"
                        />
                        <span className="text-xs font-medium text-[#0B132B]">{dev.name}</span>
                        {dev.linkedin_url && (
                          <a
                            href={dev.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2563EB] hover:underline"
                          >
                            <Linkedin size={12} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#E7E2D8] text-xs text-[#64748B]">
              {proj.live_url && (
                <a
                  href={proj.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#2563EB] font-semibold hover:underline"
                >
                  <ExternalLink size={13} /> {proj.live_url.replace("https://", "")}
                </a>
              )}
              {proj.github_url && (
                <a
                  href={proj.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#334155] hover:text-[#0B132B] hover:underline"
                >
                  <Github size={13} /> Repo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. QLearn - AI Platform"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Educational Platform, AI/ML, Quantum"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of features, technical objectives, and research outcomes..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Live URL / Route (e.g. /qlearn or https://...)
                  </label>
                  <input
                    type="text"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="/qlearn or https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    GitHub / Source Code URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Banner Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Tech Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="React, TypeScript, Supabase, Tailwind"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-gray-300 text-sm bg-white"
                  >
                    <option value="Live">Live</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                  <label htmlFor="featured-check" className="text-sm font-semibold text-gray-800">
                    Feature on Homepage
                  </label>
                </div>
              </div>

              {/* Developers Section */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 mt-6">
                <h4 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-1.5">
                  <Users size={16} /> Developers & Contributors
                </h4>

                {/* Developer inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-2.5">
                  <input
                    type="text"
                    placeholder="Developer Name *"
                    value={devName}
                    onChange={(e) => setDevName(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-amber-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Lead Fullstack)"
                    value={devRole}
                    onChange={(e) => setDevRole(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-amber-300 text-xs bg-white"
                  />
                  <input
                    type="url"
                    placeholder="Photo URL"
                    value={devPhoto}
                    onChange={(e) => setDevPhoto(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-amber-300 text-xs bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                  <input
                    type="url"
                    placeholder="LinkedIn Profile URL"
                    value={devLinkedin}
                    onChange={(e) => setDevLinkedin(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-amber-300 text-xs bg-white"
                  />
                  <input
                    type="url"
                    placeholder="GitHub Profile URL"
                    value={devGithub}
                    onChange={(e) => setDevGithub(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-amber-300 text-xs bg-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddDeveloper}
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  + Add Developer to Project
                </button>

                {/* Developer chips */}
                {developers.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-amber-200 flex flex-wrap gap-2">
                    {developers.map((dev, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-amber-300 text-xs shadow-xs"
                      >
                        <span className="font-semibold text-gray-900">{dev.name}</span>
                        <span className="text-gray-500">({dev.role})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDeveloper(idx)}
                          className="text-red-500 hover:text-red-700 ml-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E2D8]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#C59B27] bg-white text-[#0B132B] font-semibold text-sm hover:bg-[#FAF8F5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#B58C1F] text-[#0B132B] font-bold text-sm shadow-sm transition-all"
                >
                  {saving ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
