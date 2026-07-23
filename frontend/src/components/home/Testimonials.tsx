import { Star } from "lucide-react";

type Testimonial = {
  name: string;
  location: string;
  image: string;
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
          Testimonials
        </p>

        <h2
          className="text-4xl font-bold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          What Our Travellers Say
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="bg-card rounded-2xl p-8 shadow-sm"
          >
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <Star
                  key={index}
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <p className="text-muted-foreground italic mb-6 leading-relaxed">
              "{testimonial.text}"
            </p>

            <div className="flex items-center gap-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover"
              />

              <div>
                <h4 className="font-semibold">
                  {testimonial.name}
                </h4>

                <p className="text-sm text-muted-foreground">
                  {testimonial.location}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
