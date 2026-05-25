import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground no-print">
      <div className="container-wide px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl font-semibold mb-4">
              Dr. G. Jaya Suma
            </h3>
            <p className="text-primary-foreground/80 leading-relaxed max-w-md">
             Professor with over three decades of distinguished service
              in academic administration, governance, and institutional
              leadership at premier educational institutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "About", href: "/about" },
                { label: "Experience", href: "/experience" },
                { label: "Publications", href: "/publications" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/80 text-sm">
                  Department of Information Technology
                  <br />
                  JNTU-GV Gurajada University
                  <br />
                  Vizianagaram, India – 535003
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <a
                  href="mailto:registrar@jntugv.edu.in"
                  className="text-primary-foreground/80 text-sm hover:text-accent transition-colors"
                >
                  registrar@jntugv.edu.in
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <span className="text-primary-foreground/80 text-sm">
                  +91 089222 94316
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-primary-foreground/60 text-sm">
              © {currentYear} Dr. G. Jaya Suma. All rights reserved.
            </p>

            <p className="text-primary-foreground/60 text-sm">
              Department of Information Technology, JNTU-GV Gurajada University
            </p>

            {/* Designer Credit */}
            <a
              href="https://github.com/Likhith32"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-primary-foreground/60 text-sm
                         transition-all duration-300 hover:text-accent
                         hover:-translate-y-0.5"
            >
              <Github
                size={16}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span>
                Designed by{" "}
                <span className="font-medium">Likhith Mankala</span>
              </span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs
                               bg-accent/10 text-accent font-medium">
                
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
