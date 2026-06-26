// Shared shell for the auth modals.
import { useState, type FormEvent, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "login") await signIn(email, password);
      else await signUp(email, password);
      onOpenChange(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl border-0 p-0 sm:max-w-md"
        style={{ backgroundColor: "var(--ivory)" }}
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
                className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition-shadow focus:ring-2"
                style={{ borderColor: "var(--sand)" }}
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
                className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition-shadow focus:ring-2"
                style={{ borderColor: "var(--sand)" }}
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
              className="w-full rounded-full px-6 py-3 text-sm font-semibold transition-opacity disabled:opacity-60"
              style={{
                backgroundColor: "var(--charcoal)",
                color: "var(--ivory)",
                fontFamily: "Space Grotesk",
              }}
            >
              {busy ? "Please wait..." : ctaLabel}
            </button>

            <p className="pt-2 text-center text-xs" style={{ color: "var(--muted-text)" }}>
              {switchPrompt}
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
