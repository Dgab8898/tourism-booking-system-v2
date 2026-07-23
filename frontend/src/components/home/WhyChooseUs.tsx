import { Clock, Shield, Star } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "Fully Protected",
    description:
      "Every booking is covered by ATOL protection and comprehensive travel insurance options.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Our team is available around the clock — before, during, and after your journey.",
  },
  {
    icon: Star,
    title: "Expert Curation",
    description:
      "Every destination, hotel, and guide is personally vetted by our travel specialists.",
  },
] as const;

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-bold uppercase tracking-widest mb-2">
            Why Wanderlust
          </p>

          <h2
            className="text-4xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Travel With Confidence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="bg-card rounded-2xl p-8 text-center shadow-sm"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon size={26} className="text-primary" />
              </div>

              <h3
                className="text-lg font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
