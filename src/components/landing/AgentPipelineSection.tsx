import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Network, Plane, Building2, Cloud, MapPin, CalendarDays } from "lucide-react";

export function AgentPipelineSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const progress = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    setScrollProgress(Math.min(1, Math.max(0, progress)));
  }

  const agents = [
    { num: "01", name: "Supervisor Agent", desc: "Orchestrating the pipeline", Icon: Network },
    { num: "02", name: "Flight Agent", desc: "Scanning available routes", Icon: Plane },
    { num: "03", name: "Hotel Agent", desc: "Matching your vibe", Icon: Building2 },
    { num: "04", name: "Weather Agent", desc: "Checking conditions", Icon: Cloud },
    { num: "05", name: "Local Agent", desc: "Finding hidden gems", Icon: MapPin },
    { num: "06", name: "Itinerary Agent", desc: "Crafting your journey", Icon: CalendarDays },
  ];

  return (
    <section className="w-full bg-[var(--color-dark-bg)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="label-eyebrow">THE PIPELINE</div>
          <h2 className="font-display mt-3 text-4xl font-bold text-white md:text-5xl">
            Six agents. One journey.
          </h2>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="agent-scroll-row mt-12 flex flex-row overflow-x-auto px-6 pb-8"
        style={{
          gap: "20px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {agents.map(({ num, name, desc, Icon }, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6, borderColor: "rgba(184,198,177,0.35)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-auto shrink-0 snap-start rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            style={{ minWidth: "260px", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Icon size={18} color="white" />
              </div>
              <span className="font-mono text-sm text-white/30">{num}</span>
            </div>

            <div className="mt-10">
              <h3 className="font-display text-xl font-bold text-white">{name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{desc}</p>
            </div>

            <div className="mt-6 h-0.5 w-8 bg-[var(--color-sage)]"></div>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto mt-4 max-w-6xl px-6">
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[var(--color-sage)]"
            style={{ width: `${scrollProgress * 100}%` }}
          ></div>
        </div>
      </div>
    </section>
  );
}
