// Planner page — auth-protected client-side. Owns the trip request state machine.
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { TripInput } from "@/components/planner/TripInput";
import { TripLoadingScene } from "@/components/planner/TripLoadingScene";
import { TripReport } from "@/components/planner/TripReport";
import { useAuth } from "@/hooks/useAuth";
import { useTripRequest } from "@/hooks/useTripRequest";

export const Route = createFileRoute("/planner")({
  // Client-only: Supabase session lives in localStorage, no SSR check possible.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Planner — Trippin'" },
      {
        name: "description",
        content: "Plan your next trip in one sentence with Trippin'.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const {
    sentence,
    setSentence,
    tripUIState,
    report,
    error,
    submitTrip,
    resetTrip,
  } = useTripRequest();

  // Redirect unauthenticated users to landing.
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/" });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    // Minimal skeleton — no spinner.
    return (
      <div
        className="app-gradient min-h-screen theme-transition"
      >
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 pt-40">
          <div
            className="h-6 w-24 animate-pulse rounded"
            style={{ backgroundColor: "var(--sand)" }}
          />
          <div
            className="mt-4 h-10 w-3/4 animate-pulse rounded"
            style={{ backgroundColor: "var(--sand)" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-gradient min-h-screen theme-transition">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 py-24 pt-32">
        {tripUIState === "idle" || tripUIState === "submitting" ? (
          <TripInput
            sentence={sentence}
            onSentenceChange={setSentence}
            onSubmit={submitTrip}
            isSubmitting={tripUIState === "submitting"}
          />
        ) : null}

        {tripUIState === "result_ready" && report && (
          <TripReport report={report} onReset={resetTrip} />
        )}

        {tripUIState === "error" && (
          <div className="mx-auto max-w-md text-center">
            <h2
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 600,
                fontSize: 20,
                color: "var(--charcoal)",
              }}
            >
              Something went wrong.
            </h2>
            <p
              className="mt-2"
              style={{ fontFamily: "Inter", fontSize: 15, color: "var(--muted-text)" }}
            >
              {error}
            </p>
            <button
              onClick={resetTrip}
              className="glass-button mt-6 rounded-full px-6 py-2.5 text-sm transition-all hover:scale-[1.02]"
              style={{
                borderColor: "var(--sand)",
                color: "var(--charcoal)",
                fontFamily: "Inter",
                fontWeight: 500,
              }}
            >
              Try again
            </button>
          </div>
        )}
      </main>

      {tripUIState === "loading_animation" && (
        <TripLoadingScene
          origin={report?.origin}
          destination={report?.destination}
        />
      )}
    </div>
  );
}
