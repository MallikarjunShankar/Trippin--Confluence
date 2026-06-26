import { AuthForm } from "./AuthForm";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup: () => void;
}

export function LoginModal({ open, onOpenChange, onSwitchToSignup }: LoginModalProps) {
  return (
    <AuthForm
      open={open}
      onOpenChange={onOpenChange}
      mode="login"
      title="Welcome back"
      subtitle="Log in to plan your next trip."
      ctaLabel="Log in"
      switchPrompt={
        <>
          New here?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-semibold underline-offset-2 hover:underline"
            style={{ color: "var(--charcoal)" }}
          >
            Create an account
          </button>
        </>
      }
    />
  );
}
