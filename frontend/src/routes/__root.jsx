import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { ShopProvider } from "@/lib/shop-store";
import { UserProvider } from "@/lib/user-store";
import { AdminProvider, useAdmin } from "@/lib/admin-store";
import { UsersRegistryProvider } from "@/lib/users-registry";

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: ({ error }) =>
  <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-eyebrow text-gold mb-3" style={{ fontFamily: "var(--font-sans)" }}>Connection Problem</p>
        <h1 className="text-display text-3xl text-ink mb-4">We couldn't reach the server</h1>
        <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: "var(--font-sans)" }}>
          The storefront could not load data from the backend. Make sure the API server is running
          and connected to MongoDB, then refresh this page.
        </p>
        <p className="text-xs text-muted-foreground/70 mb-6 font-mono break-words">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <button onClick={() => window.location.reload()} className="btn-luxe btn-luxe-hover">
          Retry
        </button>
      </div>
    </div>

});

function RootLayout() {
  return (
    <UsersRegistryProvider>
      <AdminProvider>
        <SiteShell />
      </AdminProvider>
    </UsersRegistryProvider>);

}

// Waits for the first product load (success or failure) before mounting
// any page. Every page on the site reads products from AdminProvider, so
// rendering a page before that first load finishes can crash on an empty
// array. This only blocks the very first load — later refreshes (e.g.
// admin adding/editing a product) do NOT show this screen again.
function SiteShell() {
  const matches = useRouterState({ select: (s) => s.matches });
  const isAdmin = matches.some((m) => m.pathname.startsWith("/admin"));
  const { initializing } = useAdmin();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-eyebrow text-gold mb-4" style={{ fontFamily: "var(--font-sans)" }}>Maison Vera</p>
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>);

  }

  return (
    <UserProvider>
      <ShopProvider>
        {isAdmin ?
        <>
            <Outlet />
            <Toaster richColors position="top-right" />
          </> :

        <>
            <Navbar />
            <Outlet />
            <Footer />
            <Toaster richColors position="top-right" />
          </>
        }
      </ShopProvider>
    </UserProvider>);

}