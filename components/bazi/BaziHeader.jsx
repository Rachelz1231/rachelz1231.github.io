"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "排盘", href: "/bazi" },
  { label: "合盘", href: "/bazi/bazi-pair" },
  { label: "命理参考", href: "/bazi/reference" },
];

export function BaziHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-narrow flex h-14 items-center justify-between">
        <Link
          href="/bazi"
          className="font-serif text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          八字
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
