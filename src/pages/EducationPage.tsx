import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { Award, BookOpen, Users, Trophy, Briefcase, GraduationCap } from "lucide-react";
import { supabase } from "@/lib/supabase";

// 1️⃣ ADD JSON IMPORTS (TOP OF FILE)
import facultyDevelopmentProgramsJSON from "@/data/faculty_development_programs.json";
import publicationsRecognitionJSON from "@/data/publications_recognition.json";

const EducationPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [facultyDevelopmentPrograms, setFacultyDevelopmentPrograms] = useState<
    {
      title: string;
      organizer: string;
      duration: string;
      description: string;
      year: number;
    }[]
  >([]);
  const [publicationsRecognition, setPublicationsRecognition] = useState<
    {
      title: string;
      description?: string;
      year?: number;
      issued_by?: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2️⃣ ADD SUPABASE SAFETY CHECK
  const isSupabaseEnabled =
    !!import.meta.env.VITE_SUPABASE_URL &&
    !!import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !!supabase;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 3️⃣ REPLACE useEffect(fetchEducationData) with DB + JSON FALLBACK
  useEffect(() => {
    const fetchEducationData = async () => {
      setIsLoading(true);

      try {
        if (!isSupabaseEnabled) {
          throw new Error("Supabase not available");
        }

        const { data: fdps, error: fdpError } = await supabase
          .from("faculty_development_programs")
          .select("title, organizer, duration, description, year")
          .order("year", { ascending: false });

        if (fdpError) throw fdpError;

        const { data: pubsRec, error: pubsRecError } = await supabase
          .from("publications_recognition")
          .select("title, description, year, issued_by")
          .order("year", { ascending: false });

        if (pubsRecError) throw pubsRecError;

        setFacultyDevelopmentPrograms(fdps || []);
        setPublicationsRecognition(pubsRec || []);

      } catch (error) {
        console.warn("Supabase connection issue → loading Education data from JSON fallback", error);

        // ✅ JSON fallback
        setFacultyDevelopmentPrograms(facultyDevelopmentProgramsJSON || []);
        setPublicationsRecognition(publicationsRecognitionJSON || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducationData();
  }, [isSupabaseEnabled]);

  // Hardcoded Session Chairs
  const sessionChairs = [
    "Awarded Certificate of Appreciation for instrumental role as Active SPOC for NPTEL Online Course, IIT Madras during Jul-Dec 2017 semester.",
    "Contributed as Chaired a Technical Sessions for International Conference 'Computational Intelligence and Soft Computing' December 19th-20th 2015.",
    "Contributed as Reviewer to International Conference on Computational Intelligence and Soft Computing, December 19th-20th 2015.",
    "Contributed as Session Chair for International conference on Smart Technologies in Data Science and Communication (SmartDSC-2017) held at Vignan's Institute of Information Technology, Vizag-India from 30th November to 2nd December 2017.",
    "Contributed as Judge for the event Code chef for Digital India Week July 20th-25th 2015.",
  ];

  const academicContributions = [
    {
      category: "Specialization",
      items: [
        "Artificial Intelligence",
        "Data Mining",
        "Machine Learning",
        "Deep Learning",
        "Soft Computing",
        "Internet of Things",
      ],
    },
    {
      category: "Publications & Recognition",
      items: [], // Populated via useEffect
    },
    {
      category: "Board Positions",
      items: [
        "Chairperson BOS, Dept. of Information Technology (2017-2022)",
        "Member of Board of Studies for 3 years (2007-2010) in the Dept of CSE, GIT, GITAM University",
        "Chairperson for Board of Studies for PG Courses from June 2017 JNTUK, University College of Engineering (A), Department of Information Technology",
        "Chairperson for Board of Studies for UG Courses from June 2017 JNTUK, University College of Engineering (A), Department of Information Technology",
        "Board of Studies (BOS) Member of Swarnandhra College of Engineering & Technology (SCET) for the Department of Information Technology, from 4-01-2018",
      ],
    },
    {
      category: "Research Guidance (Ph.D. Awarded)",
      items: [
        "Guided 6 PhDs & Eight Scholars are currently working for PhD",
        "RVS Lalitha (Roll No. 09022P0544) – Ph.D. thesis titled “Vehicular Ad Hoc Networks: Pile-ups in Data Dissemination”, awarded in March 2017 under the Department of CSE, JNTUK, Kakinada.",
        "Mrs. P. Aruna Kumari (Roll No. 3022P0506) – Ph.D. thesis titled “Design and Development of Efficient Feature Selection Mechanisms at Feature Level in Multimodal Biometric System for Person Identification”, awarded in November 2020 under the Department of CSE, JNTUK, Kakinada.",
        "Ms. S. Sureka (Roll No. 13022P0507) – Ph.D. thesis titled “A Machine Learning Framework for Early Risk Prediction of Diabetes Comorbidity in Thyroid Patients”, awarded in July 2021 under the Department of CSE, JNTUK, Kakinada.",
        "Ms. N. Jayalakshmi (Roll No. 13022P0604) – Awarded Ph.D. in Computer Science for the thesis titled “An Interesting Subgraph Mining Approach to Design a Web Page Recommendation System using Web Log Data”, on 18th October 2021 under the Department of CSE, JNTUK, Kakinada.",
        "Mrs. Kovvuri N. Bhargavi (Roll No. 15022P0516) – Awarded Ph.D. in Computer Science and Engineering for the thesis titled “A Framework for Decision Making in Weather Prediction Using Artificial Intelligence”, on 17th July 2023 under the Department of CSE, JNTUK, Kakinada.",
        "Mrs. Gorli L. Aruna Kumari (Roll No. 13022P0605) – Awarded Ph.D. in Computer Science for the thesis titled “Design and Analysis of an Improved Diabetes Mellitus Prediction Using Deep Neural Network”, on 26th July 2023 under the Department of CSE, JNTUK, Kakinada."
      ],
    },
  ];

  const administrationContributions = [
    {
      category: "Leadership Roles",
      items: [
        "Professor, Department of Information Technology, JNTU-GV, from March 2026 to till date",
        "Registrar, JNTU-GV, from 03-08-2023 to March 2026",
        "Head, Department of Information Technology, JNTUK, University College of Engineering (A), from 25th September 2014 to till date",
        "Member of College Academic Council JNTUK, University College of Engineering (A), 13-07-2017 to till date",
      ],
    },
    {
      category: "Committee Positions",
      items: [
        "Nominated as Single Point of Contact (SPOC) for NPTEL Local Chapter in JNTUK, University College of Engineering (A), VZM from July 2017 to till date",
        "Convener for Women Empowerment & Grievance Cell, JNTUK, University College of Engineering (A) from September 2017 to Till Date",
        "Secretary & Member for Women Empowerment & Grievance Cell from January 2014-August 2017",
        "Coordinator for SC/ST cell from January 2014-April 2017",
        "Convener for Fact finding Committee every year provisional affiliation of private college under JNTUK",
        "Member for Research Centre Committee for every year inspection for research centers in departments of affiliated colleges of JNTUK",
        "Member for permanent affiliation (FFC) for affiliated colleges of JNTUK",
        "Coordinator for MOOCs (Massive Online Courses) from 2015-till date",
        "Committee Member for Research Centre Inspection to affiliated college of JNTUK and nominated by JNTUK",
        "Expert Member of the Interview Committee for Selection of Faculty (Ratification) in the CSSE for the Affiliated Colleges in JNTUK",
        "Committee member for Tenders opening related University College of Engineering-VZM",
        "Anti-Ragging committee member - Girls Hostel - Every year - University College of Engineering",
        "Governing Body Member & Nominee of JNTUK to DADI Institute of Engineering & Technology",
        "Appointed as Coordinating Officer's for NAAC work related to University College Of Engineering, VZM",
        "Appointed as Convener for Selection Committee of Adhoc Lecturer, University college of Engineering-VZM",
        "Appointed as Projects Coordinator for PG Courses (M.Tech (IT) & MCA) - till date",
      ],
    },
    {
      category: "Previous Institutional Roles (GITAM University)",
      items: [
        "Departmental Library committee member in the Department of CS&E, GIT, GITAM University",
        "Member of Proctorial Board (2008-Dec 2012) in the Dept of CSE, GIT, GITAM University",
        "One of project Nodal Officer for Equity Assurance Unit (finishing school) TEQIP-II Programme, 2012",
        "Academic Course Coordinator for II/IV B.Tech CSE (2008-2009) in the Dept of CSE, GIT, GITAM University",
        "Project Coordinator for IV/IV B.Tech CSE (2008-2009) in the Dept of CSE, GIT, GITAM University",
        "Academic Course Coordinator for IV/IV B.Tech (CSE) (2011-2012) Dept of CSE, GIT, GITAM University",
        "Girls Hostel Coordinator for Department of Computer Science and Engineering, GITAM Institute of Technology, GITAM University from 2011-2012",
        "Consultancy, Projects & Collaborations (CPC) Coordinator for Department of Computer Science and Engineering, GITAM Institute of Technology, GITAM University from 2011-Jan 2013",
        "Time Table In-Charge for Department of Computer Science and Engineering, GITAM Institute of Technology, GITAM University from 2011-2013",
        "Member of Vigilance Committee from July 2008 to 2012",
      ],
    },
    {
      category: "Examination & Election Duties",
      items: [
        "Appointed as Special Observer for EAMCET & ECET Examination",
        "Appointed as Observer for EAMCET",
        "Appointed as Chief Superintendent CENTRE-D FOR APSLPRB-2016 Examination at University College of Engineering, JNTUK-VZM",
        "Flying Squad Members to make Ragging Free Campus",
        "Appointed as a Presiding Officer in Parvathipuram on 23/7/2013 for Andhra Pradesh Panchayat Raj Election",
      ],
    },
  ];

  const professionalContributions = [
    {
      category: "Professional Memberships",
      items: [
        "Member of Computer Society of India (CSI) – ID: 01170956",
        "Senior Fellow of IEEE – Membership ID: 92245858",
        "Life Member of Indian Society for Technical Education (ISTE) – ID: LM44520",
        "Faculty Sponsor of IEEE Women in Engineering (WIE)",
        "Faculty Sponsor of ACM Chapter",
        "Fellow Member of The Institution of Engineers (India)",
      ],
    },
    {
      category: "International Engagement",
      items: [
        "Visited USA twice (2009, 2019) to present research papers and chair technical sessions",
        "Visited Malaysia (2016) to present research papers and chair technical sessions",
      ],
    },
    {
      category: "Book Publications",
      items: [
        "Author of a book titled 'Artificial Intelligence & Machine Learning' – Published by GCS Publishers India, 2022",
        "FGANN: A Hybrid Approach for Medical Diagnosing – International Conference on Computational Intelligence and Big Data Analytics, Springer, December 2018",
        "Swarm Intelligence and Variable Precision Rough Set Model: A Hybrid Approach for Classification – Computational Intelligence Techniques in Health Care, Springer Briefs in Applied Sciences and Technology, 2016",
        "A Comparative Study of Various Minutiae Extraction Methods for Fingerprint Recognition Based on Score Level Fusion – Application of Computational Intelligence to Biology, Springer Briefs in Applied Sciences and Technology, 2016",
        "Vehicular Ad Hoc Networks: Trimming Pile-Ups in Data Dissemination Using HTPVANET Algorithm – Springer India, 2016"
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-cream-dark to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container-wide px-6 lg:px-12 relative z-10">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 animate-fade-in">
              Learning & Contributions
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in-delay">
              Professional development and academic service excellence
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary"></div>
        <div className="container-wide px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: "30+", label: "Workshops Organized", icon: Users, delay: "0" },
              { number: "50+", label: "Workshops Attended", icon: BookOpen, delay: "100" },
              { number: "5+", label: "PhDs Guided", icon: GraduationCap, delay: "200" },
              { number: "50+", label: "Journal Publications", icon: Award, delay: "300" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className="text-center transform transition-all duration-500 hover:scale-110 animate-fade-in"
                  style={{ animationDelay: `${item.delay}ms` }}
                >
                  <Icon className="w-8 h-8 text-primary-foreground/70 mx-auto mb-3" />
                  <p className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-1 animate-count-up">
                    {item.number}
                  </p>
                  <p className="text-primary-foreground/70 text-sm">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning & Professional Development */}
      <section className="section-padding">
        <div className="container-wide px-6 lg:px-12">
          <SectionHeading
            title="Learning & Professional Development"
            subtitle="Continuous learning and skill enhancement initiatives"
          />

          <div className="space-y-12">
            {/* Faculty Development Programs */}
            <div className="animate-slide-in-left">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-accent" />
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Faculty Development Programs
                </h3>
              </div>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : facultyDevelopmentPrograms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No programs found.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {facultyDevelopmentPrograms.map((program, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-3 p-5 bg-card rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2 group-hover:scale-150 transition-transform duration-300" />
                      <div className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                        <p>
                          Participated in faculty development programme on{" "}
                          <strong className="text-foreground">{program.title}</strong>
                          {program.organizer && (
                            <> conducted by <strong className="text-foreground">{program.organizer}</strong></>
                          )}
                          {program.duration && <> ({program.duration})</>}
                          {program.year && <> - {program.year}</>}
                        </p>
                        {program.description && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {program.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Session Chairs & Recognition */}
            <div className="animate-slide-in-right">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-accent" />
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Session Chairs & Recognition
                </h3>
              </div>
              <div className="grid gap-4">
                {sessionChairs.map((chair, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-3 p-5 bg-gradient-to-r from-card to-card/50 rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Award className="w-5 h-5 text-accent flex-shrink-0 mt-1 group-hover:rotate-12 transition-transform duration-300" />
                    <p className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                      {chair}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contributions Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-6 lg:px-12">
          <SectionHeading
            title="Contributions"
            subtitle="Academic, administrative, and professional service"
          />

          <div className="space-y-12">
            {/* Academic Contributions */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="w-10 h-10 text-accent" />
                <h3 className="font-serif text-3xl font-bold text-primary">
                  Academic Contributions
                </h3>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                {academicContributions.map((section, index) => (
                  <div 
                    key={index} 
                    className="space-y-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                      <h4 className="font-serif text-xl font-semibold text-primary">
                        {section.category}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {section.category === "Publications & Recognition" ? (
                        isLoading ? (
                          <div className="text-center py-4 text-muted-foreground text-sm">Loading...</div>
                        ) : (
                          publicationsRecognition.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="group flex items-start gap-3 p-4 bg-card rounded-lg border border-border hover:border-accent hover:shadow-md transition-all duration-300 transform hover:-translate-x-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2 group-hover:scale-150 transition-transform duration-300" />
                              <div className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                                <p>
                                  {item.title}
                                  {item.issued_by && ` - ${item.issued_by}`}
                                  {item.year && ` - ${item.year}`}
                                </p>
                                {item.description && (
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        )
                      ) : (
                        section.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="group flex items-start gap-3 p-4 bg-card rounded-lg border border-border hover:border-accent hover:shadow-md transition-all duration-300 transform hover:-translate-x-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2 group-hover:scale-150 transition-transform duration-300" />
                            <p className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                              {item}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Administration Contributions */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="w-10 h-10 text-accent" />
                <h3 className="font-serif text-3xl font-bold text-primary">
                  Administration Contributions
                </h3>
              </div>
              
              <div className="mb-8 animate-fade-in-up">
                <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-lg border-l-4 border-accent mb-4">
                  <h4 className="font-serif text-xl font-semibold text-primary">
                    {administrationContributions[0].category}
                  </h4>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {administrationContributions[0].items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="group flex items-start gap-3 p-5 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg border border-accent/30 hover:border-accent hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <Briefcase className="w-5 h-5 text-accent flex-shrink-0 mt-1 group-hover:rotate-12 transition-transform duration-300" />
                      <p className="text-sm text-foreground/90 leading-relaxed font-medium group-hover:text-foreground transition-colors">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {[administrationContributions[1], administrationContributions[2]].map((section, index) => (
                  <div key={index} className="space-y-4 animate-fade-in-up">
                    <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                      <h4 className="font-serif text-xl font-semibold text-primary">
                        {section.category}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="group flex items-start gap-3 p-4 bg-card rounded-lg border border-border hover:border-accent hover:shadow-md transition-all duration-300 transform hover:-translate-x-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-2 group-hover:scale-150 transition-transform duration-300" />
                          <p className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Contributions */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Users className="w-10 h-10 text-accent" />
                <h3 className="font-serif text-3xl font-bold text-primary">
                  Professional Contributions
                </h3>
              </div>
              <div className="grid lg:grid-cols-3 gap-8">
                {professionalContributions.map((section, index) => (
                  <div key={index} className="space-y-4 animate-fade-in-up">
                    <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border-l-4 border-accent">
                      <h4 className="font-serif text-xl font-semibold text-primary">
                        {section.category}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="group flex items-start gap-3 p-4 bg-card rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <Trophy className="w-4 h-4 text-accent flex-shrink-0 mt-1 group-hover:rotate-12 transition-transform duration-300" />
                          <p className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Expertise */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        <div className="container-narrow px-6 lg:px-12 relative z-10">
          <SectionHeading
            title="Areas of Expertise"
            subtitle="Specialized knowledge and research domains"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Artificial Intelligence", icon: "🤖" },
              { name: "Machine Learning", icon: "🧠" },
              { name: "Deep Learning", icon: "🔬" },
              { name: "Data Mining", icon: "⛏️" },
              { name: "Soft Computing", icon: "💻" },
              { name: "Internet of Things", icon: "🌐" },
              { name: "Block Chain Technology", icon: "⛓️" },
              { name: "Cyber Security", icon: "🔒" },
              { name: "Cloud Computing", icon: "☁️" },
              { name: "Python Programming", icon: "🐍" },
              { name: "GIS & Remote Sensing", icon: "🛰️" },
              { name: "Data Science", icon: "📊" },
            ].map((expertise, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 p-5 bg-card rounded-lg border border-border hover:border-accent hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up cursor-pointer"
              >
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                  {expertise.icon}
                </span>
                <span className="text-foreground/80 font-medium group-hover:text-foreground transition-colors">
                  {expertise.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EducationPage;
