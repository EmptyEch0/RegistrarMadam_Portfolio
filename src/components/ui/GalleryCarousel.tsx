import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Plus,
  Settings,
  Calendar,
  Sparkles,
  Eye,
  Info,
  ExternalLink,
} from "lucide-react";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import fallbackMediaData from "@/data/media.json";

export interface GalleryPhoto {
  id: string;
  title: string;
  source?: string;
  year?: number;
  description?: string | null;
  image_url: string;
}

export const GalleryCarousel: React.FC = () => {
  const [items, setItems] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Map to track natural dimensions: "landscape" | "portrait"
  const [aspectTypes, setAspectTypes] = useState<Record<string, "landscape" | "portrait">>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Check admin status
  useEffect(() => {
    try {
      const auth = localStorage.getItem("admin_authenticated") === "true";
      setIsAdmin(auth);
    } catch {}
  }, []);

  // Fetch gallery media from Supabase table 'media' (with fallback to media.json)
  const fetchMedia = useCallback(async () => {
    try {
      const client = supabaseAdmin || supabase;
      const { data, error } = await client
        .from("media")
        .select("*")
        .order("year", { ascending: false });

      if (!error && data && data.length > 0) {
        setItems(data);
        try {
          localStorage.setItem("cached_media_items", JSON.stringify(data));
        } catch {}
      } else {
        // Fallback to local cache or media.json
        const cached = localStorage.getItem("cached_media_items");
        if (cached) {
          setItems(JSON.parse(cached));
        } else if (Array.isArray(fallbackMediaData) && fallbackMediaData.length > 0) {
          setItems(fallbackMediaData as GalleryPhoto[]);
        }
      }
    } catch (err) {
      console.warn("Failed fetching live media, using fallback:", err);
      if (Array.isArray(fallbackMediaData)) {
        setItems(fallbackMediaData as GalleryPhoto[]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Handle aspect detection on image load
  const handleImageLoad = (id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const isLandscape = img.naturalWidth / img.naturalHeight >= 1.15;
      setAspectTypes((prev) => ({
        ...prev,
        [id]: isLandscape ? "landscape" : "portrait",
      }));
    }
  };

  const nextSlide = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Autoplay every 2.0 seconds (user requested: 2 seconds)
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);
    return () => clearInterval(interval);
  }, [isPaused, items.length, nextSlide]);

  // Smoothly center the active slide in viewport
  useEffect(() => {
    const activeEl = itemsRef.current[currentIndex];
    const container = containerRef.current;
    if (activeEl && container) {
      const containerWidth = container.offsetWidth;
      const elementLeft = activeEl.offsetLeft;
      const elementWidth = activeEl.offsetWidth;

      const targetScrollLeft = elementLeft - containerWidth / 2 + elementWidth / 2;

      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: "smooth",
      });
    }
  }, [currentIndex, aspectTypes]);

  if (loading) {
    return (
      <div className="w-full py-16 flex items-center justify-center text-muted-foreground text-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mr-3" />
        Loading Institutional Gallery...
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const activeItem = items[currentIndex] || items[0];
  const displayedHoverItem = hoveredIndex !== null ? items[hoveredIndex] : activeItem;

  return (
    <div className="w-full space-y-6">
      {/* Gallery Section Header & Admin Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 px-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-accent/20">
            <Sparkles size={13} />
            Moments & Academic Milestones
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary tracking-tight">
            Institutional Photo Gallery
          </h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            A visual chronicle of honorary conferences, student initiatives, public felicitations, and research milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Admin Edit Shortcut Button */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-accent/40 text-accent hover:bg-accent/10 font-semibold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Link to="/admin/media">
              <Settings size={13} />
              {isAdmin ? "Admin: Manage & Upload Photos" : "Gallery Admin"}
            </Link>
          </Button>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={prevSlide}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Panoramic Carousel Track Container */}
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-slate-950/90 border border-border/80 shadow-2xl py-4 sm:py-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredIndex(null);
        }}
      >
        {/* Soft edge blur vignettes to match reference style */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-slate-950 via-slate-950/70 to-transparent z-10 pointer-events-none" />

        {/* Scrollable Track */}
        <div
          ref={containerRef}
          className="flex items-center gap-3 sm:gap-5 overflow-x-hidden scroll-smooth px-[10vw] sm:px-[20vw] py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, idx) => {
            const isActive = idx === currentIndex;
            const isHovered = idx === hoveredIndex;
            const aspect = aspectTypes[item.id] || "landscape";

            return (
              <div
                key={item.id}
                ref={(el) => (itemsRef.current[idx] = el)}
                onClick={() => {
                  setCurrentIndex(idx);
                  setSelectedPhoto(item);
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative shrink-0 cursor-pointer rounded-xl overflow-hidden transition-all duration-700 ease-out select-none ${
                  isActive
                    ? "scale-100 opacity-100 z-20 shadow-2xl ring-2 ring-accent/60"
                    : "scale-95 opacity-55 hover:opacity-85 z-10 brightness-90 hover:brightness-100"
                } ${
                  aspect === "landscape"
                    ? "w-[75vw] sm:w-[540px] md:w-[640px]"
                    : "w-[50vw] sm:w-[300px] md:w-[350px]"
                } h-[340px] sm:h-[420px] md:h-[480px] bg-slate-900`}
              >
                {/* Photo Image */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading={idx < 4 ? "eager" : "lazy"}
                  onLoad={(e) => handleImageLoad(item.id, e)}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if cloud image fails
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000";
                  }}
                />

                {/* Subtle vignette on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Top Quick Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  {item.year && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30 shadow-xs">
                      {item.year}
                    </span>
                  )}
                  {item.source && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/50 backdrop-blur-md text-white/90 border border-white/20 truncate max-w-[150px]">
                      {item.source}
                    </span>
                  )}
                </div>

                {/* Hover / Active Floating Info Card (Exact match with Image 3 from reference!) */}
                {(isActive || isHovered) && (
                  <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-3.5 sm:p-4 text-slate-900 dark:text-white shadow-2xl border border-white/30 dark:border-slate-800/80 animate-fade-in transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-serif font-bold text-sm sm:text-base leading-snug line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground flex-wrap">
                          {item.source && <span className="font-semibold text-accent">{item.source}</span>}
                          {item.year && <span>· Year {item.year}</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhoto(item);
                        }}
                        className="p-1.5 rounded-lg bg-accent/15 text-accent hover:bg-accent hover:text-white transition-colors shrink-0 shadow-xs"
                        title="Click to view full image"
                      >
                        <Maximize2 size={14} />
                      </button>
                    </div>

                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Arrow Buttons on Carousel Track */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all z-30 shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all z-30 shadow-lg"
        >
          <ChevronRight size={20} />
        </button>

        {/* Bottom Pagination Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {items.slice(0, 15).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-8 h-2 bg-amber-400"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Jump to photo ${idx + 1}`}
            />
          ))}
          {items.length > 15 && (
            <span className="text-[10px] text-white/40 ml-1 font-mono">
              +{items.length - 15} more
            </span>
          )}
        </div>
      </div>

      {/* Lightbox / Fullscreen Image Preview Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[92vh] bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-muted/40">
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-primary">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedPhoto.source} {selectedPhoto.year ? `· ${selectedPhoto.year}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild className="text-xs">
                  <Link to="/admin/media">
                    <Settings size={13} className="mr-1.5" />
                    Edit in Admin
                  </Link>
                </Button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Close image modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Image Body */}
            <div className="relative flex-1 bg-black/95 flex items-center justify-center p-2 sm:p-4 overflow-hidden min-h-[300px] max-h-[65vh]">
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.title}
                className="max-h-[62vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Modal Description Footer */}
            {selectedPhoto.description && (
              <div className="p-4 sm:p-5 border-t border-border bg-card">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {selectedPhoto.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

