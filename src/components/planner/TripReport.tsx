// Full formatted trip report. Pure presentational — receives report via props.
import { motion } from "framer-motion";
import { useState } from "react";
import type {
  FlightOption,
  HotelOption,
  ItineraryDay,
  TripReport as TripReportType,
  WeatherDay,
} from "@/types";

interface TripReportProps {
  report: TripReportType;
  onReset: () => void;
}

function formatDuration(mins: number): string {
  if (!mins || mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function formatDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  return `${time}, ${date}`;
}

function formatShortDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit" });
}

function formatLongDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
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

function EmptyState({ children }: { children: string }) {
  return (
    <p
      className="py-4 text-center"
      style={{ fontFamily: "Inter", fontSize: 15, color: "var(--muted-text)" }}
    >
      {children}
    </p>
  );
}

function FlightCard({ flight }: { flight: FlightOption }) {
  return (
    <div
      className="rounded-2xl border bg-white p-5"
      style={{ borderColor: "var(--sand)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 600,
              fontSize: 16,
              color: "var(--charcoal)",
            }}
          >
            {flight.airline || "Airline"}
          </p>
          <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--muted-text)" }}>
            {flight.flightNumber}
          </p>
        </div>
        <div className="text-right">
          <p
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: 20,
              color: "var(--charcoal)",
            }}
          >
            {flight.price ? flight.price.toLocaleString() : "—"}
          </p>
          <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--muted-text)" }}>
            {flight.currency}
          </p>
        </div>
      </div>

      <div
        className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1"
        style={{ fontFamily: "Inter", fontSize: 14, color: "var(--charcoal)" }}
      >
        <span>{flight.origin || "—"}</span>
        <span style={{ color: "var(--muted-text)" }}>→</span>
        <span>{flight.destination || "—"}</span>
        <span style={{ color: "var(--muted-text)" }}>·</span>
        <span style={{ color: "var(--muted-text)" }}>
          {formatDateTime(flight.departure)} – {formatDateTime(flight.arrival)}
        </span>
      </div>

      <div
        className="mt-2 flex flex-wrap gap-x-3"
        style={{ fontFamily: "Inter", fontSize: 13, color: "var(--muted-text)" }}
      >
        <span>{formatDuration(flight.durationMinutes)}</span>
        <span>·</span>
        <span>{flight.cabinClass || "Economy"}</span>
      </div>
    </div>
  );
}

function HotelCard({ hotel }: { hotel: HotelOption }) {
  return (
    <div
      className="rounded-2xl border bg-white p-5"
      style={{ borderColor: "var(--sand)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 600,
              fontSize: 16,
              color: "var(--charcoal)",
            }}
          >
            {hotel.name || "Hotel"}
          </p>
          <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--muted-text)" }}>
            {hotel.starRating ? `${hotel.starRating} stars` : "—"}
          </p>
        </div>
        <div className="text-right">
          <p
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: 20,
              color: "var(--charcoal)",
            }}
          >
            {hotel.pricePerNight ? hotel.pricePerNight.toLocaleString() : "—"}
          </p>
          <p style={{ fontFamily: "Inter", fontSize: 13, color: "var(--muted-text)" }}>
            {hotel.currency} / night
          </p>
        </div>
      </div>
      <p
        className="mt-3"
        style={{ fontFamily: "Inter", fontSize: 13, color: "var(--muted-text)" }}
      >
        {hotel.address || "—"}
      </p>
      <p
        className="mt-1"
        style={{ fontFamily: "Inter", fontSize: 13, color: "var(--muted-text)" }}
      >
        Check-in {formatLongDate(hotel.checkIn)} · Check-out {formatLongDate(hotel.checkOut)}
      </p>
    </div>
  );
}

function WeatherDayCard({ day }: { day: WeatherDay }) {
  return (
    <div
      className="min-w-[100px] shrink-0 rounded-xl p-3 text-center"
      style={{ backgroundColor: "var(--sand)" }}
    >
      <p
        style={{
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: 13,
          color: "var(--charcoal)",
        }}
      >
        {formatShortDate(day.date)}
      </p>
      <p
        className="mt-1"
        style={{ fontFamily: "Inter", fontSize: 13, color: "var(--muted-text)" }}
      >
        {day.condition || "—"}
      </p>
      <p
        className="mt-1"
        style={{
          fontFamily: "Space Grotesk",
          fontWeight: 600,
          fontSize: 15,
          color: "var(--charcoal)",
        }}
      >
        {day.tempHighC} / {day.tempLowC}
      </p>
    </div>
  );
}

function ItineraryDayBlock({ day }: { day: ItineraryDay }) {
  return (
    <div className="py-4" style={{ borderTop: "1px solid var(--sand)" }}>
      <p
        style={{
          fontFamily: "Space Grotesk",
          fontWeight: 600,
          fontSize: 15,
          color: "var(--charcoal)",
        }}
      >
        Day {day.day} — {formatLongDate(day.date)}
      </p>
      {day.title && (
        <p
          className="mt-1 italic"
          style={{ fontFamily: "Inter", fontSize: 14, color: "var(--muted-text)" }}
        >
          {day.title}
        </p>
      )}
      {day.activities.length > 0 && (
        <ul
          className="mt-2 list-inside list-disc"
          style={{
            fontFamily: "Inter",
            fontSize: 14,
            color: "var(--charcoal)",
            lineHeight: 1.8,
          }}
        >
          {day.activities.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      )}
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
        {report.origin || "Origin"} → {report.destination || "Destination"}
      </h1>
      <p
        className="mt-2"
        style={{ fontFamily: "Inter", fontSize: 15, color: "var(--muted-text)" }}
      >
        {report.date}
        {report.returnDate ? ` – ${report.returnDate}` : ""}
        {report.travelers ? ` · ${report.travelers} travelers` : ""}
      </p>

      {/* Flights */}
      <section
        className="mt-10 border-b pb-10"
        style={{ borderColor: "var(--sand)" }}
      >
        <SectionHeading>Flights</SectionHeading>
        {report.flights.length > 0 ? (
          <div className="space-y-4">
            {report.flights.map((f, i) => (
              <FlightCard key={i} flight={f} />
            ))}
          </div>
        ) : (
          <EmptyState>No flights found for this route.</EmptyState>
        )}
      </section>

      {/* Hotels */}
      <section
        className="mt-10 border-b pb-10"
        style={{ borderColor: "var(--sand)" }}
      >
        <SectionHeading>Hotels</SectionHeading>
        {report.hotels.length > 0 ? (
          <div className="space-y-4">
            {report.hotels.map((h, i) => (
              <HotelCard key={i} hotel={h} />
            ))}
          </div>
        ) : (
          <EmptyState>No hotel options to show yet.</EmptyState>
        )}
      </section>

      {/* Weather */}
      <section
        className="mt-10 border-b pb-10"
        style={{ borderColor: "var(--sand)" }}
      >
        <SectionHeading>Weather</SectionHeading>
        {report.weather.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {report.weather.map((w, i) => (
              <WeatherDayCard key={i} day={w} />
            ))}
          </div>
        ) : (
          <EmptyState>No weather forecast available.</EmptyState>
        )}
      </section>

      {/* Itinerary */}
      <section
        className="mt-10 border-b pb-10"
        style={{ borderColor: "var(--sand)" }}
      >
        <SectionHeading>Day-by-day</SectionHeading>
        {report.itinerary.length > 0 ? (
          <div>
            {report.itinerary.map((d, i) => (
              <ItineraryDayBlock key={i} day={d} />
            ))}
          </div>
        ) : (
          <EmptyState>No itinerary yet.</EmptyState>
        )}
      </section>

      {/* Budget */}
      {typeof report.budgetSummaryINR === "number" && (
        <section
          className="mt-10 border-b pb-10"
          style={{ borderColor: "var(--sand)" }}
        >
          <SectionHeading>Estimated Budget</SectionHeading>
          <p
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 600,
              fontSize: 22,
              color: "var(--charcoal)",
            }}
          >
            Approx. ₹{report.budgetSummaryINR.toLocaleString("en-IN")} total
          </p>
        </section>
      )}

      {/* Notes */}
      {report.notes && report.notes.trim().length > 0 && (
        <section
          className="mt-10 border-b pb-10"
          style={{ borderColor: "var(--sand)" }}
        >
          <SectionHeading>Things to know</SectionHeading>
          <p
            className="max-w-[600px]"
            style={{ fontFamily: "Inter", fontSize: 15, color: "var(--muted-text)" }}
          >
            {report.notes}
          </p>
        </section>
      )}

      {/* Footer actions */}
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <button
          onClick={onReset}
          className="rounded-full border px-5 py-2.5 text-sm transition-colors hover:bg-black/5"
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
          className="rounded-full border px-5 py-2.5 text-sm transition-colors hover:bg-black/5"
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
          <span
            className="text-sm"
            style={{ fontFamily: "Inter", color: "var(--sage)" }}
          >
            Copied.
          </span>
        )}
      </div>
    </motion.div>
  );
}
