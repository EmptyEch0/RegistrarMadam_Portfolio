import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  FileText,
  Award,
  ArrowRight,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CarouselSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  highlightText?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  isActionModal?: boolean; // triggers opening student modal or external
  bgColorClass: string;
}

// Default placeholder slides - User can easily customize these when they provide carousel info later
const DEFAULT_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: "slide-iot-assignments",
    tag: "Academics & Submissions",
    badge: "B.Tech 4th Year (2023–2027)",
    title: "Internet of Things (IoT) Portal Open",
    subtitle:
      "All 70 students (Roll No: 23VV1A1201 – 23VV1A1270) can now log in to upload Assignment 1, 2, and 3. PDF limit: strictly less than 1.0 MB.",
    highlightText: "Deadline for Assignment 1: 15th November 2026",
    ctaText: "Go to Student Portal",
    ctaLink: "/qlearn",
    bgColorClass: "from-slate-900 via-indigo-950 to-blue-900",
  },
  {
    id: "slide-mid-marks",
    tag: "Internal Assessment",
    badge: "Evaluation Notice",
    title: "Mid-1 Examination & Marks Notice",
    subtitle:
      "Mid-1 assessment scores and faculty review marks will be published directly inside your individual Student Academics profile by Dr. G. Jaya Suma.",
    highlightText: "Scores will reflect privately under your verified roll number",
    ctaText: "Check My Academics",
    ctaLink: "/qlearn",
    bgColorClass: "from-slate-900 via-amber-950/60 to-slate-950",
  },
  {
    id: "slide-research-governance",
    tag: "Institutional Leadership",
    badge: "Academic Portfolio",
    title: "Dr. G. Jaya Suma — Professor of IT",
    subtitle:
      "With over 24 years of distinguished leadership in academic governance, research innovations in Quantum Computing, Machine Learning, and curriculum design.",
    highlightText: "Explore over 50+ publications and national initiatives",
    ctaText: "Explore Portfolio",
    ctaLink: "/about",
    bgColorClass: "from-slate-950 via-slate-900 to-indigo-950",
  },
];

interface PortalCarouselProps {
  onOpenStudentPortal?: () => void;
  slides?: CarouselSlide[];
}

export const PortalCarousel: React.FC<PortalCarouselProps> = ({
  onOpenStudentPortal,
  slides = DEFAULT_CAROUSEL_SLIDES,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const current = slides[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xl border border-border/80 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background slide with gradient transitions */}
      <div
        className={`relative min-h-[340px] sm:min-h-[300px] p-6 sm:p-10 md:p-12 text-white bg-gradient-to-br ${current.bgColorClass} transition-all duration-700 flex flex-col justify-between`}
      >
        {/* Subtle decorative geometric backdrop */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />

        {/* Slide Top Metadata */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-xs">
              <Sparkles size={12} />
              {current.tag}
            </span>
            {current.badge && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-white/90 backdrop-blur-xs border border-white/15">
                {current.badge}
              </span>
            )}
          </div>

          <div className="text-xs text-white/60 font-mono">
            {currentIndex + 1} / {slides.length}
          </div>
        </div>

        {/* Slide Body Content */}
        <div className="relative z-10 my-4 max-w-3xl space-y-3">
          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            {current.title}
          </h3>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
            {current.subtitle}
          </p>

          {current.highlightText && (
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 bg-black/25 px-3 py-1.5 rounded-lg border border-amber-400/20">
              <Calendar size={13} className="shrink-0" />
              <span>{current.highlightText}</span>
            </div>
          )}
        </div>

        {/* Slide Bottom Action & Indicators */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-3">
            {onOpenStudentPortal && currentIndex === 0 ? (
              <Button
                variant="default"
                size="sm"
                onClick={onOpenStudentPortal}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg flex items-center gap-2"
              >
                <GraduationCap size={16} />
                Open Student Portal (Upload PDF)
              </Button>
            ) : current.ctaLink ? (
              <Button
                variant="default"
                size="sm"
                asChild
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg flex items-center gap-2"
              >
                <Link to={current.ctaLink}>
                  {current.ctaText || "Learn More"}
                  <ArrowRight size={14} />
                </Link>
              </Button>
            ) : null}

            <span className="text-[11px] text-white/50 hidden sm:inline-block">
              {isPaused ? "Paused" : "Auto-playing notice"}
            </span>
          </div>

          {/* Dot Navigation */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? "w-7 h-2 bg-amber-400"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

