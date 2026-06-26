// The ONLY place that talks to the FastAPI backend.
// Components must never call fetch / axios directly.

import type {
  FlightOption,
  HotelOption,
  ItineraryDay,
  TripReport,
  TripRequest,
  WeatherDay,
} from "@/types";

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8000";

export async function submitTripRequest(
  request: TripRequest,
): Promise<TripReport> {
  const response = await fetch(`${API_BASE}/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const detail =
      (errorBody && typeof errorBody === "object" && "detail" in errorBody
        ? String((errorBody as { detail: unknown }).detail)
        : null) ?? `Request failed: ${response.status}`;
    throw new Error(detail);
  }

  const raw: unknown = await response.json();
  return normalizeTripResponse(raw);
}

/* ---------- Normalizers (snake_case → camelCase, defensive) ---------- */

type Raw = Record<string, unknown>;

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function asNumber(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function normalizeFlightOption(f: unknown): FlightOption {
  const r = (f ?? {}) as Raw;
  return {
    airline: asString(r.airline),
    flightNumber: asString(r.flight_number ?? r.flightNumber),
    departure: asString(r.departure),
    arrival: asString(r.arrival),
    origin: asString(r.origin),
    destination: asString(r.destination),
    durationMinutes: asNumber(r.duration_minutes ?? r.durationMinutes),
    price: asNumber(r.price),
    currency: asString(r.currency, "INR"),
    cabinClass: asString(r.cabin_class ?? r.cabinClass, "Economy"),
  };
}

function normalizeHotelOption(h: unknown): HotelOption {
  const r = (h ?? {}) as Raw;
  return {
    name: asString(r.name),
    starRating: asNumber(r.star_rating ?? r.starRating),
    pricePerNight: asNumber(r.price_per_night ?? r.pricePerNight),
    currency: asString(r.currency, "INR"),
    address: asString(r.address),
    checkIn: asString(r.check_in ?? r.checkIn),
    checkOut: asString(r.check_out ?? r.checkOut),
  };
}

function normalizeWeatherDay(w: unknown): WeatherDay {
  const r = (w ?? {}) as Raw;
  return {
    date: asString(r.date),
    condition: asString(r.condition),
    tempHighC: asNumber(r.temp_high_c ?? r.tempHighC),
    tempLowC: asNumber(r.temp_low_c ?? r.tempLowC),
  };
}

function normalizeItineraryDay(d: unknown): ItineraryDay {
  const r = (d ?? {}) as Raw;
  const activities = asArray(r.activities)
    .map((a) => asString(a))
    .filter((s) => s.length > 0);
  return {
    day: asNumber(r.day),
    date: asString(r.date),
    title: asString(r.title),
    activities,
  };
}

function normalizeTripResponse(raw: unknown): TripReport {
  const r = (raw ?? {}) as Raw;
  const errorsRaw = asArray(r.errors).map((e) => asString(e));
  return {
    query: asString(r.query),
    origin: asString(r.origin),
    destination: asString(r.destination),
    date: asString(r.date),
    returnDate:
      typeof r.return_date === "string"
        ? r.return_date
        : typeof r.returnDate === "string"
          ? r.returnDate
          : undefined,
    travelers:
      typeof r.travelers === "number" ? r.travelers : undefined,
    flights: asArray(r.flights).map(normalizeFlightOption),
    hotels: asArray(r.hotels).map(normalizeHotelOption),
    weather: asArray(r.weather).map(normalizeWeatherDay),
    itinerary: asArray(r.itinerary).map(normalizeItineraryDay),
    budgetSummaryINR:
      typeof r.budget_summary_inr === "number"
        ? r.budget_summary_inr
        : typeof r.budgetSummaryINR === "number"
          ? r.budgetSummaryINR
          : undefined,
    notes: typeof r.notes === "string" ? r.notes : undefined,
    errors: errorsRaw.length > 0 ? errorsRaw : undefined,
  };
}
