// Sentence input + example chips + submit button.
import { useState, type KeyboardEvent } from "react";

const MIN_LENGTH = 10;

const EXAMPLES = [
  "Bali for 7 days from Delhi",
  "Tokyo in October, 5 nights",
  "Weekend in Dubai from Bangalore",
  "Europe under budget",
];

interface TripInputProps {
  sentence: string;
  onSentenceChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function TripInput({
  sentence,
  onSentenceChange,
  onSubmit,
  isSubmitting,
}: TripInputProps) {
  const [showError, setShowError] = useState(false);

  function handleSubmit() {
    if (sentence.trim().length < MIN_LENGTH) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onSubmit();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="w-full">
      <p className="label-eyebrow">PLAN A TRIP</p>
      <h1
        className="mt-3"
        style={{
          fontFamily: "Space Grotesk",
          fontWeight: 700,
          fontSize: "clamp(28px, 4vw, 36px)",
          color: "var(--charcoal)",
        }}
      >
        Where do you want to go?
      </h1>
      <p
        className="mt-2"
        style={{ fontFamily: "Inter", fontSize: 16, color: "var(--muted-text)" }}
      >
        Describe your trip in plain language.
      </p>

      <textarea
        value={sentence}
        onChange={(e) => {
          onSentenceChange(e.target.value);
          if (showError && e.target.value.trim().length >= MIN_LENGTH) {
            setShowError(false);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder="Find flights from Mumbai to Tokyo from 15 October for 7 days."
        className="glass-input mt-8 w-full resize-none rounded-2xl p-5 outline-none transition-shadow focus:ring-2"
        style={{
          minHeight: 120,
          fontFamily: "Inter",
          fontWeight: 400,
          fontSize: 16,
          color: "var(--charcoal)",
        }}
      />

      {showError && (
        <p
          className="mt-2 text-sm"
          style={{ fontFamily: "Inter", color: "var(--destructive)" }}
        >
          Tell us a bit more — where to, when, and for how long?
        </p>
      )}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => {
              onSentenceChange(ex);
              setShowError(false);
            }}
            className="glass-button shrink-0 rounded-full px-3 py-1.5 text-[13px] transition-all hover:scale-[1.02]"
            style={{
              color: "var(--charcoal)",
              fontFamily: "Inter",
            }}
          >
            {ex}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="glass-button mt-4 w-full rounded-full px-6 py-4 text-sm font-semibold transition-all hover:scale-[1.01] disabled:opacity-60"
        style={{
          color: "var(--charcoal)",
          fontFamily: "Space Grotesk",
          fontWeight: 600,
        }}
      >
        {isSubmitting ? "Working on it..." : "Find my trip"}
      </button>

      <p
        className="mt-3 text-center text-xs"
        style={{ color: "var(--muted-text)", fontFamily: "Inter" }}
      >
        Tip: press ⌘ / Ctrl + Enter to submit
      </p>
    </div>
  );
}
