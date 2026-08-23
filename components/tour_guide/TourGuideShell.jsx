"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { tours, tourStatusLabels } from "@/lib/tours";
import { cn } from "@/lib/utils";

function TourNav({ onNavigate }) {
  const pathname = usePathname();

  const link = (href, label, meta) => (
    <Link
      key={href}
      href={href}
      onClick={onNavigate}
      className={cn(
        "block rounded-md px-3 py-2 text-sm transition-colors",
        pathname === href
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      {label}
      {meta ? (
        <span className="mt-0.5 block text-xs text-muted-foreground">{meta}</span>
      ) : null}
    </Link>
  );

  return (
    <nav className="flex flex-col gap-1">
      {link("/tour_guide", "全部计划")}
      <p className="mt-4 px-3 pb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        行程
      </p>
      {tours.map((tour) =>
        link(
          `/tour_guide/${tour.slug}`,
          tour.title,
          `${tour.dates} · ${tourStatusLabels[tour.status] ?? tour.status}`
        )
      )}
    </nav>
  );
}

export function TourGuideShell({ children }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container-wide flex h-14 items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="打开行程列表">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="mt-8">
                <TourNav onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href="/tour_guide"
            className="font-serif text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
          >
            旅游规划
          </Link>
        </div>
      </header>

      <div className="container-wide flex flex-1 gap-10 py-10">
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-24">
            <TourNav />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <footer className="border-t border-border/60 py-6">
        <p className="container-wide text-xs text-muted-foreground">
          行程与价格会随季节变动，出行前请以官方信息为准。
        </p>
      </footer>
    </div>
  );
}
