import { AuthShell } from "@/components/auth/auth-shell";
import { ApplicationStatus } from "@/components/auth/application-status";

export default function PendingPage() {
  return (
    <AuthShell video={false}>
      <ApplicationStatus />
    </AuthShell>
  );
}
