import Link from "next/link";
import { tours, tourStatusLabels } from "@/lib/tours";

// 截断根 layout 的 "%s — Rachel Zeng" 模板，避免名字漏进标签页。
// 子页面无需处理：它们套用的是本段 layout 的 "%s — 旅游规划"。
export const metadata = {
  title: { absolute: "旅游规划" },
};

export default function TourGuideIndexPage() {
  return (
    <div>
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
        Tour Guide · 旅游规划
      </p>
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        全部计划
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        每个计划一页，按天列出行程与需要提前预订的项目。
      </p>

      <ul className="mt-8 space-y-4">
        {tours.map((tour) => (
          <li key={tour.slug}>
            <Link
              href={`/tour_guide/${tour.slug}`}
              className="block rounded-lg border border-border/60 bg-background p-5 transition-colors hover:border-primary/40 hover:bg-accent/30"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {tour.title}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {tourStatusLabels[tour.status] ?? tour.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {tour.destination} · {tour.dates}
              </p>
              <p className="mt-3 text-sm text-foreground/80">{tour.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
