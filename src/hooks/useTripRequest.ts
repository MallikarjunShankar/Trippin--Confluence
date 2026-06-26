// State machine for a single trip planning request.
// Owns: input text, UI state, the result, the error.
// Calls the service layer — never fetches directly.

import { useCallback, useState } from "react";
import { submitTripRequest } from "@/services/tripApi";
import type { TripReport, TripUIState } from "@/types";

interface UseTripRequestReturn {
  sentence: string;
  setSentence: (value: string) => void;
  tripUIState: TripUIState;
  report: TripReport | null;
  error: string | null;
  submitTrip: () => Promise<void>;
  resetTrip: () => void;
}

const MIN_SENTENCE_LENGTH = 10;

export function useTripRequest(): UseTripRequestReturn {
  const [sentence, setSentence] = useState("");
  const [tripUIState, setTripUIState] = useState<TripUIState>("idle");
  const [report, setReport] = useState<TripReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitTrip = useCallback(async () => {
    if (sentence.trim().length < MIN_SENTENCE_LENGTH) return;
    setError(null);
    setTripUIState("loading_animation");
    try {
      const result = await submitTripRequest({ sentence });
      setReport(result);
      setTripUIState("result_ready");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setTripUIState("error");
    }
  }, [sentence]);

  const resetTrip = useCallback(() => {
    setSentence("");
    setReport(null);
    setError(null);
    setTripUIState("idle");
  }, []);

  return {
    sentence,
    setSentence,
    tripUIState,
    report,
    error,
    submitTrip,
    resetTrip,
  };
}
