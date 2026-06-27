// Full formatted trip report. Pure presentational — receives report via props.
import { motion } from "framer-motion";
import { useState } from "react";
import type { TripReport as TripReportType } from "@/types";

interface TripReportProps {
  report: TripReportType;
  onReset: () => void;
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2
      className="mb-4"
      style={{
        fontFamily: "Space Grotesk",
        fontWeight: 600,
        fontSize: 20,
        color: "var(--charcoal)",
      }}
    >
      {children}
    </h2>
  );
}

function MarkdownCard({ content }: { content: string }) {
  return (
    <div
      className="glass-card rounded-2xl p-5"
      style={{
        fontFamily: "Inter",
        fontSize: 15,
        color: "var(--charcoal)",
        whiteSpace: "pre-wrap",
        lineHeight: 1.8,
      }}
    >
      {content}
    </div>
  );
}

export function TripReport({ report, onReset }: TripReportProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore — clipboard may be blocked.
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-2xl px-4"
    >
      {/* Header */}
      <p className="label-eyebrow">YOUR TRIP</p>
      <h1
        className="mt-3"
        style={{
          fontFamily: "Space Grotesk",
          fontWeight: 700,
          fontSize: "clamp(28px, 4vw, 36px)",
          color: "var(--charcoal)",
        }}
      >
        {report.destination || "Destination"}
      </h1>
      <p className="mt-2" style={{ fontFamily: "Inter", fontSize: 15, color: "var(--muted-text)" }}>
        {report.eventDate}
      </p>

      {/* Report */}
      {report.report && report.report.trim().length > 0 && (
        <section className="mt-10 border-b pb-10" style={{ borderColor: "var(--sand)" }}>
          <SectionHeading>Trip Report</SectionHeading>
          <MarkdownCard content={report.report} />
        </section>
      )}

      {/* Itinerary */}
      {report.itinerary && report.itinerary.trim().length > 0 && (
        <section className="mt-10 border-b pb-10" style={{ borderColor: "var(--sand)" }}>
          <SectionHeading>Day-by-day Itinerary</SectionHeading>
          <MarkdownCard content={report.itinerary} />
        </section>
      )}

      {/* Footer actions */}
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <button
          onClick={onReset}
          className="glass-button rounded-full px-5 py-2.5 text-sm transition-all hover:scale-[1.02]"
          style={{
            borderColor: "var(--sand)",
            color: "var(--charcoal)",
            fontFamily: "Inter",
            fontWeight: 500,
          }}
        >
          Plan another trip
        </button>
        <button
          onClick={copyLink}
          className="glass-button rounded-full px-5 py-2.5 text-sm transition-all hover:scale-[1.02]"
          style={{
            borderColor: "var(--sand)",
            color: "var(--charcoal)",
            fontFamily: "Inter",
            fontWeight: 500,
          }}
        >
          Copy report link
        </button>
        {copied && (
          <span className="text-sm" style={{ fontFamily: "Inter", color: "var(--sage)" }}>
            Copied.
          </span>
        )}
      </div>
    </motion.div>
  );
}
