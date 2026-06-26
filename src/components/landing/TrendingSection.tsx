// Six trending destination cards on a soft-sand background.
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { SignupModal } from "@/components/auth/SignupModal";
import { LoginModal } from "@/components/auth/LoginModal";

interface Destination {
  city: string;
  country: string;
  duration: string;
  fare: string;
}

const DESTINATIONS: Destination[] = [
  { city: "Tokyo", country: "Japan", duration: "~9h 30m avg", fare: "~₹28,000 avg fare" },
  { city: "Paris", country: "France", duration: "~10h 15m avg", fare: "~₹42,000 avg fare" },
  { city: "Bali", country: "Indonesia", duration: "~7h 45m avg", fare: "~₹18,000 avg fare" },
  { city: "Dubai", country: "UAE", duration: "~3h 30m avg", fare: "~₹8,500 avg fare" },
  { city: "Singapore", country: "Singapore", duration: "~5h 45m avg", fare: "~₹15,000 avg fare" },
  { city: "New York", country: "USA", duration: "~15h 20m avg", fare: "~₹55,000 avg fare" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function TrendingSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  function handlePlan() {
    if (user) navigate({ to: "/planner" });
    else setSignupOpen(true);
  }

  return (
    <section
      id="destinations"
      className="section-glass-alt w-full py-24 theme-transition"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="label-eyebrow">TRENDING DESTINATIONS</p>
          <h2
            className="mt-3"
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 44px)",
              color: "var(--charcoal)",
            }}
          >
            Where people are headed
          </h2>
        </div>

        <motion.div
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {DESTINATIONS.map((dest) => (
            <motion.div
              key={dest.city}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-2xl p-6"
            >
              <h3
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 600,
                  fontSize: 24,
                  color: "var(--charcoal)",
                }}
              >
                {dest.city}
              </h3>
              <p
                className="mt-1"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: 13,
                  color: "var(--muted-text)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {dest.country}
              </p>
              <div className="my-4 h-px w-full" style={{ backgroundColor: "var(--sand)" }} />
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: 14,
                  color: "var(--muted-text)",
                }}
              >
                From Delhi
              </p>
              <p
                className="mt-1"
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 600,
                  fontSize: 18,
                  color: "var(--charcoal)",
                }}
              >
                {dest.duration}
              </p>
              <p
                className="mt-1"
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 500,
                  fontSize: 15,
                  color: "var(--sage)",
                }}
              >
                {dest.fare}
              </p>
              <button
                onClick={handlePlan}
                className="glass-button mt-5 rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]"
                style={{ color: "var(--charcoal)", fontFamily: "Inter" }}
              >
                Plan this trip
              </button>
            </motion.div>
          ))}
        </motion.div>
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
