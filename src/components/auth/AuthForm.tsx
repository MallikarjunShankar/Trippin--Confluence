// Shared shell for the auth modals.
import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { Mail } from "lucide-react";

interface AuthFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "login" | "signup";
  title: string;
  subtitle: string;
  ctaLabel: string;
  switchPrompt: ReactNode;
}

export function AuthForm({
  open,
  onOpenChange,
  mode,
  title,
  subtitle,
  ctaLabel,
  switchPrompt,
}: AuthFormProps) {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmailSent(false);
    }
  }, [open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        onOpenChange(false);
        setEmail("");
        setPassword("");
      } else {
        await signUp(email, password);
        setEmailSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="glass-card rounded-2xl border p-0 sm:max-w-md"
      >
        <div className="p-8">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle
              className="text-2xl"
              style={{ fontFamily: "Space Grotesk", fontWeight: 700, color: "var(--charcoal)" }}
            >
              {title}
            </DialogTitle>
            <DialogDescription style={{ color: "var(--muted-text)" }}>
              {subtitle}
            </DialogDescription>
          </DialogHeader>

          {emailSent ? (
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <div className="w-12 h-12 rounded-full bg-[var(--color-sage)]/20 flex items-center justify-center">
                <Mail className="text-[var(--color-sage)]" size={22} />
              </div>
              <h3 className="font-[Space_Grotesk] font-semibold text-lg text-[var(--color-text)]">
                Check your inbox
              </h3>
              <p className="font-[Inter] text-sm text-[var(--color-muted)] max-w-xs leading-relaxed">
                We sent a verification link to your email address. Click the link to activate your account and start planning.
              </p>
              <p className="font-[Inter] text-xs text-[var(--color-muted)]">
                Did not receive it? Check your spam folder.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--charcoal)" }}>
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm outline-none transition-shadow focus:ring-2"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--charcoal)" }}>
                  Password
                </label>
                <input
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full rounded-2xl px-4 py-3 text-sm outline-none transition-shadow focus:ring-2"
                />
              </div>

              {error && (
                <p className="text-sm" style={{ color: "var(--destructive)" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="glass-button w-full rounded-full px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.01] disabled:opacity-60"
                style={{
                  color: "var(--charcoal)",
                  fontFamily: "Space Grotesk",
                }}
              >
                {busy ? "Please wait..." : ctaLabel}
              </button>

              <p className="pt-2 text-center text-xs" style={{ color: "var(--muted-text)" }}>
                {switchPrompt}
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
