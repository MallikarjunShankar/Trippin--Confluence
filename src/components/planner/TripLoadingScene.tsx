// Full-viewport themed loading overlay shown while the FastAPI request runs.
import { useEffect, useState } from "react";
import { Check, Plane } from "lucide-react";

const STEPS = [
  "Parsing your request",
  "Searching available flights",
  "Matching hotels",
  "Checking weather conditions",
  "Building your itinerary",
  "Generating your report",
];

const STEP_INTERVAL_MS = 2000;

interface TripLoadingSceneProps {
  origin?: string;
  destination?: string;
}

export function TripLoadingScene({ origin, destination }: TripLoadingSceneProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, STEP_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 transition-opacity duration-600"
      style={{ backgroundColor: "var(--dark-bg)" }}
    >
      {/* Flight path */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between text-[13px]" style={{
          color: "rgba(255,255,255,0.5)",
          fontFamily: "Inter",
          letterSpacing: "0.1em",
        }}>
          <span>{origin?.toUpperCase() || "DEPARTING"}</span>
          <span>{destination?.toUpperCase() || "ARRIVING"}</span>
        </div>
        <svg viewBox="0 0 600 120" className="mt-3 w-full" aria-hidden="true">
          <defs>
            <path
              id="flight-arc-path"
              d="M 20 100 Q 300 -20 580 100"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          </defs>
          <use href="#flight-arc-path" />
          <circle cx="20" cy="100" r="4" fill="#B8C6B1" />
          <circle cx="580" cy="100" r="4" fill="#B8C6B1" />
          <g>
            <path
              d="M0,-6 L4,2 L0,0 L-4,2 Z"
              fill="white"
              transform="rotate(90) scale(2)"
            />
            <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
              <mpath href="#flight-arc-path" />
            </animateMotion>
          </g>
        </svg>
      </div>

      {/* Steps */}
      <ul className="mt-12 space-y-3">
        {STEPS.map((step, i) => {
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          return (
            <li
              key={step}
              className="flex items-center gap-3 pl-3"
              style={{
                borderLeft: isActive ? "2px solid var(--sage)" : "2px solid transparent",
                animation: isActive ? "scroll-pulse 1.4s ease-in-out infinite" : undefined,
                color: isActive
                  ? "rgba(255,255,255,0.9)"
                  : isDone
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(255,255,255,0.3)",
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: 16,
              }}
            >
              {isDone ? (
                <Check size={14} style={{ color: "var(--sage)" }} />
              ) : (
                <span className="inline-block h-[14px] w-[14px]" />
              )}
              {step}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
