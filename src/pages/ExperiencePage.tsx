import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { Timeline } from "@/components/ui/timeline";
import { GraduationCap, Award, Briefcase } from "lucide-react";

const ExperiencePage = () => {
  /* ===========================
     PROFESSIONAL EXPERIENCE
     =========================== */
  const positions = [
    {
      year: "March 2026",
      endYear: "Present",
      title: "DAA&P, Head of Women Empowerment Cell & Professor",
      institution:
        "Jawaharlal Nehru Technological University – Gurajada, Vizianagaram (JNTU-GV)",
      icon: "🏛️",
      description:
        "Leading academic audit and planning initiatives, spearheading women empowerment programs, and continuing academic leadership as a Professor.",
      responsibilities: [
        "Overseeing academic audits and strategic planning for the university",
        "Leading the Women Empowerment Cell to promote gender equality and support women in academia",
        "Delivering lectures and guiding Ph.D. scholars in Data Mining and AI",
        "Developing modern curricula and academic programs",
      ],
    },
    {
      year: "Aug 2023",
      endYear: "March 2026",
      title: "Registrar (Former)",
      institution:
        "Jawaharlal Nehru Technological University – Gurajada, Vizianagaram (JNTU-GV)",
      icon: "🏛️",
      description:
        "Served as the chief administrative officer of the university, overseeing academic governance and administration.",
      responsibilities: [
        "Supervision of academic and administrative affairs",
        "Coordination with UGC, AICTE, APSCHE, and Government bodies",
        "Oversight of examinations, admissions, and academic records",
        "Implementation of digital governance systems",
      ],
    },
    {
      year: "Jan 2013",
      endYear: "Aug 2023",
      title: "Professor & Head of the Department (Former)",
      institution:
        "Department of Information Technology, JNTU-GV University College of Engineering, Vizianagaram",
      icon: "🎓",
      description:
        "Academic leadership with focus on curriculum development, research, and student outcomes.",
    },
    {
      year: "Sept 2003",
      endYear: "Jan 2013",
      title: "Associate Professor",
      institution: "Department of CSSE, GITAM University, Visakhapatnam",
      icon: "🎓",
      description:
        "Teaching, research, and academic development in Computer Science and Systems Engineering.",
    },
    {
      year: "Aug 2002",
      endYear: "Sept 2003",
      title: "Assistant Professor",
      institution: "Department of CSSE, ANITS, Visakhapatnam",
      icon: "🎓",
      description: "Undergraduate teaching and student mentoring.",
    },
    {
      year: "Dec 2001",
      endYear: "Aug 2002",
      title: "Assistant Professor",
      institution: "Department of CSE, VITAM, Parvathipuram",
      icon: "🎓",
      description: "Early academic career in engineering education.",
    },
  ];

  /* ===========================
     COMMITTEE & GOVERNANCE
     =========================== */
  const committees = [
    {
      year: "2023",
      endYear: "Present",
      title: "Member – Academic Council & Executive Council",
      institution: "JNTU-GV, Vizianagaram",
      description:
        "Participating in key decision-making bodies responsible for academic planning, policy formulation, and governance.",
    },
    {
      year: "2018",
      endYear: "Present",
      title: "Chair / Member – Examination & Academic Reforms Committees",
      institution: "JNTU-GV and University-Level Committees",
      description:
        "Contributed to examination reforms, curriculum restructuring, and quality assurance initiatives.",
    },
  ];

  /* ===========================
     EDUCATION DATA (USED IN PART 2)
     =========================== */
  const degrees = [
    {
      degree: "Doctor of Philosophy (Ph.D.)",
      field: "Computer Science (Data Mining)",
      institution: "Andhra University, Visakhapatnam",
      year: "July 2011",
      thesis:
        "Multi-split Fuzzy Decision Tree Classifiers – A Dynamic Fuzzification Approach",
      honors: [
        "Awarded Ph.D in Data Mining",
        "Research conducted under the esteemed guidance of Prof. M. Shashi",
      ],
    },
    {
      degree: "Master of Technology (M.Tech)",
      field: "Computer Science & Technology",
      institution: "Andhra University, Visakhapatnam",
      year: "2000 – 2002",
      thesis: null,
      honors: [],
    },
    {
      degree: "Bachelor of Technology (B.Tech)",
      field: "Computer Science & Software Engineering",
      institution: "Andhra University, Visakhapatnam",
      year: "1994 – 1998",
      thesis: null,
      honors: [],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
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
        <div className="absolute top-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container-wide px-6 lg:px-12 text-center relative z-10">
          {/* Main Title with Fade-In Animation */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Professional Experience & Education
          </h1>

          {/* Gold Accent Underline */}
          <div className="mx-auto h-1 w-24 bg-accent rounded-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150" />

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            Academic leadership, governance roles, and educational foundation
          </p>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="pt-10 pb-20">
        <div className="container-narrow px-6 lg:px-12">
          <div className="mb-12 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="h-7 w-7 text-accent" />
              <h2 className="text-3xl md:text-4xl font-semibold text-primary font-serif">
                Professional Experience
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Teaching and administrative roles across institutions
            </p>
          </div>

          <Timeline items={positions} />
        </div>
      </section>

      {/* REGISTRAR RESPONSIBILITIES */}
      <section className="pb-20 animate-fade-in-up">
        <div className="container-narrow px-6 lg:px-12">
          <div className="card-institutional p-8 border-l-4 border-l-accent bg-gradient-to-r from-accent/5 to-accent/10 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-primary">
                Registrar & Administrative Responsibilities (2023 – 2026)
              </h3>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li className="hover:text-foreground transition-colors">Overall supervision of academic and administrative affairs</li>
              <li className="hover:text-foreground transition-colors">Implementation of university statutes and regulations</li>
              <li className="hover:text-foreground transition-colors">Coordination with government and regulatory agencies</li>
              <li className="hover:text-foreground transition-colors">Oversight of examinations, admissions, and academic records</li>
              <li className="hover:text-foreground transition-colors">Support to statutory bodies and university governance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* COMMITTEE & GOVERNANCE */}
      <section className="section-padding bg-gradient-to-br from-muted/40 via-muted/20 to-background">
        <div className="container-narrow px-6 lg:px-12">
          <div className="mb-12 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-7 w-7 text-accent" />
              <h2 className="text-3xl md:text-4xl font-semibold text-primary font-serif">
                Committee & Governance Roles
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Contributions to academic policy and university governance
            </p>
          </div>

          <Timeline items={committees} />
        </div>
      </section>

      {/* EDUCATION */}
      <section className="pt-12 pb-20">
        <div className="container-narrow px-6 lg:px-12">
          <div className="mb-12 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="h-7 w-7 text-accent" />
              <h2 className="text-3xl md:text-4xl font-semibold text-primary font-serif">
                Educational Qualifications
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Academic credentials and research foundation
            </p>
          </div>

          <div className="space-y-8">
            {degrees.map((edu, index) => (
              <div
                key={index}
                className="group card-institutional p-8 border-l-4 border-l-accent hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                      <GraduationCap size={28} className="text-accent group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-serif text-xl font-semibold text-primary group-hover:text-accent transition-colors">
                          {edu.degree}
                        </h3>
                        <p className="text-muted-foreground">{edu.field}</p>
                      </div>
                      <span className="text-accent font-semibold whitespace-nowrap">
                        {edu.year}
                      </span>
                    </div>

                    <p className="text-foreground/80 font-medium mb-3">
                      {edu.institution}
                    </p>

                    {edu.thesis && (
                      <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1 font-semibold">
                          Thesis / Dissertation:
                        </p>
                        <p className="text-foreground/70 italic">
                          "{edu.thesis}"
                        </p>
                      </div>
                    )}

                    {edu.honors && edu.honors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {edu.honors.map((honor, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-sm rounded-sm hover:bg-accent/20 transition-colors"
                          >
                            <Award size={14} />
                            {honor}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION PHILOSOPHY QUOTE */}
      <section className="pt-12 pb-20 bg-gradient-to-br from-muted/40 via-muted/20 to-background">
        <div className="container-narrow px-6 lg:px-12">
          <blockquote className="text-center max-w-2xl mx-auto animate-fade-in-up">
            <div className="mb-6">
              <svg className="w-12 h-12 text-accent/30 mx-auto" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h8V14h-6c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h8V14h-6c0-2.2 1.8-4 4-4V8z"/>
              </svg>
            </div>
            <p className="font-serif text-2xl md:text-3xl italic text-charcoal-light leading-relaxed mb-6">
              "My academic journey laid a strong foundation for research-driven
              teaching and administrative leadership, reinforcing the belief
              that education must continuously evolve through innovation and
              integrity."
            </p>
            <footer className="text-muted-foreground">
              <span className="font-semibold text-primary">
                Dr. G. Jaya Suma
              </span>
              <br />
              <span className="text-sm">
                Professor, Department of IT, JNTU-GV, Vizianagaram
              </span>
            </footer>
          </blockquote>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExperiencePage;