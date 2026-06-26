// Hero section: dark canvas with the 3D globe + text overlay.
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { HeroGlobe } from "./HeroGlobe";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [out, setOut] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOut(!entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handlePrimary() {
    if (user) navigate({ to: "/planner" });
    else setSignupOpen(true);
  }

  function handleHowItWorks() {
    const target = document.getElementById("about");
    target?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--dark-bg), color-mix(in srgb, var(--sage) 12%, var(--dark-bg)))" }}
      >
        {/* Layer 1: globe */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            transform: out ? "scale(1.1)" : "scale(1)",
            opacity: out ? 0 : 1,
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <HeroGlobe />
        </div>

        {/* Soft radial darkening for text legibility */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(12,12,12,0) 40%, rgba(12,12,12,0.55) 100%)",
          }}
        />

        {/* Layer 2: text overlay */}
        <div
          className="relative z-10 flex flex-col items-center px-6 text-center transition-all duration-700"
          style={{
            transform: out ? "translateY(-40px)" : "translateY(0)",
            opacity: out ? 0 : 1,
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <img
            src="/logio.png"
            alt="Trippin'"
            className="mb-10 h-12 w-auto md:h-14"
            style={{ filter: "invert(1) brightness(2)" }}
          />

          <h1
            className="text-white"
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: "clamp(56px, 8vw, 100px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Your AI travel crew.
          </h1>

          <p
            className="mt-5"
            style={{
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: "clamp(16px, 2vw, 22px)",
              color: "rgba(255,255,255,0.65)",
              maxWidth: 640,
            }}
          >
            Flights. Hotels. Weather. Itineraries. One conversation.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <button
              onClick={handlePrimary}
              className="glass-button rounded-full px-8 py-4 text-sm font-semibold transition-transform hover:scale-[1.02]"
              style={{
                color: "var(--text-on-dark)",
                fontFamily: "Space Grotesk",
                fontWeight: 600,
              }}
            >
              Start planning
            </button>
            <button
              onClick={handleHowItWorks}
              className="glass-button rounded-full px-8 py-4 text-sm transition-all hover:scale-[1.02]"
              style={{
                borderColor: "rgba(255,255,255,0.3)",
                color: "rgba(255,255,255,0.8)",
                fontFamily: "Space Grotesk",
                fontWeight: 500,
              }}
            >
              See how it works
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <ChevronDown size={22} />
        </div>
      </section>

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />
      <SignupModal
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
}
