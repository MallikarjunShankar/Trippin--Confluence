// Dark narrow CTA strip.
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { SignupModal } from "@/components/auth/SignupModal";
import { LoginModal } from "@/components/auth/LoginModal";

export function PlansCTASection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  function handleStart() {
    if (user) navigate({ to: "/planner" });
    else setSignupOpen(true);
  }

  return (
    <section
      id="plans"
      className="w-full py-20"
      style={{ backgroundColor: "var(--dark-bg)" }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="label-eyebrow" style={{ color: "var(--sage)" }}>
          THE PLAN
        </p>
        <h2
          className="mt-4 text-white"
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            fontSize: "clamp(40px, 5vw, 72px)",
            lineHeight: 1.05,
          }}
        >
          One sentence.
          <br />
          A complete trip.
        </h2>
        <p
          className="mt-5"
          style={{
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: 17,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          No forms. No filters. No tab-switching.
        </p>
        <button
          onClick={handleStart}
          className="mt-10 rounded-full px-8 py-4 text-sm font-semibold transition-transform hover:scale-[1.02]"
          style={{
            backgroundColor: "var(--ivory)",
            color: "var(--charcoal)",
            fontFamily: "Space Grotesk",
            fontWeight: 600,
          }}
        >
          Start planning
        </button>
      </div>

      <SignupModal
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />
      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />
    </section>
  );
}
