import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Mail, MapPin, Phone, Clock, Send, Info } from "lucide-react";

type Extra = { name: string; label: string; type: "select" | "date"; options?: string[]; required?: boolean };

/* Each request type reshapes the form. ids match the inquiries.request_type check in supabase/inquiries.sql.
 * Extra fields have no DB column; they are written as "Label: value" lines at the top of the message. */
const REQUEST_TYPES: {
  id: string;
  emoji: string;
  card: string;
  cardDesc: string;
  heading: string;
  hint: string;
  ref?: { label: string; placeholder: string };
  extras?: Extra[];
  subject?: string; // fixed subject prefix; general enquiries type their own
  messageLabel: string;
  messagePlaceholder: string;
}[] = [
  {
    id: "paper",
    emoji: "📄",
    card: "Request a Paper",
    cardDesc: "Full text of a publication",
    heading: "Request a research paper",
    hint: "Give the paper title (or DOI) and say how you'll use it: reading, citing, or teaching. Full texts are shared for personal academic use.",
    ref: { label: "Paper title or DOI *", placeholder: "Exact title as listed on the Publications page" },
    subject: "Paper request",
    messageLabel: "How will you use it? *",
    messagePlaceholder: "e.g. I'm citing this in my M.Tech thesis on diabetes prediction...",
  },
  {
    id: "thesis",
    emoji: "🎓",
    card: "Thesis / Ph.D. Guidance",
    cardDesc: "Supervision & research direction",
    heading: "Thesis or Ph.D. guidance",
    hint: "Share your degree, research area, and background. Mention prior publications or projects if you have them.",
    ref: { label: "Research area or proposed topic *", placeholder: "e.g. Deep learning for medical imaging" },
    extras: [{ name: "Degree", label: "Degree *", type: "select", options: ["Ph.D.", "M.Tech", "MCA", "B.Tech", "Other"], required: true }],
    subject: "Thesis guidance",
    messageLabel: "Your background *",
    messagePlaceholder: "Current programme and institution, prior work, why this area interests you...",
  },
  {
    id: "collaboration",
    emoji: "🤝",
    card: "Collaboration",
    cardDesc: "Joint research or projects",
    heading: "Propose a research collaboration",
    hint: "Describe the problem, what each side brings, and the expected outcome (paper, project, grant, MoU).",
    ref: { label: "Collaboration area *", placeholder: "e.g. IoT-based disaster management" },
    subject: "Collaboration proposal",
    messageLabel: "Your proposal *",
    messagePlaceholder: "The idea, your team, timeline, and how you see us working together...",
  },
  {
    id: "talk",
    emoji: "🎤",
    card: "Invite for a Talk",
    cardDesc: "Keynote, guest lecture, FDP",
    heading: "Invite for a talk or event",
    hint: "Include the event, proposed date, audience, and topic. Invitations at least 3 weeks ahead are easier to accommodate.",
    ref: { label: "Event / programme name *", placeholder: "e.g. National FDP on Agentic AI" },
    extras: [
      { name: "Proposed date", label: "Proposed date", type: "date" },
      { name: "Mode", label: "Mode", type: "select", options: ["In person", "Online", "Hybrid"] },
    ],
    subject: "Talk invitation",
    messageLabel: "Event details *",
    messagePlaceholder: "Topic, audience, expected duration, venue...",
  },
  {
    id: "general",
    emoji: "✉️",
    card: "General enquiry",
    cardDesc: "Anything else",
    heading: "Send a message",
    hint: "For anything else: department matters, student queries, or feedback about this site.",
    messageLabel: "Message *",
    messagePlaceholder: "Your message...",
  },
];

const emptyForm = {
  name: "",
  email: "",
  affiliation: "",
  reference_title: "",
  subject: "",
  message: "",
  extras: {} as Record<string, string>,
  website: "", // honeypot: hidden from people, bots fill it
};

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const ContactPage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  // The URL is the single source of truth for the chosen type (?type=paper&title=...)
  const type = REQUEST_TYPES.find((t) => t.id === searchParams.get("type")) ?? REQUEST_TYPES[REQUEST_TYPES.length - 1];

  // Switching type (or arriving from "Request full text") resets the type-specific fields
  useEffect(() => {
    setFormData((prev) => ({ ...prev, reference_title: searchParams.get("title") || "", subject: "", extras: {} }));
  }, [searchParams]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const chooseType = (id: string) => setSearchParams({ type: id }, { replace: true });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setExtra = (name: string, value: string) =>
    setFormData((prev) => ({ ...prev, extras: { ...prev.extras, [name]: value } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reference = formData.reference_title.trim();
    const extraLines = (type.extras ?? [])
      .filter((x) => formData.extras[x.name])
      .map((x) => `${x.name}: ${formData.extras[x.name]}`);
    const message = [...extraLines, ...(extraLines.length ? [""] : []), formData.message.trim()].join("\n");
    const subject = (type.subject ? `${type.subject}: ${reference || formData.name.trim()}` : formData.subject.trim()).slice(0, 200);

    // Bots that fill the hidden field get a fake success and nothing is stored
    const { error } = formData.website
      ? { error: null }
      : await supabase.from("inquiries").insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          affiliation: formData.affiliation.trim() || null,
          request_type: type.id,
          reference_title: reference || null,
          subject,
          message: message.slice(0, 5000),
        });

    if (error) {
      console.error("Inquiry submit failed", error);
      toast({
        variant: "destructive",
        title: "Could not send your request",
        description: "Please try again, or email gjsuma.it@jntugvcev.edu.in directly.",
      });
    } else {
      toast({
        title: "Request Sent",
        description: "Thank you. We will respond to your email within 2-3 business days.",
      });
      setFormData({ ...emptyForm, extras: {} });
    }
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Office Address",
      content: [
        "Department of Information Technology",
        "JNTU-GV (Jawaharlal Nehru Technological University - Gurajada Vizianagaram)",
        "Dwarapudi, Vizianagaram",
        "Andhra Pradesh 535003, India",
      ],
    },
    {
      icon: Mail,
      title: "Email",
      content: ["gjsuma.it@jntugvcev.edu.in"],
    },
    {
      icon: Phone,
      title: "Phone",
      content: ["+91 08922294316"],
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: [
        "Monday - Friday: 9:00 AM - 5:30 PM",
        "Saturday: 10:00 AM - 1:00 PM",
        "Sunday: Closed",
      ],
    },
  ];

  const mainTypes = REQUEST_TYPES.filter((t) => t.id !== "general");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-10 bg-gradient-to-b from-cream-dark to-background">
        <div className="container-wide px-6 lg:px-12">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Collaborate
            </h1>
            <p className="text-xl text-muted-foreground">
              What can we help you with?
            </p>
          </div>
        </div>
      </section>

      {/* Request type chooser */}
      <section className="pb-4">
        <div className="container-wide px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" role="group" aria-label="Choose request type">
            {mainTypes.map((t) => {
              const active = t.id === type.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => chooseType(t.id)}
                  aria-pressed={active}
                  className={cn(
                    "card-institutional p-4 sm:p-5 text-left transition-all duration-200 border-2",
                    active ? "border-accent bg-accent/5 shadow-md" : "border-transparent hover:border-accent/40"
                  )}
                >
                  <span className="text-2xl sm:text-3xl block mb-2" aria-hidden="true">{t.emoji}</span>
                  <span className={cn("block font-serif font-semibold text-sm sm:text-base", active ? "text-accent" : "text-primary")}>
                    {t.card}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">{t.cardDesc}</span>
                </button>
              );
            })}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Something else?{" "}
            <button
              type="button"
              onClick={() => chooseType("general")}
              aria-pressed={type.id === "general"}
              className={cn("font-medium underline-offset-4 hover:underline", type.id === "general" ? "text-accent underline" : "text-primary")}
            >
              Send a general enquiry
            </button>
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding pt-10">
        <div className="container-wide px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form (fields change with the chosen type) */}
            <div key={type.id} className="animate-fade-in">
              <SectionHeading
                title={`${type.emoji} ${type.heading}`}
                subtitle="We will respond to your email within 2-3 business days"
                alignment="left"
              />

              <div className="flex gap-3 p-4 mb-6 rounded-lg bg-accent/5 border border-accent/20 text-sm text-foreground/80">
                <Info size={18} className="text-accent shrink-0 mt-0.5" />
                <p><strong className="text-primary">What to include:</strong> {type.hint}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" placeholder="Your name" maxLength={120} value={formData.name} onChange={handleChange} required className="bg-card" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" placeholder="your.email@example.com" maxLength={200} value={formData.email} onChange={handleChange} required className="bg-card" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliation">Institution / Affiliation</Label>
                  <Input id="affiliation" name="affiliation" placeholder="University, college, or company" maxLength={200} value={formData.affiliation} onChange={handleChange} className="bg-card" />
                </div>

                {type.ref ? (
                  <div className="space-y-2">
                    <Label htmlFor="reference_title">{type.ref.label}</Label>
                    <Input id="reference_title" name="reference_title" placeholder={type.ref.placeholder} maxLength={300} value={formData.reference_title} onChange={handleChange} required className="bg-card" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" name="subject" placeholder="Subject of your message" maxLength={200} value={formData.subject} onChange={handleChange} required className="bg-card" />
                  </div>
                )}

                {type.extras && (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {type.extras.map((x) => {
                      const id = `extra-${x.name.replace(/\W+/g, "-").toLowerCase()}`;
                      return (
                        <div key={x.name} className="space-y-2">
                          <Label htmlFor={id}>{x.label}</Label>
                          {x.type === "select" ? (
                            <select id={id} value={formData.extras[x.name] ?? ""} onChange={(e) => setExtra(x.name, e.target.value)} required={x.required} className={selectClass}>
                              <option value="">Select...</option>
                              {x.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                          ) : (
                            <Input id={id} type="date" value={formData.extras[x.name] ?? ""} onChange={(e) => setExtra(x.name, e.target.value)} required={x.required} className="bg-card" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Honeypot: off-screen, skipped by keyboard and screen readers */}
                <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{type.messageLabel}</Label>
                  <Textarea id="message" name="message" placeholder={type.messagePlaceholder} maxLength={4800} rows={6} value={formData.message} onChange={handleChange} required className="bg-card resize-y" />
                </div>

                <Button type="submit" variant="hero" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    <>
                      Send {type.id === "general" ? "Message" : "Request"}
                      <Send size={18} />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="animate-fade-in-right">
              <SectionHeading
                title="Contact Information"
                subtitle="Reach out through official channels"
                alignment="left"
              />

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="group card-institutional p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors duration-300">
                      <item.icon size={24} className="text-accent group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      {item.content.map((line, idx) => (
                        <p
                          key={idx}
                          className="text-foreground/70 text-sm leading-relaxed group-hover:text-foreground transition-colors"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Google Map */}
              <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <h3 className="font-serif text-xl font-semibold text-primary mb-4">
                  Location Map
                </h3>
                <div className="aspect-video bg-muted rounded-lg border border-border overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.8989647756826!2d83.41984387501326!3d18.116999682594936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3be3e0cd996633%3A0x1e8c1e8f5e8f5e8f!2sJNTU-GV%2C%20Dwarapudi%2C%20Andhra%20Pradesh%20535003!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="JNTU-GV Location Map"
                  ></iframe>
                </div>
                <div className="mt-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm text-foreground/70 text-center">
                    <MapPin className="inline w-4 h-4 mr-1 text-accent" />
                    JNTU-GV Campus, Dwarapudi, Vizianagaram, Andhra Pradesh 535003
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-12 bg-gradient-to-r from-muted/20 via-muted/30 to-muted/20">
        <div className="container-narrow px-6 lg:px-12 text-center">
          <div className="p-6 bg-card rounded-lg border border-border shadow-md">
            <p className="text-muted-foreground text-sm leading-relaxed">
              <strong className="text-primary">Note:</strong> For academic inquiries,
              research collaborations, or department matters, please contact the
              Department of Information Technology. All official communications
              can be sent to the official email address{" "}
              <a href="mailto:gjsuma.it@jntugvcev.edu.in" className="text-accent hover:underline font-medium">
                gjsuma.it@jntugvcev.edu.in
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-6 lg:px-12">
          <SectionHeading
            title="Quick Contact"
            subtitle="Choose the best way to reach us"
          />

          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="mailto:gjsuma.it@jntugvcev.edu.in"
              className="group card-institutional p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Mail className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                Email Us
              </h3>
              <p className="text-foreground/70 text-sm">
                gjsuma.it@jntugvcev.edu.in
              </p>
            </a>

            <a
              href="tel:+918897344078"
              className="group card-institutional p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Phone className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                Call Us
              </h3>
              <p className="text-foreground/70 text-sm">
                +91 88973 44078
              </p>
            </a>

            <a
              href="https://maps.app.goo.gl/7Wpc87Ntn7XCEge9"
              target="_blank"
              rel="noopener noreferrer"
              className="group card-institutional p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <MapPin className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                Visit Us
              </h3>
              <p className="text-foreground/70 text-sm">
                Dwarapudi, Vizianagaram
              </p>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;