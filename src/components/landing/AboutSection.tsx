// Ivory brand-description block with scroll-reveal.
import { motion } from "framer-motion";

const STATS = [
  "200+ airlines scanned",
  "Real-time weather data",
  "Day-by-day itinerary",
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="section-glass w-full py-32 theme-transition"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="label-eyebrow">WHAT IS TRIPPIN'</p>

          <p
            className="mt-6"
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 600,
              fontSize: "clamp(28px, 4vw, 52px)",
              color: "var(--charcoal)",
              lineHeight: 1.2,
            }}
          >
            Travel planning takes time you don't have.
            <br />
            Trippin' does it in seconds.
            <br />
            <br />
            Tell it where you want to go. It finds flights, matches hotels to your
            style, checks the weather, and builds a full itinerary — automatically.
          </p>

          <div className="mt-16 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-12">
            {STATS.map((label) => (
              <div
                key={label}
                className="pb-1"
                style={{
                  borderBottom: "1px solid var(--sage)",
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: 15,
                  color: "var(--muted-text)",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
