import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { 
  Briefcase, 
  Users, 
  Target, 
  Lightbulb, 
  Quote, 
  GraduationCap, 
  Award, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import RegistrarImage from "../assets/Registrar.jpeg";

const AboutPage = () => {
  const expertise = [
    {
      icon: Briefcase,
      title: "Academic Administration",
      description:
        "Expert in managing complex academic operations, policy formulation, and institutional governance at the highest levels.",
    },
    {
      icon: Users,
      title: "Leadership & Governance",
      description:
        "Proven track record of leading diverse teams, committees, and boards to achieve institutional excellence.",
    },
    {
      icon: Target,
      title: "Strategic Planning",
      description:
        "Skilled in developing and implementing strategic initiatives for institutional growth and academic excellence.",
    },
    {
      icon: Lightbulb,
      title: "Policy Development",
      description:
        "Extensive experience in drafting and implementing academic policies aligned with national education frameworks.",
    },
  ];

  const highlights = [
    { label: "Experience", value: "24+ Years", sub: "Teaching & Research" },
    { label: "Former Registrar", value: "JNTU-GV", sub: "2023 – 2026" },
    { label: "Current Leadership", value: "DAA&P", sub: "& Head, WEC" },
    { label: "Specialization", value: "Data Mining", sub: "B.Tech, M.Tech, Ph.D." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 bg-gradient-to-b from-cream-dark via-cream/40 to-background overflow-hidden">
        {/* Subtle Grid Pattern Background */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        
        {/* Decorative Blur Elements for Depth */}
        <div className="absolute top-20 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container-wide px-4 sm:px-6 lg:px-12 xl:px-16 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/15 text-accent rounded-full text-xs font-semibold tracking-wider uppercase mb-5 border border-accent/25 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Sparkles size={13} className="text-accent" />
            <span>Institutional Leader & Educator</span>
          </div>

          {/* Main Title with Fade-In Animation */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            About Dr. G. Jaya Suma
          </h1>

          {/* Gold Accent Underline */}
          <div className="mx-auto h-1.5 w-24 bg-accent rounded-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150" />

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            A distinguished career dedicated to academic excellence, innovative pedagogy, and transformative institutional leadership.
          </p>
        </div>
      </section>

      {/* Biography Section (Full Width Grid) */}
      <section className="pt-8 sm:pt-12 pb-20">
        <div className="container-wide px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 xl:gap-14 items-start">
            
            {/* Profile Image & Executive Card (Left Column) */}
            <div className="lg:col-span-5 xl:col-span-4 animate-fade-in-up">
              <div className="lg:sticky lg:top-28 space-y-5">
                <div className="relative group">
                  {/* Decorative subtle backdrop glow */}
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-accent/30 via-primary/20 to-secondary/30 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500" />
                  
                  <div className="relative rounded-2xl overflow-hidden border border-border/80 bg-card shadow-2xl">
                    <div className="aspect-[3/4] w-full max-h-[480px] overflow-hidden bg-muted/40">
                      <img
                        src={RegistrarImage}
                        alt="Dr. G. Jayasuma - Professor of Information Technology & DAA&P"
                        className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </div>

                    {/* Image Footer Info Card */}
                    <div className="p-5 bg-card/95 backdrop-blur-sm border-t border-border/60">
                      <h3 className="font-serif text-xl font-bold text-primary">
                        Dr. G. Jaya Suma
                      </h3>
                      <p className="text-sm font-medium text-accent mt-0.5">
                        Director of Academic Audit & Planning (DAA&P)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Head, Women Empowerment Cell · Professor of IT, JNTU-GV
                      </p>

                      <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 bg-primary/5 text-primary rounded text-[11px] font-medium border border-primary/10">
                          Former University Registrar (2023–2026)
                        </span>
                        <span className="px-2.5 py-1 bg-accent/10 text-accent rounded text-[11px] font-medium border border-accent/20">
                          Ph.D. in Data Mining
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Highlight Stats under photo */}
                <div className="grid grid-cols-2 gap-3">
                  {highlights.map((h, i) => (
                    <div 
                      key={i} 
                      className="p-3.5 rounded-xl bg-card border border-border/60 shadow-sm hover:border-accent/40 transition-colors"
                    >
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground block font-medium">
                        {h.label}
                      </span>
                      <div className="text-base sm:text-lg font-bold text-primary font-serif mt-0.5">
                        {h.value}
                      </div>
                      <span className="text-xs text-muted-foreground block">
                        {h.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Biography Content (Right Column) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="border-l-4 border-accent pl-5">
                <span className="text-xs uppercase tracking-wider font-semibold text-accent block mb-1">
                  Profile & Experience
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
                  Professional Biography
                </h2>
              </div>

              <div className="space-y-5 text-foreground/85 leading-relaxed text-base sm:text-[17px]">
                <p className="hover:text-foreground transition-colors">
                  Dr. G. Jayasuma holds a B.Tech, M.Tech, and Ph.D. in Computer
                  Science with specialization in Data Mining, and has over 24
                  years of experience in teaching, research, and academic
                  administration. She has served as Professor and Head of the
                  Department of Information Technology at JNTU-GV, University
                  College of Engineering, Vizianagaram (2013–2022), and has
                  recently completed her tenure as the University Registrar of JNTU-GV 
                  (2023–2026). She is currently serving as the Director of Academic Audit & Planning (DAA&P) and Head of Women Empowerment Cell, alongside her role as a Professor in the Department of Information Technology at JNTU-GV, Vizianagaram, Andhra Pradesh.
                </p>

                <p className="hover:text-foreground transition-colors">
                  She has held key leadership roles including Director of Faculty
                  Development, Director of Industry–Institute Interaction, and
                  Director (i/c) of Placements & Training, contributing
                  significantly to faculty empowerment, industry collaboration,
                  and student career development.
                </p>

                <p className="hover:text-foreground transition-colors">
                  Recognized for her commitment to educational excellence and
                  academic leadership, Dr. Jayasuma continues to play a vital
                  role in advancing the academic and institutional growth of
                  JNTU-GV.
                </p>
              </div>

              {/* Vision Statement Quote Card */}
              <blockquote className="relative border-l-4 border-accent p-6 sm:p-8 bg-gradient-to-r from-accent/10 via-accent/5 to-card rounded-r-2xl shadow-sm my-8 border border-border/50">
                <Quote className="absolute top-5 right-6 w-12 h-12 text-accent/15 -scale-x-100 pointer-events-none" />
                <p className="font-serif text-lg sm:text-xl italic text-foreground/95 leading-relaxed mb-4 relative z-10">
                  "I extend my sincere gratitude to all for your continued
                  support and commitment to the college. Together, we strive
                  to promote educational excellence through a strong
                  value-based and research-oriented academic environment. Our
                  goal is to empower students with knowledge, character, and
                  leadership skills, preparing them to contribute meaningfully
                  to society."
                </p>
                <div className="pt-3 border-t border-accent/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10">
                  <div className="font-serif font-bold text-primary text-base sm:text-lg">
                    — Dr. G. Jayasuma
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-accent tracking-wide">
                    DAA&P, Head of Women Empowerment Cell & Professor, Dept. of IT, JNTU-GV
                  </div>
                </div>
              </blockquote>

              {/* Core Administrative Milestones summary card */}
              <div className="card-institutional p-6 rounded-xl border border-border/60 bg-gradient-to-br from-card to-muted/20">
                <h4 className="font-serif text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <Award className="text-accent" size={18} />
                  <span>Key Administrative Milestones</span>
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-foreground/80">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                    <span>Spearheaded university-wide digital governance and student academic records</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                    <span>Established collaborative industry-academia MoUs and placement training</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                    <span>Supervised academic audit & curriculum revisions aligned with NEP guidelines</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                    <span>Mentored women in technology through proactive institutional WEC initiatives</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Areas of Expertise */}
      <section className="section-padding bg-gradient-to-br from-muted/40 via-muted/20 to-background border-t border-b border-border/40">
        <div className="container-wide px-4 sm:px-6 lg:px-12 xl:px-16">
          <SectionHeading
            title="Areas of Expertise"
            subtitle="Core competencies developed through decades of academic leadership and research"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {expertise.map((item, index) => (
              <div
                key={index}
                className="card-institutional p-6 sm:p-7 text-center group hover:border-accent hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up rounded-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <item.icon
                    size={28}
                    className="text-accent group-hover:text-accent-foreground transition-colors"
                  />
                </div>
                <h3 className="font-serif text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Administrative Philosophy (Wide 3-column Grid) */}
      <section className="section-padding">
        <div className="container-wide px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-14 animate-fade-in-up">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <Target className="h-6 w-6 text-accent" />
              <span className="text-xs uppercase tracking-wider font-semibold text-accent">Leadership Ethos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary font-serif mb-4">
              Administrative Philosophy
            </h2>
            <div className="mx-auto h-1 w-20 bg-accent rounded-full mb-4" />
            <p className="text-muted-foreground text-base sm:text-lg">
              Guiding principles and core values shaping decades of effective institutional leadership and student empowerment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="group card-institutional p-7 sm:p-8 rounded-xl border-t-4 border-t-accent hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between animate-fade-in-up">
              <div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent transition-colors">
                  <ShieldCheck className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-primary mb-3 group-hover:text-accent transition-colors">
                  Transparency & Accountability
                </h3>
                <p className="text-foreground/80 text-sm sm:text-base leading-relaxed group-hover:text-foreground transition-colors">
                  Believing that transparency is the foundation of trust, Dr.
                  Jayasuma has championed open governance practices, ensuring all
                  stakeholders have access to information and that
                  decision-making processes remain accountable, verifiable, and well
                  documented.
                </p>
              </div>
            </div>

            <div className="group card-institutional p-7 sm:p-8 rounded-xl border-t-4 border-t-secondary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary transition-colors">
                  <GraduationCap className="h-6 w-6 text-secondary group-hover:text-secondary-foreground transition-colors" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-primary mb-3 group-hover:text-secondary transition-colors">
                  Student-Centric Approach
                </h3>
                <p className="text-foreground/80 text-sm sm:text-base leading-relaxed group-hover:text-foreground transition-colors">
                  At the heart of every policy and initiative is the student. Dr.
                  Jayasuma's administration prioritizes student welfare,
                  academic support systems, and career development opportunities,
                  recognizing that students are the primary beneficiaries of
                  educational institutions.
                </p>
              </div>
            </div>

            <div className="group card-institutional p-7 sm:p-8 rounded-xl border-t-4 border-t-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                  <Lightbulb className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-primary mb-3 group-hover:text-primary/80 transition-colors">
                  Innovation & Adaptation
                </h3>
                <p className="text-foreground/80 text-sm sm:text-base leading-relaxed group-hover:text-foreground transition-colors">
                  Embracing change as an opportunity for growth, Dr. Jayasuma has
                  led digital transformation initiatives, modernized
                  administrative processes, and introduced innovative programs
                  that keep the institution aligned with contemporary academic
                  standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;