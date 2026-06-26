import { AuthForm } from "./AuthForm";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({ open, onOpenChange, onSwitchToLogin }: SignupModalProps) {
  return (
    <AuthForm
      open={open}
      onOpenChange={onOpenChange}
      mode="signup"
      title="Create your account"
      subtitle="One sentence to a complete trip — start planning in seconds."
      ctaLabel="Create account"
      switchPrompt={
        <>
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold underline-offset-2 hover:underline"
            style={{ color: "var(--charcoal)" }}
          >
            Log in
          </button>
        </>
      }
    />
  );
}
