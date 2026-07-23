type CallToActionProps = {
  onBrowsePackages: () => void;
  onContactExpert: () => void;
};

export function CallToAction({
  onBrowsePackages,
  onContactExpert,
}: CallToActionProps) {
  return (
    <section className="relative py-24 bg-primary overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center px-6">
        <h2
          className="text-primary-foreground text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Ready to Start Your Journey?
        </h2>

        <p className="text-primary-foreground/70 text-lg mb-8">
          Talk to one of our travel experts and get a personalized itinerary
          within 48 hours — no obligation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={onBrowsePackages}
            className="px-8 py-4 bg-accent text-white rounded-xl font-bold text-base hover:opacity-90 transition-opacity"
          >
            Browse Packages
          </button>

          <button
            type="button"
            onClick={onContactExpert}
            className="px-8 py-4 border-2 border-primary-foreground/30 text-primary-foreground rounded-xl font-bold text-base hover:border-primary-foreground/60 transition-colors"
          >
            Contact an Expert
          </button>
        </div>
      </div>
    </section>
  );
}
