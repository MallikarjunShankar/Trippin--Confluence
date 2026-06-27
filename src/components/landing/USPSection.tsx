import { motion } from "framer-motion";
import { Zap, Sparkles, Globe } from "lucide-react";

export function USPSection() {
  return (
    <section
      style={{ backgroundColor: "#0C0C0C" }}
      className="w-full px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-5xl font-bold text-white md:text-6xl">
            Built different.
          </h2>
          <p className="mt-4 max-w-[560px] text-base text-white/55 md:text-lg">
            Not a search engine. Not a booking tool. An AI that thinks like a travel expert.
          </p>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <Card
            icon={<Zap size={18} color="white" />}
            title="Instant, not infinite"
            body="No 47 tabs. No decision paralysis. One prompt, complete plan."
          />
          <Card
            icon={<Sparkles size={18} color="white" />}
            title="Context-aware"
            body="Trippin knows your budget, pace, and vibe. Every suggestion is intentional."
          />
          <Card
            icon={<Globe size={18} color="white" />}
            title="Always current"
            body="Live weather, real fares, updated hotel availability. No stale data."
          />
        </motion.div>
      </div>
    </section>
  );
}

function Card({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-8"
    >
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
        {icon}
      </div>
      <h3 className="font-display mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-white/55">{body}</p>
    </motion.div>
  );
}
