import { Link } from "react-router-dom";
import { ArrowRight, Download, FileText, GraduationCap, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import RegistrarImage from "../assets/Registrar.jpeg";

import CountUp from "react-countup";

const HomePage = () => {
  const highlights = [
    {
      icon: GraduationCap,
      number: "24+",
      label: "Years of Service",
    },
    {
      icon: Award,
      number: "5+",
      label: "National Awards",
    },
    {
      icon: BookOpen,
      number: "50+",
      label: "Publications",
    },
    {
      icon: FileText,
      number: "100+",
      label: "Policies Drafted",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
<section className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden">
        {/* Background Pattern */}
<div className="absolute inset-0 bg-gradient-to-br from-cream via-background to-cream-dark opacity-50 transform scale-105" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative container-wide px-6 lg:px-12 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-sm mb-6">
                <span className="text-sm font-medium tracking-wider uppercase">
                  DAA&P | Head of Women Empowerment Cell
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
                Dr. G.Jaya Suma
                <br />
                <span className="text-secondary"></span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                Professor, Director of Academic Audit & Planning (DAA&P), and Head of Women Empowerment Cell at JNTU-GV, with nearly three decades of
                distinguished service in academic governance, institutional
                leadership, and educational excellence.
              </p>

              {/* Quote */}
              <blockquote className="border-l-4 border-accent pl-6 py-2 mb-10">
<p className="font-serif text-lg italic text-muted-foreground">
                  "Excellence in education administration is not merely about
                  managing institutions, but about nurturing the future of a
                  nation through principled governance and visionary
                  leadership."
                </p>
              </blockquote>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/about">
                    View Profile
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button variant="hero-outline" size="lg" asChild>
                  <Link to="/publications">Academic Contributions</Link>
                </Button>
                <Button variant="institutional" size="lg" asChild>
                  <Link to="/contact">Contact</Link>
                </Button>
              </div>

              {/* PDF Download */}
              <div className="mt-8">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Download size={16} />
                  Download CV (PDF)
                </Button>
              </div>
            </div>

            {/* Right - Profile Image */}
            <div className="relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-4 border-2 border-accent/20 rounded-sm" />
                <div className="absolute -inset-8 border border-border rounded-sm" />

                {/* Profile image placeholder */}
                <div className="relative aspect-[3/4] rounded-sm overflow-hidden">
  <img
    src={RegistrarImage}
    alt="Dr. G. JayaSuma - Professor of Information Technology"
    className="w-full h-full object-cover object-top"
    loading="lazy"
  />
</div>


                {/* Floating badge */}
                <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-4 rounded-sm shadow-gold">
                  <p className="font-serif text-2xl font-bold">24+</p>
                  <p className="text-xs uppercase tracking-wider">Years</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-primary">
        <div className="container-wide px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <item.icon
                  size={32}
                  className="mx-auto mb-4 text-accent"
                />
                <p className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
  <CountUp end={parseInt(item.number)} suffix="+" duration={2} />
</p>

                <p className="text-primary-foreground/70 text-sm uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-4">
              Explore the Portfolio
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover decades of academic leadership, research contributions,
              and administrative excellence.
            </p>
            <div className="mt-6 h-1 w-20 bg-accent mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Professional Experience",
                description:
                  "A comprehensive timeline of leadership roles and administrative positions across premier institutions.",
                link: "/experience",
              },
              {
                title: "Awards & Recognition",
                description:
                  "National and institutional honors recognizing excellence in academic administration.",
                link: "/achievements",
              },
              {
                title: "Research & Publications",
                description:
                  "Journals, papers, and conference proceedings contributing to educational discourse.",
                link: "/publications",
              },
              {
                title: "Media Coverage",
                description:
                  "Newspaper features, interviews, and public addresses highlighting institutional initiatives.",
                link: "/media",
              },
              {
                title: "Academic Background",
                description:
                  "Educational qualifications and alma mater institutions shaping the administrative philosophy.",
                link: "/education",
              },
              {
                title: "Connect",
                description:
                  "Reach out for collaborations, consultations, or academic engagements.",
                link: "/contact",
              },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="card-institutional p-8 group hover:border-accent/30"
              >
                <h3 className="font-serif text-xl font-semibold text-primary mb-3 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
                <span className="inline-flex items-center gap-2 text-accent text-sm font-medium">
                  Learn more
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
