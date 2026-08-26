import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login — HASA HASA",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ bg?: string }>;
}) {
  const { bg } = await searchParams;
  // Video background by default; /login?bg=image shows the still version.
  return (
    <AuthShell video={bg !== "image"}>
      <LoginForm />
    </AuthShell>
  );
}
