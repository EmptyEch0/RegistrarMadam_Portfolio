import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Lock, MessageSquare, Pin, Plus, Search, Send } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { DISCUSSION_CATEGORIES, categoryLabel } from "@/lib/sections";

type Thread = {
  id: string;
  title: string;
  body: string;
  category: string;
  author_name: string;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  discussion_replies?: { count: number }[];
};

type Reply = { id: string; body: string; author_name: string; created_at: string };

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/** Name + text form shared by "new topic" and "reply". Everything goes to the review queue. */
function SubmitForm({ mode, threadId, onDone }: { mode: "thread" | "reply"; threadId?: string; onDone?: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ author_name: "", title: "", category: "general", body: "", website: "" });
  const [sending, setSending] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const base = { author_name: form.author_name.trim(), body: form.body.trim() };
    // Honeypot filled → pretend success, store nothing
    const { error } = form.website
      ? { error: null }
      : mode === "thread"
        ? await supabase.from("discussion_threads").insert({ ...base, title: form.title.trim(), category: form.category })
        : await supabase.from("discussion_replies").insert({ ...base, thread_id: threadId });
    setSending(false);

    if (error) {
      console.error("Discussion submit failed", error);
      toast({ variant: "destructive", title: "Could not submit", description: "Please check your text and try again." });
      return;
    }
    toast({
      title: "Submitted for review",
      description: "Thanks! Your post will appear here once the admin approves it.",
    });
    setForm({ author_name: form.author_name, title: "", category: "general", body: "", website: "" });
    onDone?.();
  };

  return (
    <form onSubmit={submit} className="card-institutional p-6 space-y-4 relative">
      <div className={cn("grid gap-4", mode === "thread" && "sm:grid-cols-2")}>
        <div className="space-y-2">
          <Label htmlFor={`${mode}-name`}>Your name *</Label>
          <Input id={`${mode}-name`} name="author_name" required maxLength={80} value={form.author_name} onChange={set} className="bg-card" />
        </div>
        {mode === "thread" && (
          <div className="space-y-2">
            <Label htmlFor="thread-category">Category *</Label>
            <select id="thread-category" name="category" value={form.category} onChange={set} className={selectClass}>
              {DISCUSSION_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      {mode === "thread" && (
        <div className="space-y-2">
          <Label htmlFor="thread-title">Topic title *</Label>
          <Input id="thread-title" name="title" required minLength={3} maxLength={200} value={form.title} onChange={set} className="bg-card" />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor={`${mode}-body`}>{mode === "thread" ? "Your question or idea *" : "Your reply *"}</Label>
        <Textarea id={`${mode}-body`} name="body" required maxLength={5000} rows={mode === "thread" ? 6 : 4} value={form.body} onChange={set} className="bg-card resize-y" />
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor={`${mode}-website`}>Website</label>
        <input id={`${mode}-website`} name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Posts are reviewed before they appear. Please don't share phone numbers or personal details.</p>
        <Button type="submit" variant="hero" disabled={sending}>
          {sending ? "Submitting..." : mode === "thread" ? "Submit topic" : "Submit reply"}
          <Send size={16} />
        </Button>
      </div>
    </form>
  );
}

function ThreadList() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    supabase
      .from("discussion_threads")
      .select("id, title, body, category, author_name, is_pinned, is_locked, created_at, discussion_replies(count)")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Load discussions failed", error);
        setFailed(!!error);
        setThreads((data as Thread[]) || []);
        setLoading(false);
      });
  }, []);

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    return threads.filter(
      (t) =>
        (category === "all" || t.category === category) &&
        (!q || t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q) || t.author_name.toLowerCase().includes(q))
    );
  }, [threads, category, query]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search topics"
            className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        <Button variant="hero" onClick={() => setShowForm((v) => !v)} aria-expanded={showForm}>
          <Plus size={16} />
          {showForm ? "Close" : "Start a topic"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <SubmitForm mode="thread" onDone={() => setShowForm(false)} />
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {[{ id: "all", label: "All" }, ...DISCUSSION_CATEGORIES].map((c) => (
          <Button
            key={c.id}
            size="sm"
            variant={category === c.id ? "institutional" : "outline"}
            onClick={() => setCategory(c.id)}
            className="whitespace-nowrap"
          >
            {c.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Loading discussions...</p>
      ) : failed ? (
        <p className="text-center py-12 text-muted-foreground">Discussions are unavailable right now. Please try again later.</p>
      ) : visible.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border">
          <MessageSquare size={40} className="mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            {threads.length === 0 ? "No topics yet. Start the first one!" : "No topics match your filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((t) => (
            <Link
              key={t.id}
              to={`/discuss/${t.id}`}
              className="card-institutional p-5 flex items-start justify-between gap-4 group hover:border-accent/40"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {t.is_pinned && <Pin size={14} className="text-accent" aria-label="Pinned" />}
                  {t.is_locked && <Lock size={14} className="text-muted-foreground" aria-label="Locked" />}
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">{categoryLabel(t.category)}</span>
                </div>
                <h2 className="font-serif text-lg font-semibold text-primary group-hover:text-accent transition-colors">{t.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{t.body}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {t.author_name} · {fmtDate(t.created_at)}
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare size={15} />
                {t.discussion_replies?.[0]?.count ?? 0}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function ThreadView({ id }: { id: string }) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("discussion_threads").select("*").eq("id", id).maybeSingle(),
      supabase.from("discussion_replies").select("id, body, author_name, created_at").eq("thread_id", id).order("created_at"),
    ]).then(([t, r]) => {
      setThread((t.data as Thread) ?? null);
      setReplies((r.data as Reply[]) || []);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p className="text-center py-12 text-muted-foreground">Loading...</p>;
  if (!thread)
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">This topic doesn't exist or is still awaiting approval.</p>
        <Button variant="outline" asChild>
          <Link to="/discuss">Back to discussions</Link>
        </Button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/discuss" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent mb-6">
        <ArrowLeft size={15} /> All discussions
      </Link>

      <article className="card-institutional p-6 md:p-8 border-t-4 border-t-accent mb-8">
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">{categoryLabel(thread.category)}</span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary mt-3 mb-2">{thread.title}</h1>
        <p className="text-xs text-muted-foreground mb-5">
          {thread.author_name} · {fmtDate(thread.created_at)}
        </p>
        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{thread.body}</p>
      </article>

      <h2 className="font-serif text-xl font-semibold text-primary mb-4">
        {replies.length} {replies.length === 1 ? "reply" : "replies"}
      </h2>
      <div className="space-y-3 mb-10">
        {replies.map((r) => (
          <div key={r.id} className="card-institutional p-5 border-l-4 border-l-accent/50">
            <p className="text-xs text-muted-foreground mb-2">
              <strong className="text-foreground">{r.author_name}</strong> · {fmtDate(r.created_at)}
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{r.body}</p>
          </div>
        ))}
      </div>

      {thread.is_locked ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 rounded-xl p-4">
          <Lock size={15} /> This topic is closed to new replies.
        </p>
      ) : (
        <>
          <h2 className="font-serif text-xl font-semibold text-primary mb-4">Add a reply</h2>
          <SubmitForm mode="reply" threadId={thread.id} />
        </>
      )}
    </div>
  );
}

const DiscussPage = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {!id && (
        <section className="pt-32 pb-10 bg-gradient-to-b from-cream-dark to-background">
          <div className="container-wide px-6 lg:px-12 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Discussions</h1>
            <div className="mx-auto h-1 w-24 bg-accent rounded-full mb-5" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ask questions, share ideas, and learn together. Every post is reviewed before it appears.
            </p>
          </div>
        </section>
      )}

      <section className={cn("section-padding", id ? "pt-32" : "pt-4")}>
        <div className="container-wide px-6 lg:px-12">{id ? <ThreadView id={id} /> : <ThreadList />}</div>
      </section>

      <Footer />
    </div>
  );
};

export default DiscussPage;
