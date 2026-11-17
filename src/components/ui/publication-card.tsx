import { Link } from "react-router-dom";
import { BookOpen, ExternalLink, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicationCardProps {
  title: string;
  journal: string;
  year: string;
  type: "journal" | "conference" | "book" | "chapter";
  authors?: string;
  doi?: string;
  link?: string;
  className?: string;
}

const typeLabels = {
  journal: "Journal Article",
  conference: "Conference Paper",
  book: "Book",
  chapter: "Book Chapter",
};

const typeColors = {
  journal: "bg-primary/10 text-primary",
  conference: "bg-secondary/10 text-secondary",
  book: "bg-accent/10 text-accent",
  chapter: "bg-muted text-muted-foreground",
};

export function PublicationCard({
  title,
  journal,
  year,
  type,
  authors,
  doi,
  link,
  className,
}: PublicationCardProps) {
  return (
    <div
      className={cn(
        "card-institutional p-6 border-l-4 border-l-accent",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="hidden sm:block p-2 rounded-sm bg-muted text-muted-foreground">
          <BookOpen size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <span
              className={cn(
                "inline-flex px-2 py-0.5 text-xs font-medium rounded",
                typeColors[type]
              )}
            >
              {typeLabels[type]}
            </span>
            <span className="text-sm font-medium text-accent whitespace-nowrap">
              {year}
            </span>
          </div>

          <h3 className="font-serif text-lg font-semibold text-primary leading-snug mb-2">
            {title}
          </h3>

          <p className="text-muted-foreground text-sm italic mb-2">{journal}</p>

          {authors && (
            <p className="text-foreground/70 text-sm mb-3">{authors}</p>
          )}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {(doi || link) && (
            <a
              href={link || `https://doi.org/${doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
            >
              {doi ? `DOI: ${doi}` : "View Publication"}
              <ExternalLink size={14} />
            </a>
          )}
          <Link
            to={`/contact?type=paper&title=${encodeURIComponent(title)}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <Mail size={14} />
            Request full text
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
