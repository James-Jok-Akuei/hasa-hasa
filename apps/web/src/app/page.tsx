import { Contact } from "@/components/landing/contact";
import { Download } from "@/components/landing/download";
import { Faq } from "@/components/landing/faq";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Join } from "@/components/landing/join";
import { Partner } from "@/components/landing/partner";
import { SiteFooter } from "@/components/landing/site-footer";

/** Section order mirrors the nav — see the running order in site-nav.tsx. */
export default function LandingPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-brand-500 font-body">
      <HeroSection />
      <HowItWorks />
      <Partner />
      <Download />
      <Join />
      <Faq />
      <Contact />
      <SiteFooter />
    </main>
  );
}
