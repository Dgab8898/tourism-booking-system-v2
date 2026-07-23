import { Star } from "lucide-react";

type Testimonial = {
  name: string;
  location: string;
  trip: string;
  avatar: string;
  rating: number;
  text: string;
};

type TestimonialsProps = {
  testimonials: readonly Testimonial[];
};

export function Testimonials({
  testimonials,
}: TestimonialsProps) {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-accent text-sm font-bold uppercase tracking-widest mb-2">
          Stories from the Road
        </p>

        <h2
          className="text-4xl font-bold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          What Travelers Say
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="bg-card rounded-2xl p-7 border border-border shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>

            <p className="text-foreground text-sm leading-relaxed flex-1">
              "{testimonial.text}"
            </p>

            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {testimonial.avatar}
              </div>

              <div>
                <p className="font-semibold text-sm">
                  {testimonial.name}
                </p>

                <p className="text-muted-foreground text-xs">
                  {testimonial.location} · {testimonial.trip}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
