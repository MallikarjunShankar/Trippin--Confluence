// The ONLY place that talks to the FastAPI backend.
// Components must never call fetch / axios directly.

import type { TripReport, TripRequest } from "@/types";

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000";

export async function submitTripRequest(request: TripRequest): Promise<TripReport> {
  const response = await fetch(`${API_BASE}/api/trips/plan`, {
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

/* ---------- Normalizer ---------- */

type Raw = Record<string, unknown>;

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function normalizeTripResponse(raw: unknown): TripReport {
  const r = (raw ?? {}) as Raw;
  return {
    success: r.success === true,
    report: asString(r.report),
    itinerary: asString(r.itinerary),
    destination: asString(r.destination),
    eventDate: asString(r.event_date ?? r.eventDate),
  };
}
