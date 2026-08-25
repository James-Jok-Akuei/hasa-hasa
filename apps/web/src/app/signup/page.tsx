import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account — Cieng",
};

export default function SignupPage() {
  return (
    // Backgrounds swapped relative to /login: wok flame on desktop, salt sprinkle on mobile
    <AuthShell
      desktopVideoSrc="/videos/auth-bg-portrait.mp4"
      mobileVideoSrc="/videos/auth-bg-landscape.mp4"
    >
      <SignupForm />
    </AuthShell>
  );
}
