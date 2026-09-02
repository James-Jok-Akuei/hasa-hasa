import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-brand-500 font-body">
      <HeroSection />
      <HowItWorks />
    </main>
  );
}
