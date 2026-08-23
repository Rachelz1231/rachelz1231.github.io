import { Fragment } from "react";
import { notFound } from "next/navigation";
import { getTour, tours, tourStatusLabels } from "@/lib/tours";

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export function generateMetadata({ params }) {
  const tour = getTour(params.slug);
  if (!tour) return {};
  return { title: tour.title, description: tour.summary };
}

function DayLegs({ legs }) {
  return (
    <ul className="mt-3 space-y-1">
      {legs.map((leg) => (
        <li
          key={`${leg.from}-${leg.to}`}
          className="flex flex-wrap items-baseline gap-x-2 text-sm"
        >
          <span className="text-foreground/80">
            {leg.from} → {leg.to}
          </span>
          <span className="text-xs text-muted-foreground">
            {leg.distance} · {leg.duration}
          </span>
        </li>
      ))}
    </ul>
  );
}

function FlexibleBlock({ flexible }) {
  return (
    <section className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        机动项 · 还没定在哪天
      </p>
      <ul className="mt-3 space-y-2">
        {flexible.map((entry) => (
          <li key={entry.title}>
            <p className="text-sm font-medium text-foreground">{entry.title}</p>
            {entry.note ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{entry.note}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

// 钉在两天之间的机动项：时间线上的一条虚线带，和实线的「天」区分开。
// 它只是 <ol> 里的一行，所以窄屏和桌面是同一套排版。
function FlexibleBand({ entry }) {
  return (
    <li className="border-l-2 border-dashed border-primary/40 pl-5">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        机动{entry.window ? ` · ${entry.window}` : ""}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{entry.title}</p>
      {entry.note ? (
        <p className="mt-0.5 text-sm text-muted-foreground">{entry.note}</p>
      ) : null}
    </li>
  );
}

function DayOptions({ options }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        可选方案{options.note ? ` · ${options.note}` : ""}
      </p>
      <div className="mt-2 space-y-2">
        {options.choices.map((choice) => (
          <div
            key={choice.label}
            className="rounded-md border border-border/80 px-4 py-3"
          >
            <p className="text-sm font-medium text-foreground">{choice.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{choice.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DayTips({ tips }) {
  return (
    <div className="mt-4 rounded-md bg-muted/60 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        提醒
      </p>
      <ul className="mt-2 space-y-1.5">
        {tips.map((tip) => (
          <li key={tip} className="text-sm text-foreground/80">
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TourPage({ params }) {
  const tour = getTour(params.slug);
  if (!tour) notFound();

  const flexible = tour.flexible ?? [];
  const unpinned = flexible.filter((entry) => !entry.after);
  const pinnedAfter = (date) => flexible.filter((entry) => entry.after === date);

  return (
    <article>
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
        {tour.destination}
      </p>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {tour.title}
        </h1>
        <span className="text-sm text-muted-foreground">
          {tourStatusLabels[tour.status] ?? tour.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{tour.dates}</p>
      <p className="mt-4 max-w-2xl text-muted-foreground">{tour.summary}</p>

      {unpinned.length ? <FlexibleBlock flexible={unpinned} /> : null}

      <ol className="mt-10 space-y-10">
        {tour.days.map((day) => (
          <Fragment key={day.label}>
          <li className="border-l-2 border-border pl-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                {day.label} · {day.date}
              </p>
              {day.stay ? (
                <p className="text-xs text-muted-foreground">住 {day.stay}</p>
              ) : null}
            </div>
            <h2 className="mt-1 font-serif text-xl font-semibold text-foreground">
              {day.title}
            </h2>

            {day.legs?.length ? <DayLegs legs={day.legs} /> : null}

            {day.options?.choices?.length ? (
              <DayOptions options={day.options} />
            ) : null}

            {day.items?.length ? (
              <ul className="mt-3 space-y-1.5">
                {day.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-foreground/80 before:mr-2 before:text-muted-foreground before:content-['·']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {day.tips?.length ? <DayTips tips={day.tips} /> : null}
          </li>
          {pinnedAfter(day.date).map((entry) => (
            <FlexibleBand key={entry.title} entry={entry} />
          ))}
          </Fragment>
        ))}
      </ol>
    </article>
  );
}
