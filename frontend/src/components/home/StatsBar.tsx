const STATS = [
  {
    value: "60+",
    label: "Destinations",
  },
  {
    value: "12,400+",
    label: "Happy Travelers",
  },
  {
    value: "98%",
    label: "Satisfaction Rate",
  },
  {
    value: "15 yrs",
    label: "of Experience",
  },
] as const;

export function StatsBar() {
  return (
    <section className="bg-primary text-primary-foreground py-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p
              className="text-2xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {stat.value}
            </p>

            <p className="text-primary-foreground/70 text-sm mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
