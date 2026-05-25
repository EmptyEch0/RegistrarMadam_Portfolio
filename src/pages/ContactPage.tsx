import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";

const ContactPage = () => {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent",
      description:
        "Thank you for your message. We will respond within 2-3 business days.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Office Address",
      content: [
        "Department of Information Technology",
        "JNTU-GV (Jawaharlal Nehru Technological University - Gurajada Vizianagaram)",
        "Dwarapudi, Vizianagaram",
        "Andhra Pradesh 535003, India",
      ],
    },
    {
      icon: Mail,
      title: "Email",
      content: ["registrar@jntugv.edu.in"],
    },
    {
      icon: Phone,
      title: "Phone",
      content: ["+91 08922294316"],
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: [
        "Monday - Friday: 9:00 AM - 5:30 PM",
        "Saturday: 10:00 AM - 1:00 PM",
        "Sunday: Closed",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-cream-dark to-background">
        <div className="container-wide px-6 lg:px-12">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Contact
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect for collaborations, consultations, or academic engagements
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-wide px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <div className="animate-fade-in-left">
              <SectionHeading
                title="Send a Message"
                subtitle="Fill out the form below and we will respond promptly"
                alignment="left"
              />

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-card transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-card transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Subject of your message"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-card transition-all duration-300 focus:scale-[1.02]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="bg-card resize-none transition-all duration-300 focus:scale-[1.01]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto transform hover:scale-105 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-pulse">Sending...</span>
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="animate-fade-in-right">
              <SectionHeading
                title="Contact Information"
                subtitle="Reach out through official channels"
                alignment="left"
              />

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="group card-institutional p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors duration-300">
                      <item.icon size={24} className="text-accent group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      {item.content.map((line, idx) => (
                        <p
                          key={idx}
                          className="text-foreground/70 text-sm leading-relaxed group-hover:text-foreground transition-colors"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Google Map */}
              <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <h3 className="font-serif text-xl font-semibold text-primary mb-4">
                  Location Map
                </h3>
                <div className="aspect-video bg-muted rounded-lg border border-border overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.8989647756826!2d83.41984387501326!3d18.116999682594936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3be3e0cd996633%3A0x1e8c1e8f5e8f5e8f!2sJNTU-GV%2C%20Dwarapudi%2C%20Andhra%20Pradesh%20535003!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="JNTU-GV Location Map"
                  ></iframe>
                </div>
                <div className="mt-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm text-foreground/70 text-center">
                    <MapPin className="inline w-4 h-4 mr-1 text-accent" />
                    JNTU-GV Campus, Dwarapudi, Vizianagaram, Andhra Pradesh 535003
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-12 bg-gradient-to-r from-muted/20 via-muted/30 to-muted/20">
        <div className="container-narrow px-6 lg:px-12 text-center">
          <div className="p-6 bg-card rounded-lg border border-border shadow-md">
            <p className="text-muted-foreground text-sm leading-relaxed">
              <strong className="text-primary">Note:</strong> For academic inquiries,
              research collaborations, or department matters, please contact the
              Department of Information Technology. All official communications
              can be sent to the official email address{" "}
              <a href="mailto:registrar@jntugv.edu.in" className="text-accent hover:underline font-medium">
                registrar@jntugv.edu.in
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-6 lg:px-12">
          <SectionHeading
            title="Quick Contact"
            subtitle="Choose the best way to reach us"
          />

          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="mailto:registrar@jntugv.edu.in"
              className="group card-institutional p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Mail className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                Email Us
              </h3>
              <p className="text-foreground/70 text-sm">
                registrar@jntugv.edu.in
              </p>
            </a>

            <a
              href="tel:+918897344078"
              className="group card-institutional p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Phone className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                Call Us
              </h3>
              <p className="text-foreground/70 text-sm">
                +91 88973 44078
              </p>
            </a>

            <a
              href="https://maps.app.goo.gl/7Wpc87Ntn7XCEge9"
              target="_blank"
              rel="noopener noreferrer"
              className="group card-institutional p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <MapPin className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                Visit Us
              </h3>
              <p className="text-foreground/70 text-sm">
                Dwarapudi, Vizianagaram
              </p>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;