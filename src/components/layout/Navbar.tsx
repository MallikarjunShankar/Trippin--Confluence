// Top navigation. Transparent at top, dark glass after scroll.
// Auth-aware: shows Log in / Sign up OR Plan a trip / avatar based on session.

import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignupModal } from "@/components/auth/SignupModal";

const SCROLL_TRIGGER_PX = 40;

interface NavbarProps {
  /** Force dark/glass treatment regardless of scroll (e.g. planner page) */
  forceDark?: boolean;
}

export function Navbar({ forceDark = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > SCROLL_TRIGGER_PX);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isDark = forceDark || scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          isDark
            ? "bg-[rgba(12,12,12,0.85)] backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logio.png"
              alt="Trippin'"
              className="h-9 w-auto"
              style={{
                filter: isDark ? "invert(1) brightness(2)" : "none",
              }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="/#about"
              className={`text-sm transition-colors ${
                isDark ? "text-white/70 hover:text-white" : "text-charcoal/70 hover:text-charcoal"
              }`}
              style={{ color: isDark ? undefined : "var(--muted-text)" }}
            >
              About
            </a>
            <a
              href="/#destinations"
              className="text-sm transition-colors"
              style={{ color: isDark ? "rgba(255,255,255,0.7)" : "var(--muted-text)" }}
            >
              Destinations
            </a>
            <a
              href="/#plans"
              className="text-sm transition-colors"
              style={{ color: isDark ? "rgba(255,255,255,0.7)" : "var(--muted-text)" }}
            >
              Plans
            </a>
          </nav>

          {/* Right side */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <button
                  onClick={() => navigate({ to: "/planner" })}
                  className="rounded-full px-5 py-2 text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--sage)", color: "var(--charcoal)" }}
                >
                  Plan a trip
                </button>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
                    style={{ backgroundColor: "var(--sand)", color: "var(--charcoal)" }}
                    aria-label="Account menu"
                  >
                    {user.email[0]?.toUpperCase() ?? "U"}
                  </button>
                  {menuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border bg-white shadow-md"
                      style={{ borderColor: "var(--sand)" }}
                    >
                      <div className="px-4 py-3 text-xs" style={{ color: "var(--muted-text)" }}>
                        {user.email}
                      </div>
                      <button
                        onClick={async () => {
                          setMenuOpen(false);
                          await signOut();
                          navigate({ to: "/" });
                        }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--ivory)]"
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setLoginOpen(true)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    isDark ? "text-white/85 hover:bg-white/10" : "hover:bg-black/5"
                  }`}
                  style={{ color: isDark ? undefined : "var(--charcoal)" }}
                >
                  Log in
                </button>
                <button
                  onClick={() => setSignupOpen(true)}
                  className="rounded-full px-5 py-2 text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--sage)", color: "var(--charcoal)" }}
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{ color: isDark ? "white" : "var(--charcoal)" }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile sheet */}
        {mobileOpen && (
          <div
            className="border-t md:hidden"
            style={{
              backgroundColor: isDark ? "rgba(12,12,12,0.95)" : "var(--ivory)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "var(--sand)",
            }}
          >
            <div className="flex flex-col gap-3 px-6 py-5">
              {(["about", "destinations", "plans"] as const).map((id) => (
                <a
                  key={id}
                  href={`/#${id}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm capitalize"
                  style={{ color: isDark ? "rgba(255,255,255,0.8)" : "var(--charcoal)" }}
                >
                  {id}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                {user ? (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate({ to: "/planner" });
                    }}
                    className="rounded-full px-5 py-2 text-sm font-semibold"
                    style={{ backgroundColor: "var(--sage)", color: "var(--charcoal)" }}
                  >
                    Plan a trip
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setLoginOpen(true);
                      }}
                      className="rounded-full border px-5 py-2 text-sm"
                      style={{
                        borderColor: isDark ? "rgba(255,255,255,0.2)" : "var(--sand)",
                        color: isDark ? "white" : "var(--charcoal)",
                      }}
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        setSignupOpen(true);
                      }}
                      className="rounded-full px-5 py-2 text-sm font-semibold"
                      style={{ backgroundColor: "var(--sage)", color: "var(--charcoal)" }}
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

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
