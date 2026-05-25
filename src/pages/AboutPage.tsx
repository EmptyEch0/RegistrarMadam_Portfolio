import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { Briefcase, Users, Target, Lightbulb } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
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
        <div className="absolute top-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container-wide px-6 lg:px-12 text-center relative z-10">
          {/* Main Title with Fade-In Animation */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            About Dr. G. Jaya Suma
          </h1>

          {/* Gold Accent Underline */}
          <div className="mx-auto h-1 w-24 bg-accent rounded-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150" />

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            A distinguished career dedicated to academic excellence and
            institutional leadership
          </p>
        </div>
      </section>

      {/* Biography */}
      <section className="pt-12 pb-20">
        <div className="container-narrow px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Profile Image */}
            <div className="md:col-span-1 animate-fade-in-up">
              <div className="sticky top-32">
                <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-border bg-background shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                  <img
                    src={RegistrarImage}
                    alt="Dr. G. Jayasuma - Professor of Information Technology"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Biography Content */}
            <div className="md:col-span-2 space-y-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="border-gradient pl-6">
                <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
                  Professional Biography
                </h2>
              </div>

              <p className="text-foreground/80 leading-relaxed text-[17px] hover:text-foreground transition-colors">
                Dr. G. Jayasuma holds a B.Tech, M.Tech, and Ph.D. in Computer
                Science with specialization in Data Mining, and has over 24
                years of experience in teaching, research, and academic
                administration. She has served as Professor and Head of the
                Department of Information Technology at JNTU-GV, University
                College of Engineering, Vizianagaram (2013–2022), and has
                recently completed her tenure as the University Registrar of JNTU-GV 
                (2023–2026). She is currently serving as Professor in the Department 
                of Information Technology, JNTU-GV, Vizianagaram, Andhra Pradesh.
              </p>

              <p className="text-foreground/80 leading-relaxed text-[17px] hover:text-foreground transition-colors">
                She has held key leadership roles including Director of Faculty
                Development, Director of Industry–Institute Interaction, and
                Director (i/c) of Placements & Training, contributing
                significantly to faculty empowerment, industry collaboration,
                and student career development.
              </p>

              <p className="text-foreground/80 leading-relaxed text-[17px] hover:text-foreground transition-colors">
                Recognized for her commitment to educational excellence and
                academic leadership, Dr. Jayasuma continues to play a vital
                role in advancing the academic and institutional growth of
                JNTU-GV.
              </p>

              {/* Vision Statement */}
              <blockquote className="border-l-4 border-accent pl-6 py-4 bg-gradient-to-r from-accent/5 to-accent/10 rounded-r-lg my-8 hover:shadow-lg transition-all duration-300">
                <p className="font-serif text-lg italic text-muted-foreground mb-2">
                  "I extend my sincere gratitude to all for your continued
                  support and commitment to the college. Together, we strive
                  to promote educational excellence through a strong
                  value-based and research-oriented academic environment. Our
                  goal is to empower students with knowledge, character, and
                  leadership skills, preparing them to contribute meaningfully
                  to society."
                </p>
                <footer className="text-muted-foreground text-sm font-medium">
                  — Dr. G. Jayasuma
                </footer>
                <div className="mt-2 text-sm text-accent tracking-wide">
                  Professor, Dept. of IT, JNTU-GV
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Expertise */}
      <section className="section-padding bg-gradient-to-br from-muted/40 via-muted/20 to-background">
        <div className="container-wide px-6 lg:px-12">
          <SectionHeading
            title="Areas of Expertise"
            subtitle="Core competencies developed through decades of academic leadership"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((item, index) => (
              <div
                key={index}
                className="card-institutional p-6 text-center group hover:border-accent hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up"
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

      {/* Administrative Philosophy */}
      <section className="section-padding">
        <div className="container-narrow px-6 lg:px-12">
          <div className="mb-12 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-7 w-7 text-accent" />
              <h2 className="text-3xl md:text-4xl font-semibold text-primary font-serif">
                Administrative Philosophy
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              Guiding principles for effective institutional leadership
            </p>
          </div>

          <div className="space-y-8">
            <div className="group card-institutional p-8 border-l-4 border-l-accent hover:shadow-xl transition-all duration-300 transform hover:-translate-x-2 animate-fade-in-up">
              <h3 className="font-serif text-xl font-semibold text-primary mb-3 group-hover:text-accent transition-colors">
                Transparency & Accountability
              </h3>
              <p className="text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                Believing that transparency is the foundation of trust, Dr.
                Jayasuma has championed open governance practices, ensuring all
                stakeholders have access to information and that
                decision-making processes remain accountable and well
                documented.
              </p>
            </div>

            <div className="group card-institutional p-8 border-l-4 border-l-secondary hover:shadow-xl transition-all duration-300 transform hover:-translate-x-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h3 className="font-serif text-xl font-semibold text-primary mb-3 group-hover:text-secondary transition-colors">
                Student-Centric Approach
              </h3>
              <p className="text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                At the heart of every policy and initiative is the student. Dr.
                Jayasuma's administration prioritizes student welfare,
                academic support systems, and career development opportunities,
                recognizing that students are the primary beneficiaries of
                educational institutions.
              </p>
            </div>

            <div className="group card-institutional p-8 border-l-4 border-l-primary hover:shadow-xl transition-all duration-300 transform hover:-translate-x-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h3 className="font-serif text-xl font-semibold text-primary mb-3 group-hover:text-primary/80 transition-colors">
                Innovation & Adaptation
              </h3>
              <p className="text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                Embracing change as an opportunity for growth, Dr. Jayasuma has
                led digital transformation initiatives, modernized
                administrative processes, and introduced innovative programs
                that keep the institution aligned with contemporary academic
                standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
