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
    <section
      style={{ backgroundColor: "#0C0C0C" }}
      className="w-full py-24"
    >
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
        className="agent-scroll-row mt-12"
        style={{
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
          gap: "20px",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "32px",
          width: "100%",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {agents.map((agent) => (
          <motion.div
            key={agent.name}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              minWidth: "260px",
              flexShrink: 0,
              scrollSnapAlign: "start",
            }}
            className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 cursor-default"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <agent.Icon size={18} color="white" />
              </div>
              <span className="font-mono text-sm text-white/30">{agent.num}</span>
            </div>

            <div className="mt-10">
              <h3 className="font-display text-xl font-bold text-white">{agent.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{agent.desc}</p>
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
