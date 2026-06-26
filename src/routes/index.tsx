// Landing page route — the Trippin' marketing experience.
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { USPSection } from "@/components/landing/USPSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { AgentPipelineSection } from "@/components/landing/AgentPipelineSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { TrendingSection } from "@/components/landing/TrendingSection";
import { PlansCTASection } from "@/components/landing/PlansCTASection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trippin' — Your AI travel crew" },
      {
        name: "description",
        content:
          "One sentence to a complete trip. Trippin' finds flights, matches hotels, checks weather, and builds your itinerary — automatically.",
      },
      { property: "og:title", content: "Trippin' — Your AI travel crew" },
      {
        property: "og:description",
        content:
          "Flights. Hotels. Weather. Itineraries. One conversation.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="app-gradient theme-transition">
      <Navbar />
      <main>
        <HeroSection />
        <USPSection />
        <DemoSection />
        <AgentPipelineSection />
        <AboutSection />
        <TrendingSection />
        <PlansCTASection />
      </main>
      <Footer />
    </div>
  );
}
