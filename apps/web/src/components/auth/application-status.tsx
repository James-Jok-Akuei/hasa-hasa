"use client";

import { authApi } from "@hasahasa/api-client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Where a merchant lands after signing in. Signing in and being approved are
 * separate: an owner whose restaurant is still under review is authenticated,
 * and sees this rather than the dashboard.
 */
export function ApplicationStatus() {
  const router = useRouter();

  const { data, isPending, isError } = useQuery({
    queryKey: ["session"],
    queryFn: () => authApi.me(),
    retry: false,
  });

  const unauthenticated = isError;

  useEffect(() => {
    if (unauthenticated) router.replace("/login");
  }, [unauthenticated, router]);

  if (isPending || unauthenticated) {
    return (
      <div className="flex flex-col items-center">
        <span className="sr-only">Loading</span>
        <div
          className="size-8 animate-spin rounded-full border-2 border-white/25 border-t-white"
          aria-hidden
        />
      </div>
    );
  }

  const restaurant = data?.restaurant;

  const copy = {
    PENDING: {
      title: "Under review",
      body: "Your application is with our team. We will email you as soon as it is approved — usually within a day.",
    },
    APPROVED: {
      title: "Approved",
      body: "Your restaurant is live. The dashboard is coming shortly.",
    },
    REJECTED: {
      title: "Not approved",
      body: restaurant?.rejectionReason ?? "Your application was not approved.",
    },
    SUSPENDED: {
      title: "Suspended",
      body: "This restaurant has been suspended. Get in touch and we will sort it out.",
    },
  } as const;

  const state = restaurant ? copy[restaurant.status] : null;

  return (
    <div className="flex animate-fade-up flex-col items-center text-center">
      <h1 className="text-3xl font-light uppercase tracking-[0.45em] text-white indent-[0.45em] sm:text-4xl">
        {state?.title ?? "No restaurant"}
      </h1>

      {restaurant ? (
        <p className="mt-6 text-sm font-light uppercase tracking-[0.3em] text-white/50">
          {restaurant.name}
        </p>
      ) : null}

      <p className="mt-6 max-w-sm text-sm font-light leading-relaxed tracking-wide text-white/70">
        {state?.body ?? "This account is not linked to a restaurant yet."}
      </p>

      <div className="mt-12 flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={async () => {
            await authApi.logout().catch(() => undefined);
            router.replace("/login");
          }}
          className="text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:text-brand-300 focus-visible:outline-none"
        >
          Sign out
        </button>
        <Link
          href="/"
          className="text-sm font-light uppercase tracking-[0.3em] text-white/75 transition-colors hover:text-brand-300"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
