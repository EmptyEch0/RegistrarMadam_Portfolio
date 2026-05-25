import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MediaCard } from "@/components/ui/media-card";
import { Newspaper, Mail } from "lucide-react";

interface MediaItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  year: number;
  source: string;
}

const MediaPage = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .order("year", { ascending: false });

      if (error) {
        console.error("Error fetching media:", error);
      } else {
        setMediaItems(data || []);
      }

      setLoading(false);
    };

    fetchMedia();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-16 text-center">
        <h1 className="text-5xl font-bold text-primary">Media Coverage</h1>
        <p className="text-muted-foreground mt-3">
          Newspaper features, interviews, and public addresses
        </p>
      </section>

      {/* Media Grid */}
      <section className="py-20">
        <div className="container-wide px-4">

          <div className="text-center mb-12">
            <Newspaper className="mx-auto text-accent" size={32} />
            <h2 className="text-4xl font-serif mt-3">
              Press & Publications
            </h2>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading media...
            </p>
          ) : mediaItems.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No media found.
            </p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {mediaItems.map(item => (
                <MediaCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  imageUrl={item.image_url}
                  date={item.year.toString()}
                  source={item.source}
                  type="press"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Media Inquiry */}
      <section className="py-16 bg-muted/30 text-center">
        <Mail className="mx-auto text-accent" size={26} />
        <p className="mt-4 text-muted-foreground">
          For interview requests, speaking engagements, or media inquiries,
          please contact the Department of Information Technology.
        </p>
        <a
          href="/contact"
          className="inline-block mt-4 text-accent font-medium"
        >
          Contact Us →
        </a>
      </section>

      <Footer />
    </div>
  );
};

export default MediaPage;
