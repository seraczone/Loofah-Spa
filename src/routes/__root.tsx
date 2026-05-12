import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Link, Outlet, createRootRouteWithContext, useRouter } from "@tanstack/react-router";
import { EntryIntakeGate } from "@/components/EntryIntakeGate";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileBar } from "@/components/MobileBar";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { Toaster } from "@/components/ui/sonner";
import { SITE } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="max-w-md text-center">
        <div className="font-display text-7xl italic text-mocha">404</div>
        <h2 className="mt-4 font-heading text-2xl text-ink">Page not found</h2>
        <p className="mt-3 text-sm text-ink/60">
          This page has drifted into the steam. Let&apos;s get you back to the sanctuary.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-pill bg-gold px-8 py-3 text-[12px] tracking-[0.22em] uppercase text-ink transition-colors hover:bg-gold-deep hover:text-ivory"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="max-w-md text-center">
        <h1 className="font-heading text-2xl text-ink">This page didn&apos;t load</h1>
        <p className="mt-2 text-sm text-ink/60">Something went wrong. Try again or head home.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-pill bg-ink px-7 py-3 text-[12px] tracking-[0.22em] uppercase text-ivory"
          >
            Try Again
          </button>
          <a
            href="/"
            className="rounded-pill border border-ink/30 px-7 py-3 text-[12px] tracking-[0.22em] uppercase text-ink"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { title: `${SITE.name} - ${SITE.tagline}` },
      { name: "description", content: SITE.description },
      { name: "author", content: SITE.name },
      { name: "theme-color", content: "#FAF7F2" },
      { property: "og:title", content: `${SITE.name} - ${SITE.tagline}` },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: SITE.ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SITE.ogImage },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <>
      <HeadContent />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <EntryIntakeGate />
            <Header />
            <main className="min-h-screen">
              <Outlet />
            </main>
            <Footer />
            <MobileBar />
            <Toaster richColors position="top-right" />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}
