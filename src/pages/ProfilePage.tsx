import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const profilePages = [
  { title: "About", description: "Background, designation, specialization, and academic philosophy.", link: "/about" },
  { title: "Professional Experience", description: "A comprehensive timeline of leadership roles and administrative positions across premier institutions.", link: "/experience" },
  { title: "Research & Publications", description: "Journal articles, conference papers, and authored textbooks.", link: "/publications" },
  { title: "Contributions", description: "Board of Studies roles, committees, administrative and professional service.", link: "/education" },
  { title: "Invited Talks", description: "Keynote addresses, guest lectures, and resource-person sessions.", link: "/education#invited-talks" },
  { title: "Projects & Innovations", description: "Student platforms, AI tools, quantum simulators, and innovation lab projects with live URLs.", link: "/projects" },
  { title: "Research Scholars Guidance", description: "Ph.D. research guidance, candidate dissertations, patents, and scholarly mentorship.", link: "/scholars" },
  { title: "Awards & Recognition", description: "National and institutional honors recognizing excellence in academic administration.", link: "/achievements" },
  { title: "Learning Symposium", description: "Faculty development programmes and workshops organized and attended.", link: "/learning-symposium" },
  { title: "Media Coverage", description: "Newspaper features, interviews, and public addresses highlighting institutional initiatives.", link: "/media" },
];

const ProfilePage = () => (
  <div className="min-h-screen bg-background">
    <Header />

    <section className="pt-32 pb-12 bg-gradient-to-b from-cream-dark to-background">
      <div className="container-wide px-6 lg:px-12 text-center">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">Explore the Full Profile</h1>
        <div className="mx-auto h-1 w-24 bg-accent rounded-full mb-6" />
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Decades of academic leadership, research contributions, and administrative excellence.
        </p>
      </div>
    </section>

    <section className="section-padding pt-4">
      <div className="container-wide px-6 lg:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profilePages.map((item) => (
            <Link key={item.link} to={item.link} className="card-institutional p-8 group hover:border-accent/30">
              <h2 className="font-serif text-xl font-semibold text-primary mb-3 group-hover:text-accent transition-colors">
                {item.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.description}</p>
              <span className="inline-flex items-center gap-2 text-accent text-sm font-medium">
                Learn more
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default ProfilePage;
