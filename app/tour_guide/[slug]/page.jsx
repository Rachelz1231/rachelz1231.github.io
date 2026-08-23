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

export default function TourPage({ params }) {
  const tour = getTour(params.slug);
  if (!tour) notFound();

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

      <ol className="mt-10 space-y-8">
        {tour.days.map((day) => (
          <li key={day.label} className="border-l-2 border-border pl-5">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              {day.label}
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-foreground">
              {day.title}
            </h2>
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
          </li>
        ))}
      </ol>
    </article>
  );
}
