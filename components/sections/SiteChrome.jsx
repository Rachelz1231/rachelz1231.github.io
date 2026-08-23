"use client";
import { usePathname } from "next/navigation";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

// Routes that render standalone, without the personal-site header and footer.
const bareRoutes = ["/bazi", "/tour_guide"];

export function SiteChrome({ children }) {
  const pathname = usePathname();
  const bare = bareRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (bare) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
