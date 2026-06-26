import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Plane, Download } from "lucide-react";

const STEP_COUNT = 6;
const STEP_DURATION_MS = 1800;
const RESET_PAUSE_MS = 2000;

export function DemoSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setActiveStep(STEP_COUNT);
      return;
    }

    function advance(current: number) {
      if (current < STEP_COUNT) {
        setActiveStep(current);
        timerRef.current = setTimeout(() => advance(current + 1), STEP_DURATION_MS);
      } else {
        timerRef.current = setTimeout(() => advance(0), RESET_PAUSE_MS);
      }
    }

    advance(0);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const steps = [
    "Parsing request",
    "Searching available flights",
    "Finding hotels",
    "Checking weather conditions",
    "Building itinerary",
    "Generating report",
  ];

  return (
    <section className="w-full bg-[var(--color-dark-bg)] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="label-eyebrow">SEE IT WORK</div>
          <h2 className="font-display mt-3 text-4xl font-bold text-white md:text-5xl">
            One prompt. A full plan.
          </h2>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Left panel */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-white/20"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-white/20"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-white/20"></div>
            </div>

            <div className="mt-6 inline-block rounded-2xl bg-white/10 px-5 py-3">
              <p className="text-sm text-white">
                Plan a 5-day trip to Tokyo from Mumbai in October.
              </p>
            </div>

            <div className="mt-6 flex flex-col">
              {steps.map((text, index) => {
                const isPending = index > activeStep;
                const isActive = index === activeStep;
                const isComplete = index < activeStep;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 border-b border-white/5 py-3 last:border-0 ${
                      isActive ? "-ml-2 border-l-2 border-l-[var(--color-sage)] pl-2" : ""
                    }`}
                  >
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {isPending && (
                        <div className="h-4 w-4 rounded-full border border-white/20"></div>
                      )}
                      {isActive && (
                        <div className="h-4 w-4 animate-pulse rounded-full bg-[var(--color-sage)]"></div>
                      )}
                      {isComplete && <Check size={14} color="var(--color-sage)" />}
                    </div>
                    <span
                      className={`text-sm ${
                        isPending
                          ? "text-white/30"
                          : isActive
                            ? "text-white/90"
                            : "text-white/50"
                      }`}
                    >
                      {text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel */}
          <motion.div
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            animate={{ opacity: activeStep >= STEP_COUNT ? 1 : 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="label-eyebrow">TRIP SUMMARY</div>
                <h3 className="font-display mt-2 text-3xl font-bold text-white">
                  Tokyo, Japan
                </h3>
                <p className="mt-1 text-sm text-white/50">Oct 12 – Oct 17 · 2 travelers</p>
              </div>
              <Plane size={22} className="text-white/30" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.06] p-4">
                <div className="label-eyebrow mb-1">FLIGHT</div>
                <div className="font-display text-base font-semibold text-white">BOM to HND</div>
                <div className="mt-0.5 text-xs text-white/50">Non-stop · Rs. 48,200</div>
              </div>
              <div className="rounded-xl bg-white/[0.06] p-4">
                <div className="label-eyebrow mb-1">HOTEL</div>
                <div className="font-display text-base font-semibold text-white">Shinjuku Granbell</div>
                <div className="mt-0.5 text-xs text-white/50">4.6 · Rs. 9,800/night</div>
              </div>
              <div className="rounded-xl bg-white/[0.06] p-4">
                <div className="label-eyebrow mb-1">WEATHER</div>
                <div className="font-display text-base font-semibold text-white">18 C, Clear</div>
                <div className="mt-0.5 text-xs text-white/50">Crisp autumn</div>
              </div>
              <div className="rounded-xl bg-white/[0.06] p-4">
                <div className="label-eyebrow mb-1">DAY 1</div>
                <div className="font-display text-base font-semibold text-white">Shibuya + Skyline</div>
                <div className="mt-0.5 text-xs text-white/50">Crossing, ramen, views</div>
              </div>
            </div>

            <button
              disabled
              aria-disabled="true"
              className="font-display mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-semibold"
              style={{ color: "var(--charcoal)" }}
            >
              <Download size={15} />
              Download Report
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
